// School system
const AncientSchool = {
  toggleSchool: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.inSchool) {
      G.inSchool = false;
      AncientSave.addLog('📚 退出学堂，从此不再就读。', 'info');
      AncientModal.showResult(btn, '退学', 'info');
      AncientModal.showModal('📚 告别学堂', `当前成绩：${G.schoolGrade || 'F'}`,
        [{ label: '就此别过', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
    } else {
      const bg = AncientFamilyData.FAMILY_BG[G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
      const isFree = bg.freeSchoolAge > 0 && G.age < bg.freeSchoolAge;
      const needPay = !isFree;
      if (needPay && G.money < 20) {
        AncientModal.showToast('囊中羞涩，束脩尚缺 20 文，无力入学！');
        return;
      }
      if (needPay) {
        AncientModal.confirmSpend(20, '📖 备好束脩，叩门入学', () => {
          G.money -= 20;
          G.inSchool = true;
          AncientSave.addLog('📖 备妥束脩，正式入读学堂，立志苦学。', 'event');
          AncientModal.showResult(btn, '入学', 'good');
          AncientSave.save();
          AncientRender.render();
          AncientModal.closeModal();
        });
        return;
      }
      G.inSchool = true;
      AncientSave.addLog('📖 家中出资供读，蒙恩入堂，当思感恩发奋。', 'event');
      AncientModal.showResult(btn, '入学', 'good');
      AncientModal.showModal('📖 入读学堂', '家中供你读书，束脩已备妥。每年执笔应考可精进成绩，望你勤勉向学。',
        [{ label: '谨遵教诲，定当用功', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
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
      { id: 'safe', label: '🖌️ 中规中矩，四平八稳', sub: '持重稳健，鲜有闪失', scoreMod: 0 },
      { id: 'bold', label: '⚡ 大胆立意，文采斐然', sub: '若立意出众则名列前茅，若把握不稳则一落千丈', scoreMod: 20 },
      { id: 'copy', label: '📋 引经据典，旁征博引', sub: '智识须深厚，方能运用自如，成绩稳健', scoreMod: -5 }
    ];
    AncientModal.showModal(`✍️ 执笔应考`, `今岁题目：《${prompt.title}》<br>${prompt.desc}<br><br>当前成绩：${G.schoolGrade || 'F'} · 智识：${G.intel}`,
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
    AncientSave.addLog(`✍️ 《${prompt.title}》应考归来，得${newGrade}等。${gradeInfo.desc} ${changeStr}`, 'info');
    
    let recMsg = '';
    if ((newGrade === 'A' || newGrade === 'S') && !G.examRecommended && !G.examPassed) {
      if (Math.random() < (newGrade === 'S' ? 0.85 : 0.5)) {
        G.examRecommended = true;
        recMsg = '<br><br>🌟 先生见你文章超群，力荐你下场一试！';
        AncientSave.addLog('🌟 先生见你文章出众，特荐你下场科举！科举入口已解锁。', 'event');
      }
    }
    
    AncientSave.save();
    AncientRender.render();
    AncientModal.showModal('📜 考试结果',
      `今岁题目：《${prompt.title}》<br>文章得分：${Math.round(finalScore)} 分<br>成绩：<span style="color:${gradeInfo.color};font-size:18px;font-weight:700">${newGrade}</span><br>${gradeInfo.desc}<br>${changeStr}<br>博览有益，智识 +${gradeInfo.intelBonus}${recMsg}`,
      [{ label: '✅ 铭记于心', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
  },
  
  selfStudy: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.mood < 20) {
      AncientModal.showToast('心神俱疲，无从静心苦读！');
      return;
    }
    AncientActions.markAction('selfStudy');
    const success = AncientSave.roll(0.5 + (G.intel / 100) * 0.4);
    if (success) {
      const gain = 2 + Math.floor(Math.random() * 3);
      G.intel = AncientState.clamp(G.intel + gain);
      G.mood = AncientState.clamp(G.mood - 5);
      AncientSave.addLog(`📜 挑灯夜读，苦思有得，智识 +${gain}，略感疲惫。`, 'good');
      AncientModal.showResult(btn, `智识 +${gain}`, 'good');
      AncientSave.save();
      AncientModal.showModal('📜 挑灯苦读', `挑灯夜读，有所精进。<br>智识 +${gain}，然心情略减 -5。`,
        [{ label: '学无止境', sub: '', cost: '', id: 'ok' }], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      G.mood = AncientState.clamp(G.mood - 8);
      AncientSave.addLog(`😞 苦读半日，脑中一片混沌，毫无所得。`, 'bad');
      AncientModal.showResult(btn, '苦读无获', 'bad');
      AncientSave.save();
      AncientModal.showModal('😞 苦读无获', '枯坐半日，一无所获，心情受损 -8。',
        [{ label: '来日再战', sub: '', cost: '', id: 'ok' }], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },
  
  takeExam: (e) => {
    const G = AncientState.G;
    if (AncientActions.actionDone('takeExam')) {
      AncientModal.showToast('今岁已下场应试，不可重复！');
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
      AncientSave.addLog(`😞 科举落第，名落孙山，心灰意冷，来年再图东山再起。`, 'bad');
    }
    AncientSave.save();
    AncientRender.render();
  }
};

window.AncientSchool = AncientSchool;
