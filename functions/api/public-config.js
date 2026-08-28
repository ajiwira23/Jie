import {json,cors} from "../_lib.js";
export async function onRequest({request,env}){if(request.method==='OPTIONS')return new Response(null,{headers:cors(request)});if(request.method!=='GET')return json({error:'Method not allowed'},405,cors(request));return json({turnstileSiteKey:env.TURNSTILE_SITE_KEY||null},200,{...cors(request),'cache-control':'public, max-age=300'});}
