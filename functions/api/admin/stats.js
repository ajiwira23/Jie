import {json,cors,requireAdminSession} from "../../_lib.js";
// Backs the Overview stat cards in admin.html, which currently render static "—" placeholders.
export async function onRequest({request,env}){
  if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
  if(request.method!=='GET')return json({error:'Method not allowed'},405,cors(request));
  const session=await requireAdminSession(request,env);
  if(!session)return json({error:'Unauthorized'},401,cors(request));
  if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
  try{
    const [totalOrders,pending,success,revenue,openRefunds,openInquiries,openTickets]=await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS n FROM orders").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE status IN ('pending','payment_pending','paid','processing')").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE status='success'").first(),
      env.DB.prepare("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE status IN ('paid','processing','success')").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM refunds WHERE status NOT IN ('refunded','refund_rejected')").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM inquiries WHERE status='new'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM support_tickets WHERE status IN ('open','in_progress')").first(),
    ]);
    return json({
      totalOrders:totalOrders?.n||0,
      pendingOrders:pending?.n||0,
      successOrders:success?.n||0,
      revenue:revenue?.s||0,
      openRefunds:openRefunds?.n||0,
      openInquiries:openInquiries?.n||0,
      openTickets:openTickets?.n||0,
    },200,{...cors(request),'cache-control':'no-store'});
  }catch(e){return json({error:e?.message||'Unable to load stats'},500,cors(request));}
}
