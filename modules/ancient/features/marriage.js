const AncientMarriage = {
  // 通用生育概率计算（18-50 岁，35 岁后逐年下降）
  getFertilityRate: (age) => {
    if (age < 18 || age > 50) return 0;  // 年龄限制
    if (age <= 35) return 0.1;  // 18-35 岁：10% 基础概率
    // 35-50 岁：逐年下降，从 10% 降到 0%
    return 0.1 * (1 - (age - 35) / 15);
  },
  proposeToNPC: (idx) => {
    const npc = AncientState.G.npcs && AncientState.G.npcs[idx]; if (!npc) return;
    if (npc.favor < 80){ AncientModal.showToast('好感度不足 80！'); return; }
    if (AncientState.G.married){ AncientModal.showToast('你已有配偶！'); return; }
    const sameGender = npc.gender === AncientState.G.gender;
    AncientModal.showModal(`💑 向 ${npc.name} 提亲`,
      `<b>${npc.name}</b>（${npc.age}岁）\n家境：${npc.bg} · 身家：约${npc.money}文\n性格：${npc.trait}\n好感度：${npc.favor}/100\n${npc.estates&&npc.estates.length>0?'随嫁地产：'+npc.estates.map(e=>e.name).join('、'):'无随嫁地产'}\n${sameGender?'（同性结合，无法孕育子嗣）':''}`,
      [{label:'💍 正式提亲', sub:sameGender?'同性婚姻':'缔结良缘', cost:'', id:'yes'},
       {label:'↩ 再考虑一下', sub:'', cost:'', id:'no'}],
      (id) => { AncientModal.closeModal(); if (id==='yes') AncientMarriage.sendProposal(npc, sameGender); });
  },

  sendProposal: (npc, sameGender) => {
    // 提亲后，对方当年给出响应
    const agreeRate = 0.3 + (npc.favor-80)/20*0.5;
    if (AncientSave.roll(agreeRate)){
      // 对方同意，标记为待成亲状态
      if (!AncientState.G.pendingMarriage) AncientState.G.pendingMarriage = [];
      AncientState.G.pendingMarriage.push({
        name: npc.name,
        emoji: npc.emoji,
        gender: npc.gender,
        bg: npc.bg,
        money: npc.money,
        estates: npc.estates||[],
        sameGender: sameGender || false,
        year: AncientState.G.age
      });
      AncientState.G.npcs = AncientState.G.npcs.filter(n => n.id !== npc.id);
      AncientSave.addLog(`💍 ${npc.name} 应允了婚事，待来年成亲。`, 'good');
      AncientModal.showModal('💍 提亲结果',
        `${npc.name} 欣然应允！<br><br>待来年春暖花开，喜结连理。`,
        [{label:'🎉 静候佳期',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
    } else {
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood-12); npc.favor = AncientState.clamp(npc.favor-15);
      AncientSave.addLog(`💔 ${npc.name} 婉言谢绝了提亲。`, 'bad');
      AncientModal.showModal('💔 提亲结果', `${npc.name} 婉言谢绝。\n\n好感 -15，心情受损。`,
        [{label:'↩ 黯然离去',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
    }
  },

  doMarryNPC: (npc, sameGender) => {
    if (!AncientState.G.npcs) AncientState.G.npcs = [];
    AncientState.G.npcs = AncientState.G.npcs.filter(n => n.id !== npc.id);
    AncientState.G.married=true; AncientState.G.spouseName=npc.name; AncientState.G.spouseGender=npc.gender;
    AncientState.G.spouseBg=npc.bg; AncientState.G.spouseMoney=npc.money; AncientState.G.spouseEstates=npc.estates||[]; AncientState.G.spouseFavor=80;
    AncientState.G.sameGenderMarriage = sameGender || false;
    if (npc.estates && npc.estates.length > 0)
      npc.estates.forEach(e => AncientState.G.estates.push({...e, eid:'se_'+Date.now()+Math.random(), residents:[]}));
    AncientState.G.mood = AncientState.clamp(AncientState.G.mood+20);
    const availEstate = AncientState.G.estates.find(e => !(e.residents||[]).includes(npc.name) && (e.residents||[]).length < e.capacity);
    if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(npc.name); }
    AncientSave.addLog(`🎊 与 ${npc.name} 喜结连理！${sameGender?'（同性结合）':''}${npc.estates&&npc.estates.length>0?' 对方带来'+npc.estates.map(e=>e.name).join('、')+'。':''}`, 'event');
    AncientModal.showModal('🎊 大喜之日！',
      `<b>${npc.name}</b> 欣然应允，喜结连理！<br><br>${sameGender?'✨ 同性结合，无法孕育子嗣。<br><br>':''}${npc.estates&&npc.estates.length>0?'💰 随嫁地产：'+npc.estates.map(e=>e.icon+e.name).join('、')+'<br><br>':''}配偶好感度：${AncientState.G.spouseFavor}/100`,
      [{label:'🎉 成婚大吉！',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
  },

  blindDate: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('blindDate')){ AncientModal.showToast('今年已经相亲过了！'); return; }
    AncientActions.markAction('blindDate');
    const candidate = AncientSocial.genNPCGender(AncientState.G.gender==='male'?'female':'male');
    AncientModal.showModal('💑 媒人来访',
      `媒人为你引荐了一位：\n\n<b>${candidate.name}</b>（${candidate.age}岁 · ${candidate.gender==='male'?'男':'女'}）\n职业：${candidate.job} · 家境：${candidate.bg}\n性格：${candidate.trait}\n身家：约 ${candidate.money} 文\n${candidate.estates&&candidate.estates.length>0?'名下地产：'+candidate.estates.map(x=>x.icon+x.name).join('、'):'暂无名下房产'}\n\n是否接受这门婚事？`,
      [{label:'✅ 点头应允',sub:'尝试缔结良缘',cost:'',id:'yes'},
       {label:'❌ 婉言谢绝',sub:'错过此人',cost:'',id:'no'}],
      (id) => {
        AncientModal.closeModal();
        if (id==='no'){ AncientState.G.mood=AncientState.clamp(AncientState.G.mood-3); AncientSave.addLog(`💔 相亲不成，媒人自叹无缘。`,'info'); showModal('💔 相亲不成', '媒人自叹无缘，相亲不成。<br><br>心情 -3',
          [{label:'遗憾',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); }); return; }
        const sameGender = candidate.gender === AncientState.G.gender;
        const rate = AncientState.clamp(0.15+(AncientState.G.charm/100)*0.55, 0.05, 0.7);
        if (AncientSave.roll(rate)){
          AncientState.G.married=true; AncientState.G.spouseName=candidate.name; AncientState.G.spouseGender=candidate.gender;
          AncientState.G.spouseBg=candidate.bg; AncientState.G.spouseMoney=candidate.money; AncientState.G.spouseEstates=candidate.estates||[]; AncientState.G.spouseFavor=70; AncientState.G.sameGenderMarriage=sameGender;
          if (candidate.estates) candidate.estates.forEach(est => AncientState.G.estates.push({...est, eid:'se_'+Date.now()+Math.random(), residents:[]}));
          AncientState.G.mood = AncientState.clamp(AncientState.G.mood+15);
          const availEstate = AncientState.G.estates.find(e => !(e.residents||[]).includes(candidate.name) && (e.residents||[]).length < e.capacity);
          if (availEstate){ if (!availEstate.residents) availEstate.residents=[]; availEstate.residents.push(candidate.name); }
          AncientSave.addLog(`🎊 与 ${candidate.name} 相亲顺利，喜结连理！`, 'event');
          AncientModal.showResult(btn, '成婚！', 'good');
          AncientModal.showModal('🎊 相亲成功！',
            `<b>${candidate.name}</b> 一见钟情，喜结连理！<br><br>配偶好感度：${AncientState.G.spouseFavor}/100`,
            [{label:'🎉 大喜大吉！',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
        } else {
          AncientState.G.mood = AncientState.clamp(AncientState.G.mood-8);
          AncientSave.addLog(`😢 相亲未能成功，对方无意。`, 'bad');
          AncientModal.showResult(btn, '未能成婚', 'bad');
          AncientModal.showModal('💔 相亲结果',
            `${candidate.name} 婉言表示无意，此番相亲无缘而终。<br><br>心情受损。`,
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
      showModal('👶 未能添丁', '今年未能添丁，来年再盼。',
        [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientSave.save(); AncientRender.render(); });
    }
    AncientSave.save(); AncientRender.render();
  },

  // 子女取名系统
  startNaming: (babyInfo) => {
    // babyInfo: {gender, motherType, motherName, estateId}
    const isMale = babyInfo.gender === 'male';
    const surname = AncientState.G.gender === 'male' ? AncientState.G.name.charAt(0) : (babyInfo.motherName ? babyInfo.motherName.charAt(0) : AncientState.G.name.charAt(0));
    
    // 第一弹窗：取名选择
    AncientModal.showModal(`🎊 弄${isMale?'璋':'瓦'}之喜`,
      `${babyInfo.spouseEmoji||'👤'} ${babyInfo.spouseName||babyInfo.motherName} 诞下一名${isMale?'男婴':'女婴'}，合府上下喜气盈门。<br><br>孩子降生，当择一好名，以寄父母殷切之望。`,
      [
        {label:'✍️ 亲自取名', sub:'手书赐名', cost:'', id:'manual'},
        {label:'🎲 请先生赐名', sub:'随机生成', cost:'', id:'random'}
      ],
      (id) => {
        AncientModal.closeModal();
        if (id === 'manual') {
          AncientMarriage.showManualNaming(surname, isMale, babyInfo);
        } else {
          AncientMarriage.showRandomNaming(surname, isMale, babyInfo);
        }
      }
    );
  },

  // 第二弹窗 A：亲自取名
  showManualNaming: (surname, isMale, babyInfo) => {
    AncientModal.showModal('✍️ 为孩子赐名',
      `<input type="text" id="babyNameInput" placeholder="请输入名字（一至两字）" style="width:100%;padding:8px;font-size:14px;border:1px solid var(--border);border-radius:4px;margin-top:10px" maxlength="2">`,
      [
        {label:'📜 落笔定名', sub:'确认取名', cost:'', id:'confirm'},
        {label:'↩ 再想想', sub:'重新考虑', cost:'', id:'cancel'}
      ],
      (id) => {
        if (id === 'cancel') {
          AncientModal.closeModal();
          AncientMarriage.startNaming(babyInfo);
          return;
        }
        const nameInput = document.getElementById('babyNameInput').value.trim();
        if (!nameInput || nameInput.length > 2) {
          AncientModal.showToast('请输入一至两个字的名字！');
          return;
        }
        AncientModal.closeModal();
        const babyName = surname + nameInput;
        AncientMarriage.showNameConfirm(babyName, isMale, babyInfo);
      }
    );
  },

  // 第二弹窗 B：先生赐名（随机）
  showRandomNaming: (surname, isMale, babyInfo) => {
    const givenName = AncientNaming.genName(babyInfo.gender);
    const babyName = surname + givenName;
    const meaning = AncientNaming.getRandomMeaning();
    const emoji = babyInfo.spouseEmoji||'👤';
    
    AncientModal.showModal('🎲 先生赐名',
      `先生沉吟片刻，提笔写下：<br><br>${emoji} <b>${babyName}</b><br><br>寓意：${meaning}`,
      [
        {label:'✅ 就用此名', sub:'采用此名', cost:'', id:'accept'},
        {label:'🎲 换一个', sub:'重新生成', cost:'', id:'reroll'},
        {label:'↩ 自己来取', sub:'手动取名', cost:'', id:'manual'}
      ],
      (id) => {
        AncientModal.closeModal();
        if (id === 'accept') {
          AncientMarriage.showNameConfirm(babyName, isMale, babyInfo);
        } else if (id === 'reroll') {
          AncientMarriage.showRandomNaming(surname, isMale, babyInfo);
        } else {
          AncientMarriage.showManualNaming(surname, isMale, babyInfo);
        }
      }
    );
  },

  // 第三弹窗：命名确认
  showNameConfirm: (babyName, isMale, babyInfo) => {
    const blessing = AncientNaming.getRandomBlessing();
    const emoji = babyInfo.spouseEmoji||'👤';
    
    AncientModal.showModal('📜 落笔成名',
      `${emoji} <b>${babyName}</b><br><br>${isMale?'吾儿':'小女'} ${babyName}，望汝${blessing}。<br><br>此名自今日起，载入家谱。`,
      [
        {label:'🎉 合家同贺', sub:'确认命名', cost:'', id:'confirm'}
      ],
      (id) => {
        AncientModal.closeModal();
        // 完成命名，添加孩子到家族
        AncientMarriage.finalizeNaming(babyName, isMale, babyInfo);
      }
    );
  },

  // 完成命名，添加孩子
  finalizeNaming: (babyName, isMale, babyInfo) => {
    const babyEmoji = isMale ? AncientNames.MALE_EMOJI[Math.floor(Math.random()*3)] : AncientNames.FEMALE_EMOJI[Math.floor(Math.random()*3)];
    const child = {
      name: babyName,
      gender: isMale ? 'male' : 'female',
      emoji: babyEmoji,
      age: 0,
      favor: 50,
      spouse: null,
      spouseName: null,
      spouseGender: null,
      spouseEmoji: null,
      spouseFavor: 50,
      children: [],
      motherType: babyInfo.motherType || 'spouse',
      // 新增字段
      money: 0,  // 子嗣的钱财
      job: 'none',  // 子嗣的职业
      jobRank: 0,  // 职业等级
      jobProf: 0,  // 职业熟练度
      intelligence: 0,  // 智识
      inSchool: false,  // 是否在学堂
      schoolAge: 0  // 入学年龄
    };
    
    AncientState.G.children.push(child);
    
    // 安置到房产
    if (babyInfo.estateId) {
      const estate = AncientState.G.estates.find(e => (e.eid||e.id) === babyInfo.estateId);
      if (estate) {
        if (!estate.residents) estate.residents = [];
        if (!estate.residents.includes(babyName)) {
          estate.residents.push(babyName);
        }
      }
    }
    
    AncientSave.addLog(`🎉 ${isMale?'子':'女'} ${babyName} 呱呱坠地，家中添丁！`, 'good');
    AncientSave.save();
    AncientRender.render();
  }
};

window.AncientMarriage = AncientMarriage;
window.proposeToNPC = AncientMarriage.proposeToNPC;
window.sendProposal = AncientMarriage.sendProposal;
window.doMarryNPC = AncientMarriage.doMarryNPC;
window.blindDate = AncientMarriage.blindDate;
window.haveChild = AncientMarriage.haveChild;
window.startNaming = AncientMarriage.startNaming;
