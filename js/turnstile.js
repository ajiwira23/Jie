(() => {
  let token=''; let readyResolve; const ready=new Promise(r=>readyResolve=r); window.AWTurnstile={ready,token:()=>token};
  async function init(){try{const r=await fetch('/api/public-config');const c=await r.json();if(!c.turnstileSiteKey){readyResolve('');return;}const holder=document.querySelector('#turnstile-widget');if(!holder){readyResolve('');return;}const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;script.onload=()=>{window.turnstile.render(holder,{sitekey:c.turnstileSiteKey,theme:document.documentElement.dataset.theme==='light'?'light':'dark',callback:v=>{token=v;readyResolve(v)},'expired-callback':()=>{token='';}})};document.head.appendChild(script);}catch{readyResolve('')}}
  document.addEventListener('DOMContentLoaded',init);
})();
