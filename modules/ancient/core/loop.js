// Game loop system
const AncientLoop = {
  nextYear: () => {
    AncientState.G.age += 1; AncientState.G.yearsLived += 1;
    AncientState.G.salaryCollectedThisYear = false; AncientState.G.parentMoneyAskedThisYear = false;
    AncientState.G.tasksDoneThisYear = []; AncientState.G.actionsThisYear = [];
    AncientState.G._shopSeed = false; AncientState.G._shopYear = -1;
    AncientState.G._yearTasksAge = -1;
    AncientState.G.venueStamina = 100;
    if (!AncientState.G.diseases) AncientState.G.diseases = [];
    if (!AncientState.G.npcs) AncientState.G.npcs = [];

    const yearEvents = [];

    // ========== 处理 NPC 的承诺（来年再收） ==========
    if (AncientState.G.npcs && AncientState.G.npcs.length > 0){
      const toRemove = [];
      AncientState.G.npcs.forEach((npc, idx) => {
        if (npc._promiseToBuyHouse){
          // 兑现承诺：需要买房安置
          const spareEstate = AncientState.G.estates.find(e => {
            const isResidential = e.id !== 'farm' && e.id !== 'shop';
            if (!isResidential) return false;
            return AncientEstate.canPlaceLover(AncientState.G.estates.indexOf(e));
          });
          
          if (spareEstate){
            // 有房产，收为外室
            if (!AncientState.G.lovers) AncientState.G.lovers = [];
            AncientState.G.lovers.push({
              name: npc.name,
              gender: npc.gender,
              emoji: npc.emoji,
              age: npc.age,
              favor: npc.favor,
              estateId: spareEstate.eid||spareEstate.id
            });
            if (!spareEstate.residents) spareEstate.residents = [];
            spareEstate.residents.push(npc.name);
            toRemove.push(idx);
            AncientSave.addLog(`📅 践前诺，将 ${npc.name} 收为外室，安置于【${spareEstate.name}】。`, 'event');
            yearEvents.push({
              icon:'📅', title:'兑现承诺',
              body:`${npc.name} 已正式成为外室，安置于【${spareEstate.name}】，践诺已毕。`,
              type:'event'
            });
          } else {
            // 仍无房产，继续等待
            AncientSave.addLog(`📅 府中尚无合宜院落安置 ${npc.name}，前诺仍在，来年再议。`, 'info');
          }
          delete npc._promiseToBuyHouse;
        }
      });
      // 从后往前删除，避免索引错乱
      for (let i = toRemove.length - 1; i >= 0; i--){
        AncientState.G.npcs.splice(toRemove[i], 1);
      }
    }

    // ========== 事件触发优先级顺序 ==========
    // ① 成亲事件（最高优先级）
    // ② 孩子出生
    // ③ 其他事件
    
    // ① 成亲事件：处理待成亲对象
    if (AncientState.G.pendingMarriage && AncientState.G.pendingMarriage.length > 0){
      AncientState.G.pendingMarriage.forEach(pending => {
        // 执行成亲
        if (!AncientState.G.married){
          AncientState.G.married = true;
          AncientState.G.spouseName = pending.name;
          AncientState.G.spouseEmoji = pending.emoji;
          AncientState.G.spouseGender = pending.gender;
          AncientState.G.spouseBg = pending.bg;
          AncientState.G.spouseMoney = pending.money;
          AncientState.G.spouseEstates = pending.estates || [];
          AncientState.G.spouseFavor = 80;
          AncientState.G.sameGenderMarriage = pending.sameGender || false;
          
          // 添加随嫁地产
          if (pending.estates && pending.estates.length > 0){
            pending.estates.forEach(e => AncientState.G.estates.push({...e, eid:'se_'+Date.now()+Math.random(), residents:[]}));
          }
          
          // 自动入住空房
          const availEstate = AncientState.G.estates.find(e => 
            !(e.residents||[]).includes(pending.name) && 
            (e.residents||[]).length < e.capacity
          );
          if (availEstate){
            if (!availEstate.residents) availEstate.residents = [];
            availEstate.residents.push(pending.name);
          }
          
          AncientState.G.mood = AncientState.clamp(AncientState.G.mood + 20);
          AncientSave.addLog(`🎊 与 ${pending.name} 拜堂成亲，洞房花烛，喜结连理！${pending.sameGender?'（同性结合）':''}`, 'event');
          
          yearEvents.push({
            icon:'🎊', title:'洞房花烛夜',
            body:`${pending.emoji} <b>${pending.name}</b> 喜结连理！<br><br>${pending.estates&&pending.estates.length>0?'💰 随嫁恒产：'+pending.estates.map(e=>e.icon+e.name).join('、')+'<br><br>':''}夫妻初缔，情谊为 80/100，愿百年好合。`,
            type:'good'
          });
        }
      });
      AncientState.G.pendingMarriage = [];
    }
    
    // ① 纳妾事件：处理待纳妾对象（优先级同成亲）
    if (AncientState.G.pendingConcubine && AncientState.G.pendingConcubine.length > 0){
      AncientState.G.pendingConcubine.forEach(pending => {
        if (!AncientState.G.concubines) AncientState.G.concubines = [];
        const roleLabel = pending.role==='concubine'?'妾室':'面首';
        AncientState.G.concubines.push({
          name: pending.name,
          emoji: pending.emoji,
          gender: pending.gender,
          age: pending.age,
          favor: pending.favor,
          role: pending.role,
          estateId: pending.estateId,
          estateName: pending.estateName
        });
        
        // 入住到房产
        const estate = AncientState.G.estates.find(e => (e.eid||e.id) === pending.estateId);
        if (estate){
          if (!estate.residents) estate.residents = [];
          if (!estate.residents.includes(pending.name)){
            estate.residents.push(pending.name);
          }
        }
        
        AncientSave.addLog(`🏮 择吉纳 ${pending.name} 为${roleLabel}，接入府中，合府称贺。`, 'good');
        yearEvents.push({
          icon:'🏮', title:'纳妾之日',
          body:`${pending.emoji} <b>${pending.name}</b> 已正式纳入府中为${roleLabel}，安置妥当。<br><br>初始好感度：${pending.favor}/100`,
          type:'good'
        });
      });
      AncientState.G.pendingConcubine = [];
    }
    
    // ========== 生育事件（优先级第二） ==========
    // 1. 配偶生育（正妻）
    if (AncientState.G.married && AncientState.G.spouseName){
      const intimacyDone = AncientActions.actionDone('intimacySpouse');
      if (intimacyDone && Math.random() < 0.1){ // 10% chance
        const childGender = Math.random() > 0.5 ? 'male' : 'female';
        
        // 查找有配偶居住的房产
        const estate = AncientState.G.estates.find(e => {
          const residents = e.residents || [];
          return residents.includes(AncientState.G.spouseName);
        });
        
        // 触发取名系统
        AncientMarriage.startNaming({
          gender: childGender,
          motherType: 'spouse',
          spouseName: AncientState.G.spouseName,
          spouseEmoji: AncientState.G.spouseEmoji,
          estateId: estate ? (estate.eid||estate.id) : null
        });
      }
    }
    
    // 2. 妾室生育
    if (AncientState.G.concubines && AncientState.G.concubines.length > 0){
      AncientState.G.concubines.forEach((c, idx) => {
        const intimacyDone = AncientActions.actionDone('intimacyConcubine_'+idx);
        if (intimacyDone && Math.random() < 0.1){ // 10% chance
          const childGender = Math.random() > 0.5 ? 'male' : 'female';
          
          // 查找妾室居住的房产
          const estate = AncientState.G.estates.find(e => {
            const residents = e.residents || [];
            return residents.includes(c.name);
          });
          
          // 触发取名系统
          AncientMarriage.startNaming({
            gender: childGender,
            motherType: 'concubine',
            motherName: c.name,
            estateId: estate ? (estate.eid||estate.id) : null
          });
        }
      });
    }
    
    // 3. 外室生育（私生子）
    if (AncientState.G.lovers && AncientState.G.lovers.length > 0){
      AncientState.G.lovers.forEach((lover, idx) => {
        const intimacyDone = AncientActions.actionDone('intimacyLover_'+idx);
        if (intimacyDone && Math.random() < 0.1){ // 10% chance
          const childGender = Math.random() > 0.5 ? 'male' : 'female';
          // 私生子随外室姓，不参与取名系统
          const surname = lover.name.charAt(0);
          const given = AncientNaming.genName(childGender);
          const babyName = surname + given;
          const babyEmoji = childGender === 'male' ? AncientNames.MALE_EMOJI[Math.floor(Math.random()*3)] : AncientNames.FEMALE_EMOJI[Math.floor(Math.random()*3)];
          
          AncientState.G.illegitimateChildren.push({
            name: babyName,
            gender: childGender,
            emoji: babyEmoji,
            age: 0,
            favor: 50,
            mother: lover.name,
            motherType: 'lover',
            isIllegitimate: true
          });
          
          AncientSave.addLog(`🌸 外室 ${lover.name} 诞下私生子 ${babyName}。`, 'event');
          // 触发外室上门事件
          AncientFamily.triggerLoverVisit(idx, babyName, babyEmoji);
        }
      });
    }
    // ========== 生育事件结束 ==========

    // Age children
    AncientState.G.children.forEach(c => c.age += 1);
    
    // Child bring home event (for adult children)
    AncientState.G.children.forEach((c, idx) => {
      if (c.age >= 18 && !c.spouse && Math.random() < 0.08){
        // 8% chance per year for adult unmarried child
        const targetGender = Math.random() > 0.5 ? 'male' : 'female'; // Random gender, not limited to opposite
        const lover = AncientSocial.genNPCGender(targetGender);
        lover.age = Math.max(18, c.age - 3 + Math.floor(Math.random() * 6));
        
        yearEvents.push({
          icon:'💕', title:`${c.name} 带人回家`,
          body:`${c.emoji} ${c.name} 带回家一位：${lover.emoji} ${lover.name}（${lover.age}岁，${lover.bg}）。<br><br>${c.name} 表示希望与对方成亲。<br><br>若同意：将进入结婚流程（有失败概率）<br>若拒绝：子女可能私奔`,
          type:'event', opts:[{label:'✅ 同意亲事',id:'agree'},{label:'❌ 坚决反对',id:'reject'}],
          onAction:(id)=>{
            if (id==='agree'){
              // Proceed to marriage (with failure chance)
              const successRate = 0.5 + (c.favor!=null?c.favor:50)/200;
              if (AncientSave.roll(successRate)){
                const cost = 100;
                if (AncientState.G.money >= cost){
                  AncientState.G.money -= cost;
                  c.spouse = true; c.spouseName = lover.name; c.spouseGender = lover.gender;
                  c.spouseEmoji = lover.emoji; c.spouseFavor = 50;
                  AncientSave.addLog(`💕 ${c.name} 与 ${lover.name} 成亲！`, 'good');
                } else {
                  AncientState.G.money -= cost;
                  c.spouse = true; c.spouseName = lover.name; c.spouseGender = lover.gender;
                  c.spouseEmoji = lover.emoji; c.spouseFavor = 50;
                  AncientSave.addLog(`💕 ${c.name} 与 ${lover.name} 成亲（从简）！`, 'good');
                }
              } else {
                AncientSave.addLog(`💔 ${lover.name} 家拒绝了这门亲事。`, 'bad');
              }
            } else {
              // Reject - chance to elope
              if (AncientSave.roll(0.4)){
                c.eloped = true; // Mark as eloped (unavailable for inheritance)
                AncientSave.addLog(`💨 ${c.name} 与 ${lover.name} 私奔了！`, 'bad');
              } else {
                c.favor = AncientState.clamp((c.favor!=null?c.favor:50) - 20);
                AncientSave.addLog(`😔 ${c.name} 对你的反对很失望，好感 -20。`, 'bad');
              }
            }
          }
        });
      }
    });
    
    // Child childbirth event (for married children with opposite-gender spouse)
    AncientState.G.children.forEach((c, idx) => {
      if (c.spouse && c.spouseGender !== c.gender && Math.random() < 0.05){
        // 5% chance per year for married heterosexual couple
        const childGender = Math.random() > 0.5 ? 'male' : 'female';
        const surname = c.gender === 'male' ? c.name.charAt(0) : c.spouseName.charAt(0);
        const given = (childGender === 'male' ? AncientNames.MALE_NAMES : AncientNames.FEMALE_NAMES)[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)];
        const babyName = surname + given;
        const babyEmoji = childGender === 'male' ? AncientNames.MALE_EMOJI[Math.floor(Math.random()*3)] : AncientNames.FEMALE_EMOJI[Math.floor(Math.random()*3)];
        
        if (!c.children) c.children = [];
        c.children.push({
          name: babyName,
          gender: childGender,
          emoji: babyEmoji,
          age: 0,
          favor: 50
        });
        
        AncientSave.addLog(`👶 ${c.name} 的配偶诞下一子，取名 ${babyName}。`, 'good');
        yearEvents.push({
          icon:'👶', title:`喜得孙辈`,
          body:`${c.emoji} ${c.name} 的配偶${c.spouseGender==='male'?'夫君':'夫人'} ${c.spouseName} 诞下一名${childGender==='male'?'男婴':'女婴'}！<br><br>取名：<b>${babyName}</b><br><br>家族添丁，喜气洋洋！`,
          type:'good'
        });
      }
    });

    // Auto salary
    const job = AncientJobs.JOBS.find(j => j.id === AncientState.G.job);
    if (job && AncientState.G.job !== 'none' && AncientState.G.age >= job.minAge && AncientState.G.age <= job.maxAge){
      const rankMult = 1 + AncientState.G.jobRank * 0.3;
      const lo = Math.round(job.salaryRange[0] * rankMult);
      const hi = Math.round(job.salaryRange[1] * rankMult);
      const rankLabel = job.ranks[Math.min(AncientState.G.jobRank, job.ranks.length-1)];
      if (AncientSave.roll(0.75 + AncientState.G.jobRank * 0.04)){
        const earned = lo + Math.floor(Math.random() * (hi-lo+1));
        AncientState.G.money += earned; AncientState.G.totalMoney += earned;
        yearEvents.push({icon:'💰', title:`【${rankLabel}】薪俸到手`, body:`本年薪俸已结清。<br><br>入账 <b style="color:var(--amber)">+${earned} 文</b><br>当前余钱：${AncientState.G.money} 文`, type:'good'});
        AncientSave.addLog(`💰 【${rankLabel}】薪俸 +${earned}文。`, 'good');
      } else {
        const ded = Math.floor((lo+hi)/4);
        AncientState.G.money = Math.max(0, AncientState.G.money - ded);
        yearEvents.push({icon:'😤', title:'业绩扣款', body:`今年差事办得不妥，被扣去 <b style="color:var(--red)">${ded} 文</b>。`, type:'bad'});
        AncientSave.addLog(`😤 业绩不佳，被扣 ${ded}文。`, 'bad');
      }
    }

    // Estate income
    if (AncientState.G.estates && AncientState.G.estates.length > 0){
      let estateIncome = 0;
      AncientState.G.estates.forEach(e => { if (e.incomePerYear > 0) estateIncome += e.incomePerYear + (Math.floor(Math.random()*10)-5); });
      if (estateIncome > 0){
        AncientState.G.money += estateIncome; AncientState.G.totalMoney += estateIncome;
        AncientSave.addLog(`🏠 地产收入 +${estateIncome}文。`, 'good');
        yearEvents.push({icon:'🏠', title:'地产收入', body:`今年地产收益颇丰。<br><br>入账 <b style="color:var(--amber)">+${estateIncome} 文</b><br>当前余钱：${AncientState.G.money} 文`, type:'good'});
      }
    }

    // Disease effects
    if (window.AncientDisease) window.AncientDisease.checkDisease();
    if (AncientState.G.diseases && AncientState.G.diseases.length > 0){
      yearEvents.push({icon:'🤒', title:'疾病困扰', body:`你目前患有：<br><br>${AncientState.G.diseases.map(d=>`${d.icon} <b>${d.name}</b> — ${d.desc}`).join('<br>')}<br><br>请前往<b>地点 → 医馆</b>就诊！`, type:'bad'});
    }

    // Concubine events
    if (AncientState.G.concubines && AncientState.G.concubines.length > 0 && AncientState.G.married){
      AncientState.G.concubines.forEach((c,i) => {
        if (c.favor >= 80 && Math.random() < 0.12){
          yearEvents.push({
            icon:'🏮', title:`${c.name} 要求扶正`,
            body:`${c.emoji} ${c.name}（好感${c.favor}）哭诉多年情深，求你扶正她为正室。<br><br>若答应：${AncientState.G.spouseName}好感 -30，${c.name}好感 +20<br>若拒绝：${c.name}好感 -20`,
            type:'event', opts:[{label:'✅ 扶正为妻',id:'yes'},{label:'❌ 婉言安抚',id:'no'}],
            onAction:(id)=>{
              if (id==='yes'){ AncientState.G.spouseFavor=AncientState.clamp((AncientState.G.spouseFavor||50)-30); c.favor=AncientState.clamp(c.favor+20); AncientSave.addLog(`📜 扶正 ${c.name} 为正室。`,'event'); }
              else { c.favor=AncientState.clamp(c.favor-20); if(c.favor<30){ AncientState.G.concubines.splice(i,1); AncientSave.addLog(`💔 ${c.name} 心灰意冷，悄然离去。`,'bad'); } else { AncientSave.addLog(`😞 婉言安抚 ${c.name}。`,'info'); } }
            }
          });
          AncientSave.addLog(`🏮 妾室 ${c.name} 要求扶正……`, 'event');
        }
      });
    }

    if (AncientState.G.married && AncientState.G.concubines && AncientState.G.concubines.length > 0 && Math.random() < 0.15){
      const c = AncientState.G.concubines[0];
      AncientState.G.spouseFavor = AncientState.clamp((AncientState.G.spouseFavor||50) - 15);
      AncientSave.addLog(`😡 ${AncientState.G.spouseName} 察觉府中有异，疑心顿起。`, 'bad');
      yearEvents.push({icon:'😡', title:'东窗事发', body:`${AncientState.G.spouseName} 察觉府中有异，疑心顿起。<br><br>配偶好感 <b style="color:var(--red)">-15</b>`, type:'bad'});
      if ((AncientState.G.spouseFavor||50) < 25 && Math.random() < 0.4){
        const exSpouseName = AncientState.G.spouseName;
        AncientState.G.married=false; AncientState.G.spouseName=null; AncientState.G.spouseEmoji=null; AncientState.G.spouseFavor=50; AncientState.G.mood=AncientState.clamp(AncientState.G.mood-25);
        AncientSave.addLog(`💔 ${exSpouseName} 心灰意冷，执意提出和离，分道扬镳！`, 'bad');
        yearEvents.push({icon:'💔', title:'和离', body:`${exSpouseName} 含泪离去，执意和离，缘尽于此。<br><br>心情 <b style="color:var(--red)">-25</b>，从此孑然一身`, type:'bad'});
      }
    }

    // NPC decay
    AncientState.G.npcs.forEach(npc => {
      if (npc.role === 'bestfriend') return;
      if (!AncientState.G.actionsThisYear.includes('interact_'+npc.id) && Math.random() < 0.3) npc.favor = Math.max(0, npc.favor-3);
    });
    AncientState.G.npcs = AncientState.G.npcs.filter(n => n.favor > 0 || n.role === 'bestfriend');

    // Parent mortality
    AncientState.G.parents.forEach(p => {
      if (p.alive && Math.random() < 0.03 + AncientState.G.age * 0.002){
        p.alive = false;
        AncientSave.addLog(`💔 ${p.rel} ${p.name} 撒手人寰，音容宛在，令人扼腕。`, 'bad');
        AncientState.G.mood = AncientState.clamp(AncientState.G.mood - 15);
        if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
        p.favor = 0; AncientState.G.parentFavor = AncientState.clamp(AncientState.G.parentFavor - 10);
        yearEvents.push({icon:'💔', title:`${p.rel}离世`, body:`${p.emoji} ${p.name} 已驾鹤西归，音容笑貌历历在目。<br><br>心情 -15，愿${p.rel}一路走好，泉下安息。`, type:'bad'});
      }
    });

    // Attribute decay
    const healthDecay = 1 + Math.floor(Math.random()*2) + (AncientState.G.age>=40?1:0) + (AncientState.G.age>=55?2:0) + (AncientState.G.age>=70?3:0);
    const moodDecay = Math.floor(Math.random()*3);
    let charmDecay = 0;
    if (AncientState.G.age<20) charmDecay = Math.random()<0.15?1:0;
    else if (AncientState.G.age<35) charmDecay = Math.random()<0.30?1:0;
    else if (AncientState.G.age<50) charmDecay = 1+(Math.random()<0.4?1:0);
    else if (AncientState.G.age<65) charmDecay = 1+Math.floor(Math.random()*2);
    else charmDecay = 2+Math.floor(Math.random()*2);
    let intelDecay = 0;
    if (AncientState.G.age<25) intelDecay = Math.random()<0.10?1:0;
    else if (AncientState.G.age<40) intelDecay = Math.random()<0.25?1:0;
    else if (AncientState.G.age<55) intelDecay = Math.random()<0.50?1:0;
    else if (AncientState.G.age<70) intelDecay = 1+(Math.random()<0.35?1:0);
    else intelDecay = 2+Math.floor(Math.random()*2);
    AncientState.G.health=AncientState.clamp(AncientState.G.health-healthDecay); AncientState.G.mood=AncientState.clamp(AncientState.G.mood-moodDecay);
    AncientState.G.charm=AncientState.clamp(AncientState.G.charm-charmDecay); AncientState.G.intel=AncientState.clamp(AncientState.G.intel-intelDecay);

    // School
    if (AncientState.G.inSchool){
      const bg = AncientFamilyData.FAMILY_BG[AncientState.G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
      const isFree = bg.freeSchoolAge > 0 && AncientState.G.age < bg.freeSchoolAge;
      if (AncientState.G.age > 18){
        AncientState.G.inSchool=false;
        AncientSave.addLog(`📚 年岁渐丰，已届离学之龄，求学生涯就此告一段落。`,'info');
        yearEvents.push({icon:'📚', title:'离开学堂', body:`年岁渐丰，已届离学之龄，求学生涯就此告一段落。`, type:'info'});
      }
      else if (!isFree && AncientState.G.money >= 20){
        AncientState.G.money -= 20; AncientState.G.schoolYears++;
        const ev = AncientEvents.SCHOOL_EVENTS[Math.floor(Math.random()*AncientEvents.SCHOOL_EVENTS.length)];
        AncientState.G.intel = AncientState.clamp(AncientState.G.intel+4+(ev.intel||0)); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+(ev.mood||0));
        AncientSave.addLog(`📖 ${ev.text}`, 'info');
        yearEvents.push({icon:'📖', title:'学堂见闻', body:ev.text, type:'info'});
      } else if (!isFree && AncientState.G.money < 20){
        AncientState.G.inSchool = false;
        AncientSave.addLog(`📚 囊中羞涩，无力缴纳束脩，不得不含泪辍学。`, 'bad');
        yearEvents.push({icon:'📚', title:'辍学', body:`囊中羞涩，无力缴纳束脩，不得不含泪辍学。`, type:'bad'});
      } else {
        AncientState.G.schoolYears++;
        const ev = AncientEvents.SCHOOL_EVENTS[Math.floor(Math.random()*AncientEvents.SCHOOL_EVENTS.length)];
        AncientState.G.intel = AncientState.clamp(AncientState.G.intel+4+(ev.intel||0)); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+(ev.mood||0));
        AncientSave.addLog(`📖 ${ev.text}`, 'info');
        yearEvents.push({icon:'📖', title:'学堂见闻', body:ev.text, type:'info'});
      }
    }

    // Job age out
    if (job && AncientState.G.job !== 'none'){
      if (AncientState.G.age > job.maxAge){
        AncientSave.addLog(`👴 年迈体衰，不堪重任，从 ${job.name} 一职荣退。`,'info');
        yearEvents.push({icon:'👴', title:'退休', body:`岁月不饶人，从 ${job.name} 一职荣退。<br><br>半生辛苦，终可安享晚年。`, type:'info'});
        AncientState.G.job='none'; AncientState.G.jobRank=0; AncientState.G.jobProf=0;
      }
      else if (job.dangerRisk && Math.random()<0.12){
        AncientState.G.health=AncientState.clamp(AncientState.G.health-20);
        AncientSave.addLog(`⚔️ 征战沙场，身受重创，险些殒命，健康大减。`,'bad');
        yearEvents.push({icon:'⚔️', title:'战场受伤', body:`沙场征战，身受重创，九死一生。<br><br>健康 <b style="color:var(--red)">-20</b>`, type:'bad'});
      }
    }

    // Random event
    const eligible = AncientEvents.RANDOM_EVENTS.filter(e => {
      if (AncientState.G.age<e.age[0] || AncientState.G.age>e.age[1]) return false;
      if (e.job && e.job !== AncientState.G.job) return false;
      if (e.reqIntel && AncientState.G.intel < e.reqIntel) return false;
      return true;
    });
    const weights = eligible.map(e => e.w);
    const total = weights.reduce((a,b) => a+b, 0);
    let r = Math.random()*total, ev;
    for (let i=0; i<eligible.length; i++){ r -= eligible[i].w; if (r<=0){ ev=eligible[i]; break; } }
    if (!ev) ev = eligible[0];
    if (ev){
      if (ev.money){ AncientState.G.money+=ev.money; if(ev.money>0) AncientState.G.totalMoney+=ev.money; }
      if (ev.health) AncientState.G.health=AncientState.clamp(AncientState.G.health+ev.health);
      if (ev.mood)   AncientState.G.mood=AncientState.clamp(AncientState.G.mood+ev.mood);
      if (ev.intel)  AncientState.G.intel=AncientState.clamp(AncientState.G.intel+ev.intel);
      if (ev.charm)  AncientState.G.charm=AncientState.clamp(AncientState.G.charm+ev.charm);
      AncientSave.addLog(ev.text, ev.type==='good'?'good':ev.type==='bad'?'bad':'info');
      yearEvents.push({icon:ev.type==='good'?'✨':ev.type==='bad'?'⚠️':'📜', title:ev.type==='good'?'吉事':ev.type==='bad'?'凶事':'见闻', body:ev.text, type:ev.type==='good'?'good':ev.type==='bad'?'bad':'info'});
    }

    // Death check
    let dead=false, cause='';
    if (AncientState.G.age>=AncientState.G.maxAge)     { dead=true; cause=`寿终正寝，享年${AncientState.G.age}岁，无疾而终，此乃喜丧，子孙含泪送行。`; }
    else if (AncientState.G.health<=0)    { dead=true; cause=`病体难支，油尽灯枯，于${AncientState.G.age}岁撒手人寰，长辞于世。`; }
    else if (AncientState.G.mood<=0)      { dead=true; cause=`心灰意冷，万念俱灰，郁郁而终，享年${AncientState.G.age}岁。`; }
    else if (AncientState.G.money<-200)   { dead=true; cause=`家徒四壁，饥寒交迫，于${AncientState.G.age}岁含冤离世，令人唏嘘。`; }
    else if (AncientState.G.dead)         { dead=true; }

    if (dead){
      AncientState.G.dead=true; AncientState.G.deathCause=cause||AncientState.G.deathCause;
      AncientSave.addLog(`☠️ ${cause||AncientState.G.deathCause}`, 'bad');
      AncientSave.save();
      if (window.AncientRender) window.AncientRender.renderObituary();
      return;
    }

    AncientSave.save();
    if (window.AncientRender) window.AncientRender.render();
    setTimeout(() => { const lw=document.querySelector('.log-wrap'); if(lw) lw.scrollTop=0; }, 100);
    if (yearEvents.length > 0) AncientLoop.showSequentialEvents(yearEvents, 0);
  },

  showSequentialEvents: (events, idx) => {
    if (idx >= events.length) return;
    const ev = events[idx];
    const isInteractive = ev.opts && ev.opts.length > 0;
    const opts = isInteractive
      ? ev.opts.map(o => ({label:o.label, sub:`${idx+1}/${events.length}`, cost:'', id:o.id}))
      : [{label:'翻过此页 →', sub:`${idx+1}/${events.length}`, cost:'', id:'next'}];
    showModal(`${ev.icon} ${ev.title}`, ev.body, opts, (id) => {
      closeModal();
      if (isInteractive && ev.onAction) ev.onAction(id);
      AncientSave.save();
      if (idx+1 < events.length) setTimeout(() => AncientLoop.showSequentialEvents(events, idx+1), 120);
    });
  }
};

window.AncientLoop = AncientLoop;
window.nextYear = AncientLoop.nextYear;
