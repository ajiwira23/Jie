import {json,cors,body,rateLimit,sha256,auditLog} from "../../_lib.js";
export async function onRequest({request,env}){
 if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
 if(request.method!=='POST')return json({error:'Method not allowed'},405,cors(request));
 try{
  await rateLimit(request,env,'order-verify-confirm',{limit:10,windowSeconds:900});
  const b=await body(request),orderId=String(b.orderId||'').trim(),verificationId=String(b.verificationId||'').trim(),code=String(b.code||'').trim();
  if(!orderId||!verificationId||!/^\d{6}$/.test(code))return json({error:'Kode verifikasi tidak valid'},400,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  const row=await env.DB.prepare("SELECT id,order_id,otp_hash,attempts,expires_at,used_at FROM order_verifications WHERE id=? AND order_id=? LIMIT 1").bind(verificationId,orderId).first();
  if(!row||row.used_at)return json({error:'Kode verifikasi tidak tersedia'},403,cors(request));
  if(Date.now()>Date.parse(row.expires_at))return json({error:'Kode verifikasi sudah kedaluwarsa'},403,cors(request));
  if(Number(row.attempts)>=5)return json({error:'Batas percobaan kode tercapai'},429,cors(request));
  const valid=await sha256(code)===row.otp_hash;
  if(!valid){await env.DB.prepare("UPDATE order_verifications SET attempts=attempts+1 WHERE id=?").bind(row.id).run();return json({error:'Kode verifikasi salah'},403,cors(request));}
  const token=b64u(crypto.randomUUID()+'.'+crypto.randomUUID()),tokenHash=await sha256(token),now=new Date(),accessExpires=new Date(now.getTime()+15*60*1000).toISOString();
  // Store only a hash of the short-lived access token; the raw token is returned once.
  await env.DB.prepare("UPDATE order_verifications SET verified_at=?,used_at=?,access_token_hash=?,access_expires_at=? WHERE id=?").bind(now.toISOString(),now.toISOString(),tokenHash,accessExpires,row.id).run();
  await env.DB.prepare("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id,metadata_json,created_at) VALUES (?,?,?,?,?,?)").bind(null,'order.ownership_verified','order',orderId,JSON.stringify({verificationId:row.id}),now).run();
  return json({ok:true,accessToken:token,expiresIn:900},200,cors(request));
 }catch(e){return json({error:e?.message||'Verifikasi gagal'},500,cors(request));}
}
function b64u(s){return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
