(() => {
  const emailInput = document.querySelector('#adminEmail');
  const passwordInput = document.querySelector('#adminPassword');
  const loginBtn = document.querySelector('#adminLogin');
  const logoutBtn = document.querySelector('#adminLogout');
  const status = document.querySelector('#adminStatus');
  const panel = document.querySelector('#adminPanel');
  if (!passwordInput || !loginBtn || !emailInput) return;

  const money = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const api = (url, options={}) => fetch(url,{...options,credentials:'same-origin',headers:{'content-type':'application/json',...(options.headers||{})}});

  function setLoggedIn(on){
    passwordInput.disabled=on; loginBtn.disabled=on; logoutBtn.hidden=!on; panel.hidden=!on;
    if(on) refreshStats().catch(()=>{});
  }

  async function login(){
    status.textContent='Memverifikasi…';
    const r=await api('/api/admin/session',{method:'POST',body:JSON.stringify({email:emailInput.value,password:passwordInput.value})});
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Login gagal');
    passwordInput.value=''; setLoggedIn(true); status.textContent='Login berhasil.';
  }
  async function logout(){await api('/api/admin/session',{method:'DELETE'}); setLoggedIn(false); status.textContent='Logout berhasil.';}
  async function check(){const r=await api('/api/admin/session');const j=await r.json();setLoggedIn(Boolean(j.authenticated));}

  // --- Overview stats ---
  async function refreshStats(){
    const r=await api('/api/admin/stats'); if(!r.ok)return; const j=await r.json();
    document.querySelector('#statTotalOrders').textContent=j.totalOrders ?? '—';
    document.querySelector('#statPending').textContent=j.pendingOrders ?? '—';
    document.querySelector('#statSuccess').textContent=j.successOrders ?? '—';
    document.querySelector('#statRevenue').textContent=money(j.revenue||0);
    document.querySelector('#statRefunds').textContent=j.openRefunds ?? '—';
    document.querySelector('#statInquiries').textContent=j.openInquiries ?? '—';
    document.querySelector('#statTickets').textContent=j.openTickets ?? '—';
  }

  // --- Digital store: e-wallet orders (manual PPOB-style fulfillment) ---
  const ewalletList = document.querySelector('#ewalletOrderList');
  const ewalletStatusEl = document.querySelector('#adminStoreStatus');
  async function loadEwalletOrders(){
    ewalletStatusEl.textContent='Memuat pesanan…';
    const r=await api('/api/admin/ewallet-orders'); const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Gagal memuat pesanan');
    ewalletList.innerHTML=(j.orders||[]).map(o=>{
      let input={}; try{input=JSON.parse(o.input_json||'{}')}catch{}
      return `<article class="admin-card" style="padding:18px"><div class="summary-row"><strong>${esc(o.product_name)}</strong><span>${money(o.total)}</span></div><p style="margin:8px 0">Tujuan: <strong>${esc(input.account||'-')}</strong> · ${esc(input.wallet||'-')}</p><p>Status: <strong>${esc(o.status)}</strong> · Pengiriman: <strong>${esc(o.fulfillment_status||'awaiting_admin')}</strong></p><div class="admin-actions"><button class="btn btn-secondary" data-kind="ewallet" data-id="${esc(o.id)}" data-status="processing">Diproses</button><button class="btn btn-primary" data-kind="ewallet" data-id="${esc(o.id)}" data-status="success">Terkirim</button><button class="btn btn-secondary" data-kind="ewallet" data-id="${esc(o.id)}" data-status="failed">Gagal</button></div></article>`;
    }).join('') || '<p>Belum ada pesanan e-wallet yang menunggu pengiriman.</p>';
    ewalletStatusEl.textContent=`${j.orders?.length||0} pesanan ditemukan.`;
  }
  ewalletList?.addEventListener('click', e => handleOrderAction(e,'/api/admin/ewallet-orders',loadEwalletOrders));

  // --- Orders: game top-up & other digital services ---
  const gameOrderList = document.querySelector('#gameOrderList');
  const gameOrderStatusEl = document.querySelector('#gameOrderStatus');
  async function loadGameOrders(){
    gameOrderStatusEl.textContent='Memuat pesanan…';
    const r=await api('/api/admin/orders'); const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Gagal memuat pesanan');
    gameOrderList.innerHTML=(j.orders||[]).map(o=>{
      let input={}; try{input=JSON.parse(o.input_json||'{}')}catch{}
      const target=Object.entries(input).filter(([k])=>!k.startsWith('_')&&k!=='payment_method'&&k!=='fulfillment').map(([k,v])=>`${esc(k)}: ${esc(v)}`).join(' · ');
      return `<article class="admin-card" style="padding:18px"><div class="summary-row"><strong>${esc(o.product_name)}</strong><span>${money(o.total)}</span></div><p style="margin:8px 0;color:var(--muted)">${target||'-'}</p><p>Game/Layanan: <strong>${esc(o.game_id)}</strong> · Status: <strong>${esc(o.status)}</strong> · Pengiriman: <strong>${esc(o.fulfillment_status||'awaiting_admin')}</strong></p><div class="admin-actions"><button class="btn btn-secondary" data-kind="order" data-id="${esc(o.id)}" data-status="processing">Diproses</button><button class="btn btn-primary" data-kind="order" data-id="${esc(o.id)}" data-status="success">Terkirim</button><button class="btn btn-secondary" data-kind="order" data-id="${esc(o.id)}" data-status="failed">Gagal</button></div></article>`;
    }).join('') || '<p>Belum ada pesanan top up game/layanan digital yang menunggu pengiriman.</p>';
    gameOrderStatusEl.textContent=`${j.orders?.length||0} pesanan ditemukan.`;
  }
  gameOrderList?.addEventListener('click', e => handleOrderAction(e,'/api/admin/orders',loadGameOrders));

  async function handleOrderAction(e, endpoint, reload){
    const b=e.target.closest('button[data-id]'); if(!b)return;
    const statusEl = b.closest('section')?.querySelector('p[id$="Status"]');
    try{
      const r=await api(endpoint,{method:'PATCH',body:JSON.stringify({orderId:b.dataset.id,status:b.dataset.status})});
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'Gagal memperbarui status');
      await reload(); await refreshStats();
    }catch(err){ if(statusEl) statusEl.textContent=err.message; }
  }

  // --- Refunds ---
  const refundList = document.querySelector('#refundList');
  const refundStatusEl = document.querySelector('#refundStatus');
  const REFUND_ACTIONS = {
    refund_requested: [['refund_review','Tinjau']],
    refund_review: [['refund_approved','Setujui'],['refund_rejected','Tolak']],
    refund_approved: [['refund_processing','Proses']],
    refund_processing: [['refunded','Selesai (Dana Dikembalikan)']],
  };
  async function loadRefunds(){
    refundStatusEl.textContent='Memuat refund…';
    const r=await api('/api/admin/refunds'); const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Gagal memuat refund');
    refundList.innerHTML=(j.refunds||[]).map(rf=>{
      const actions=(REFUND_ACTIONS[rf.status]||[]).map(([st,label])=>`<button class="btn btn-secondary" data-id="${esc(rf.id)}" data-status="${st}">${esc(label)}</button>`).join(' ');
      return `<article class="admin-card" style="padding:18px"><div class="summary-row"><strong>${esc(rf.product_name)}</strong><span>${money(rf.total)}</span></div><p style="margin:8px 0">Order: <strong>${esc(rf.order_id)}</strong> · Alasan: ${esc(rf.reason)}</p><p style="color:var(--muted)">${esc(rf.description)}</p><p>Status refund: <strong>${esc(rf.status)}</strong></p><div class="admin-actions">${actions||'<em>Tidak ada aksi lanjutan.</em>'}</div></article>`;
    }).join('') || '<p>Belum ada permintaan refund.</p>';
    refundStatusEl.textContent=`${j.refunds?.length||0} refund ditemukan.`;
  }
  refundList?.addEventListener('click', async e => {
    const b=e.target.closest('button[data-id]'); if(!b)return;
    try{
      const r=await api('/api/admin/refunds',{method:'PATCH',body:JSON.stringify({refundId:b.dataset.id,status:b.dataset.status})});
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'Gagal memperbarui refund');
      await loadRefunds(); await refreshStats();
    }catch(err){ refundStatusEl.textContent=err.message; }
  });

  // --- Agency: inquiries ---
  const inquiryList = document.querySelector('#inquiryList');
  const inquiryStatusEl = document.querySelector('#inquiryStatus');
  const INQUIRY_STATUSES = ['new','contacted','quoted','won','lost'];
  async function loadInquiries(){
    inquiryStatusEl.textContent='Memuat inquiry…';
    const r=await api('/api/admin/inquiries'); const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Gagal memuat inquiry');
    inquiryList.innerHTML=(j.inquiries||[]).map(iq=>{
      const opts=INQUIRY_STATUSES.map(s=>`<option value="${s}" ${s===iq.status?'selected':''}>${s}</option>`).join('');
      return `<article class="admin-card" style="padding:18px"><div class="summary-row"><strong>${esc(iq.name)}</strong><span>${esc(iq.email)}</span></div><p style="margin:8px 0;color:var(--muted)">${esc(iq.website_type||'-')} · ${esc(iq.whatsapp||'-')}</p><p>${esc(iq.notes||'')}</p><div class="admin-actions"><select data-id="${esc(iq.id)}" class="inquiry-status-select">${opts}</select></div></article>`;
    }).join('') || '<p>Belum ada inquiry.</p>';
    inquiryStatusEl.textContent=`${j.inquiries?.length||0} inquiry ditemukan.`;
  }
  inquiryList?.addEventListener('change', async e => {
    const sel=e.target.closest('select.inquiry-status-select'); if(!sel)return;
    try{
      const r=await api('/api/admin/inquiries',{method:'PATCH',body:JSON.stringify({inquiryId:sel.dataset.id,status:sel.value})});
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'Gagal memperbarui inquiry');
      await refreshStats();
    }catch(err){ inquiryStatusEl.textContent=err.message; }
  });

  // --- Agency: support tickets ---
  const ticketList = document.querySelector('#ticketList');
  const ticketStatusEl = document.querySelector('#ticketStatus');
  const TICKET_STATUSES = ['open','in_progress','resolved','closed'];
  async function loadTickets(){
    ticketStatusEl.textContent='Memuat tiket…';
    const r=await api('/api/admin/support'); const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Gagal memuat tiket');
    ticketList.innerHTML=(j.tickets||[]).map(t=>{
      const opts=TICKET_STATUSES.map(s=>`<option value="${s}" ${s===t.status?'selected':''}>${s}</option>`).join('');
      return `<article class="admin-card" style="padding:18px"><div class="summary-row"><strong>${esc(t.name)}</strong><span>${esc(t.email)}</span></div><p style="margin:8px 0">${esc(t.message)}</p><div class="admin-actions"><select data-id="${esc(t.id)}" class="ticket-status-select">${opts}</select></div></article>`;
    }).join('') || '<p>Belum ada tiket support.</p>';
    ticketStatusEl.textContent=`${j.tickets?.length||0} tiket ditemukan.`;
  }
  ticketList?.addEventListener('change', async e => {
    const sel=e.target.closest('select.ticket-status-select'); if(!sel)return;
    try{
      const r=await api('/api/admin/support',{method:'PATCH',body:JSON.stringify({ticketId:sel.dataset.id,status:sel.value})});
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'Gagal memperbarui tiket');
      await refreshStats();
    }catch(err){ ticketStatusEl.textContent=err.message; }
  });


  // --- Admin users (owner only) ---
  const adminUsersPanel=document.querySelector('#adminUsersPanel'), adminUsersStatus=document.querySelector('#adminUsersStatus');
  async function loadAdmins(){
    if(!adminUsersPanel)return;
    adminUsersStatus.textContent='Memuat admin…';
    const r=await api('/api/admin/admins');const j=await r.json();
    if(!r.ok){adminUsersStatus.textContent=j.error||'Tidak dapat memuat admin';return;}
    adminUsersPanel.innerHTML=`<form id="createAdminForm" class="store-form" style="margin-bottom:18px">
      <div class="field"><label>Email admin baru</label><input name="email" type="email" required></div>
      <div class="field"><label>Password sementara (min. 12 karakter)</label><input name="password" type="password" minlength="12" required></div>
      <div class="field"><label>Role</label><select name="role"><option value="admin">Admin</option><option value="support">Support</option><option value="owner">Owner</option></select></div>
      <button class="btn btn-primary" type="submit">Tambah Admin</button></form>
      <div style="display:grid;gap:10px">${(j.admins||[]).map(a=>`<article class="admin-card" style="padding:14px"><div class="summary-row"><strong>${esc(a.email)}</strong><span>${esc(a.role)}</span></div><p>Status: ${a.active?'Aktif':'Nonaktif'} · ID: ${esc(a.id)}</p><div class="admin-actions"><button type="button" class="btn btn-secondary" data-admin-id="${esc(a.id)}" data-active="${a.active?'0':'1'}">${a.active?'Nonaktifkan':'Aktifkan'}</button></div></article>`).join('')}</div>`;
    adminUsersStatus.textContent=`${j.admins?.length||0} admin terdaftar.`;
  }
  adminUsersPanel?.addEventListener('submit',async e=>{
    if(e.target.id!=='createAdminForm')return;e.preventDefault();
    const b=Object.fromEntries(new FormData(e.target));
    try{const r=await api('/api/admin/admins',{method:'POST',body:JSON.stringify(b)}),j=await r.json();if(!r.ok)throw new Error(j.error||'Gagal membuat admin');e.target.reset();await loadAdmins();}catch(err){adminUsersStatus.textContent=err.message;}
  });
  adminUsersPanel?.addEventListener('click',async e=>{
    const b=e.target.closest('button[data-admin-id]');if(!b)return;
    try{const r=await api('/api/admin/admins',{method:'PATCH',body:JSON.stringify({adminId:b.dataset.adminId,active:b.dataset.active==='1'})}),j=await r.json();if(!r.ok)throw new Error(j.error||'Gagal mengubah admin');await loadAdmins();}catch(err){adminUsersStatus.textContent=err.message;}
  });
  async function maybeLoadAdmins(){
    const r=await api('/api/admin/session');const j=await r.json();if(j.authenticated&&j.role==='owner')loadAdmins().catch(()=>{});
  }

  document.querySelector('#loadEwalletOrders')?.addEventListener('click',()=>loadEwalletOrders().catch(e=>ewalletStatusEl.textContent=e.message));
  document.querySelector('#loadGameOrders')?.addEventListener('click',()=>loadGameOrders().catch(e=>gameOrderStatusEl.textContent=e.message));
  document.querySelector('#loadRefunds')?.addEventListener('click',()=>loadRefunds().catch(e=>refundStatusEl.textContent=e.message));
  document.querySelector('#loadInquiries')?.addEventListener('click',()=>loadInquiries().catch(e=>inquiryStatusEl.textContent=e.message));
  document.querySelector('#loadTickets')?.addEventListener('click',()=>loadTickets().catch(e=>ticketStatusEl.textContent=e.message));
  loginBtn.addEventListener('click',()=>login().catch(e=>status.textContent=e.message));
  logoutBtn?.addEventListener('click',()=>logout().catch(e=>status.textContent=e.message));

  check().then(()=>maybeLoadAdmins()).catch(()=>{});
})();
