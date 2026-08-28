import {json,cors,body,assertAllowedTransition,requireAdminSession,auditLog} from "../../_lib.js";
export async function onRequest({request,env}){
  if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
  const session=await requireAdminSession(request,env);
  if(!session)return json({error:'Unauthorized'},401,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  try{
    if(request.method==='GET'){
      const rows=await env.DB.prepare("SELECT o.id,o.status,o.total,o.product_name,o.email,o.whatsapp,o.input_json,o.created_at,o.updated_at,m.status AS fulfillment_status,m.admin_note,m.fulfilled_by,m.fulfilled_at FROM orders o LEFT JOIN manual_fulfillments m ON m.order_id=o.id WHERE o.game_id='digital:ewallet' AND o.status IN ('paid','processing','success','failed') ORDER BY o.created_at DESC LIMIT 100").all();
      return json({orders:rows.results||[]},200,cors(request));
    }
    if(request.method!=='PATCH')return json({error:'Method not allowed'},405,cors(request));
    const b=await body(request);
    if(!b.orderId||!['paid','processing','success','failed'].includes(b.status))return json({error:'Data status tidak valid'},400,cors(request));
    const order=await env.DB.prepare("SELECT * FROM orders WHERE id=? AND game_id='digital:ewallet'").bind(b.orderId).first();
    if(!order)return json({error:'Pesanan e-wallet tidak ditemukan'},404,cors(request));
    try{assertAllowedTransition(order.status,b.status)}catch{return json({error:`Status tidak dapat diubah dari ${order.status} ke ${b.status}`},409,cors(request));}
    const now=new Date().toISOString();
    await env.DB.prepare('UPDATE orders SET status=?,updated_at=? WHERE id=?').bind(b.status,now,order.id).run();
    if(b.status==='paid')await env.DB.prepare('INSERT OR IGNORE INTO manual_fulfillments (id,order_id,status,created_at,updated_at) VALUES (?,?,?,?,?)').bind(`MF-${order.id}`,order.id,'awaiting_admin',now,now).run();
    else await env.DB.prepare('UPDATE manual_fulfillments SET status=?,admin_note=?,fulfilled_by=?,fulfilled_at=?,updated_at=? WHERE order_id=?').bind(b.status,b.note||null,session.adminId,b.status==='success'?now:null,now,order.id).run();
    await auditLog(env,{actorId:session.adminId,action:'order.status_changed',entityType:'order',entityId:order.id,metadata:{from:order.status,to:b.status,note:b.note||null}});
    return json({ok:true,orderId:order.id,status:b.status},200,cors(request));
  }catch(e){return json({error:e?.message||'Admin operation failed'},500,cors(request));}
}
