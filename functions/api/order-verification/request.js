import {json,cors,body,idempotency,rateLimit,verifyTurnstile,sha256,randomNumericCode,sendOtpEmail} from "../../_lib.js";
export async function onRequest({request,env}){
 if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
 if(request.method!=='POST')return json({error:'Method not allowed'},405,cors(request));
 try{
  await rateLimit(request,env,'order-verify-request',{limit:5,windowSeconds:900});await verifyTurnstile(request,env);
  const b=await body(request),orderId=String(b.orderId||'').trim(),contact=String(b.contact||'').trim().toLowerCase();
  if(!/^[A-Z0-9-]{6,80}$/.test(orderId)||!contact)return json({error:'Order ID dan kontak wajib diisi'},400,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  const order=await env.DB.prepare("SELECT id,email,whatsapp FROM orders WHERE id=? LIMIT 1").bind(orderId).first();
  if(!order)return json({error:'Pesanan tidak ditemukan'},404,cors(request));
  const matches=contact===String(order.email).toLowerCase()||contact===String(order.whatsapp||'').toLowerCase();
  if(!matches)return json({error:'Data kontak tidak cocok dengan pesanan'},403,cors(request));
  const existing=await env.DB.prepare("SELECT id FROM order_verifications WHERE order_id=? AND used_at IS NULL AND expires_at>? ORDER BY created_at DESC LIMIT 1").bind(order.id,new Date().toISOString()).first();
  if(existing)return json({ok:true,verificationId:existing.id,message:'Kode verifikasi masih aktif. Periksa email yang terdaftar.'},200,cors(request));
  const code=randomNumericCode(6),now=new Date(),expires=new Date(now.getTime()+10*60*1000),id=`OV-${crypto.randomUUID().slice(0,12).toUpperCase()}`;
  await env.DB.prepare("DELETE FROM order_verifications WHERE order_id=? AND (used_at IS NOT NULL OR expires_at<?)").bind(order.id,now.toISOString()).run();
  await env.DB.prepare("INSERT INTO order_verifications (id,order_id,contact,otp_hash,attempts,expires_at,created_at) VALUES (?,?,?,?,?,?,?)").bind(id,order.id,contact,await sha256(code),0,expires.toISOString(),now.toISOString()).run();
  try{await sendOtpEmail(env,{to:order.email,code,orderId:order.id});}catch(e){await env.DB.prepare("DELETE FROM order_verifications WHERE id=?").bind(id).run();throw e;}
  return json({ok:true,verificationId:id,message:'Kode verifikasi dikirim ke email yang terdaftar dan berlaku 10 menit.'},200,cors(request));
 }catch(e){return json({error:e.statusCode?e.message:'Gagal mengirim kode verifikasi'},e.statusCode||500,cors(request));}
}
