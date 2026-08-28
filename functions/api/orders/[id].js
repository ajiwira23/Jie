import {json,cors,sha256} from "../../_lib.js";
export async function onRequest({request,env,params}){
 if(request.method==="OPTIONS")return new Response(null,{headers:cors(request)});
 if(request.method!=="GET")return json({error:"Method not allowed"},405,cors(request));
 const id=String(params.id||"").slice(0,80);if(!/^[A-Z0-9-]+$/.test(id))return json({error:"Order ID tidak valid"},400,cors(request));
 if(!env.DB)return json({error:"Order database belum dikonfigurasi"},503,cors(request));
 const token=String(request.headers.get("x-order-verification")||"").trim();
 if(!token)return json({error:"Verifikasi kepemilikan diperlukan. Minta dan masukkan kode OTP."},401,cors(request));
 const tokenHash=await sha256(token);
 const verification=await env.DB.prepare("SELECT order_id,access_expires_at FROM order_verifications WHERE order_id=? AND access_token_hash=? ORDER BY verified_at DESC LIMIT 1").bind(id,tokenHash).first();
 if(!verification||!verification.access_expires_at||Date.now()>Date.parse(verification.access_expires_at))return json({error:"Sesi verifikasi sudah berakhir. Silakan verifikasi ulang."},403,cors(request));
 const r=await env.DB.prepare("SELECT id,status,game_id,product_name,total,email,whatsapp,created_at,updated_at FROM orders WHERE id=?").bind(id).first();
 if(!r)return json({error:"Pesanan tidak ditemukan"},404,cors(request));
 if(verification.order_id!==r.id)return json({error:"Verifikasi order tidak cocok"},403,cors(request));
 delete r.email;delete r.whatsapp;
 return json({order:r},200,cors(request));
}
