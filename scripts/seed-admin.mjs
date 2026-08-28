import {hashPassword} from '../functions/_lib.js';
const [email,password,role='owner']=process.argv.slice(2);
if(!email||!password||password.length<12){console.error('Usage: node scripts/seed-admin.mjs admin@example.com \"password-min-12\" [owner|admin|support]');process.exit(1);}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['owner','admin','support'].includes(role)){console.error('Email/role tidak valid');process.exit(1);}
const hash=await hashPassword(password),id=`ADM-${crypto.randomUUID().slice(0,12).toUpperCase()}`,now=new Date().toISOString();
console.log(`INSERT INTO admins (id,email,password_hash,role,active,created_at) VALUES (${JSON.stringify(id)},${JSON.stringify(email.toLowerCase())},${JSON.stringify(hash)},${JSON.stringify(role)},1,${JSON.stringify(now)});`);
