// School system
const AncientSchool = {
  toggleSchool: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.inSchool) {
      G.inSchool = false;
      AncientSave.addLog('📚 退出了学堂，不再上学。', 'info');
      AncientModal.showResult(btn, '退学', 'info');
      AncientModal.showModal('📚 离开学堂', `当前成绩：${G.schoolGrade || 'F'}`,
        [{ label: '知道了', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
    } else {
      const bg = AncientFamilyData.FAMILY_BG[G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
      const isFree = bg.freeSchoolAge > 0 && G.age < bg.freeSchoolAge;
      const needPay = !isFree;
      if (needPay && G.money < 20) {
        AncientModal.showToast('没有足够的钱交学费！需要 20 文。');
        return;
      }
      if (needPay) {
        AncientModal.confirmSpend(20, '📖 缴纳束脩，入读学堂', () => {
          G.money -= 20;
          G.inSchool = true;
          AncientSave.addLog('📖 交了束脩，入读学堂。', 'event');
          AncientModal.showResult(btn, '入学', 'good');
          AncientSave.save();
          AncientRender.render();
          AncientModal.closeModal();
        });
        return;
      }
      G.inSchool = true;
      AncientSave.addLog('📖 家里供着，入读学堂。', 'event');
      AncientModal.showResult(btn, '入学', 'good');
      AncientModal.showModal('📖 入读学堂', '家里出钱供你读书，束脩已备好。每年写文应考可提升成绩。',
        [{ label: '定当勤学', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
    }
    AncientSave.save();
    AncientRender.render();
  },
  
  gradeFromScore: (score) => {
    if (score >= 92) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 48) return 'D';
    if (score >= 35) return 'E';
    return 'F';
  },
  
  openExamModal: (e) => {
    const G = AncientState.G;
    if (AncientActions.actionDone('exam')) {
      AncientModal.showToast('今年已经考过试了！');
      return;
    }
    const prompt = AncientEvents.ESSAY_PROMPTS[Math.floor(Math.random() * AncientEvents.ESSAY_PROMPTS.length)];
    const styles = [
      { id: 'safe', label: '🖌️ 四平八稳，中规中矩', sub: '稳妥保守，失误较少', scoreMod: 0 },
      { id: 'bold', label: '⚡ 文采飞扬，大胆立意', sub: '创意十足，成功则高分，失败则低分', scoreMod: 20 },
      { id: 'copy', label: '📋 照抄经典，引经据典', sub: '智识要求高，通过率稳定', scoreMod: -5 }
    ];
    AncientModal.showModal(`✍️ 写文应考`, `题目：《${prompt.title}》\n${prompt.desc}\n\n当前成绩：${G.schoolGrade || 'F'} · 智识：${G.intel}`,
      styles.map(s => ({ label: s.label, sub: s.sub, cost: '', id: s.id, _mod: s.scoreMod })),
      (id) => {
        AncientModal.closeModal();
        const style = styles.find(s => s.id === id);
        AncientSchool.doExam(prompt, style);
      });
  },
  
  doExam: (prompt, style) => {
    const G = AncientState.G;
    AncientActions.markAction('exam');
    const intelScore = G.intel * 0.9 + (Math.random() - 0.5) * 14;
    let finalScore = intelScore + (style && style._mod || 0);
    if (style && style.id === 'bold') finalScore += (Math.random() - 0.5) * 28;
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    const gradeThresholds = { F: [0, 35], E: [22, 48], D: [35, 60], C: [48, 70], B: [60, 80], A: [72, 91], S: [80, 999] };
    const gradeOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
    const curGradeIdx = gradeOrder.indexOf(G.schoolGrade || 'F');
    const [keepLine, upLine] = gradeThresholds[G.schoolGrade || 'F'];
    
    let newGradeIdx;
    if (finalScore >= upLine) newGradeIdx = Math.min(curGradeIdx + 1, 6);
    else if (finalScore < keepLine) newGradeIdx = Math.max(curGradeIdx - 1, 0);
    else newGradeIdx = curGradeIdx;
    
    const newGrade = gradeOrder[newGradeIdx];
    const gradeInfo = AncientEvents.GRADE_INFO[newGrade];
    const oldGrade = G.schoolGrade || 'F';
    G.schoolGrade = newGrade;
    G.intel = AncientState.clamp(G.intel + gradeInfo.intelBonus);
    
    const improved = gradeOrder.indexOf(newGrade) > gradeOrder.indexOf(oldGrade);
    const dropped = gradeOrder.indexOf(newGrade) < gradeOrder.indexOf(oldGrade);
    G.mood = AncientState.clamp(G.mood + (improved ? 8 : dropped ? -8 : 2));
    
    const changeStr = improved ? `↑ 从${oldGrade}升至${newGrade}！` : dropped ? `↓ 从${oldGrade}跌至${newGrade}…` : `持平${newGrade}`;
    AncientSave.addLog(`✍️ 《${prompt.title}》— 成绩${newGrade}。${gradeInfo.desc} ${changeStr}`, 'info');
    
    let recMsg = '';
    if ((newGrade === 'A' || newGrade === 'S') && !G.examRecommended && !G.examPassed) {
      if (Math.random() < (newGrade === 'S' ? 0.85 : 0.5)) {
        G.examRecommended = true;
        recMsg = '\n\n🌟 先生特别推荐你参加科举！';
        AncientSave.addLog('🌟 先生推荐你参加科举！科举入口已解锁。', 'event');
      }
    }
    
    AncientSave.save();
    AncientRender.render();
    AncientModal.showModal('📜 考试结果',
      `题目：《${prompt.title}》\n得分：${Math.round(finalScore)} 分\n成绩：<span style="color:${gradeInfo.color};font-size:18px;font-weight:700">${newGrade}</span>\n${gradeInfo.desc}\n${changeStr}\n智识 +${gradeInfo.intelBonus}${recMsg}`,
      [{ label: '✅ 知道了', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
  },
  
  selfStudy: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.mood < 20) {
      AncientModal.showToast('心情太差，无法集中精神！');
      return;
    }
    AncientActions.markAction('selfStudy');
    const success = AncientSave.roll(0.5 + (G.intel / 100) * 0.4);
    if (success) {
      const gain = 1 + Math.floor(Math.random() * 2);
      G.intel = AncientState.clamp(G.intel + gain);
      G.mood = AncientState.clamp(G.mood - 5);
      AncientSave.addLog(`📜 挑灯夜读，智识 +${gain}，略感疲倦。`, 'good');
      AncientModal.showResult(btn, `智识 +${gain}`, 'good');
      AncientSave.save();
      AncientModal.showModal('📜 自学有成', `挑灯夜读，智识 +${gain}<br>心情 -5`,
        [{ label: '继续努力', sub: '', cost: '', id: 'ok' }], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      G.mood = AncientState.clamp(G.mood - 8);
      AncientSave.addLog(`😞 苦读半日，毫无所得。`, 'bad');
      AncientModal.showResult(btn, '苦读无果', 'bad');
      AncientSave.save();
      AncientModal.showModal('😞 苦读无果', '苦读半日，心情 -8',
        [{ label: '下次再来', sub: '', cost: '', id: 'ok' }], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },
  
  takeExam: (e) => {
    const G = AncientState.G;
    if (AncientActions.actionDone('takeExam')) {
      AncientModal.showToast('今年已经参加过科举了！');
      return;
    }
    AncientActions.markAction('takeExam');
    const rate = (Math.max(60, G.intel) - 60) / 40 * 0.65 + 0.1;
    const success = AncientSave.roll(rate);
    
    if (success) {
      const reward = 200 + Math.floor(Math.random() * 200);
      G.money += reward;
      G.totalMoney += reward;
      G.mood = AncientState.clamp(G.mood + 20);
      G.charm = AncientState.clamp(G.charm + 10);
      G.examPassed = true;
      G.job = 'officer';
      G.jobRank = 0;
      G.jobProf = 0;
      AncientSave.addLog(`🎉 科举高中！朝廷赐银 ${reward}文，入朝为官！`, 'good');
    } else {
      G.mood = AncientState.clamp(G.mood - 15);
      G.examRecommended = false;
      AncientSave.addLog(`😞 科举落榜，心灰意冷，来年再战。`, 'bad');
    }
    AncientSave.save();
    AncientRender.render();
  }
};

window.AncientSchool = AncientSchool;
