const AncientEstate = {
  familyResidents: () => {
    const list = [{name:AncientState.G.name, label:`${AncientState.G.name}（本人）`, emoji:AncientState.G.emoji}];
    if (AncientState.G.married && AncientState.G.spouseName) list.push({name:AncientState.G.spouseName, label:`${AncientState.G.spouseName}（配偶）`, emoji:AncientState.G.spouseEmoji||'👤'});
    (AncientState.G.children||[]).forEach(c => list.push({name:c.name, label:`${c.name}（${c.gender==='male'?'子':'女'}·${c.age}岁）`, emoji:c.emoji}));
    (AncientState.G.concubines||[]).forEach(c => list.push({name:c.name, label:`${c.name}（${c.role==='concubine'?'妾室':'面首'}）`, emoji:c.emoji}));
    return list;
  },

  addToEstate: (estateIdx, residentName) => {
    const e = AncientState.G.estates[estateIdx]; if (!e) return;
    if (!e.residents) e.residents = [];
    if (e.residents.includes(residentName)){ AncientModal.showToast('此人已在该处居住！'); return; }
    if (e.residents.length >= e.capacity){ AncientModal.showToast('此房已住满！'); return; }
    AncientState.G.estates.forEach((oe,oi) => { if (oi!==estateIdx && oe.residents) oe.residents = oe.residents.filter(r => r!==residentName); });
    e.residents.push(residentName);
    AncientSave.save(); AncientRender.render();
  },

  removeFromEstate: (estateIdx, residentName) => {
    const e = AncientState.G.estates[estateIdx]; if (!e || !e.residents) return;
    e.residents = e.residents.filter(r => r !== residentName);
    AncientSave.save(); AncientRender.render();
  },

  buyEstate: (estateId) => {
    const tmpl = AncientEstates.ESTATES.find(e => e.id === estateId); if (!tmpl) return;
    if (AncientState.G.money < tmpl.price){ AncientModal.showToast('钱不够！'); return; }
    AncientModal.confirmSpend(tmpl.price, `${tmpl.icon} 购置【${tmpl.name}】\n容纳 ${tmpl.capacity} 人`, () => {
      AncientState.G.money -= tmpl.price;
      if (!AncientState.G.estates) AncientState.G.estates = [];
      AncientState.G.estates.push({...tmpl, eid:'e_'+Date.now(), residents:[]});
      AncientSave.addLog(`🏠 购置了【${tmpl.name}】，花费 ${tmpl.price}文。`, 'event');
      AncientSave.save();
      AncientModal.showModal('🏠 购置成功', `${tmpl.icon} <b>${tmpl.name}</b> 已纳入名下。`,
        [{label:'甚好',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    });
  },

  sellEstate: (idx) => {
    const e = AncientState.G.estates[idx]; if (!e) return;
    const hasMinor = AncientState.G.children.some(c => c.age<18 && (e.residents||[]).includes(c.name));
    if (hasMinor){ AncientModal.showToast('有未成年子女居住于此，不可售出！'); return; }
    const sellPrice = Math.floor(e.price * 0.6);
    AncientModal.showModal('🏠 确认售出', `将【${e.name}】以 ${sellPrice}文 售出？（原价${e.price}文，六折回收）`,
      [{label:`✅ 确认售出 ${sellPrice}文`,sub:'',cost:'',id:'yes'}],
      (id) => {
        AncientModal.closeModal();
        if (id==='yes'){
          AncientState.G.money += sellPrice; AncientState.G.estates.splice(idx, 1);
          AncientSave.addLog(`🏠 售出【${e.name}】，得 ${sellPrice}文。`, 'info');
          AncientSave.save(); AncientRender.render();
        }
      });
  }
};

window.AncientEstate = AncientEstate;
window.familyResidents = AncientEstate.familyResidents;
window.addToEstate = AncientEstate.addToEstate;
window.removeFromEstate = AncientEstate.removeFromEstate;
window.buyEstate = AncientEstate.buyEstate;
window.sellEstate = AncientEstate.sellEstate;
