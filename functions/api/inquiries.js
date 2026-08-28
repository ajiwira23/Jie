import {json,cors,body,idempotency,rateLimit,verifyTurnstile} from "../_lib.js";
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function onRequest({request,env}){
 if(request.method==='OPTIONS') return new Response(null,{headers:cors(request)});
 if(request.method!=='POST') return json({error:'Method not allowed'},405,cors(request));
 try{
  await rateLimit(request,env,'inquiries');await verifyTurnstile(request,env);const b=await body(request); const idem=idempotency(request); const name=String(b.name||'').trim(), email=String(b.email||'').trim();
  if(name.length<2||name.length>100||!emailRe.test(email)) return json({error:'Nama/email tidak valid'},400,cors(request));
  const fields=['whatsapp','websiteType','packageId','referenceUrl','features','deadline','notes'];
  for(const k of fields) if(b[k]!=null&&String(b[k]).length>3000) return json({error:`Field ${k} terlalu panjang`},400,cors(request));
  if(env.DB){const existing=await env.DB.prepare("SELECT inquiry_id,status FROM inquiry_idempotency WHERE idempotency_key=? LIMIT 1").bind(idem).first();if(existing)return json({inquiryId:existing.inquiry_id,status:existing.status,idempotent:true},200,cors(request));} const id=`INQ-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const now=new Date().toISOString();
  if(env.DB){await env.DB.prepare(`INSERT INTO inquiries (id,name,email,whatsapp,website_type,package_id,budget,reference_url,features,deadline,notes,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,name,email,b.whatsapp||null,b.websiteType||null,b.packageId||null,Number.isFinite(b.budget)?b.budget:null,b.referenceUrl||null,b.features||null,b.deadline||null,b.notes||null,'new',now,now).run();await env.DB.prepare("INSERT INTO inquiry_idempotency (idempotency_key,inquiry_id,status,created_at) VALUES (?,?,?,?)").bind(idem,id,'new',now).run();}
  return json({inquiryId:id,status:'new',mode:env.DB?'database':'mock'},201,{...cors(request),'x-idempotency-key':idem});
 }catch(e){return json({error:'Unable to create project request'},500,cors(request));}
}
