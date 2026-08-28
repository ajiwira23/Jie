import {json,cors,body,verifyTurnstile,rateLimit} from "../_lib.js";
const SERVICES={pdam:{label:'PDAM',field:'customerNumber'},bpjs:{label:'BPJS',field:'customerNumber'}};
export async function onRequest({request,env}){
 if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
 if(request.method!=='POST')return json({error:'Method not allowed'},405,cors(request));
 try{await rateLimit(request,env,'digital-inquiry',{limit:20});await verifyTurnstile(request,env);const b=await body(request);const s=SERVICES[b.serviceId];if(!s)return json({error:'Layanan inquiry tidak didukung'},400,cors(request));const value=String(b.inputs?.[s.field]||'').trim();if(!/^\d{6,20}$/.test(value))return json({error:`${s.label}: nomor pelanggan tidak valid`},400,cors(request));
  if(!env.DIGITAL_PROVIDER_API_URL||!env.DIGITAL_PROVIDER_API_KEY)return json({error:`Provider ${s.label} belum dikonfigurasi. Sistem tidak membuat nominal tagihan palsu.`},503,cors(request));
  const r=await fetch(env.DIGITAL_PROVIDER_API_URL,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${env.DIGITAL_PROVIDER_API_KEY}`},body:JSON.stringify({action:'inquiry',serviceId:b.serviceId,customerNumber:value})});
  const j=await r.json().catch(()=>null);if(!r.ok)return json({error:'Provider inquiry gagal'},502,cors(request));
  if(!j||!j.success||!Number.isFinite(Number(j.amount))||Number(j.amount)<=0)return json({error:'Provider tidak mengembalikan tagihan yang valid'},502,cors(request));
  return json({success:true,serviceId:b.serviceId,customerNumber:value,customerName:j.customerName||null,amount:Math.round(Number(j.amount)),adminFee:Math.max(0,Math.round(Number(j.adminFee||0))),providerReference:j.reference||null},200,cors(request));
 }catch(e){return json({error:e?.message||'Inquiry gagal'},e?.statusCode||500,cors(request));}
}
