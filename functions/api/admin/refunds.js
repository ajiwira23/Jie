import {json,cors,body,assertAllowedTransition,requireAdminSession,auditLog} from "../../_lib.js";
// Admin-facing counterpart to the public POST /api/refunds — without this, refund requests dead-end at
// "refund_requested" forever. Mirrors the order's own status alongside the refund record, since both
// share the same state vocabulary (see assertAllowedTransition in functions/_lib.js).
export async function onRequest({request,env}){
  if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
  const session=await requireAdminSession(request,env);
  if(!session)return json({error:'Unauthorized'},401,cors(request));
  if(request.method==='PATCH' && !['owner','admin'].includes(session.role))return json({error:'Akses perubahan order/refund tidak diizinkan untuk role ini'},403,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  try{
    if(request.method==='GET'){
      const url=new URL(request.url);
      const statusFilter=url.searchParams.get('status');
      const clauses=[];const params=[];
      if(statusFilter){clauses.push('r.status=?');params.push(statusFilter);}
      const where=clauses.length?`WHERE ${clauses.join(' AND ')}`:'';
      const sql=`SELECT r.id,r.order_id,r.status,r.reason,r.description,r.provider_ref,r.created_at,r.updated_at,o.total,o.email,o.whatsapp,o.product_name,o.status AS order_status FROM refunds r JOIN orders o ON o.id=r.order_id ${where} ORDER BY r.created_at DESC LIMIT 100`;
      const rows=await env.DB.prepare(sql).bind(...params).all();
      return json({refunds:rows.results||[]},200,cors(request));
    }
    if(request.method!=='PATCH')return json({error:'Method not allowed'},405,cors(request));
    const b=await body(request);
    const allowed=['refund_review','refund_approved','refund_rejected','refund_processing','refunded'];
    if(!b.refundId||!allowed.includes(b.status))return json({error:'Data status refund tidak valid'},400,cors(request));
    const refund=await env.DB.prepare("SELECT * FROM refunds WHERE id=?").bind(b.refundId).first();
    if(!refund)return json({error:'Refund tidak ditemukan'},404,cors(request));
    try{assertAllowedTransition(refund.status,b.status)}catch{return json({error:`Status refund tidak dapat diubah dari ${refund.status} ke ${b.status}`},409,cors(request));}
    const now=new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare('UPDATE refunds SET status=?,provider_ref=?,updated_at=? WHERE id=?').bind(b.status,b.providerRef||refund.provider_ref||null,now,refund.id),
      env.DB.prepare('UPDATE orders SET status=?,updated_at=? WHERE id=? AND status NOT IN (?,?)').bind(b.status,now,refund.order_id,'refunded','refund_rejected'),
      env.DB.prepare('INSERT INTO refund_events (refund_id,event_type,payload_json,created_at) VALUES (?,?,?,?)').bind(refund.id,'admin.status_changed',JSON.stringify({from:refund.status,to:b.status,note:b.note||null,adminId:session.adminId}),now),
    ]);
    await auditLog(env,{actorId:session.adminId,action:'refund.status_changed',entityType:'refund',entityId:refund.id,metadata:{from:refund.status,to:b.status,note:b.note||null}});
    return json({ok:true,refundId:refund.id,status:b.status},200,cors(request));
  }catch(e){return json({error:e?.message||'Admin operation failed'},500,cors(request));}
}
