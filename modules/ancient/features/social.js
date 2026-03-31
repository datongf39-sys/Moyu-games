// Social system
const AncientSocial = {
  buildNPC: (gender) => {
    const isMale = gender === 'male';
    const surname = AncientNames.SURNAMES[Math.floor(Math.random()*AncientNames.SURNAMES.length)];
    const given = (isMale ? AncientNames.MALE_NAMES : AncientNames.FEMALE_NAMES)[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)];
    const bg = AncientNames.NPC_BG[Math.floor(Math.random()*AncientNames.NPC_BG.length)];
    const [mlo, mhi] = AncientNames.NPC_BG_MONEY[bg];
    const money = mlo + Math.floor(Math.random()*(mhi-mlo));
    
    // 合理的年龄分配逻辑
    // 14-17 岁：少年，可能无业
    // 18-60 岁：成年，必须有职业
    // 60+ 岁：老年，可能退休无业
    const ageRoll = Math.random();
    let age;
    let job;
    
    if (ageRoll < 0.2) {
      // 20% 概率是少年（14-17 岁）
      age = 14 + Math.floor(Math.random() * 4);
      // 少年 50% 概率无业，50% 概率有简单职业
      job = Math.random() < 0.5 ? 'none' : AncientNames.NPC_JOBS[Math.floor(Math.random()*AncientNames.NPC_JOBS.length)];
    } else if (ageRoll < 0.85) {
      // 65% 概率是青壮年（18-50 岁），必须有职业
      age = 18 + Math.floor(Math.random() * 33);
      // 成年必须有职业，从可用职业中选择（排除 'none'）
      const availableJobs = AncientNames.NPC_JOBS.filter(j => j.id !== 'none');
      job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
    } else {
      // 15% 概率是老年（51-75 岁）
      age = 51 + Math.floor(Math.random() * 25);
      // 老年人 70% 概率退休无业，30% 概率继续工作
      if (Math.random() < 0.7) {
        job = 'none';
      } else {
        const availableJobs = AncientNames.NPC_JOBS.filter(j => j.id !== 'none');
        job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
      }
    }
    
    const trait = AncientNames.NPC_TRAITS[Math.floor(Math.random()*AncientNames.NPC_TRAITS.length)];
    const emoji = (isMale ? AncientNames.MALE_EMOJI : AncientNames.FEMALE_EMOJI)[Math.floor(Math.random()*3)];
    let estates = [];
    if (money >= 300 && Math.random() < 0.5){
      const e = AncientEstates.ESTATES[1+Math.floor(Math.random()*3)];
      estates = [{...e, eid:'nse_'+Date.now()+Math.floor(Math.random()*9999), residents:[]}];
    } else if (money >= 80 && Math.random() < 0.3){
      estates = [{...AncientEstates.ESTATES[0], eid:'nse_'+Date.now()+Math.floor(Math.random()*9999), residents:[]}];
    }
    return {id:'npc_'+Date.now()+'_'+Math.floor(Math.random()*9999), name:surname+given, gender, emoji,
      age, job: job.id || job, bg, money, trait, estates, favor:0, role:'friend', venue:''};
  },

  genNPC: () => {
    return AncientSocial.buildNPC(Math.random()>0.5?'male':'female');
  },

  genNPCGender: (forcedGender) => {
    return AncientSocial.buildNPC(forcedGender);
  },

  openNPCInteract: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const alreadyChat  = AncientActions.actionDone('interact_'+npc.id);
    const alreadyMoney = AncientActions.actionDone('giveMoney_'+npc.id);
    const alreadyGift  = AncientActions.actionDone('giftBag_'+npc.id);
    const canPropose    = npc.favor >= 80 && !G.married;
    const canConcubine  = npc.favor >= 70; // 纳妾/面首，不需要已婚
    const canLover      = npc.favor >= 70; // 收为外室，好感度 70+
    const sameGender    = npc.gender === G.gender;
    const gifts = G.inventory.filter(i => i.isGift);
    const opts = [];
    opts.push({label:'💬 叙旧话常', sub:alreadyChat?'今岁已叙过':'魅力与智识皆有裨益', cost:'', id:'chat'});
    if (gifts.length > 0) opts.push({label:'🎁 赠送礼物', sub:alreadyGift?'今岁已赠过':`行囊中有${gifts.length}件物什`, cost:'', id:'gift'});
    opts.push({label:'💰 馈赠钱帛', sub:alreadyMoney?'今岁已赠过':'散财结缘，颇有裨益', cost:'', id:'money'});
    if (canPropose)   opts.push({label:sameGender?'💍 求婚':'💍 提亲', sub:'情谊深厚，可缔姻缘', cost:'', id:'propose'});
    if (canConcubine) opts.push({label:'🏮 纳为妾室/面首', sub:'情谊渐浓，可纳府中', cost:'', id:'concubine'});
    if (canLover)     opts.push({label:'💕 收为外室', sub:'情谊渐浓，可在外安置', cost:'', id:'lover'});
    if (npc.favor >= 90) opts.push({label:'🤝 结为挚友', sub:'情谊深厚，可结挚交', cost:'', id:'bestfriend'});
    opts.push({label:'🚪 形同陌路', sub:'就此断绝往来', cost:'', id:'remove'});
    showModal(`${npc.name}`,
      `${npc.gender==='male'?'男':'女'} · ${npc.age}岁 · ${npc.job}\n${npc.bg}家境 · ${npc.trait}\n好感度：${npc.favor}/100`,
      opts, (id) => {
        closeModal();
        if (id==='chat')       AncientSocial.doNPCChat(idx);
        else if (id==='gift')  AncientSocial.doNPCGiftFromBag(idx);
        else if (id==='money') AncientSocial.doNPCGiveMoney(idx);
        else if (id==='propose')    AncientMarriage.proposeToNPC(idx);
        else if (id==='concubine')  AncientFamily.offerConcubine(idx);
        else if (id==='lover')      AncientFamily.offerLover(idx);
        else if (id==='bestfriend') AncientSocial.doNPCBestFriend(idx);
        else if (id==='remove')     AncientSocial.removeNPC(idx);
      });
  },

  doNPCChat: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'interact_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今岁已与此人叙过旧了！'); return; }
    AncientActions.markAction(key);
    if (AncientSave.roll(0.3 + (G.charm/100)*0.4 + (G.intel/100)*0.2)){
      const gain = 5+Math.floor(Math.random()*10);
      npc.favor = Math.min(100, npc.favor+gain); G.mood = AncientState.clamp(G.mood+3);
      AncientSave.addLog(`🍵 与 ${npc.name} 相谈投机，情谊渐增，好感+${gain}。`, 'good');
      showModal('🍵 投机之谈',
        `与 <b>${npc.name}</b> 促膝长谈，相谈甚欢。<br><br>好感+${gain}（现为${npc.favor}/100）${npc.favor>=80?'<br>💡 情谊已深，可遣媒提亲。':''}`,
        [{label:'甚好',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    } else {
      const loss = 2+Math.floor(Math.random()*4);
      npc.favor = Math.max(0, npc.favor-loss);
      AncientSave.addLog(`😅 与 ${npc.name} 言语不合，好感-${loss}。`, 'bad');
      showModal('😅 言语相左',
        `与 <b>${npc.name}</b> 言语相左，颇感尴尬。<br><br>好感-${loss}（现为${npc.favor}/100）`,
        [{label:'讪讪而别',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    }
    AncientSave.save(); AncientRender.render();
  },

  doNPCGiftFromBag: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'giftBag_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今岁已赠过礼了！'); return; }
    const gifts = G.inventory.map((item,i) => ({item,i})).filter(({item}) => item.isGift);
    if (gifts.length === 0){ showToast('行囊中并无可赠之物！'); return; }
    const opts = gifts.map(({item,i}) => {
      const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
      const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
      return {label:`${item.icon} ${item.name}`, sub:`好感+${bonus}${matched?' ✨投其所好':''}`, cost:'', id:String(i)};
    });
    showModal(`🎁 赠送礼物给 ${npc.name}`, `此人性情：${npc.trait}，投其所好方显诚意。`, opts, (id) => {
      closeModal(); const slotIdx=parseInt(id); const item=G.inventory[slotIdx]; if (!item) return;
      const key2 = 'giftBag_'+npc.id;
      if (AncientActions.actionDone(key2)){ showToast('今岁已赠过礼了！'); return; }
      AncientActions.markAction(key2);
      const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
      const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
      npc.favor = Math.min(100, npc.favor+bonus);
      G.inventory.splice(slotIdx,1);
      AncientSave.addLog(`🎁 赠送 ${item.name} 给 ${npc.name}，好感+${bonus}。`, 'good');
      showModal('🎁 赠礼', `赠送 ${item.name} 给 ${npc.name}，好感+${bonus}。`,
        [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    });
  },

  doNPCGiveMoney: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'giveMoney_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今岁已馈赠过了！'); return; }
    const opts = [10,20,50,100].map(amt => ({label:`赐予 ${amt} 文`, sub:`现有余钱 ${G.money} 文`, cost:String(amt), id:String(amt)}));
    showModal(`💰 馈赠钱帛给 ${npc.name}`, '馈赠钱帛，可增进情谊', opts, (id) => {
      closeModal(); const amt=parseInt(id); if (G.money<amt){ showToast('囊中羞涩，钱财不足！'); return; }
      AncientActions.markAction(key);
      G.money -= amt;
      const gain = Math.floor(amt/10);
      npc.favor = Math.min(100, npc.favor+gain);
      AncientSave.addLog(`💰 馈赠 ${npc.name} ${amt}文，对方喜笑颜开，好感+${gain}。`, 'good');
      showModal('💰 赠金', `馈赠 ${npc.name} ${amt}文，对方喜笑颜开，好感+${gain}（现为${npc.favor}/100）`,
        [{label:'心领',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    });
  },

  doNPCBestFriend: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    npc.role = 'bestfriend';
    AncientSave.addLog(`🤝 与 ${npc.name} 结为挚友！`, 'good');
    showModal('🤝 金兰之交', `与 ${npc.name} 结为金兰，誓同生死，此情长存。`,
      [{label:'义结金兰',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  removeNPC: (idx) => {
    const G = AncientState.G;
    G.npcs.splice(idx,1);
    AncientSave.addLog(`🚪 疏远了一位故人。`, 'info');
    showModal('🚪 形同陌路', `与故人就此离心，各奔前程，缘分尽矣。`,
      [{label:'就此别过',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
  }
};

window.AncientSocial = AncientSocial;
window.openNPCInteract = AncientSocial.openNPCInteract;
window.doNPCChat = AncientSocial.doNPCChat;
window.doNPCGiftFromBag = AncientSocial.doNPCGiftFromBag;
window.doNPCGiveMoney = AncientSocial.doNPCGiveMoney;
window.doNPCBestFriend = AncientSocial.doNPCBestFriend;
window.removeNPC = AncientSocial.removeNPC;
