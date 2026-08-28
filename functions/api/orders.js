import {json,cors,body,idempotency,orderId,createMidtransPayment,getCheckoutPricing,allowedPaymentMethods,verifyTurnstile,rateLimit} from "../_lib.js";
import {GAME_PRODUCT_MAP} from "../../catalog.js";
export async function onRequest({request,env}){if(request.method==="OPTIONS")return new Response(null,{headers:cors(request)});if(request.method!=="POST")return json({error:"Method not allowed"},405,cors(request));try{
 await rateLimit(request,env,'orders'); await verifyTurnstile(request,env);
 const b=await body(request);if(!b?.gameId||!b?.productId||!b?.inputs||!b?.email)return json({error:"Data order tidak lengkap"},400,cors(request));
 const p=GAME_PRODUCT_MAP[b.productId];if(!p||p.gameId!==b.gameId||!p.available||p.price<=0)return json({error:"Produk tidak tersedia"},409,cors(request));
 const email=String(b.email).trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:"Email tidak valid"},400,cors(request));
 for(const v of Object.values(b.inputs))if(typeof v!=="string"||v.length>120)return json({error:"Input akun tidak valid"},400,cors(request));
 const idem=idempotency(request),now=new Date().toISOString();if(env.DB){const existing=await env.DB.prepare("SELECT id,status,total,game_id,product_id FROM orders WHERE idempotency_key=? LIMIT 1").bind(idem).first();if(existing){return json({orderId:existing.id,status:existing.status,total:existing.total,mode:"database",idempotent:true},200,cors(request));}}
 const paymentMethod=String(b.paymentMethod||env.DEFAULT_PAYMENT_METHOD||"bank_transfer");if(!allowedPaymentMethods(env).includes(paymentMethod))return json({error:"Metode pembayaran tidak didukung"},400,cors(request));
 const pricing=getCheckoutPricing(env,paymentMethod,p.price);const id=orderId();
 if(b.promoCode)return json({error:"Kode promo belum dikonfigurasi di environment/database."},400,cors(request));
 const order={id,status:"payment_pending",pricing,game_id:b.gameId,product_id:b.productId,product_name:p.name,total:pricing.total,email,whatsapp:b.whatsapp||null,input_json:JSON.stringify({...b.inputs,_pricing:pricing,payment_method:paymentMethod}),idempotency_key:idem,created_at:now,updated_at:now};
 if(env.DB)await env.DB.prepare(`INSERT INTO orders (id,status,game_id,product_id,product_name,total,email,whatsapp,input_json,idempotency_key,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(order.id,order.status,order.game_id,order.product_id,order.product_name,order.total,order.email,order.whatsapp,order.input_json,order.idempotency_key,order.created_at,order.updated_at).run();
 let payment;try{payment=await createMidtransPayment(order,env);}catch(e){if(env.DB)await env.DB.prepare("DELETE FROM orders WHERE id=? AND status='payment_pending'").bind(id).run();throw e;}
 if(payment&&env.DB)await env.DB.prepare(`INSERT INTO payments (order_id,provider,provider_order_id,status,gross_amount,created_at) VALUES (?,?,?,?,?,?)`).bind(id,"midtrans",id,"pending",order.total,now).run();
 return json({orderId:id,status:order.status,total:order.total,pricing,payment:payment?{token:payment.token,redirect_url:payment.redirect_url}:null,mode:payment?"midtrans":"mock"},201,cors(request));
}catch(e){return json({error:e.message?.startsWith('Missing')||e.statusCode?e.message:"Unable to create order"},e.statusCode||500,cors(request));}}
