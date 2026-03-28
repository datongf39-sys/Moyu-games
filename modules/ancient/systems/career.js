const AncientCareer = {
  openJobModal: () => {
    const G = AncientState.G;
    const available = AncientJobs.JOBS.filter(j => {
      if (j.minAge > G.age || j.maxAge < G.age) return false;
      if (j.examOnly && !G.examPassed) return false;
      return true;
    });
    AncientModal.showModal('选择职业','选择一份工作，完成任务积累熟练度可晋升。新薪俸在每年结束时自动发放。',
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
    if ((AncientState.G.tasksDoneThisYear||[]).length >= 2){ AncientModal.showToast('今年已完成 2 项任务，不能再做了！'); return; }
    if ((AncientState.G.tasksDoneThisYear||[]).includes(taskIdx)){ AncientModal.showToast('今年这项任务已做过了！'); return; }
    if (!AncientState.G.tasksDoneThisYear) AncientState.G.tasksDoneThisYear = [];
    AncientState.G.tasksDoneThisYear.push(taskIdx);
    const task = job.tasks[taskIdx];
    const baseRate = 0.7 - (task.diff-1) * 0.08;
    const attrBonus = (AncientState.G.intel+AncientState.G.health) / 200 * 0.25;
    if (AncientSave.roll(baseRate + attrBonus)){
      AncientState.G.jobProf += task.prof;
      const rankNow = job.ranks[Math.min(AncientState.G.jobRank, job.ranks.length-1)];
      const profNeeded = job.profPerRank[Math.min(AncientState.G.jobRank, job.profPerRank.length-1)] || 0;
      AncientSave.addLog(`✅ [${job.name}·${rankNow}] ${task.text} 熟练度+${task.prof}。`, 'good');
      AncientModal.showResult(btn, `+${task.prof}熟练`, 'good'); AncientCareer.checkPromotion(); AncientSave.save();
      AncientModal.showModal('✅ 任务完成', `<b>${task.name}</b><br><br>${task.text}<br><br>职业熟练度 +${task.prof}<br>当前进度：${AncientState.G.jobProf}／${profNeeded}`,
        [{label:'好的',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      const xpLoss = task.failProf || Math.floor(task.prof*0.75);
      AncientState.G.jobProf = Math.max(0, AncientState.G.jobProf-xpLoss); AncientState.G.mood = AncientState.clamp(AncientState.G.mood-4);
      AncientSave.addLog(`❌ [${job.name}] ${task.name} 出了差错，熟练度 -${xpLoss}。`, 'bad');
      AncientModal.showResult(btn, '出了差错', 'bad'); AncientSave.save();
      AncientModal.showModal('❌ 任务失误', `<b>${task.name}</b><br><br>出了差错。<br>熟练度 -${xpLoss}，心情 -4`,
        [{label:'知道了',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
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
      AncientSave.addLog(`🎊 晋升为【${lastRank}】，获奖赏 ${lastBonus}文！`, 'event');
      promoted = true; AncientState.G._yearTasksAge = -1;
    }
    if (promoted){
      const nsl = Math.round(job.salaryRange[0]*(1+AncientState.G.jobRank*0.3));
      const nsh = Math.round(job.salaryRange[1]*(1+AncientState.G.jobRank*0.3));
      setTimeout(() => AncientModal.showModal('🎊 职位晋升！',
        `荣升 <b>【${lastRank}】</b>！<br><br>🪙 晋升奖赏：+${lastBonus} 文<br>📈 新薪资：${nsl}～${nsh} 文/年<br>😊 心情 +20`,
        [{label:'🎉 多谢提携！',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal()), 200);
    }
  }
};

window.AncientCareer = AncientCareer;
window.openJobModal = AncientCareer.openJobModal;
window.doWorkTask = AncientCareer.doWorkTask;
window.checkPromotion = AncientCareer.checkPromotion;
