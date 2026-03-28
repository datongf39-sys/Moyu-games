const AncientMarriage = {
  proposeToNPC: (idx) => {
    const npc = AncientState.G.npcs && AncientState.G.npcs[idx]; if (!npc) return;
    if (npc.favor < 80){ AncientModal.showToast('好感度不足 80！'); return; }
    if (AncientState.G.married){ AncientModal.showToast('你已有配偶！'); return; }
    const sameGender = npc.gender === AncientState.G.gender;
    AncientModal.showModal(`💑 向 ${npc.name} 提亲`,
      `${npc.emoji} <b>${npc.name}</b>（${npc.age}岁）\n家境：${npc.bg} · 身家：约${npc.money}文\n性格：${npc.trait}\n好感度：${npc.favor}/100\n${npc.estates&&npc.estates.length>0?'随嫁地产：'+npc.estates.map(e=>e.name).join('、'):'无随嫁地产'}\n${sameGender?'（同性结合，无法孕育子嗣）':''}`,
      [{label:'💍 正式提亲', sub:sameGender?'同性婚姻':'缔结良缘', cost:'', id:'yes'},
       {label:'↩ 再考虑一下', sub:'', cost:'', id:'no'}],
      (id) => { AncientModal.closeModal(); if (id==='yes') AncientMarriage.sendProposal(npc, sameGender); });
  },

  sendProposal: (npc, sameGender) => {
    const agreeRate = 0.3 + (npc.favor-80)/20*0.5;
    if (AncientSave.roll(agreeRate)){
      AncientMarriage.doMarryNPC(npc, sameGender);
    } else {
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood-12); npc.favor = AncientState.clamp(npc.favor-15);
      AncientSave.addLog(`💔 ${npc.name} 婉言谢绝了提亲。`, 'bad');
      AncientModal.showModal('💔 提亲结果', `${npc.emoji} ${npc.name} 婉言谢绝。\n\n好感 -15，心情受损。`,
        [{label:'↩ 黯然离去',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
    }
  },

  doMarryNPC: (npc, sameGender) => {
    if (!AncientState.G.npcs) AncientState.G.npcs = [];
    AncientState.G.npcs = AncientState.G.npcs.filter(n => n.id !== npc.id);
    AncientState.G.married=true; AncientState.G.spouseName=npc.name; AncientState.G.spouseEmoji=npc.emoji; AncientState.G.spouseGender=npc.gender;
    AncientState.G.spouseBg=npc.bg; AncientState.G.spouseMoney=npc.money; AncientState.G.spouseEstates=npc.estates||[]; AncientState.G.spouseFavor=80;
    AncientState.G.sameGenderMarriage = sameGender || false;
    if (npc.estates && npc.estates.length > 0)
      npc.estates.forEach(e => AncientState.G.estates.push({...e, eid:'se_'+Date.now()+Math.random(), residents:[]}));
    AncientState.G.mood = AncientState.clamp(AncientState.G.mood+20);
    const availEstate = AncientState.G.estates.find(e => !(e.residents||[]).includes(npc.name) && (e.residents||[]).length < e.capacity);
    if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(npc.name); }
    AncientSave.addLog(`🎊 与 ${npc.name} 喜结连理！${sameGender?'（同性结合）':''}${npc.estates&&npc.estates.length>0?' 对方带来'+npc.estates.map(e=>e.name).join('、')+'。':''}`, 'event');
    AncientModal.showModal('🎊 大喜之日！',
      `${npc.emoji} <b>${npc.name}</b> 欣然应允，喜结连理！<br><br>${sameGender?'✨ 同性结合，无法孕育子嗣。<br><br>':''}${npc.estates&&npc.estates.length>0?'💰 随嫁地产：'+npc.estates.map(e=>e.icon+e.name).join('、')+'<br><br>':''}配偶好感度：${AncientState.G.spouseFavor}/100`,
      [{label:'🎉 成婚大吉！',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  blindDate: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('blindDate')){ AncientModal.showToast('今年已经相亲过了！'); return; }
    AncientActions.markAction('blindDate');
    const candidate = AncientSocial.genNPCGender(AncientState.G.gender==='male'?'female':'male');
    AncientModal.showModal('💑 媒人来访',
      `媒人为你引荐了一位：\n\n${candidate.emoji} <b>${candidate.name}</b>（${candidate.age}岁 · ${candidate.gender==='male'?'男':'女'}）\n职业：${candidate.job} · 家境：${candidate.bg}\n性格：${candidate.trait}\n身家：约 ${candidate.money} 文\n${candidate.estates&&candidate.estates.length>0?'名下地产：'+candidate.estates.map(x=>x.icon+x.name).join('、'):'暂无名下房产'}\n\n是否接受这门婚事？`,
      [{label:'✅ 点头应允',sub:'尝试缔结良缘',cost:'',id:'yes'},
       {label:'❌ 婉言谢绝',sub:'错过此人',cost:'',id:'no'}],
      (id) => {
        AncientModal.closeModal();
        if (id==='no'){ AncientState.G.mood=AncientState.clamp(AncientState.G.mood-3); AncientSave.addLog(`💔 相亲不成，媒人自叹无缘。`,'info'); AncientSave.save(); AncientRender.render(); return; }
        const sameGender = candidate.gender === AncientState.G.gender;
        const rate = AncientState.clamp(0.15+(AncientState.G.charm/100)*0.55, 0.05, 0.7);
        if (AncientSave.roll(rate)){
          AncientState.G.married=true; AncientState.G.spouseName=candidate.name; AncientState.G.spouseEmoji=candidate.emoji;
          AncientState.G.spouseGender=candidate.gender; AncientState.G.spouseBg=candidate.bg; AncientState.G.spouseMoney=candidate.money;
          AncientState.G.spouseEstates=candidate.estates||[]; AncientState.G.spouseFavor=70; AncientState.G.sameGenderMarriage=sameGender;
          if (candidate.estates) candidate.estates.forEach(est => AncientState.G.estates.push({...est, eid:'se_'+Date.now()+Math.random(), residents:[]}));
          AncientState.G.mood = AncientState.clamp(AncientState.G.mood+15);
          const availEstate = AncientState.G.estates.find(e => !(e.residents||[]).includes(candidate.name) && (e.residents||[]).length < e.capacity);
          if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(candidate.name); }
          AncientSave.addLog(`🎊 与 ${candidate.name} 相亲顺利，喜结连理！`, 'event');
          AncientModal.showResult(btn, '成婚！', 'good');
          AncientModal.showModal('🎊 相亲成功！',
            `${candidate.emoji} <b>${candidate.name}</b> 一见钟情，喜结连理！<br><br>配偶好感度：${AncientState.G.spouseFavor}/100`,
            [{label:'🎉 大喜大吉！',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
        } else {
          AncientState.G.mood = AncientState.clamp(AncientState.G.mood-8);
          AncientSave.addLog(`😢 相亲未能成功，对方无意。`, 'bad');
          AncientModal.showResult(btn, '未能成婚', 'bad');
          AncientModal.showModal('💔 相亲结果',
            `${candidate.emoji} ${candidate.name} 婉言表示无意，此番相亲无缘而终。<br><br>心情受损。`,
            [{label:'↩ 黯然离去',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
        }
      });
  },

  haveChild: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('haveChild')){ AncientModal.showToast('今年已经尝试过了！'); return; }
    if (AncientState.G.sameGenderMarriage){ AncientModal.showToast('同性结合，无法孕育子嗣。'); return; }
    const mainEstate = AncientState.G.estates && AncientState.G.estates.find(e => {
      const concubineNames = (AncientState.G.concubines||[]).map(c => c.name);
      const hasConcubine = (e.residents||[]).some(r => concubineNames.includes(r));
      return !hasConcubine && (e.residents||[]).length < e.capacity;
    });
    if (AncientState.G.estates && AncientState.G.estates.length > 0 && !mainEstate){ AncientModal.showToast('名下房产已住满或均有妾室居住，无法生子！'); return; }
    AncientActions.markAction('haveChild');
    const agePenalty = AncientState.G.age>40?0.2:AncientState.G.age>35?0.1:0;
    const rate = AncientState.clamp(0.25+(AncientState.G.health/100)*0.3-agePenalty, 0.05, 0.6);
    if (AncientSave.roll(rate)){
      const isMale = Math.random() > 0.5;
      const childName = AncientState.G.surname + (isMale?AncientNames.MALE_NAMES:AncientNames.FEMALE_NAMES)[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)];
      const childEmoji = (isMale?AncientNames.MALE_EMOJI:AncientNames.FEMALE_EMOJI)[Math.floor(Math.random()*3)];
      const child = {name:childName, gender:isMale?'male':'female', emoji:childEmoji, age:0};
      AncientState.G.children.push(child);
      if (mainEstate){ if (!mainEstate.residents) mainEstate.residents=[]; mainEstate.residents.push(childName); }
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood+15);
      if (AncientState.G.spouseFavor) AncientState.G.spouseFavor = AncientState.clamp(AncientState.G.spouseFavor+5);
      AncientSave.addLog(`🎉 ${isMale?'子':'女'} ${childName} 呱呱坠地，家中添丁！`, 'good');
      AncientModal.showResult(btn, '添丁！', 'good');
      AncientModal.showModal('🎊 喜得子嗣！', `${childEmoji} <b>${childName}</b> 降生，${isMale?'男孩':'女孩'}。`,
        [{label:'🎉 大吉大利！',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    } else {
      AncientSave.addLog(`👶 今年未能添丁，来年再盼。`, 'info');
      AncientModal.showResult(btn, '未能添丁', 'info');
    }
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientMarriage = AncientMarriage;
window.proposeToNPC = AncientMarriage.proposeToNPC;
window.sendProposal = AncientMarriage.sendProposal;
window.doMarryNPC = AncientMarriage.doMarryNPC;
window.blindDate = AncientMarriage.blindDate;
window.haveChild = AncientMarriage.haveChild;
  const npc = G.npcs && G.npcs[idx]; if (!npc) return;
  if (npc.favor < 80){ showToast('好感度不足80！'); return; }
  if (G.married){ showToast('你已有配偶！'); return; }
  const sameGender = npc.gender === G.gender;
  showModal(`💑 向 ${npc.name} 提亲`,
    `${npc.emoji} <b>${npc.name}</b>（${npc.age}岁）\n家境：${npc.bg} · 身家：约${npc.money}文\n性格：${npc.trait}\n好感度：${npc.favor}/100\n${npc.estates&&npc.estates.length>0?'随嫁地产：'+npc.estates.map(e=>e.name).join('、'):'无随嫁地产'}\n${sameGender?'（同性结合，无法孕育子嗣）':''}`,
    [{label:'💍 正式提亲', sub:sameGender?'同性婚姻':'缔结良缘', cost:'', id:'yes'},
     {label:'↩ 再考虑一下', sub:'', cost:'', id:'no'}],
    (id) => { closeModal(); if (id==='yes') sendProposal(npc, sameGender); });
}

export function sendProposal(npc, sameGender){
  const agreeRate = 0.3 + (npc.favor-80)/20*0.5;
  if (roll(agreeRate)){
    doMarryNPC(npc, sameGender);
  } else {
    G.mood = clamp(G.mood-12); npc.favor = clamp(npc.favor-15);
    addLog(`💔 ${npc.name} 婉言谢绝了提亲。`, 'bad');
    showModal('💔 提亲结果', `${npc.emoji} ${npc.name} 婉言谢绝。\n\n好感-15，心情受损。`,
      [{label:'↩ 黯然离去',sub:'',cost:'',id:'ok'}], () => { closeModal(); save(); render(); });
  }
}

export function doMarryNPC(npc, sameGender){
  if (!G.npcs) G.npcs = [];
  G.npcs = G.npcs.filter(n => n.id !== npc.id);
  G.married=true; G.spouseName=npc.name; G.spouseEmoji=npc.emoji; G.spouseGender=npc.gender;
  G.spouseBg=npc.bg; G.spouseMoney=npc.money; G.spouseEstates=npc.estates||[]; G.spouseFavor=80;
  G.sameGenderMarriage = sameGender || false;
  if (npc.estates && npc.estates.length > 0)
    npc.estates.forEach(e => G.estates.push({...e, eid:'se_'+Date.now()+Math.random(), residents:[]}));
  G.mood = clamp(G.mood+20);
  const availEstate = G.estates.find(e => !(e.residents||[]).includes(npc.name) && (e.residents||[]).length < e.capacity);
  if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(npc.name); }
  addLog(`🎊 与 ${npc.name} 喜结连理！${sameGender?'（同性结合）':''}${npc.estates&&npc.estates.length>0?' 对方带来'+npc.estates.map(e=>e.name).join('、')+'。':''}`, 'event');
  showModal('🎊 大喜之日！',
    `${npc.emoji} <b>${npc.name}</b> 欣然应允，喜结连理！<br><br>${sameGender?'✨ 同性结合，无法孕育子嗣。<br><br>':''}${npc.estates&&npc.estates.length>0?'💰 随嫁地产：'+npc.estates.map(e=>e.icon+e.name).join('、')+'<br><br>':''}配偶好感度：${G.spouseFavor}/100`,
    [{label:'🎉 成婚大吉！',sub:'',cost:'',id:'ok'}], () => { closeModal(); save(); render(); });
}

export function blindDate(e){
  const btn = e && e.currentTarget;
  if (actionDone('blindDate')){ showToast('今年已经相亲过了！'); return; }
  markAction('blindDate');
  const candidate = genNPCGender(G.gender==='male'?'female':'male');
  showModal('💑 媒人来访',
    `媒人为你引荐了一位：\n\n${candidate.emoji} <b>${candidate.name}</b>（${candidate.age}岁 · ${candidate.gender==='male'?'男':'女'}）\n职业：${candidate.job} · 家境：${candidate.bg}\n性格：${candidate.trait}\n身家：约 ${candidate.money} 文\n${candidate.estates&&candidate.estates.length>0?'名下地产：'+candidate.estates.map(x=>x.icon+x.name).join('、'):'暂无名下房产'}\n\n是否接受这门婚事？`,
    [{label:'✅ 点头应允',sub:'尝试缔结良缘',cost:'',id:'yes'},
     {label:'❌ 婉言谢绝',sub:'错过此人',cost:'',id:'no'}],
    (id) => {
      closeModal();
      if (id==='no'){ G.mood=clamp(G.mood-3); addLog(`💔 相亲不成，媒人自叹无缘。`,'info'); save(); render(); return; }
      const sameGender = candidate.gender === G.gender;
      const rate = clamp(0.15+(G.charm/100)*0.55, 0.05, 0.7);
      if (roll(rate)){
        G.married=true; G.spouseName=candidate.name; G.spouseEmoji=candidate.emoji;
        G.spouseGender=candidate.gender; G.spouseBg=candidate.bg; G.spouseMoney=candidate.money;
        G.spouseEstates=candidate.estates||[]; G.spouseFavor=70; G.sameGenderMarriage=sameGender;
        if (candidate.estates) candidate.estates.forEach(est => G.estates.push({...est, eid:'se_'+Date.now()+Math.random(), residents:[]}));
        G.mood = clamp(G.mood+15);
        const availEstate = G.estates.find(e => !(e.residents||[]).includes(candidate.name) && (e.residents||[]).length < e.capacity);
        if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(candidate.name); }
        addLog(`🎊 与 ${candidate.name} 相亲顺利，喜结连理！`, 'event');
        showResult(btn, '成婚！', 'good');
        showModal('🎊 相亲成功！',
          `${candidate.emoji} <b>${candidate.name}</b> 一见钟情，喜结连理！<br><br>配偶好感度：${G.spouseFavor}/100`,
          [{label:'🎉 大喜大吉！',sub:'',cost:'',id:'ok'}], () => { closeModal(); save(); render(); });
      } else {
        G.mood = clamp(G.mood-8);
        addLog(`😢 相亲未能成功，对方无意。`, 'bad');
        showResult(btn, '未能成婚', 'bad');
        showModal('💔 相亲结果',
          `${candidate.emoji} ${candidate.name} 婉言表示无意，此番相亲无缘而终。<br><br>心情受损。`,
          [{label:'↩ 黯然离去',sub:'',cost:'',id:'ok'}], () => { closeModal(); save(); render(); });
      }
    });
}

export function haveChild(e){
  const btn = e && e.currentTarget;
  if (actionDone('haveChild')){ showToast('今年已经尝试过了！'); return; }
  if (G.sameGenderMarriage){ showToast('同性结合，无法孕育子嗣。'); return; }
  const mainEstate = G.estates && G.estates.find(e => {
    const concubineNames = (G.concubines||[]).map(c => c.name);
    const hasConcubine = (e.residents||[]).some(r => concubineNames.includes(r));
    return !hasConcubine && (e.residents||[]).length < e.capacity;
  });
  if (G.estates && G.estates.length > 0 && !mainEstate){ showToast('名下房产已住满或均有妾室居住，无法生子！'); return; }
  markAction('haveChild');
  const agePenalty = G.age>40?0.2:G.age>35?0.1:0;
  const rate = clamp(0.25+(G.health/100)*0.3-agePenalty, 0.05, 0.6);
  if (roll(rate)){
    const isMale = Math.random() > 0.5;
    const childName = G.surname + (isMale?MALE_NAMES:FEMALE_NAMES)[Math.floor(Math.random()*MALE_NAMES.length)];
    const childEmoji = (isMale?MALE_EMOJI:FEMALE_EMOJI)[Math.floor(Math.random()*3)];
    const child = {name:childName, gender:isMale?'male':'female', emoji:childEmoji, age:0};
    G.children.push(child);
    if (mainEstate){ if (!mainEstate.residents) mainEstate.residents=[]; mainEstate.residents.push(childName); }
    G.mood = clamp(G.mood+15);
    if (G.spouseFavor) G.spouseFavor = clamp(G.spouseFavor+5);
    addLog(`🎉 ${isMale?'子':'女'} ${childName} 呱呱坠地，家中添丁！`, 'good');
    showResult(btn, '添丁！', 'good');
    showModal('🎊 喜得子嗣！', `${childEmoji} <b>${childName}</b> 降生，${isMale?'男孩':'女孩'}。`,
      [{label:'🎉 大吉大利！',sub:'',cost:'',id:'ok'}], () => closeModal());
  } else {
    addLog(`👶 今年未能添丁，来年再盼。`, 'info');
    showResult(btn, '未能添丁', 'info');
  }
  save(); render();
}
