const AncientCareer = {
  openJobModal: () => {
    const G = AncientState.G;
    const available = AncientJobs.JOBS.filter(j => {
      if (j.minAge > G.age || j.maxAge < G.age) return false;
      if (j.examType === 'civil'     && !G.examPassed)          return false;
      if (j.examType === 'military'  && !G.militaryExamPassed)  return false;
      return true;
    });
    AncientModal.showModal('择业问仕','选定一行，勤勉任事，积累熟练可升迁晋级。每年岁末薪俸自行发放，勿需惦念。',
      available.map(j => ({label:`${j.icon} ${j.name}`, sub:j.desc, cost:j.ranks.join('→'), id:j.id})),
      (id) => {
        if (id !== G.job){
          G.job=id; G.jobRank=0; G.jobProf=0; G._yearTasksAge=-1;
          const j = AncientJobs.JOBS.find(x => x.id===id);
          AncientSave.addLog(`💼 开始从事 ${j.icon}${j.name}。`, 'event');
          AncientSave.save(); AncientModal.closeModal(); AncientRender.render();
        } else { AncientModal.closeModal(); }
      });
  },

  doWorkTask: (e, taskIdx) => {
    const btn = e && e.currentTarget;
    const job = AncientJobs.JOBS.find(j => j.id === AncientState.G.job); if (!job || !job.tasks[taskIdx]) return;
    if ((AncientState.G.tasksDoneThisYear||[]).length >= 2){ AncientModal.showToast('今岁已尽职两件差事，不可贪多！'); return; }
    if ((AncientState.G.tasksDoneThisYear||[]).includes(taskIdx)){ AncientModal.showToast('此差事今岁已办过，不可重复！'); return; }
    if (!AncientState.G.tasksDoneThisYear) AncientState.G.tasksDoneThisYear = [];
    AncientState.G.tasksDoneThisYear.push(taskIdx);
    const task = job.tasks[taskIdx];
    const baseRate = 0.7 - (task.diff-1) * 0.08;
    const attrBonus = (AncientState.G.intel+AncientState.G.health) / 200 * 0.25;
    if (AncientSave.roll(baseRate + attrBonus)){
      AncientState.G.jobProf += task.prof;
      const rankNow = job.ranks[Math.min(AncientState.G.jobRank, job.ranks.length-1)];
      const profNeeded = job.profPerRank[Math.min(AncientState.G.jobRank, job.profPerRank.length-1)] || 0;
      AncientSave.addLog(`✅ 【${job.name}·${rankNow}】${task.text}，熟练精进 +${task.prof}。`, 'good');
      AncientModal.showResult(btn, `+${task.prof}熟练`, 'good'); AncientCareer.checkPromotion(); AncientSave.save();
      AncientModal.showModal('✅ 差事办妥', `<b>${task.name}</b><br><br>${task.text}<br><br>熟练精进 +${task.prof}<br>升迁进度：${AncientState.G.jobProf}／${profNeeded}`,
        [{label:'知晓',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      const xpLoss = task.failProf || Math.floor(task.prof*0.75);
      AncientState.G.jobProf = Math.max(0, AncientState.G.jobProf-xpLoss); AncientState.G.mood = AncientState.clamp(AncientState.G.mood-4);
      AncientSave.addLog(`❌ 【${job.name}】${task.name} 出了岔子，熟练退步 -${xpLoss}。`, 'bad');
      AncientModal.showResult(btn, '出了差错', 'bad'); AncientSave.save();
      AncientModal.showModal('❌ 差事有失', `<b>${task.name}</b><br><br>此番办差有失，令人汗颜。<br>熟练退步 -${xpLoss}，心情受损 -4`,
        [{label:'惭愧',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },

  checkPromotion: () => {
    const job = AncientJobs.JOBS.find(j => j.id === AncientState.G.job); if (!job || !Array.isArray(job.profPerRank)) return;
    const maxRank = job.ranks.length - 1;
    let promoted=false, lastRank='', lastBonus=0;
    while (AncientState.G.jobRank < maxRank){
      const needed = job.profPerRank[AncientState.G.jobRank] || 0;
      if (needed === 0 || AncientState.G.jobProf < needed) break;
      AncientState.G.jobProf -= needed; AncientState.G.jobRank++;
      lastRank = job.ranks[AncientState.G.jobRank]; lastBonus = 50 + AncientState.G.jobRank*30;
      AncientState.G.money += lastBonus; AncientState.G.totalMoney += lastBonus; AncientState.G.mood = AncientState.clamp(AncientState.G.mood+20);
      AncientSave.addLog(`🎊 擢升为【${lastRank}】，朝廷赐赏 ${lastBonus}文！`, 'event');
      promoted = true; AncientState.G._yearTasksAge = -1;
    }
    if (promoted){
      const nsl = Math.round(job.salaryRange[0]*(1+AncientState.G.jobRank*0.3));
      const nsh = Math.round(job.salaryRange[1]*(1+AncientState.G.jobRank*0.3));
      setTimeout(() => AncientModal.showModal('🎊 擢升高位！',
        `恭喜荣膺 <b>【${lastRank}】</b>！<br><br>🪙 朝廷赐赏：+${lastBonus} 文<br>📈 新俸禄：${nsl}～${nsh} 文/年<br>😊 意气风发，心情 +20`,
        [{label:'🎉 感激涕零，定当尽忠职守！',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal()), 200);
    }
  }
};

window.AncientCareer = AncientCareer;
window.openJobModal = AncientCareer.openJobModal;
window.doWorkTask = AncientCareer.doWorkTask;
window.checkPromotion = AncientCareer.checkPromotion;
