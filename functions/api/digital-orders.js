import {json,cors,body,idempotency,orderId,createMidtransPayment,getCheckoutPricing,allowedPaymentMethods,verifyTurnstile,rateLimit} from "../_lib.js";
import {DIGITAL_PRODUCT_MAP} from "../../catalog.js";
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; const validPhone=v=>/^08\d{8,13}$/.test(String(v||'').replace(/\D/g,''));
function parseAmount(raw){const s=String(raw??'').trim().replace(/\s/g,'');if(!/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$/.test(s)&&!/^\d+$/.test(s))return 0;return Number(s.replace(/\./g,'').replace(/,\d{1,2}$/,''))||0;}
export async function onRequest({request,env}){if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});if(request.method!=='POST')return json({error:'Method not allowed'},405,cors(request));try{
 await rateLimit(request,env,'digital-orders'); await verifyTurnstile(request,env);
 const b=await body(request);const p=DIGITAL_PRODUCT_MAP[b.productId];if(!p||p.serviceId!==b.serviceId)return json({error:'Produk digital tidak valid'},400,cors(request));
 const email=String(b.email||'').trim();if(!EMAIL.test(email))return json({error:'Email tidak valid'},400,cors(request));
 const inputs=b.inputs&&typeof b.inputs==='object'?b.inputs:{};for(const [k,v] of Object.entries(inputs)){if(typeof v!=='string'||v.length>120)return json({error:`Input ${k} tidak valid`},400,cors(request));}
 if(['pulsa'].includes(p.serviceId)&&!validPhone(inputs.phone))return json({error:'Nomor HP tidak valid'},400,cors(request));
 if(p.serviceId==='ewallet'&&!validPhone(inputs.account))return json({error:'Nomor tujuan e-wallet tidak valid'},400,cors(request));
 let face=Number(p.faceValue||0);if(p.custom){face=parseAmount(b.customAmount);if(face<100000||face>1000000)return json({error:'Nominal e-wallet harus Rp100.000 sampai Rp1.000.000'},400,cors(request));}
 const paymentMethod=String(b.paymentMethod||env.DEFAULT_PAYMENT_METHOD||'bank_transfer');if(!allowedPaymentMethods(env).includes(paymentMethod))return json({error:'Metode pembayaran tidak didukung'},400,cors(request));
 if(p.serviceId!=='ewallet')return json({error:'Produk PPOB ini belum memiliki harga provider yang dapat dipakai untuk checkout.'},409,cors(request));
 const calc=getCheckoutPricing(env,paymentMethod,face,{serviceId:p.serviceId});const idem=idempotency(request),now=new Date().toISOString();
 if(env.DB){const existing=await env.DB.prepare('SELECT id,status,total FROM orders WHERE idempotency_key=? LIMIT 1').bind(idem).first();if(existing)return json({orderId:existing.id,status:existing.status,total:existing.total,mode:'database',idempotent:true},200,cors(request));}
 const id=orderId().replace('LT-','DG-');const order={id,status:'payment_pending',pricing:calc,game_id:`digital:${p.serviceId}`,product_id:b.productId,product_name:p.name,total:calc.total,email,whatsapp:b.whatsapp||null,input_json:JSON.stringify({...inputs,_pricing:calc,payment_method:paymentMethod,fulfillment:{mode:'manual_admin',status:'awaiting_admin'}}),idempotency_key:idem,created_at:now,updated_at:now};
 if(env.DB)await env.DB.prepare('INSERT INTO orders (id,status,game_id,product_id,product_name,total,email,whatsapp,input_json,idempotency_key,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(order.id,order.status,order.game_id,order.product_id,order.product_name,order.total,order.email,order.whatsapp,order.input_json,order.idempotency_key,order.created_at,order.updated_at).run();
 let payment;try{payment=await createMidtransPayment(order,env);}catch(e){if(env.DB)await env.DB.prepare("DELETE FROM orders WHERE id=? AND status='payment_pending'").bind(id).run();throw e;}
 if(payment&&env.DB)await env.DB.prepare('INSERT INTO payments (order_id,provider,provider_order_id,status,gross_amount,created_at) VALUES (?,?,?,?,?,?)').bind(id,'midtrans',id,'pending',order.total,now).run();
 return json({orderId:id,status:order.status,total:order.total,pricing:calc,payment:payment?{token:payment.token,redirect_url:payment.redirect_url}:null,mode:payment?'midtrans':(env.DB?'database':'mock')},201,cors(request));
}catch(e){return json({error:e?.message||'Unable to create digital order'},e?.statusCode||500,cors(request));}}
