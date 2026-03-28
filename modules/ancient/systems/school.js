const AncientSchool = {
  toggleSchool: (e) => {
    const btn = e && e.currentTarget;
    if (AncientState.G.inSchool){
      AncientState.G.inSchool = false; AncientSave.addLog(`📚 退出了学堂，不再上学。`, 'info');
      AncientModal.showResult(btn, '退学', 'info');
      AncientModal.showModal('📚 离开学堂', `当前成绩：${AncientState.G.schoolGrade||'F'}`,
        [{label:'知道了',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    } else {
      const bg = AncientFamilyData.FAMILY_BG[AncientState.G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
      const isFree = bg.freeSchoolAge > 0 && AncientState.G.age < bg.freeSchoolAge;
      if (!isFree && AncientState.G.money < 20){ AncientModal.showToast('没有足够的钱交学费！需要 20 文。'); return; }
      if (!isFree){
        AncientModal.confirmSpend(20, '📖 缴纳束脩，入读学堂', () => {
          AncientState.G.money-=20; AncientState.G.inSchool=true;
          AncientSave.addLog(`📖 交了束脩，入读学堂。`, 'event');
          AncientModal.showResult(btn, '入学', 'good'); AncientSave.save(); AncientRender.render();
        }); return;
      }
      AncientState.G.inSchool = true; AncientSave.addLog(`📖 家里供着，入读学堂。`, 'event'); AncientModal.showResult(btn, '入学', 'good');
      AncientModal.showModal('📖 入读学堂','家里出钱供你读书，束脩已备好。每年写文应考可提升成绩。',
        [{label:'定当勤学',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
    }
    AncientSave.save(); AncientRender.render();
  },

  gradeFromScore: (score) => {
    if (score>=92) return 'S'; if (score>=80) return 'A'; if (score>=70) return 'B';
    if (score>=60) return 'C'; if (score>=48) return 'D'; if (score>=35) return 'E'; return 'F';
  },

  openExamModal: (e) => {
    if (AncientActions.actionDone('exam')){ AncientModal.showToast('今年已经考过试了！'); return; }
    const prompt = AncientEvents.ESSAY_PROMPTS[Math.floor(Math.random()*AncientEvents.ESSAY_PROMPTS.length)];
    const styles = [
      {id:'safe', label:'🖌️ 四平八稳，中规中矩',sub:'稳妥保守，失误较少',scoreMod:0},
      {id:'bold', label:'⚡ 文采飞扬，大胆立意',sub:'创意十足，成功则高分，失败则低分',scoreMod:20},
      {id:'copy', label:'📋 照抄经典，引经据典',sub:'智识要求高，通过率稳定',scoreMod:-5},
    ];
    AncientModal.showModal(`✍️ 写文应考`, `题目：《${prompt.title}》\n${prompt.desc}\n\n当前成绩：${AncientState.G.schoolGrade||'F'} · 智识：${AncientState.G.intel}`,
      styles.map(s => ({label:s.label, sub:s.sub, cost:'', id:s.id, _mod:s.scoreMod})),
      (id) => { AncientModal.closeModal(); const style=styles.find(s=>s.id===id); AncientSchool.doExam(prompt, style); });
  },

  doExam: (prompt, style) => {
    AncientActions.markAction('exam');
    let finalScore = AncientState.G.intel*0.9 + (Math.random()-0.5)*14 + (style&&style._mod||0);
    if (style && style.id==='bold') finalScore += (Math.random()-0.5)*28;
    finalScore = Math.max(0, Math.min(100, finalScore));
    const gradeThresholds = {F:[0,35],E:[22,48],D:[35,60],C:[48,70],B:[60,80],A:[72,91],S:[80,999]};
    const gradeOrder = ['F','E','D','C','B','A','S'];
    const curGradeIdx = gradeOrder.indexOf(AncientState.G.schoolGrade||'F');
    const [keepLine, upLine] = gradeThresholds[AncientState.G.schoolGrade||'F'];
    let newGradeIdx;
    if (finalScore >= upLine)   newGradeIdx = Math.min(curGradeIdx+1, 6);
    else if (finalScore < keepLine) newGradeIdx = Math.max(curGradeIdx-1, 0);
    else newGradeIdx = curGradeIdx;
    const newGrade = gradeOrder[newGradeIdx];
    const gradeInfo = AncientEvents.GRADE_INFO[newGrade];
    const oldGrade = AncientState.G.schoolGrade || 'F';
    AncientState.G.schoolGrade = newGrade; AncientState.G.intel = AncientState.clamp(AncientState.G.intel + gradeInfo.intelBonus);
    const improved = gradeOrder.indexOf(newGrade) > gradeOrder.indexOf(oldGrade);
    const dropped  = gradeOrder.indexOf(newGrade) < gradeOrder.indexOf(oldGrade);
    AncientState.G.mood = AncientState.clamp(AncientState.G.mood + (improved?8:dropped?-8:2));
    const changeStr = improved ? `↑ 从${oldGrade}升至${newGrade}！` : dropped ? `↓ 从${oldGrade}跌至${newGrade}…` : `持平${newGrade}`;
    AncientSave.addLog(`✍️ 《${prompt.title}》— 成绩${newGrade}。${gradeInfo.desc} ${changeStr}`, 'info');
    let recMsg = '';
    if ((newGrade==='A'||newGrade==='S') && !AncientState.G.examRecommended && !AncientState.G.examPassed){
      if (Math.random() < (newGrade==='S'?0.85:0.5)){
        AncientState.G.examRecommended = true; recMsg = '\n\n🌟 先生特别推荐你参加科举！';
        AncientSave.addLog(`🌟 先生推荐你参加科举！科举入口已解锁。`, 'event');
      }
    }
    AncientSave.save(); AncientRender.render();
    AncientModal.showModal('📜 考试结果',
      `题目：《${prompt.title}》\n得分：${Math.round(finalScore)} 分\n成绩：<span style="color:${gradeInfo.color};font-size:18px;font-weight:700">${newGrade}</span>\n${gradeInfo.desc}\n${changeStr}\n智识+${gradeInfo.intelBonus}${recMsg}`,
      [{label:'✅ 知道了',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
  },

  selfStudy: (e) => {
    const btn = e && e.currentTarget;
    if (AncientState.G.mood < 20){ AncientModal.showToast('心情太差，无法集中精神！'); return; }
    if (AncientSave.roll(0.5+(AncientState.G.intel/100)*0.4)){
      const gain = 1+Math.floor(Math.random()*2);
      AncientState.G.intel = AncientState.clamp(AncientState.G.intel+gain); AncientState.G.mood = AncientState.clamp(AncientState.G.mood-5);
      AncientSave.addLog(`📜 挑灯夜读，智识+${gain}，略感疲倦。`, 'good');
      AncientModal.showResult(btn, `智识+${gain}`, 'good'); AncientActions.markAction('selfStudy'); AncientSave.save();
      AncientModal.showModal('📜 自学有成', `挑灯夜读，智识+${gain}<br>心情 -5`,
        [{label:'继续努力',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood-8);
      AncientSave.addLog(`😞 苦读半日，毫无所得。`, 'bad');
      AncientModal.showResult(btn, '没学进去', 'bad'); AncientActions.markAction('selfStudy'); AncientSave.save();
      AncientModal.showModal('😞 苦读无果', '苦读半日，心情 -8',
        [{label:'下次再来',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },

  takeExam: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('takeExam')){ AncientModal.showToast('今年已经参加过科举了！'); return; }
    AncientActions.markAction('takeExam');
    const rate = (Math.max(60, AncientState.G.intel)-60)/40*0.65 + 0.1;
    if (AncientSave.roll(rate)){
      const reward = 200 + Math.floor(Math.random()*200);
      AncientState.G.money+=reward; AncientState.G.totalMoney+=reward; AncientState.G.mood=AncientState.clamp(AncientState.G.mood+20); AncientState.G.charm=AncientState.clamp(AncientState.G.charm+10);
      AncientState.G.examPassed=true; AncientState.G.job='officer'; AncientState.G.jobRank=0; AncientState.G.jobProf=0;
      AncientSave.addLog(`🎉 科举高中！朝廷赐银 ${reward}文，入朝为官！`, 'good');
      AncientModal.showResult(btn, '高中！', 'good');
    } else {
      AncientState.G.mood=AncientState.clamp(AncientState.G.mood-15); AncientState.G.examRecommended=false;
      AncientSave.addLog(`😞 科举落榜，心灰意冷，来年再战。`, 'bad');
      AncientModal.showResult(btn, '落榜', 'bad');
    }
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientSchool = AncientSchool;
window.toggleSchool = AncientSchool.toggleSchool;
window.gradeFromScore = AncientSchool.gradeFromScore;
window.openExamModal = AncientSchool.openExamModal;
window.selfStudy = AncientSchool.selfStudy;
window.takeExam = AncientSchool.takeExam;
