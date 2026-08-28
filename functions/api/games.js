import {json,cors} from "../_lib.js";
import {GAMES} from "../../catalog.js";
export async function onRequest({request}){if(request.method==="OPTIONS")return new Response(null,{headers:cors(request)});if(request.method!=="GET")return json({error:"Method not allowed"},405,cors(request));return json({games:GAMES},200,{...cors(request),"cache-control":"public, max-age=60"});}
