import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {getCheckoutPricing,DEFAULT_MIDTRANS_FEES} from '../functions/_lib.js';
const root=path.resolve('.');
const required=['index.html','topup.html','game.html','checkout.html','order.html','refund.html','admin.html','faq.html','terms.html','privacy.html','404.html','robots.txt','sitemap.xml','manifest.json','favicon.svg','catalog.js','js/main.js','js/store.js','js/turnstile.js','functions/api/public-pricing.js','functions/api/admin/session.js','functions/api/admin/admins.js','functions/api/order-verification/request.js','functions/api/order-verification/verify.js'];
for(const f of required)if(!fs.existsSync(path.join(root,f)))throw new Error(`Missing ${f}`);
const jsFiles=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.js')||p.endsWith('.mjs'))jsFiles.push(p)}}walk(root);
for(const f of jsFiles)execFileSync(process.execPath,['--check',f],{stdio:'inherit'});
const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html'));for(const f of htmlFiles){const h=fs.readFileSync(path.join(root,f),'utf8');if(!h.includes('rel="icon"'))throw new Error(`Missing favicon in ${f}`);if(!h.includes('meta name="description"'))throw new Error(`Missing description in ${f}`)}
for(const [method,expectedMin] of Object.entries(DEFAULT_MIDTRANS_FEES)){const p=getCheckoutPricing({SERVICE_FEE_AMOUNT:'2000',SERVICE_FEE_VAT_RATE:'0.11',MIDTRANS_FEE_VAT_RATE:'0.11'},method,100000);if(p.merchantNet<p.targetNet)throw new Error(`Gross-up failed for ${method}`);}
const orders=fs.readFileSync(path.join(root,'functions/api/orders.js'),'utf8');if(orders.includes('steam-8'))throw new Error('Legacy Steam ID remains in orders API');
const schema=fs.readFileSync(path.join(root,'SCHEMA.sql'),'utf8');
for(const t of ['admins','audit_logs','rate_limits','order_verifications'])if(!schema.includes(`CREATE TABLE IF NOT EXISTS ${t}`))throw new Error(`Missing Stage 2 table: ${t}`);

const frontend=fs.readFileSync(path.join(root,'js/admin.js'),'utf8');if(frontend.includes('sessionStorage.setItem')||frontend.includes('aw-admin-token'))throw new Error('Admin credential persisted in browser storage');

// Guards against the class of bug audited on 2026-08-27: an INSERT's column list, its VALUES(?) placeholder
// count, and the number of arguments passed to .bind(...) must all agree, or D1 rejects the query at runtime
// with no compile-time warning. Scans every INSERT INTO ... VALUES (...) ... .bind(...) call in functions/.
let sqlChecks=0;
const insertPattern=/INSERT(?:\s+OR\s+\w+)?\s+INTO\s+\w+\s*\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)[^;`]*?\.bind\(([^;]*?)\)\.run\(\)/gs;
for(const f of jsFiles){
  if(!f.startsWith(path.join(root,'functions'))) continue;
  const src=fs.readFileSync(f,'utf8');
  let m;
  while((m=insertPattern.exec(src))){
    sqlChecks++;
    const cols=m[1].split(',').map(s=>s.trim()).filter(Boolean).length;
    const placeholders=(m[2].match(/\?/g)||[]).length;
    // Rough bind-arg count: split on top-level commas only (ignores commas inside nested parens/template literals).
    let depth=0,args=1,inTemplate=false;
    for(const ch of m[3]){
      if(ch==='`') inTemplate=!inTemplate;
      if(inTemplate) continue;
      if(ch==='('||ch==='[') depth++;
      else if(ch===')'||ch===']') depth--;
      else if(ch===','&&depth===0) args++;
    }
    if(m[3].trim()==='') args=0;
    if(cols!==placeholders) throw new Error(`${path.relative(root,f)}: INSERT has ${cols} columns but ${placeholders} '?' placeholders`);
    if(cols!==args) throw new Error(`${path.relative(root,f)}: INSERT has ${cols} columns but .bind() passes ${args} argument(s)`);
  }
}
if(sqlChecks===0) throw new Error('No INSERT statements were found to validate — the check pattern may be out of sync with the codebase');

console.log(`Smoke test passed: ${jsFiles.length} JS files, ${htmlFiles.length} HTML pages, catalog sync, pricing gross-up, admin storage, ${sqlChecks} INSERT statements validated, and required production assets.`);
