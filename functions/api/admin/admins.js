import {json,cors,body,requireAdminSession,auditLog,hashPassword} from "../../_lib.js";
const ROLES=['owner','admin','support'];
export async function onRequest({request,env}){
 if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});
 const session=await requireAdminSession(request,env);if(!session)return json({error:'Unauthorized'},401,cors(request));
 if(session.role!=='owner')return json({error:'Akses khusus owner'},403,cors(request));
 if(!env.DB)return json({error:'Database belum dikonfigurasi'},503,cors(request));
 try{
  if(request.method==='GET'){
   const rows=await env.DB.prepare("SELECT id,email,role,active,created_at FROM admins ORDER BY created_at ASC").all();
   return json({admins:rows.results||[]},200,cors(request));
  }
  const b=await body(request);
  if(request.method==='POST'){
   const email=String(b.email||'').trim().toLowerCase(),password=String(b.password||''),role=String(b.role||'admin');
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<12||password.length>200||!ROLES.includes(role))return json({error:'Data admin tidak valid. Password minimal 12 karakter.'},400,cors(request));
   const exists=await env.DB.prepare("SELECT id FROM admins WHERE lower(email)=?").bind(email).first();if(exists)return json({error:'Email admin sudah terdaftar'},409,cors(request));
   const id=`ADM-${crypto.randomUUID().slice(0,12).toUpperCase()}`,now=new Date().toISOString(),hash=await hashPassword(password);
   await env.DB.prepare("INSERT INTO admins (id,email,password_hash,role,active,created_at) VALUES (?,?,?,?,?,?)").bind(id,email,hash,role,1,now).run();
   await auditLog(env,{actorId:session.adminId,action:'admin.created',entityType:'admin',entityId:id,metadata:{email,role}});
   return json({ok:true,admin:{id,email,role,active:1,created_at:now}},201,cors(request));
  }
  if(request.method==='PATCH'){
   if(!b.adminId)return json({error:'adminId wajib diisi'},400,cors(request));
   if(b.adminId===session.adminId&&b.active===false)return json({error:'Owner tidak dapat menonaktifkan sesi sendiri'},409,cors(request));
   const existing=await env.DB.prepare("SELECT id,email,role,active FROM admins WHERE id=?").bind(String(b.adminId)).first();if(!existing)return json({error:'Admin tidak ditemukan'},404,cors(request));
   const sets=[],params=[];
   if(b.role!==undefined){if(!ROLES.includes(String(b.role)))return json({error:'Role tidak valid'},400,cors(request));sets.push('role=?');params.push(String(b.role));}
   if(b.active!==undefined){sets.push('active=?');params.push(b.active?1:0);}
   if(b.password!==undefined){if(String(b.password).length<12)return json({error:'Password minimal 12 karakter'},400,cors(request));sets.push('password_hash=?');params.push(await hashPassword(String(b.password)));}
   if(!sets.length)return json({error:'Tidak ada perubahan'},400,cors(request));
   params.push(existing.id);await env.DB.prepare(`UPDATE admins SET ${sets.join(',')} WHERE id=?`).bind(...params).run();
   await auditLog(env,{actorId:session.adminId,action:'admin.updated',entityType:'admin',entityId:existing.id,metadata:{changes:Object.keys(b).filter(k=>k!=='password')}});
   return json({ok:true,adminId:existing.id},200,cors(request));
  }
  return json({error:'Method not allowed'},405,cors(request));
 }catch(e){return json({error:e?.message||'Admin management failed'},500,cors(request));}
}
