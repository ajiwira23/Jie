import {json,cors,body,requireAdminSession,auditLog} from "../../_lib.js";
const ALLOWED_STATUS=['open','in_progress','resolved','closed'];
export async function onRequest({request,env}){
  if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
  const session=await requireAdminSession(request,env);
  if(!session)return json({error:'Unauthorized'},401,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  try{
    if(request.method==='GET'){
      const url=new URL(request.url);const statusFilter=url.searchParams.get('status');
      const sql=statusFilter
        ? "SELECT id,order_id,email,name,message,status,created_at,updated_at FROM support_tickets WHERE status=? ORDER BY created_at DESC LIMIT 100"
        : "SELECT id,order_id,email,name,message,status,created_at,updated_at FROM support_tickets ORDER BY created_at DESC LIMIT 100";
      const rows=statusFilter?await env.DB.prepare(sql).bind(statusFilter).all():await env.DB.prepare(sql).all();
      return json({tickets:rows.results||[]},200,cors(request));
    }
    if(request.method!=='PATCH')return json({error:'Method not allowed'},405,cors(request));
    const b=await body(request);
    if(!b.ticketId||!ALLOWED_STATUS.includes(b.status))return json({error:'Data status tidak valid'},400,cors(request));
    const existing=await env.DB.prepare("SELECT id,status FROM support_tickets WHERE id=?").bind(b.ticketId).first();
    if(!existing)return json({error:'Tiket tidak ditemukan'},404,cors(request));
    const now=new Date().toISOString();
    await env.DB.prepare("UPDATE support_tickets SET status=?,updated_at=? WHERE id=?").bind(b.status,now,existing.id).run();
    await auditLog(env,{actorId:session.adminId,action:'support_ticket.status_changed',entityType:'support_ticket',entityId:existing.id,metadata:{from:existing.status,to:b.status}});
    return json({ok:true,ticketId:existing.id,status:b.status},200,cors(request));
  }catch(e){return json({error:e?.message||'Admin operation failed'},500,cors(request));}
}
