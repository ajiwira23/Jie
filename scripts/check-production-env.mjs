// Run before a production deploy: wrangler pages secret list, then paste/confirm, or wire this into CI
// against your actual secret store. Cloudflare Pages Functions env vars aren't readable from Node directly,
// so this script documents + checks whatever is passed to it via process.env for local/CI verification —
// it is a checklist made executable, not a live probe of the deployed Worker.
const REQUIRED = [
  'SESSION_SECRET',
  'MIDTRANS_SERVER_KEY',
  'TURNSTILE_SECRET_KEY',
  'RESEND_API_KEY',
  'OTP_FROM_EMAIL',
];
const RECOMMENDED = [
  'ADMIN_ID',
  'MIDTRANS_IS_PRODUCTION',
  'SERVICE_FEE_AMOUNT',
];

const missing = REQUIRED.filter(k => !process.env[k]);
const missingRecommended = RECOMMENDED.filter(k => !process.env[k]);



if (missing.length) {
  console.error(`Missing required security configuration before production deploy: ${missing.join(', ')}`);
  console.error('Without these, Turnstile/rate limiting/admin login degrade silently instead of failing loudly — see SECURITY.md.');
  process.exit(1);
}
if (missingRecommended.length) {
  console.warn(`Recommended (not blocking) configuration not set: ${missingRecommended.join(', ')}`);
}
console.log('Production environment check passed.');
