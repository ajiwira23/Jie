import {json,cors,body,verifyPassword,rateLimit,verifyTurnstile,auditLog} from "../../_lib.js";
const COOKIE='aw_admin_session';
function b64u(s){return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function unb64u(s){return atob(s.replace(/-/g,'+').replace(/_/g,'/'));}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64u(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))))}
async function validSession(request,env){
  const raw=request.headers.get('cookie')||'';const m=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
  if(!m||!env.SESSION_SECRET)return null;const token=m.slice(COOKIE.length+1);const [payload,sig]=token.split('.');
  if(!payload||!sig)return null;const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SESSION_SECRET),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const padded=sig.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((sig.length+3)%4);let bytes;
  try{bytes=Uint8Array.from(atob(padded),c=>c.charCodeAt(0));}catch{return null}
  if(!await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(payload)))return null;
  let data;try{data=JSON.parse(unb64u(payload));}catch{return null}
  if(!data.exp||Date.now()>data.exp||!data.adminId)return null;
  if(env.DB){
    try{const a=await env.DB.prepare("SELECT id,email,role,active FROM admins WHERE id=? LIMIT 1").bind(data.adminId).first();return a&&Number(a.active)===1?{...data,email:a.email,role:a.role}:null;}catch{return null}
  }
  return env.ALLOW_LEGACY_ADMIN_ENV==="true"?data:null;
}
export async function onRequest({request,env}){
 if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
 if(request.method==='GET'){const s=await validSession(request,env);return json({authenticated:!!s,adminId:s?.adminId||null,email:s?.email||null,role:s?.role||null},200,cors(request));}
 if(request.method==='DELETE'){const s=await validSession(request,env);if(s)await auditLog(env,{actorId:s.adminId,action:'admin.logout'});return new Response(null,{status:204,headers:{...cors(request),'set-cookie':`${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`}});}
 if(request.method!=='POST')return json({error:'Method not allowed'},405,cors(request));
 try{
  await rateLimit(request,env,'admin-login',{limit:5,windowSeconds:900});await verifyTurnstile(request,env);
  const b=await body(request);const email=String(b.email||'').trim().toLowerCase();const password=String(b.password||'');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8||password.length>200)return json({error:'Email atau password admin tidak valid'},400,cors(request));
  if(!env.SESSION_SECRET)return json({error:'Admin login belum dikonfigurasi'},503,cors(request));
  if(!env.DB)return json({error:'Database admin belum dikonfigurasi'},503,cors(request));
  const admin=await env.DB.prepare("SELECT id,email,password_hash,role,active FROM admins WHERE lower(email)=? LIMIT 1").bind(email).first();
  const ok=!!admin&&Number(admin.active)===1&&await verifyPassword(password,admin.password_hash);
  if(!ok){await auditLog(env,{actorId:admin?.id||email,action:'admin.login_failed',metadata:{reason:'invalid_credentials'}});return json({error:'Email atau password admin salah'},401,cors(request));}
  const payload=b64u(JSON.stringify({adminId:admin.id,iat:Date.now(),exp:Date.now()+8*60*60*1000}));
  const sig=await sign(payload,env.SESSION_SECRET);
  await auditLog(env,{actorId:admin.id,action:'admin.login_success',metadata:{role:admin.role}});
  return json({ok:true,adminId:admin.id,email:admin.email,role:admin.role},200,{...cors(request),'set-cookie':`${COOKIE}=${payload}.${sig}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Strict`});
 }catch(e){return json({error:e.statusCode?e.message:'Admin login gagal'},e.statusCode||500,cors(request));}
}
