export const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
export const cors=(req)=>({ "access-control-allow-origin": new URL(req.url).origin, "access-control-allow-methods":"GET,POST,PATCH,DELETE,OPTIONS", "access-control-allow-headers":"Content-Type, Idempotency-Key, Authorization", "x-content-type-options":"nosniff", "referrer-policy":"same-origin", "x-frame-options":"DENY" });
export const body=async req=>{const len=Number(req.headers.get("content-length")||0);if(len>100_000)throw new Error("Payload too large");return req.json()};
export const idempotency=req=>{const value=req.headers.get("Idempotency-Key");return value&&/^[A-Za-z0-9._:-]{8,128}$/.test(value)?value:crypto.randomUUID();};
const rateMemory=new Map();
// Enforced via D1 so the limit holds across Worker isolates/edge locations, not just the isolate that
// happens to handle a given request. The in-memory map remains as a fast pre-check only (cheap early exit),
// never as the sole enforcement — the D1 read/write below is authoritative.
export async function rateLimit(request,env,bucket,{limit=30,windowSeconds=60}={}){
  const ip=request.headers.get('CF-Connecting-IP')||request.headers.get('x-forwarded-for')||'unknown';
  const clientKey=ip.split(',')[0].trim();
  const key=`${bucket}:${clientKey}`; const now=Date.now();
  const hit=rateMemory.get(key);
  if(hit&&now-hit.start<windowSeconds*1000&&hit.count>=limit*2){
    // Fast local shortcut for isolates already hammered far past the limit — avoids a D1 round-trip.
    const e=new Error('Terlalu banyak permintaan. Silakan coba lagi sebentar.');e.statusCode=429;throw e;
  }
  if(!env.DB){
    // No database configured (local/dev only): fall back to best-effort in-memory limiting.
    if(!hit||now-hit.start>=windowSeconds*1000) rateMemory.set(key,{start:now,count:1});
    else {hit.count++;if(hit.count>limit){const e=new Error('Terlalu banyak permintaan. Silakan coba lagi sebentar.');e.statusCode=429;throw e;}}
    return;
  }
  const nowIso=new Date(now).toISOString();
  try{
    await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<?').bind(nowIso).run();
    const existing=await env.DB.prepare('SELECT count,expires_at FROM rate_limits WHERE bucket=? AND client_key=?').bind(bucket,clientKey).first();
    if(!existing){
      await env.DB.prepare('INSERT INTO rate_limits (bucket,client_key,count,expires_at) VALUES (?,?,?,?)').bind(bucket,clientKey,1,new Date(now+windowSeconds*1000).toISOString()).run();
      rateMemory.set(key,{start:now,count:1});
      return;
    }
    const expiresAt=Date.parse(existing.expires_at);
    if(now>=expiresAt){
      await env.DB.prepare('UPDATE rate_limits SET count=1,expires_at=? WHERE bucket=? AND client_key=?').bind(new Date(now+windowSeconds*1000).toISOString(),bucket,clientKey).run();
      rateMemory.set(key,{start:now,count:1});
      return;
    }
    const nextCount=existing.count+1;
    if(nextCount>limit){
      const e=new Error('Terlalu banyak permintaan. Silakan coba lagi sebentar.');e.statusCode=429;throw e;
    }
    await env.DB.prepare('UPDATE rate_limits SET count=? WHERE bucket=? AND client_key=?').bind(nextCount,bucket,clientKey).run();
    rateMemory.set(key,{start:now,count:nextCount});
  }catch(e){
    if(e.statusCode===429)throw e;
    // D1 unavailable for some other reason: degrade to in-memory limiting rather than fail the request.
    if(!hit||now-hit.start>=windowSeconds*1000) rateMemory.set(key,{start:now,count:1});
    else {hit.count++;if(hit.count>limit){const e2=new Error('Terlalu banyak permintaan. Silakan coba lagi sebentar.');e2.statusCode=429;throw e2;}}
  }
}
export async function verifyTurnstile(request,env){
  if(!env.TURNSTILE_SECRET_KEY)return;
  const b=await request.clone().json(); const token=String(b.turnstileToken||'').trim(); if(!token){const e=new Error('Verifikasi anti-spam diperlukan.');e.statusCode=400;throw e;}
  const fd=new FormData();fd.append('secret',env.TURNSTILE_SECRET_KEY);fd.append('response',token);const ip=request.headers.get('CF-Connecting-IP');if(ip)fd.append('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:fd});const j=await r.json();if(!j.success){const e=new Error('Verifikasi anti-spam gagal.');e.statusCode=403;throw e;}
}
export function orderId(){const bytes=new Uint8Array(4);crypto.getRandomValues(bytes);return `LT-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${[...bytes].map(x=>x.toString(16).padStart(2,"0")).join("").toUpperCase()}`;}
export async function sha512(s){const b=new TextEncoder().encode(s),d=await crypto.subtle.digest("SHA-512",b);return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("")}
export function envRequired(env,key){if(!env[key])throw new Error(`Missing server configuration: ${key}`);return env[key]}

// Shared admin-session check used by every functions/api/admin/* endpoint, so the verification logic
// (and any future fix to it) lives in exactly one place instead of being copy-pasted per file.
const ADMIN_COOKIE='aw_admin_session';
export async function requireAdminSession(request,env){
  const raw=request.headers.get('cookie')||'';
  const part=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(ADMIN_COOKIE+'='));
  if(!part||!env.SESSION_SECRET)return null;
  const token=part.slice(ADMIN_COOKIE.length+1);
  const [payload,sig]=token.split('.');
  if(!payload||!sig)return null;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SESSION_SECRET),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const padded=sig.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((sig.length+3)%4);
  let bytes;try{bytes=Uint8Array.from(atob(padded),c=>c.charCodeAt(0));}catch{return null}
  const good=await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(payload));
  if(!good)return null;
  let data;try{data=JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')))}catch{return null}
  if(!data.exp||Date.now()>data.exp||!data.adminId)return null;
  // Multi-user admin sessions are checked against D1 on every request so disabled users
  // lose access immediately instead of waiting for cookie expiry.
  if(env.DB){
    try{
      const admin=await env.DB.prepare("SELECT id,email,role,active FROM admins WHERE id=? LIMIT 1").bind(data.adminId).first();
      if(!admin||Number(admin.active)!==1)return null;
      return {...data,email:admin.email,role:admin.role};
    }catch{return null}
  }
  return env.ALLOW_LEGACY_ADMIN_ENV==="true"?data:null;
}

// Password hashing: PBKDF2-HMAC-SHA256 with per-password random salt and high iteration count.
// Deliberately slow (unlike sha512 above, which stays fast on purpose for Midtrans signature checks).
// Format: pbkdf2$<iterations>$<saltHex>$<hashHex>
const PBKDF2_ITERATIONS = 210_000;
function hex(buf){return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function unhex(s){const a=new Uint8Array(s.length/2);for(let i=0;i<a.length;i++)a[i]=parseInt(s.substr(i*2,2),16);return a}
export async function hashPassword(password,{iterations=PBKDF2_ITERATIONS}={}){
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations},key,256);
  return `pbkdf2$${iterations}$${hex(salt)}$${hex(bits)}`;
}
export async function verifyPassword(password,stored){
  if(!stored)return false;
  const parts=String(stored).split("$");
  if(parts.length!==4||parts[0]!=="pbkdf2")return false;
  const iterations=Number(parts[1]);const salt=unhex(parts[2]);const expectedHex=parts[3];
  if(!Number.isFinite(iterations)||iterations<50_000)return false;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations},key,256);
  const actualHex=hex(bits);
  if(actualHex.length!==expectedHex.length)return false;
  let diff=0;for(let i=0;i<actualHex.length;i++)diff|=actualHex.charCodeAt(i)^expectedHex.charCodeAt(i);
  return diff===0;
}


export async function sha256(s){
  const b=new TextEncoder().encode(String(s));
  const d=await crypto.subtle.digest("SHA-256",b);
  return hex(d);
}
export function randomNumericCode(length=6){
  const bytes=crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map(b=>String(b%10)).join("");
}
export async function sendOtpEmail(env,{to,code,orderId}){
  if(!env.RESEND_API_KEY||!env.OTP_FROM_EMAIL){
    const e=new Error("Layanan verifikasi email belum dikonfigurasi.");e.statusCode=503;throw e;
  }
  const r=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{"content-type":"application/json","authorization":`Bearer ${env.RESEND_API_KEY}`},
    body:JSON.stringify({
      from:env.OTP_FROM_EMAIL,
      to:[to],
      subject:`Kode verifikasi pesanan ${orderId}`,
      text:`Kode verifikasi Aji Wira untuk pesanan ${orderId}: ${code}\n\nKode berlaku 10 menit dan hanya dapat digunakan sekali. Jika Anda tidak meminta kode ini, abaikan email ini.`
    })
  });
  if(!r.ok){const e=new Error("Gagal mengirim kode verifikasi.");e.statusCode=502;throw e;}
  return true;
}

// Best-effort append-only audit trail. Never throws (a logging failure must not block the admin action itself).
export async function auditLog(env,{actorId=null,action,entityType=null,entityId=null,metadata=null}){
  if(!env.DB)return;
  try{
    await env.DB.prepare("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id,metadata_json,created_at) VALUES (?,?,?,?,?,?)")
      .bind(actorId,action,entityType,entityId,metadata?JSON.stringify(metadata):null,new Date().toISOString()).run();
  }catch{}
}
export function assertAllowedTransition(from,to){const m={pending:["payment_pending","cancelled","expired"],payment_pending:["paid","failed","expired"],paid:["processing","refund_requested"],processing:["success","failed","refund_requested"],success:["refund_requested"],failed:["refund_requested"],expired:[],refund_requested:["refund_review"],refund_review:["refund_approved","refund_rejected"],refund_approved:["refund_processing"],refund_processing:["refunded","refund_review"],refund_rejected:[],refunded:[],cancelled:[]};if(!m[from]?.includes(to))throw new Error(`Invalid order transition: ${from} -> ${to}`);}



export const DEFAULT_MIDTRANS_FEES = {
  bank_transfer: { percent: 0, fixed: 4000 },
  gopay: { percent: 0.02, fixed: 0 },
  qris: { percent: 0.007, fixed: 0 },
  shopeepay: { percent: 0.02, fixed: 0 },
  dana: { percent: 0.015, fixed: 0 },
  ovo: { percent: 0.015, fixed: 0 },
  credit_card: { percent: 0.029, fixed: 2000 },
  indomaret: { percent: 0, fixed: 5000 },
  alfamart: { percent: 0, fixed: 5000 },
  akulaku: { percent: 0.017, fixed: 0 },
  kredivo: { percent: 0.02, fixed: 0 }
};

function readJsonEnv(env, key, fallback) {
  try { return env[key] ? JSON.parse(env[key]) : fallback; } catch { return fallback; }
}

export function getCheckoutPricing(env, paymentMethod, productAmount, options = {}) {
  const face = Math.max(0, Math.round(Number(productAmount) || 0));
  const isEwallet = options.serviceId === "ewallet";
  const fees = { ...DEFAULT_MIDTRANS_FEES, ...readJsonEnv(env, "MIDTRANS_FEE_CONFIG_JSON", {}) };
  const method = paymentMethod || env.DEFAULT_PAYMENT_METHOD || "bank_transfer";
  const fee = fees[method];
  if (!fee) throw new Error(`Metode pembayaran belum dikonfigurasi: ${method}`);
  const percent = Math.max(0, Number(fee.percent || 0));
  const fixed = Math.max(0, Number(fee.fixed || 0));
  const feeVatRate = Math.max(0, Number(env.MIDTRANS_FEE_VAT_RATE ?? 0.11));

  if (isEwallet) {
    // E-wallet customer pricing is capped at one transparent 10% deduction,
    // but the UI breaks that cap into meaningful components. Midtrans cost
    // and its VAT are included inside the cap; they are NOT added on top.
    const capRate = Math.max(0, Math.min(0.10, Number(env.EWALLET_DEDUCTION_RATE ?? 0.10)));
    const cap = Math.round(face * capRate);
    const gatewayFee = Math.round(face * percent + fixed);
    const gatewayVat = Math.round(gatewayFee * feeVatRate);
    const gatewayCost = gatewayFee + gatewayVat;
    if (gatewayCost > cap) throw new Error("Biaya payment gateway melebihi batas biaya e-wallet yang dikonfigurasi");

    // Remaining portion of the 10% cap is presented as the merchant's
    // service/operational component. Its VAT is shown separately, so the
    // customer sees a professional breakdown without exposing an "all-in"
    // bucket or charging anything beyond the 10% cap.
    const serviceAndTaxBudget = cap - gatewayCost;
    const serviceVatRate = Math.max(0, Number(env.SERVICE_FEE_VAT_RATE ?? 0.11));
    const serviceFee = Math.round(serviceAndTaxBudget / (1 + serviceVatRate));
    const serviceVat = Math.max(0, serviceAndTaxBudget - serviceFee);
    const deduction = gatewayCost + serviceFee + serviceVat;
    const received = Math.max(0, face - deduction);
    return {
      face, ewalletDeductionRate: capRate, ewalletDeduction: deduction,
      ewalletEstimatedReceived: received,
      serviceFee, serviceFeeVatRate: serviceVatRate, serviceFeeVat: serviceVat,
      targetNet: received, paymentMethod: method,
      gatewayFeeRate: percent, gatewayFixedFee: fixed, gatewayFee,
      gatewayVatRate: feeVatRate, gatewayVat, gatewayCost,
      total: face, merchantNet: face - gatewayCost,
      roundingBuffer: cap - deduction,
      ewalletBreakdown: { cap, serviceFee, serviceVat, gatewayFee, gatewayVat, total: deduction }
    };
  }

  const serviceFee = Math.max(0, Math.round(Number(env.SERVICE_FEE_AMOUNT || 2000)));
  const serviceFeeVatRate = Math.max(0, Number(env.SERVICE_FEE_VAT_RATE ?? 0.11));
  const serviceFeeVat = Math.round(serviceFee * serviceFeeVatRate);
  const targetNet = face + serviceFee + serviceFeeVat;
  const factor = 1 - (percent * (1 + feeVatRate));
  if (factor <= 0) throw new Error("Konfigurasi biaya payment gateway tidak valid");
  const gross = Math.ceil((targetNet + fixed * (1 + feeVatRate)) / factor);
  const gatewayFee = Math.round(gross * percent + fixed);
  const gatewayVat = Math.round(gatewayFee * feeVatRate);
  const totalGatewayCost = gatewayFee + gatewayVat;
  const merchantNet = gross - totalGatewayCost;
  return { face, ewalletDeductionRate: 0, ewalletDeduction: 0, ewalletEstimatedReceived: face, serviceFee, serviceFeeVatRate, serviceFeeVat, targetNet, paymentMethod: method, gatewayFeeRate: percent, gatewayFixedFee: fixed, gatewayFee, gatewayVatRate: feeVatRate, gatewayVat, gatewayCost: totalGatewayCost, total: gross, merchantNet, roundingBuffer: merchantNet - targetNet };
}

export function allowedPaymentMethods(env) {
  const configured = readJsonEnv(env, "MIDTRANS_FEE_CONFIG_JSON", {});
  return Object.keys({ ...DEFAULT_MIDTRANS_FEES, ...configured });
}

export async function createMidtransPayment(order,env){const key=env.MIDTRANS_SERVER_KEY;if(!key)return null;const production=env.MIDTRANS_IS_PRODUCTION==="true";const base=env.MIDTRANS_API_BASE_URL||(production?"https://app.midtrans.com":"https://app.sandbox.midtrans.com");const auth=btoa(`${key}:`);const response=await fetch(`${base}/snap/v1/transactions`,{method:"POST",headers:{authorization:`Basic ${auth}`,"content-type":"application/json"},body:JSON.stringify({transaction_details:{order_id:order.id,gross_amount:order.total},enabled_payments:order.payment_method?(order.payment_method==='bank_transfer'?['bca_va','bni_va','bri_va','permata_va','cimb_va']: [order.payment_method]):undefined,item_details:[{id:order.product_id,price:order.pricing?.face||order.total,quantity:1,name:order.product_name},{id:`${order.product_id}-service`,price:order.pricing?.serviceFee||0,quantity:1,name:'Application / Service Fee'},{id:`${order.product_id}-vat`,price:order.pricing?.serviceFeeVat||0,quantity:1,name:'PPN Service Fee'},{id:`${order.product_id}-gateway`,price:Math.max(0,order.total-(order.pricing?.face||order.total)-(order.pricing?.serviceFee||0)-(order.pricing?.serviceFeeVat||0)),quantity:1,name:'Payment Processing Adjustment'}].filter(x=>x.price>0),customer_details:{email:order.email}})});if(!response.ok)throw new Error("Payment gateway unavailable");return response.json();}
