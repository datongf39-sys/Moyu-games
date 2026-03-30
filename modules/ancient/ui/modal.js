// Modal UI system
const AncientModal = {
  showModal: (title, sub, opts, onSelect) => {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-sub').innerHTML = (sub||'').replace(/\n/g,'<br>');
    const optsEl = document.getElementById('modal-opts'); optsEl.innerHTML = '';
    (opts||[]).forEach(opt => {
      const el = document.createElement('div'); el.className = 'modal-opt';
      el.innerHTML = `<span>${opt.label}<br><span style="font-size:9px;color:var(--faint)">${opt.sub||''}</span></span><span class="modal-opt-cost">${opt.cost||''}</span>`;
      el.onclick = () => onSelect(opt.id); optsEl.appendChild(el);
    });
    document.getElementById('modal-actions').innerHTML = `<button class="mclose" onclick="closeModal()">取消</button>`;
    document.getElementById('modal').classList.add('show');
  },
  
  closeModal: () => {
    document.getElementById('modal').classList.remove('show');
  },
  
  modalBgClick: (e) => {
    if (e.target === document.getElementById('modal')) AncientModal.closeModal();
  },
  
  confirmSpend: (cost, desc, onConfirm) => {
    AncientModal.showModal('💰 确认花费',
      `${desc}\n\n需要花费：🪙 ${cost} 文\n当前余钱：🪙 ${AncientState.G.money} 文`,
      [{label:`✅ 确认花费 ${cost}文`, sub:'', cost:'', id:'yes'}],
      (id) => { AncientModal.closeModal(); onConfirm(); });
  },

  confirm: (title, sub, onConfirm) => {
    AncientModal.showModal(title, sub,
      [{label:'✅ 确认', sub:'', cost:'', id:'yes'}, {label:'↩ 取消', sub:'', cost:'', id:'no'}],
      (id) => { 
        AncientModal.closeModal(); 
        if (id === 'yes') onConfirm(); 
      });
  },
  
  showToast: (msg) => {
    let t = document.getElementById('toast');
    if (!t){
      t = document.createElement('div'); t.id = 'toast';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg);padding:8px 18px;border-radius:6px;font-size:11px;font-family:var(--mono);z-index:9999;transition:opacity .3s;white-space:nowrap';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(t._t); t._t = setTimeout(() => t.style.opacity='0', 2400);
  },
  
  showResult: (btn, text, type='good') => {
    if (!btn) return;
    btn.querySelectorAll('.result-chip').forEach(c => c.remove());
    const chip = document.createElement('span'); chip.className = `result-chip ${type}`; chip.textContent = text;
    btn.style.position = 'relative'; btn.appendChild(chip);
    setTimeout(() => chip.remove(), 1800);
  },
  
  addRipple: (e) => {
    const btn = e.currentTarget;
    const r = document.createElement('span'); r.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    r.style.left = (e.clientX-rect.left-30)+'px'; r.style.top = (e.clientY-rect.top-30)+'px';
    btn.appendChild(r); setTimeout(() => r.remove(), 500);
    btn.classList.add('clicked'); setTimeout(() => btn.classList.remove('clicked'), 300);
  },
  
  refreshVenueBody: () => {
    if (window.AncientVenue) window.AncientVenue.refreshVenueBody();
  }
};

window.AncientModal = AncientModal;
window.showModal = AncientModal.showModal;
window.closeModal = AncientModal.closeModal;
window.showToast = AncientModal.showToast;
window.showResult = AncientModal.showResult;
window.addRipple = AncientModal.addRipple;
window.confirmSpend = AncientModal.confirmSpend;
