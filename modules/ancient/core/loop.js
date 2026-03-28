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

    // Age children
    AncientState.G.children.forEach(c => c.age += 1);

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
      if (estateIncome > 0){ AncientState.G.money += estateIncome; AncientState.G.totalMoney += estateIncome; AncientSave.addLog(`🏠 地产收入 +${estateIncome}文。`, 'good'); }
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
      AncientSave.addLog(`😡 ${AncientState.G.spouseName} 察觉到了 ${c.name} 的存在，好感 -15。`, 'bad');
      if ((AncientState.G.spouseFavor||50) < 25 && Math.random() < 0.4){
        const exSpouseName = AncientState.G.spouseName;
        AncientState.G.married=false; AncientState.G.spouseName=null; AncientState.G.spouseEmoji=null; AncientState.G.spouseFavor=50; AncientState.G.mood=AncientState.clamp(AncientState.G.mood-25);
        AncientSave.addLog(`💔 ${exSpouseName} 无法忍受，提出和离！`, 'bad');
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
        AncientSave.addLog(`💔 ${p.rel} ${p.name} 已离世，往事如烟。`, 'bad');
        AncientState.G.mood = AncientState.clamp(AncientState.G.mood - 15);
        if (p.favor == null) p.favor = AncientState.G.parentFavor || 50;
        p.favor = 0; AncientState.G.parentFavor = AncientState.clamp(AncientState.G.parentFavor - 10);
        yearEvents.push({icon:'💔', title:`${p.rel}离世`, body:`${p.emoji} ${p.name} 已离世，往事如烟。<br><br>心情 -15，愿${p.rel}一路走好。`, type:'bad'});
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
      if (AncientState.G.age > 18){ AncientState.G.inSchool=false; AncientSave.addLog(`📚 年岁渐长，离开了学堂。`,'info'); }
      else if (!isFree && AncientState.G.money >= 20){
        AncientState.G.money -= 20; AncientState.G.schoolYears++;
        const ev = AncientEvents.SCHOOL_EVENTS[Math.floor(Math.random()*AncientEvents.SCHOOL_EVENTS.length)];
        AncientState.G.intel = AncientState.clamp(AncientState.G.intel+4+(ev.intel||0)); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+(ev.mood||0));
        AncientSave.addLog(`📖 ${ev.text}`, 'info');
      } else if (!isFree && AncientState.G.money < 20){
        AncientState.G.inSchool = false; AncientSave.addLog(`📚 交不起学费，不得不辍学。`, 'bad');
      } else {
        AncientState.G.schoolYears++;
        const ev = AncientEvents.SCHOOL_EVENTS[Math.floor(Math.random()*AncientEvents.SCHOOL_EVENTS.length)];
        AncientState.G.intel = AncientState.clamp(AncientState.G.intel+4+(ev.intel||0)); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+(ev.mood||0));
        AncientSave.addLog(`📖 ${ev.text}`, 'info');
      }
    }

    // Job age out
    if (job && AncientState.G.job !== 'none'){
      if (AncientState.G.age > job.maxAge){ AncientSave.addLog(`👴 年岁太大，从 ${job.name} 退休。`,'info'); AncientState.G.job='none'; AncientState.G.jobRank=0; AncientState.G.jobProf=0; }
      else if (job.dangerRisk && Math.random()<0.12){ AncientState.G.health=AncientState.clamp(AncientState.G.health-20); AncientSave.addLog(`⚔️ 在战场上受了重伤！健康大减。`,'bad'); }
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
    }

    // Death check
    let dead=false, cause='';
    if (AncientState.G.age>=AncientState.G.maxAge)     { dead=true; cause=`寿终正寝，${AncientState.G.age}岁无病而终，乃是喜丧。`; }
    else if (AncientState.G.health<=0)    { dead=true; cause=`因病体虚，油尽灯枯，${AncientState.G.age}岁与世长辞。`; }
    else if (AncientState.G.mood<=0)      { dead=true; cause=`心灰意冷，郁郁寡欢，${AncientState.G.age}岁抑郁而终。`; }
    else if (AncientState.G.money<-200)   { dead=true; cause=`家贫如洗，饥寒交迫，${AncientState.G.age}岁含冤离世。`; }
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
      : [{label:'继续 →', sub:`${idx+1}/${events.length}`, cost:'', id:'next'}];
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
