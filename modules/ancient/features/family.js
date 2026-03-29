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
    if (AncientActions.actionDone(key)){ AncientModal.showToast('今岁已与'+p.rel+'叙话，不可再扰。'); return; }
    AncientActions.markAction(key);
    if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
    const gain = 3+Math.floor(Math.random()*5);
    p.favor = AncientState.clamp(p.favor+gain); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+2);
    AncientState.G.parentFavor = AncientState.clamp(((AncientState.G.parents[0]&&AncientState.G.parents[0].favor||50)+(AncientState.G.parents[1]&&AncientState.G.parents[1].favor||50))/2);
    AncientSave.addLog(`💬 与${p.rel}闲话家常，好感+${gain}。`, 'good'); AncientSave.save(); AncientRender.render();
    AncientModal.showModal('💬 承欢膝下', `与${p.rel}闲话家常，其乐融融。好感+${gain}（现为${p.favor}/100）`,
      [{label:'甚是欢喜',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
  },

  doGiftParent: (idx) => {
    const p = AncientState.G.parents[idx]; if (!p) return;
    const cost = 20+Math.floor(AncientState.G.age/5)*5;
    if (AncientState.G.money < cost){ AncientModal.showToast(`孝敬${p.rel}需费钱${cost}文，囊中不足！`); return; }
    AncientModal.confirmSpend(cost, `🎁 孝敬${p.rel}`, () => {
      AncientActions.markAction('giftParents_'+idx); AncientState.G.money -= cost;
      if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
      const gain = 5+Math.floor(Math.random()*10); p.favor = AncientState.clamp(p.favor+gain);
      AncientState.G.parentFavor = AncientState.clamp(((AncientState.G.parents[0]&&AncientState.G.parents[0].favor||50)+(AncientState.G.parents[1]&&AncientState.G.parents[1].favor||50))/2);
      AncientSave.addLog(`🎁 孝敬${p.rel}，好感+${gain}。`, 'good'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('🎁 父母含笑', `好感+${gain}（现为${p.favor}/100）`,
        [{label:'孝心可鉴',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    });
  },

  doAskParent: (idx) => {
    const p = AncientState.G.parents[idx]; if (!p) return;
    if (AncientState.G.parentMoneyAskedThisYear){ AncientModal.showToast('今岁已向父母开口一次，不可贪多。'); return; }
    const bg = AncientFamilyData.FAMILY_BG[AncientState.G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
    if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
    const rate = 0.1+(p.favor/100)*0.8;
    AncientState.G.parentMoneyAskedThisYear = true;
    if (AncientSave.roll(rate)){
      const [lo,hi] = bg.parentMoneyBase;
      const final = Math.min(lo+Math.floor(Math.random()*(hi-lo+1)), bg.parentMoneyLimit);
      AncientState.G.money += final; AncientSave.addLog(`🙏 向${p.rel}撒娇，得到 ${final}文。`, 'good'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('🙏 父母慷慨解囊', `获得 +${final} 文`,
        [{label:'叩谢爹娘',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    } else {
      p.favor = AncientState.clamp(p.favor-5);
      AncientSave.addLog(`😔 ${p.rel}近来手头拮据，婉言推辞，好感 -5。`, 'info'); AncientSave.save(); AncientRender.render();
      AncientModal.showModal('😔 空手而归', '好感 -5',
        [{label:'暂且作罢',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    }
  },

  openSpouseInteract: () => {
    const giftDone = AncientActions.actionDone('giftSpouse');
    const intimacyDone = AncientActions.actionDone('intimacySpouse');
    const hasCapacity = AncientEstate.hasAvailableCapacity(1);
    
    const opts = [
      {label:'💝 赠礼增感情', sub:giftDone?'今岁已赠过':'花费文钱', cost:'', id:'gift'}
    ];
    if (hasCapacity || !hasCapacity){
      opts.push({label:'💕 鱼水之欢', sub:intimacyDone?'今岁已有鱼水之欢':'来年或有子嗣之喜', cost:'', id:'intimacy'});
    }
    opts.push({label:'📜 和离书', sub:'两厢分离，各奔前程', cost:'', id:'divorce'});
    
    AncientModal.showModal(`${AncientState.G.spouseEmoji||'👤'} ${AncientState.G.spouseName}`,
      `${AncientState.G.spouseGender==='male'?'夫君':'夫人'}\n好感度：${AncientState.G.spouseFavor||50}/100`,
      opts,
      (id) => { 
        AncientModal.closeModal(); 
        if(id==='gift') AncientFamily.giftSpouse(); 
        else if(id==='intimacy') AncientFamily.intimacySpouse(); 
        else if(id==='divorce') AncientFamily.divorceSpouse(); 
      });
  },
  
  intimacySpouse: () => {
    if (AncientActions.actionDone('intimacySpouse')){ showToast('今岁已有鱼水之欢，不可贪多！'); return; }
    if (!AncientEstate.hasAvailableCapacity(1)){ 
      showToast('府中已住满，无处安置新生骨肉！'); 
      return; 
    }
    AncientActions.markAction('intimacySpouse');
    AncientSave.addLog(`💕 与 ${AncientState.G.spouseName} 亲热。`, 'info');
    showModal('💕 鱼水之欢', `与 ${AncientState.G.spouseName} 共度良宵，琴瑟和鸣。<br><br>来年或有弄璋弄瓦之喜。`,
      [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  giftSpouse: () => {
    if (AncientActions.actionDone('giftSpouse')){ AncientModal.showToast('今岁已赠过礼了！'); return; }
    const cost = 30+Math.floor(AncientState.G.age/10)*10;
    if (AncientState.G.money < cost){ AncientModal.showToast(`备礼需费${cost}文，囊中不足！`); return; }
    AncientModal.confirmSpend(cost, `💝 赠礼给 ${AncientState.G.spouseName}`, () => {
      AncientActions.markAction('giftSpouse'); AncientState.G.money -= cost;
      const gain = 5+Math.floor(Math.random()*10);
      AncientState.G.spouseFavor = AncientState.clamp((AncientState.G.spouseFavor||50)+gain);
      AncientSave.addLog(`💝 赠礼给 ${AncientState.G.spouseName}，好感+${gain}。`, 'good');
      showModal('💝 夫妻情深', `赠礼给 ${AncientState.G.spouseName}，好感+${gain}（现为${AncientState.G.spouseFavor}/100）`,
        [{label:'伉俪和睦',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    });
  },

  divorceSpouse: () => {
    if (!confirm(`此举乃和离之道，一旦决定，无法反悔，是否继续？`)) return;
    const exName = AncientState.G.spouseName; AncientState.G.mood = AncientState.clamp(AncientState.G.mood-20);
    if (AncientState.G.spouseEstates && AncientState.G.spouseEstates.length > 0)
      AncientState.G.spouseEstates.forEach(se => { AncientState.G.estates = AncientState.G.estates.filter(e => e.id !== se.id); });
    AncientState.G.estates.forEach(e => { if (e.residents) e.residents = e.residents.filter(r => r !== exName); });
    AncientState.G.married=false; AncientState.G.spouseName=null; AncientState.G.spouseEmoji=null; AncientState.G.spouseGender=null; AncientState.G.spouseFavor=50; AncientState.G.spouseEstates=[];
    AncientSave.addLog(`📜 与 ${exName} 各执一纸和离书，就此别过，心情 -20。`, 'bad'); AncientSave.save();
    AncientModal.showModal('📜 和离', `与 <b>${exName}</b> 各执一纸和离书，就此别过，心情 -20。`,
      [{label:'就此别过',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  offerConcubine: (idx) => {
    const npc = AncientState.G.npcs && AncientState.G.npcs[idx]; if (!npc) return;
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
    
    // 纳妾成功率比正妻低 20%
    const successRate = 0.5 + (npc.favor/100)*0.3 - 0.2; // -20% penalty
    if (!AncientSave.roll(successRate)){
      AncientModal.showModal('🏮 婉言推拒',
        `${npc.name} 婉言推拒，不愿委身为${roleLabel}。`,
        [{label:'缘分未到',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); });
      return;
    }
    
    // 对方同意，进入待纳妾状态，来年纳妾
    if (!AncientState.G.pendingConcubine) AncientState.G.pendingConcubine = [];
    AncientState.G.pendingConcubine.push({
      name: npc.name,
      emoji: npc.emoji,
      gender: npc.gender,
      age: npc.age,
      favor: npc.favor,
      role: role,
      estateId: spareEstate.eid||spareEstate.id,
      estateName: spareEstate.name,
      cost: cost,
      year: AncientState.G.age
    });
    AncientState.G.npcs = AncientState.G.npcs.filter(n => n.id !== npc.id);
    AncientSave.addLog(`🏮 ${npc.name} 含羞应允为${roleLabel}，待来年择吉日纳入府中。`, 'good');
    AncientModal.showModal('🏮 纳妾结果',
      `${npc.emoji} ${npc.name} 含羞点头，应允为${roleLabel}。<br><br>待来年春暖花开，择吉日接入府中。`,
      [{label:'🎉 翘首以盼',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  openConcubineInteract: (idx) => {
    const c = AncientState.G.concubines && AncientState.G.concubines[idx]; if (!c) return;
    const roleLabel = c.role==='concubine'?'妾室':'面首';
    const intimacyDone = AncientActions.actionDone('intimacyConcubine_'+idx);
    
    AncientModal.showModal(`${c.emoji} ${c.name}（${roleLabel}）`, `好感度：${c.favor}/100`,
      [{label:'💕 鱼水之欢', sub:intimacyDone?'今岁已有鱼水之欢':'来年或有子嗣之喜', cost:'', id:'intimacy'},
       {label:'📜 遣散出府',sub:'',cost:'',id:'dismiss'}],
      (id) => { 
        AncientModal.closeModal(); 
        if(id==='intimacy') AncientFamily.intimacyConcubine(idx);
        else if(id==='dismiss') AncientFamily.dismissConcubine(idx); 
      });
  },
  
  intimacyConcubine: (idx) => {
    const c = AncientState.G.concubines[idx]; if (!c) return;
    if (AncientActions.actionDone('intimacyConcubine_'+idx)){ showToast('今岁已有鱼水之欢，不可贪多！'); return; }
    if (!AncientEstate.hasAvailableCapacity(1)){ 
      showToast('府中已住满，无处安置新生骨肉！'); 
      return; 
    }
    AncientActions.markAction('intimacyConcubine_'+idx);
    AncientSave.addLog(`💕 与 ${c.name} 亲热。`, 'info');
    showModal('💕 鱼水之欢', `与 ${c.name} 共度良宵。<br><br>来年或有子嗣之喜。`,
      [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  dismissConcubine: (idx) => {
    const c = AncientState.G.concubines && AncientState.G.concubines[idx]; if (!c) return;
    if (!confirm(`此举乃遣散之举，一旦为之，无可挽回，是否继续？`)) return;
    AncientState.G.estates.forEach(e => { if (e.residents) e.residents = e.residents.filter(n => n !== c.name); });
    const dismissedName = c.name;
    const dismissedRole = c.role==='concubine'?'妾室':'面首';
    AncientState.G.concubines.splice(idx, 1);
    AncientSave.addLog(`📜 ${dismissedRole} ${dismissedName} 已扶持出府，就此别过。`, 'info'); AncientSave.save();
    AncientModal.showModal('📜 出府别离', `${dismissedRole} ${dismissedName} 携行囊离府，从此各不相干。`,
      [{label:'就此别过',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  openChildInteract: (idx) => {
    const c = AncientState.G.children[idx]; if (!c) return;
    const alreadyChat  = AncientActions.actionDone('chatChild_'+idx);
    const alreadyMoney = AncientActions.actionDone('giveMoneyChild_'+idx);
    const alreadyGift  = AncientActions.actionDone('giftChild_'+idx);
    const canArrangeMarriage = c.age >= 18 && AncientState.G.married;
    
    const gifts = AncientState.G.inventory.filter(i => i.isGift);
    const opts = [];
    opts.push({label:'💬 嘘寒问暖', sub:alreadyChat?'今岁已叙过':'骨肉情深', cost:'', id:'chat'});
    if (gifts.length > 0) opts.push({label:'🎁 赠送礼物', sub:alreadyGift?'今岁已赠过':`行囊中有${gifts.length}件物什`, cost:'', id:'gift'});
    opts.push({label:'💰 给零花钱', sub:alreadyMoney?'今岁已给过':'散钱与子女，骨肉情意深', cost:'', id:'money'});
    if (canArrangeMarriage) opts.push({label:'💕 为其觅配', sub:'操持婚事，觅得良缘', cost:'', id:'arrange'});
    
    showModal(`${c.emoji} ${c.name}`,
      `${c.gender==='male'?'子':'女'} · ${c.age}岁 · ${c.spouse?('配偶：'+c.spouseName+'（'+(c.spouseGender==='male'?'男':'女')+'）'):'未婚'}\n${c.favor!=null?`好感度：${c.favor}/100`:''}`,
      opts, (id) => {
        closeModal();
        if (id==='chat')       AncientFamily.doChildChat(idx);
        else if (id==='gift')  AncientFamily.doChildGiftFromBag(idx);
        else if (id==='money') AncientFamily.doChildGiveMoney(idx);
        else if (id==='arrange') AncientFamily.arrangeMarriageForChild(idx);
      });
  },
  
  doChildChat: (idx) => {
    const G = AncientState.G;
    const c = G.children[idx]; if (!c) return;
    const key = 'chatChild_'+idx;
    if (AncientActions.actionDone(key)){ showToast('今岁已与此子叙过了！'); return; }
    AncientActions.markAction(key);
    if (c.favor == null) c.favor = 50;
    if (AncientSave.roll(0.5 + (G.charm/100)*0.3)){
      const gain = 3+Math.floor(Math.random()*5);
      c.favor = Math.min(100, c.favor+gain); G.mood = AncientState.clamp(G.mood+2);
      AncientSave.addLog(`💬 与 ${c.name} 把酒言欢，骨肉情深，好感+${gain}。`, 'good');
      showModal('💬 天伦之乐',
        `与 <b>${c.name}</b> 相谈甚欢，骨肉情深。<br><br>好感+${gain}（现为${c.favor}/100）`,
        [{label:'甚是欣慰',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    } else {
      AncientSave.addLog(`😅 ${c.name} 心事重重，不欲多言。`, 'info');
      showModal('😅 父子生隙',
        `${c.name} 神色疏冷，不欲亲近，令人心寒。`,
        [{label:'黯然神伤',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    }
  },
  
  doChildGiftFromBag: (idx) => {
    const G = AncientState.G;
    const c = G.children[idx]; if (!c) return;
    const key = 'giftChild_'+idx;
    if (AncientActions.actionDone(key)){ showToast('今年已经送过礼了！'); return; }
    const gifts = G.inventory.map((item,i) => ({item,i})).filter(({item}) => item.isGift);
    if (gifts.length === 0){ showToast('包裹里没有礼物！'); return; }
    const opts = gifts.map(({item,i}) => ({label:`${item.icon} ${item.name}`, sub:`好感+${item.favorBonus}`, cost:'', id:String(i)}));
    showModal(`🎁 赠送礼物给 ${c.name}`, opts, (id) => {
      closeModal(); const slotIdx=parseInt(id); const item=G.inventory[slotIdx]; if (!item) return;
      const key2 = 'giftChild_'+idx;
      if (AncientActions.actionDone(key2)){ showToast('今年已经送过礼了！'); return; }
      AncientActions.markAction(key2);
      if (c.favor == null) c.favor = 50;
      c.favor = Math.min(100, c.favor+item.favorBonus);
      G.inventory.splice(slotIdx,1);
      AncientSave.addLog(`🎁 赠送 ${item.name} 给 ${c.name}，好感+${item.favorBonus}。`, 'good');
      AncientSave.save(); AncientRender.render();
    });
  },
  
  doChildGiveMoney: (idx) => {
    const G = AncientState.G;
    const c = G.children[idx]; if (!c) return;
    const key = 'giveMoneyChild_'+idx;
    if (AncientActions.actionDone(key)){ showToast('今年已经给过零花钱了！'); return; }
    const opts = [5,10,20,50].map(amt => ({label:`给予 ${amt} 文`, sub:`当前余钱 ${G.money}`, cost:String(amt), id:String(amt)}));
    showModal(`💰 给 ${c.name} 零花钱`, '给零花钱可增加好感', opts, (id) => {
      closeModal(); const amt=parseInt(id); if (G.money<amt){ showToast('钱不够！'); return; }
      AncientActions.markAction(key);
      G.money -= amt;
      if (c.favor == null) c.favor = 50;
      const gain = Math.floor(amt/5);
      c.favor = Math.min(100, c.favor+gain);
      AncientSave.addLog(`💰 给 ${c.name} ${amt}文零花钱，好感+${gain}。`, 'good');
      AncientSave.save(); AncientRender.render();
    });
  },
  
  arrangeMarriageForChild: (idx) => {
    const G = AncientState.G;
    const c = G.children[idx]; if (!c) return;
    if (c.spouse){ showToast('子女已有配偶！'); return; }
    
    // Generate 3 random NPCs of opposite gender
    const targetGender = c.gender === 'male' ? 'female' : 'male';
    const candidates = [];
    for (let i = 0; i < 3; i++){
      const npc = AncientSocial.genNPCGender(targetGender);
      npc.age = Math.max(18, c.age - 3 + Math.floor(Math.random() * 6)); // Age range: c.age-3 to c.age+2
      candidates.push(npc);
    }
    
    const opts = candidates.map((npc,i) => ({
      label: `${npc.emoji} ${npc.name}`,
      sub: `${npc.age}岁 · ${npc.bg} · 好感${npc.favor}`,
      cost: '',
      id: String(i)
    }));
    opts.push({label:'再看看', sub:'不选择任何人', cost:'', id:'cancel'});
    
    showModal(`💕 为 ${c.name} 安排婚配`, '选择一位合适的对象', opts, (id) => {
      closeModal();
      if (id === 'cancel') return;
      const selected = candidates[parseInt(id)];
      if (!selected) return;
      AncientFamily.proposeForChild(idx, selected);
    });
  },
  
  proposeForChild: (childIdx, npc) => {
    const G = AncientState.G;
    const c = G.children[childIdx];
    if (!c || c.spouse) return;
    
    // Check if child agrees (50% chance based on favor)
    const childFavor = c.favor != null ? c.favor : 50;
    const childAgrees = AncientSave.roll(0.3 + (childFavor/100)*0.4);
    
    if (!childAgrees){
      AncientSave.addLog(`💔 ${c.name} 拒绝了这门亲事。`, 'bad');
      showModal('💔 子女反对',
        `${c.name} 表示不喜欢对方，拒绝成亲。`,
        [{label:'尊重意愿',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientRender.render(); });
      return;
    }
    
    // Check NPC agreement (based on NPC favor)
    const npcAgrees = AncientSave.roll(0.3 + (npc.favor/100)*0.4);
    
    if (!npcAgrees){
      AncientSave.addLog(`💔 ${npc.name} 拒绝了提亲。`, 'bad');
      showModal('💔 对方拒绝',
        `${npc.name} 及其家人拒绝了这门亲事。`,
        [{label:'遗憾',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientRender.render(); });
      return;
    }
    
    // Success! Proceed to marriage
    const cost = 100; // Wedding cost
    if (G.money < cost){
      AncientSave.addLog(`😔 筹办婚礼需要 ${cost} 文，资金不足。`, 'bad');
      showModal('💸 资金不足',
        `筹办婚礼需要 ${cost} 文。`,
        [{label:'知道了',sub:'',cost:'',id:'ok'}], () => { closeModal(); });
      return;
    }
    
    G.money -= cost;
    c.spouse = true;
    c.spouseName = npc.name;
    c.spouseGender = npc.gender;
    c.spouseEmoji = npc.emoji;
    c.spouseFavor = 50;
    
    AncientSave.addLog(`💕 ${c.name} 与 ${npc.name} 成亲！`, 'good');
    showModal('💕 喜结连理',
      `${c.name} 与 ${npc.name} 正式成亲！<br>婚礼花费 ${cost} 文。`,
      [{label:'皆大欢喜',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },
  
  // 外室上门事件触发
  triggerLoverVisit: (loverIdx, babyName, babyEmoji) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    
    const opts = [
      {label:'🏠 给予房产', sub:'安置外室和孩子', cost:'', id:'estate'},
      {label:'🏮 纳为妾室', sub:'接入府中', cost:'', id:'concubine'},
      {label:'📜 扶为正室', sub:'取代现任配偶', cost:'', id:'spouse'},
      {label:'💰 给予钱财', sub:'输入金额', cost:'', id:'money'},
      {label:'❌ 不管不顾', sub:'置之不理', cost:'', id:'ignore'}
    ];
    
    showModal(`🌸 ${lover.name} 上门`,
      `${lover.emoji} ${lover.name} 抱着${babyEmoji} ${babyName} 找上门来。<br><br>「这是你的孩子，你要负责！」<br><br>请选择如何处理：`,
      opts, (id) => {
        closeModal();
        if (id==='estate') AncientFamily.loverVisitGiveEstate(loverIdx, babyName);
        else if (id==='concubine') AncientFamily.loverVisitMakeConcubine(loverIdx, babyName);
        else if (id==='spouse') AncientFamily.loverVisitMakeSpouse(loverIdx, babyName);
        else if (id==='money') AncientFamily.loverVisitGiveMoney(loverIdx, babyName);
        else if (id==='ignore') AncientFamily.loverVisitIgnore(loverIdx, babyName);
      });
  },
  
  loverVisitGiveEstate: (loverIdx, babyName) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    const estate = AncientState.G.estates.find(e => {
      const occupied = (e.residents||[]).length;
      return occupied < e.capacity;
    });
    if (!estate){
      showToast('没有空余房产！');
      AncientFamily.loverVisitGiveMoney(loverIdx, babyName);
      return;
    }
    if (!estate.residents) estate.residents = [];
    estate.residents.push(lover.name);
    AncientSave.addLog(`🏠 将【${estate.name}】给予 ${lover.name} 和 ${babyName} 居住。`, 'event');
    showModal('🏠 安置外室', `将【${estate.name}】给予 ${lover.name} 和 ${babyName} 居住。`,
      [{label:'妥善安置',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },
  
  loverVisitMakeConcubine: (loverIdx, babyName) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    if (!AncientState.G.married){
      showToast('尚未成婚，无法纳妾！');
      return;
    }
    const spareEstate = AncientState.G.estates.find(e => {
      const hasKids = AncientState.G.children.some(c => e.residents && e.residents.includes(c.name));
      const occupied = (e.residents||[]).length;
      return occupied < e.capacity && !hasKids;
    });
    if (!spareEstate){
      showToast('没有空余房产安置妾室！');
      return;
    }
    const role = AncientState.G.gender==='male'?'concubine':'lover';
    const c = {name:lover.name, gender:lover.gender, emoji:lover.emoji, age:lover.age, favor:lover.favor, role, estateId:spareEstate.eid||spareEstate.id};
    if (!AncientState.G.concubines) AncientState.G.concubines = [];
    AncientState.G.concubines.push(c);
    if (!spareEstate.residents) spareEstate.residents = [];
    spareEstate.residents.push(lover.name);
    AncientState.G.lovers.splice(loverIdx, 1);
    AncientSave.addLog(`🏮 将 ${lover.name} 纳为妾室，入住${spareEstate.name}。`, 'event');
    showModal('🏮 纳妾', `将 ${lover.name} 纳为${role==='concubine'?'妾室':'面首'}，入住${spareEstate.name}。`,
      [{label:'欣然接纳',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },
  
  loverVisitMakeSpouse: (loverIdx, babyName) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    if (!AncientState.G.married){
      // 直接结婚
      AncientState.G.married = true;
      AncientState.G.spouseName = lover.name;
      AncientState.G.spouseEmoji = lover.emoji;
      AncientState.G.spouseGender = lover.gender;
      AncientState.G.spouseFavor = 80;
      AncientState.G.lovers.splice(loverIdx, 1);
      AncientSave.addLog(`💕 迎娶 ${lover.name} 为正室。`, 'good');
      showModal('💕 迎娶', `迎娶 ${lover.name} 为正室。`,
        [{label:'喜结连理',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
      return;
    }
    // 替换现任配偶
    const exName = AncientState.G.spouseName;
    AncientState.G.spouseFavor = AncientState.clamp((AncientState.G.spouseFavor||50) - 30);
    AncientState.G.spouseName = lover.name;
    AncientState.G.spouseEmoji = lover.emoji;
    AncientState.G.spouseGender = lover.gender;
    AncientState.G.spouseFavor = 80;
    AncientState.G.lovers.splice(loverIdx, 1);
    AncientSave.addLog(`📜 扶正 ${lover.name}，取代 ${exName} 成为正室。`, 'event');
    showModal('📜 扶正',
      `${lover.name} 已成为正室。<br><br>${exName} 好感 -30`,
      [{label:'知道了',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientRender.render(); });
  },
  
  loverVisitGiveMoney: (loverIdx, babyName) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    
    showModal('💰 给予钱财',
      `请输入给予${lover.name}的金额（文）：`,
      [{label:'确认', sub:'', cost:'', id:'confirm', isInput:true, inputType:'number', inputPlaceholder:'输入金额'}],
      (id, inputVal) => {
        closeModal();
        const amount = parseInt(inputVal) || 0;
        if (amount > AncientState.G.money){
          showToast('钱不够！');
          return;
        }
        AncientState.G.money -= amount;
        const ratio = amount / (AncientState.G.money + amount);
        
        if (ratio < 0.05){
          if (AncientSave.roll(0.4)){
            AncientFamily.loverVisitCauseTrouble(loverIdx, 'stingy');
          } else {
            AncientSave.addLog(`💰 给予 ${lover.name} ${amount}文。`, 'info');
            showModal('💰 给予钱财', `给予${lover.name} ${amount}文。`,
              [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
          }
        } else if (ratio < 0.2){
          lover._lastMoneyInsufficient = true;
          AncientSave.addLog(`💰 给予 ${lover.name} ${amount}文（较少）。`, 'info');
          showModal('💰 给予钱财', `给予${lover.name} ${amount}文（较少）。`,
            [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
        } else {
          AncientSave.addLog(`💰 给予 ${lover.name} ${amount}文（丰厚）。`, 'good');
          showModal('💰 给予钱财', `给予${lover.name} ${amount}文（丰厚），对方很满意。`,
            [{label:'欣慰',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
        }
      });
  },
  
  loverVisitIgnore: (loverIdx, babyName) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    
    if (AncientSave.roll(0.7)){
      AncientFamily.loverVisitCauseTrouble(loverIdx, 'ignore');
    } else {
      AncientSave.addLog(`❌ 对 ${lover.name} 不管不顾。`, 'info');
      showModal('❌ 冷漠以待', `对 ${lover.name} 不管不顾。`,
        [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    }
  },
  
  loverVisitCauseTrouble: (loverIdx, reason) => {
    const lover = AncientState.G.lovers[loverIdx];
    if (!lover) return;
    
    AncientState.G.mood = AncientState.clamp(AncientState.G.mood - 15);
    AncientState.G.charm = AncientState.clamp(AncientState.G.charm - 10);
    
    // 配偶和妾室好感度 -15
    if (AncientState.G.married){
      AncientState.G.spouseFavor = AncientState.clamp((AncientState.G.spouseFavor||50) - 15);
    }
    if (AncientState.G.concubines){
      AncientState.G.concubines.forEach(c => {
        c.favor = AncientState.clamp(c.favor - 15);
      });
    }
    
    AncientSave.addLog(`💢 ${lover.name} 上门闹事，传播养外室的消息！心情 -15，魅力 -10，配偶与妾室好感 -15。`, 'bad');
    
    showModal('💢 外室闹事',
      `${lover.emoji} ${lover.name} 在街坊邻居间大肆宣扬你养外室的事！<br><br>心情 -15，魅力 -10<br>配偶与妾室好感度 -15`,
      [{label:'懊恼',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientRender.render(); });
  },
  
  // 收为外室功能
  offerLover: (npcIdx) => {
    const G = AncientState.G;
    const npc = G.npcs[npcIdx]; if (!npc) return;
    
    // 概率判断：基础 50% + 好感度加成 -40% 惩罚，最低 2%
    const baseRate = 0.5 + (npc.favor/100)*0.3 - 0.4;
    const successRate = Math.max(0.02, baseRate);
    
    if (!AncientSave.roll(successRate)){
      AncientModal.showModal('💔 对方拒绝',
        `${npc.name} 不愿成为你的外室。`,
        [{label:'遗憾',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); });
      return;
    }
    
    // 对方同意，进入房产分配界面
    AncientFamily.showLoverEstateSelection(npcIdx);
  },
  
  // 显示房产选择界面
  showLoverEstateSelection: (npcIdx) => {
    const G = AncientState.G;
    const npc = G.npcs[npcIdx]; if (!npc) return;
    
    // 找出可选房产：玩家已拥有 + 可住人 + 无正室妾室子女
    const availableEstates = G.estates.filter((e, i) => {
      const isResidential = e.id !== 'farm' && e.id !== 'shop';
      if (!isResidential) return false;
      return AncientEstate.canPlaceLover(i);
    });
    
    if (availableEstates.length === 0){
      // 无可选房产
      AncientModal.showModal('🏠 无可选房产',
        `你名下没有合适的房产可以安置 ${npc.name}。<br><br>可选房产需满足：<br>· 住宅类地产<br>· 无正室居住<br>· 无妾室居住<br>· 无子女居住`,
        [{label:'❌ 拒绝', sub:'放弃收为外室', cost:'', id:'reject'},
         {label:'📅 来年再收', sub:'承诺来年买房', cost:'', id:'later'}],
        (id) => {
          AncientModal.closeModal();
          if (id==='reject'){
            npc.favor = 20;
            AncientSave.addLog(`❌ 拒绝将 ${npc.name} 收为外室，对方好感降为 20。`, 'bad');
          } else if (id==='later'){
            npc._promiseToBuyHouse = true;
            npc.favor = Math.max(0, npc.favor - 10);
            AncientSave.addLog(`📅 承诺来年为 ${npc.name} 买房安置，对方好感 -10。`, 'info');
          }
          AncientSave.save(); AncientRender.render();
        });
      return;
    }
    
    const opts = availableEstates.map((e, i) => ({
      label: `${e.icon} ${e.name}`,
      sub: `容纳${e.capacity}人 ${e.desc}`,
      cost: '',
      id: String(G.estates.indexOf(e))
    }));
    
    opts.push({label:'❌ 拒绝', sub:'放弃收为外室', cost:'', id:'reject'});
    opts.push({label:'📅 来年再收', sub:'承诺来年买房', cost:'', id:'later'});
    
    AncientModal.showModal(`💕 安置 ${npc.name}`,
      `请选择一处房产安置 ${npc.name}：<br><br>注：外室不得与正室、妾室或子女同住一宅。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id === 'reject'){
          npc.favor = 20;
          AncientSave.addLog(`❌ 拒绝将 ${npc.name} 收为外室，对方好感降为 20。`, 'bad');
          AncientSave.save(); AncientRender.render();
        } else if (id === 'later'){
          npc._promiseToBuyHouse = true;
          npc.favor = Math.max(0, npc.favor - 10);
          AncientSave.addLog(`📅 承诺来年为 ${npc.name} 买房安置，对方好感 -10。`, 'info');
          AncientSave.save(); AncientRender.render();
        } else {
          const estateIdx = parseInt(id);
          // 将 NPC 收为外室并安置
          if (!G.lovers) G.lovers = [];
          const lover = {name:npc.name, gender:npc.gender, emoji:npc.emoji, age:npc.age, favor:npc.favor, estateId:G.estates[estateIdx].eid||G.estates[estateIdx].id};
          G.lovers.push(lover);
          // 安置到房产
          const estate = G.estates[estateIdx];
          if (!estate.residents) estate.residents = [];
          estate.residents.push(npc.name);
          // 从 NPC 列表移除
          G.npcs.splice(npcIdx, 1);
          AncientSave.addLog(`💕 将 ${npc.name} 收为外室，安置于【${estate.name}】。`, 'event');
          AncientSave.save(); AncientRender.render();
        }
      });
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
window.inheritChild = AncientInherit.inheritChild;
window.offerLover = AncientFamily.offerLover;
