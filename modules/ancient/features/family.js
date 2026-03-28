const AncientFamily = {
  interactParent: (idx) => {
    const parent = AncientState.G.parents && AncientState.G.parents[idx];
    if (!parent || !parent.alive){ AncientModal.showToast('父母已不在了...'); return; }
    const a = AncientState.G.age; const fav = parent.favor != null ? parent.favor : (AncientState.G.parentFavor||50);
    const bg = AncientFamilyData.FAMILY_BG[AncientState.G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
    const canAsk  = a>=3 && a<18 && !AncientState.G.parentMoneyAskedThisYear && bg.parentMoneyLimit>0;
    const giftDone = AncientActions.actionDone('giftParents_'+idx);
    const chatDone = AncientActions.actionDone('chatParent_'+idx);
    AncientModal.showModal(`${parent.emoji} ${parent.name}（${parent.rel}）`, `好感度：${fav}/100`,
      [{label:'💬 问候叙话', sub:chatDone?'今年已叙话':'增进感情', cost:'', id:'chat'},
       ...(a>=8&&!giftDone?[{label:'🎁 孝敬父母', sub:'花费文钱，好感+', cost:'', id:'gift'}]:[]),
       ...(canAsk?[{label:'🙏 向父母要钱', sub:'好感影响成功率', cost:'', id:'ask'}]:[])],
      (id) => { AncientModal.closeModal(); if(id==='chat') AncientFamily.doParentChat(idx); else if(id==='gift') AncientFamily.doGiftParent(idx); else if(id==='ask') AncientFamily.doAskParent(idx); });
  },

  doParentChat: (idx) => {
    const p = AncientState.G.parents[idx]; if (!p) return;
    const key = 'chatParent_'+idx;
    if (AncientActions.actionDone(key)){ AncientModal.showToast('今年已经和'+p.rel+'叙话了！'); return; }
    AncientActions.markAction(key);
    if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
    const gain = 3+Math.floor(Math.random()*5);
    p.favor = AncientState.clamp(p.favor+gain); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+2);
    AncientState.G.parentFavor = AncientState.clamp(((AncientState.G.parents[0]&&AncientState.G.parents[0].favor||50)+(AncientState.G.parents[1]&&AncientState.G.parents[1].favor||50))/2);
    AncientSave.addLog(`💬 与${p.rel}闲话家常，好感+${gain}。`, 'good'); AncientSave.save(); AncientRender.render();
    AncientModal.showModal('💬 温馨时光', `好感+${gain}（现为${p.favor}/100）`,
      [{label:'承欢膝下',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
  },

  doGiftParent: (idx) => {
    const p = AncientState.G.parents[idx]; if (!p) return;
    const cost = 20+Math.floor(AncientState.G.age/5)*5;
    if (AncientState.G.money < cost){ AncientModal.showToast(`孝敬${p.rel}需要 ${cost}文！`); return; }
    AncientModal.confirmSpend(cost, `🎁 孝敬${p.rel}`, () => {
      AncientActions.markAction('giftParents_'+idx); AncientState.G.money -= cost;
      if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
      const gain = 5+Math.floor(Math.random()*10); p.favor = AncientState.clamp(p.favor+gain);
      AncientState.G.parentFavor = AncientState.clamp(((AncientState.G.parents[0]&&AncientState.G.parents[0].favor||50)+(AncientState.G.parents[1]&&AncientState.G.parents[1].favor||50))/2);
      AncientSave.addLog(`🎁 孝敬${p.rel}，好感+${gain}。`, 'good'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('🎁 父母欢颜', `好感+${gain}（现为${p.favor}/100）`,
        [{label:'尽孝应当',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    });
  },

  doAskParent: (idx) => {
    const p = AncientState.G.parents[idx]; if (!p) return;
    if (AncientState.G.parentMoneyAskedThisYear){ AncientModal.showToast('今年已经问过父母了！'); return; }
    const bg = AncientFamilyData.FAMILY_BG[AncientState.G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
    if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
    const rate = 0.1+(p.favor/100)*0.8;
    AncientState.G.parentMoneyAskedThisYear = true;
    if (AncientSave.roll(rate)){
      const [lo,hi] = bg.parentMoneyBase;
      const final = Math.min(lo+Math.floor(Math.random()*(hi-lo+1)), bg.parentMoneyLimit);
      AncientState.G.money += final; AncientSave.addLog(`🙏 向${p.rel}撒娇，得到 ${final}文。`, 'good'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('🙏 父母慷慨', `获得 +${final} 文`,
        [{label:'谢谢',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    } else {
      p.favor = AncientState.clamp(p.favor-5);
      AncientSave.addLog(`😔 ${p.rel}说近来手头紧，好感 -5。`, 'info'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('😔 未能如愿', '好感 -5',
        [{label:'知道了',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    }
  },

  openSpouseInteract: () => {
    const giftDone = AncientActions.actionDone('giftSpouse');
    AncientModal.showModal(`${AncientState.G.spouseEmoji||'👤'} ${AncientState.G.spouseName}`,
      `${AncientState.G.spouseGender==='male'?'夫君':'夫人'}\n好感度：${AncientState.G.spouseFavor||50}/100`,
      [{label:'💝 赠礼增感情', sub:giftDone?'今年已赠礼':'花费文钱', cost:'', id:'gift'},
       {label:'⚔️ 和离', sub:'结束婚姻关系', cost:'', id:'divorce'}],
      (id) => { AncientModal.closeModal(); if(id==='gift') AncientFamily.giftSpouse(); else if(id==='divorce') AncientFamily.divorceSpouse(); });
  },

  giftSpouse: () => {
    if (AncientActions.actionDone('giftSpouse')){ AncientModal.showToast('今年已经赠礼了！'); return; }
    const cost = 30+Math.floor(AncientState.G.age/10)*10;
    if (AncientState.G.money < cost){ AncientModal.showToast(`赠礼需要 ${cost}文！`); return; }
    AncientModal.confirmSpend(cost, `💝 赠礼给 ${AncientState.G.spouseName}`, () => {
      AncientActions.markAction('giftSpouse'); AncientState.G.money -= cost;
      const gain = 5+Math.floor(Math.random()*10);
      AncientState.G.spouseFavor = AncientState.clamp((AncientState.G.spouseFavor||50)+gain);
      AncientSave.addLog(`💝 赠礼给 ${AncientState.G.spouseName}，好感+${gain}。`, 'good');
      AncientSave.save(); AncientRender.render();
    });
  },

  divorceSpouse: () => {
    if (!confirm(`确定要与 ${AncientState.G.spouseName} 和离吗？`)) return;
    const exName = AncientState.G.spouseName; AncientState.G.mood = AncientState.clamp(AncientState.G.mood-20);
    if (AncientState.G.spouseEstates && AncientState.G.spouseEstates.length > 0)
      AncientState.G.spouseEstates.forEach(se => { AncientState.G.estates = AncientState.G.estates.filter(e => e.id !== se.id); });
    AncientState.G.estates.forEach(e => { if (e.residents) e.residents = e.residents.filter(r => r !== exName); });
    AncientState.G.married=false; AncientState.G.spouseName=null; AncientState.G.spouseEmoji=null; AncientState.G.spouseGender=null; AncientState.G.spouseFavor=50; AncientState.G.spouseEstates=[];
    AncientSave.addLog(`📜 与 ${exName} 和离，各奔东西。`, 'bad'); AncientSave.save();
    AncientModal.showModal('📜 和离', `与 <b>${exName}</b> 和离，心情 -20。`,
      [{label:'各自珍重',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  offerConcubine: (idx) => {
    const npc = AncientState.G.npcs && AncientState.G.npcs[idx]; if (!npc) return;
    if (!AncientState.G.married){ AncientModal.showToast('尚未成婚！'); return; }
    const spareEstate = AncientState.G.estates.find(e => {
      const hasKids = AncientState.G.children.some(c => e.residents && e.residents.includes(c.name));
      const occupied = (e.residents && e.residents.length || 0);
      return occupied < e.capacity && !hasKids;
    });
    if (!spareEstate){ AncientModal.showToast('需要一间空置（无孩子）的额外房产才能纳妾！'); return; }
    if (npc.favor < 70){ AncientModal.showToast('好感度不足 70，对方不愿意！'); return; }
    const role = AncientState.G.gender==='male'?'concubine':'lover';
    const roleLabel = AncientState.G.gender==='male'?'妾室':'面首';
    const cost = 200;
    AncientModal.confirmSpend(cost, `将 ${npc.name} 纳为${roleLabel}（将入住${spareEstate.name}`, () => {
      AncientState.G.money -= cost; if (!AncientState.G.concubines) AncientState.G.concubines = [];
      const c = {name:npc.name, gender:npc.gender, emoji:npc.emoji, age:npc.age, favor:npc.favor, role, estateId:spareEstate.eid||spareEstate.id};
      AncientState.G.concubines.push(c);
      if (!spareEstate.residents) spareEstate.residents = [];
      spareEstate.residents.push(npc.name);
      AncientState.G.npcs = AncientState.G.npcs.filter(n => n.id !== npc.id);
      AncientSave.addLog(`🏮 将 ${npc.name} 纳为${roleLabel}，入住${spareEstate.name}。`, 'event');
      AncientSave.save(); AncientRender.render(); AncientModal.showToast(`${npc.name} 已成为你的${roleLabel}。`);
    });
  },

  openConcubineInteract: (idx) => {
    const c = AncientState.G.concubines && AncientState.G.concubines[idx]; if (!c) return;
    const roleLabel = c.role==='concubine'?'妾室':'面首';
    AncientModal.showModal(`${c.emoji} ${c.name}（${roleLabel}）`, `好感度：${c.favor}/100`,
      [{label:'遣散',sub:'',cost:'',id:'dismiss'}],
      (id) => { AncientModal.closeModal(); if(id==='dismiss') AncientFamily.dismissConcubine(idx); });
  },

  dismissConcubine: (idx) => {
    const c = AncientState.G.concubines && AncientState.G.concubines[idx]; if (!c) return;
    if (!confirm(`确定遣散 ${c.name} 吗？`)) return;
    AncientState.G.estates.forEach(e => { if (e.residents) e.residents = e.residents.filter(n => n !== c.name); });
    const dismissedName = c.name;
    const dismissedRole = c.role==='concubine'?'妾室':'面首';
    AncientState.G.concubines.splice(idx, 1);
    AncientSave.addLog(`📜 遣散了${dismissedRole} ${dismissedName}。`, 'info'); AncientSave.save();
    AncientModal.showModal('📜 遣散', `${dismissedRole} ${dismissedName} 已离开。`,
      [{label:'好聚好散',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  openChildInteract: (idx) => {
    const c = AncientState.G.children[idx]; if (!c) return;
    AncientModal.showModal(`${c.emoji} ${c.name}`, `${c.gender==='male'?'子':'女'} · ${c.age}岁`,
      [{label:c.age>=18?'继承人生（成年）':'尚未成年，无法继承', sub:'', cost:'', id:c.age>=18?'inherit':'nope'}],
      (id) => { AncientModal.closeModal(); if(id==='inherit') AncientInherit.inheritChild(idx); });
  }
};

window.AncientFamily = AncientFamily;
window.interactParent = AncientFamily.interactParent;
window.doParentChat = AncientFamily.doParentChat;
window.doGiftParent = AncientFamily.doGiftParent;
window.doAskParent = AncientFamily.doAskParent;
window.openSpouseInteract = AncientFamily.openSpouseInteract;
window.giftSpouse = AncientFamily.giftSpouse;
window.divorceSpouse = AncientFamily.divorceSpouse;
window.offerConcubine = AncientFamily.offerConcubine;
window.openConcubineInteract = AncientFamily.openConcubineInteract;
window.dismissConcubine = AncientFamily.dismissConcubine;
window.openChildInteract = AncientFamily.openChildInteract;
