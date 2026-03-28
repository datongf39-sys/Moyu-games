// Social system
const AncientSocial = {
  buildNPC: (gender) => {
    const isMale = gender === 'male';
    const surname = AncientNames.SURNAMES[Math.floor(Math.random()*AncientNames.SURNAMES.length)];
    const given = (isMale ? AncientNames.MALE_NAMES : AncientNames.FEMALE_NAMES)[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)];
    const bg = AncientNames.NPC_BG[Math.floor(Math.random()*AncientNames.NPC_BG.length)];
    const [mlo, mhi] = AncientNames.NPC_BG_MONEY[bg];
    const money = mlo + Math.floor(Math.random()*(mhi-mlo));
    const job = AncientNames.NPC_JOBS[Math.floor(Math.random()*AncientNames.NPC_JOBS.length)];
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
      age:14+Math.floor(Math.random()*30), job, bg, money, trait, estates, favor:0, role:'friend', venue:''};
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
    const canConcubine  = npc.favor >= 70 && G.married;
    const sameGender    = npc.gender === G.gender;
    const gifts = G.inventory.filter(i => i.isGift);
    const opts = [];
    opts.push({label:'💬 聊天叙旧', sub:alreadyChat?'今年已互动':'魅力/智识影响好感', cost:'', id:'chat'});
    if (gifts.length > 0) opts.push({label:'🎁 赠送礼物', sub:alreadyGift?'今年已赠礼':`包裹中有${gifts.length}件礼物`, cost:'', id:'gift'});
    opts.push({label:'💰 赠送钱财', sub:alreadyMoney?'今年已赠钱':'花费文钱，增加好感', cost:'', id:'money'});
    if (canPropose)   opts.push({label:sameGender?'💍 求婚':'💍 提亲', sub:'好感≥80', cost:'', id:'propose'});
    if (canConcubine) opts.push({label:'🏮 纳为妾室/面首', sub:'好感≥70，已婚可纳', cost:'', id:'concubine'});
    if (npc.favor >= 90) opts.push({label:'🤝 结为挚友', sub:'好感≥90', cost:'', id:'bestfriend'});
    opts.push({label:'🚪 疏远此人', sub:'从社交圈移除', cost:'', id:'remove'});
    showModal(`${npc.emoji} ${npc.name}`,
      `${npc.gender==='male'?'男':'女'} · ${npc.age}岁 · ${npc.job}\n${npc.bg}家境 · ${npc.trait}\n好感度：${npc.favor}/100`,
      opts, (id) => {
        closeModal();
        if (id==='chat')       AncientSocial.doNPCChat(idx);
        else if (id==='gift')  AncientSocial.doNPCGiftFromBag(idx);
        else if (id==='money') AncientSocial.doNPCGiveMoney(idx);
        else if (id==='propose')    AncientMarriage.proposeToNPC(idx);
        else if (id==='concubine')  AncientFamily.offerConcubine(idx);
        else if (id==='bestfriend') AncientSocial.doNPCBestFriend(idx);
        else if (id==='remove')     AncientSocial.removeNPC(idx);
      });
  },

  doNPCChat: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'interact_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今年已经和此人聊过了！'); return; }
    AncientActions.markAction(key);
    if (AncientSave.roll(0.3 + (G.charm/100)*0.4 + (G.intel/100)*0.2)){
      const gain = 5+Math.floor(Math.random()*10);
      npc.favor = Math.min(100, npc.favor+gain); G.mood = AncientState.clamp(G.mood+3);
      AncientSave.addLog(`🍵 与 ${npc.name} 相谈甚欢，好感+${gain}。`, 'good');
      showModal('🍵 相谈甚欢',
        `与 <b>${npc.name}</b> 促膝而谈。<br><br>好感+${gain}（现为${npc.favor}/100）${npc.favor>=80?'<br>💡 好感已达 80，可提亲！':''}`,
        [{label:'甚好',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    } else {
      const loss = 2+Math.floor(Math.random()*4);
      npc.favor = Math.max(0, npc.favor-loss);
      AncientSave.addLog(`😅 与 ${npc.name} 话不投机，好感-${loss}。`, 'bad');
      showModal('😅 话不投机',
        `与 <b>${npc.name}</b> 交谈尴尬。<br><br>好感-${loss}（现为${npc.favor}/100）`,
        [{label:'有些尴尬',sub:'',cost:'',id:'ok'}], () => { closeModal(); AncientSave.save(); AncientRender.render(); });
    }
    AncientSave.save(); AncientRender.render();
  },

  doNPCGiftFromBag: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'giftBag_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今年已经送过礼了！'); return; }
    const gifts = G.inventory.map((item,i) => ({item,i})).filter(({item}) => item.isGift);
    if (gifts.length === 0){ showToast('包裹里没有礼物！'); return; }
    const opts = gifts.map(({item,i}) => {
      const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
      const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
      return {label:`${item.icon} ${item.name}`, sub:`好感+${bonus}${matched?' ✨投其所好':''}`, cost:'', id:String(i)};
    });
    showModal(`🎁 赠送礼物给 ${npc.name}`, `对方性格：${npc.trait}`, opts, (id) => {
      closeModal(); const slotIdx=parseInt(id); const item=G.inventory[slotIdx]; if (!item) return;
      const key2 = 'giftBag_'+npc.id;
      if (AncientActions.actionDone(key2)){ showToast('今年已经送过礼了！'); return; }
      AncientActions.markAction(key2);
      const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
      const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
      npc.favor = Math.min(100, npc.favor+bonus);
      G.inventory.splice(slotIdx,1);
      AncientSave.addLog(`🎁 赠送 ${item.name} 给 ${npc.name}，好感+${bonus}。`, 'good');
      AncientSave.save(); AncientRender.render();
    });
  },

  doNPCGiveMoney: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    const key = 'giveMoney_'+npc.id;
    if (AncientActions.actionDone(key)){ showToast('今年已经给过钱了！'); return; }
    const opts = [10,20,50,100].map(amt => ({label:`赠送 ${amt} 文`, sub:`当前余钱 ${G.money}`, cost:String(amt), id:String(amt)}));
    showModal(`💰 赠送钱财给 ${npc.name}`, '赠送钱财可增加好感', opts, (id) => {
      closeModal(); const amt=parseInt(id); if (G.money<amt){ showToast('钱不够！'); return; }
      AncientActions.markAction(key);
      G.money -= amt;
      const gain = Math.floor(amt/10);
      npc.favor = Math.min(100, npc.favor+gain);
      AncientSave.addLog(`💰 赠送 ${npc.name} ${amt}文，好感+${gain}。`, 'good');
      AncientSave.save(); AncientRender.render();
    });
  },

  doNPCBestFriend: (idx) => {
    const G = AncientState.G;
    const npc = G.npcs && G.npcs[idx]; if (!npc) return;
    npc.role = 'bestfriend';
    AncientSave.addLog(`🤝 与 ${npc.name} 结为挚友！`, 'good');
    AncientSave.save(); AncientRender.render();
  },

  removeNPC: (idx) => {
    const G = AncientState.G;
    G.npcs.splice(idx,1);
    AncientSave.addLog(`🚪 疏远了一位故人。`, 'info');
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientSocial = AncientSocial;
window.openNPCInteract = AncientSocial.openNPCInteract;
window.doNPCChat = AncientSocial.doNPCChat;
window.doNPCGiftFromBag = AncientSocial.doNPCGiftFromBag;
window.doNPCGiveMoney = AncientSocial.doNPCGiveMoney;
window.doNPCBestFriend = AncientSocial.doNPCBestFriend;
window.removeNPC = AncientSocial.removeNPC;
