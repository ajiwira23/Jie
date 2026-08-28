import crypto from 'node:crypto';

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Usage: node scripts/hash-admin-password.mjs "password-min-8-char"');
  process.exit(1);
}

// PBKDF2-HMAC-SHA256, 210,000 iterations, per-password random salt.
// Must match verifyPassword() in functions/_lib.js exactly (algorithm, hash, iteration count, format).
const ITERATIONS = 210_000;
const salt = crypto.randomBytes(16);
const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
const hash = `pbkdf2$${ITERATIONS}$${salt.toString('hex')}$${derived.toString('hex')}`;

console.log('# Set this single value as ADMIN_PASSWORD_HASH. ADMIN_PASSWORD_SALT is no longer needed.');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
