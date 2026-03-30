// ══════════════════════════════════════════════════════
//  school.js  —  学堂（文试）& 武馆（武试）系统
// ══════════════════════════════════════════════════════

// ── 武试对决数据 ─────────────────────────────────────────
const MILITARY_EXAM = {
  // 各级考试需赢的场数 / 总场数
  levels: [
    {level:1, name:'武童试', rounds:3, needWin:2, oppPower:[20,35]},
    {level:2, name:'武乡试', rounds:3, needWin:2, oppPower:[35,50]},
    {level:3, name:'武会试', rounds:3, needWin:2, oppPower:[50,65]},
    {level:4, name:'武殿试', rounds:5, needWin:3, oppPower:[65,85]},
  ],
  moves: [
    {id:'attack', name:'⚔️ 猛攻', desc:'强力进攻，伤害高但耗费体力'},
    {id:'defend', name:'🛡️ 防守', desc:'以逸待劳，消耗对手'},
    {id:'feint',  name:'🌀 虚晃', desc:'出奇制胜，克制猛攻'},
  ],
  // 克制关系：attack > defend > feint > attack
  // attack vs defend: 攻方+15
  // attack vs feint:  攻方-10（被克制）
  // defend vs feint:  守方+10
  // 相同：平局+0
};

// ══════════════════════════════════════════════════════
const AncientSchool = {

  // ── 学堂入退学 ────────────────────────────────────────
  toggleSchool: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.inSchool) {
      G.inSchool = false;
      AncientSave.addLog('📚 退出学堂，从此不再就读。', 'info');
      AncientModal.showResult(btn, '退学', 'info');
      AncientModal.showModal('📚 告别学堂', `当前文试进度：${AncientCivilData.CIVIL_LEVELS[G.civilExamLevel||0].name}`,
        [{label:'就此别过', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
    } else {
      // 家世免费规则：poor=无免费 normal=10岁前免费 rich=16岁前免费
      const freeAge = {poor:0, normal:10, rich:16}[G.familyBg] || 0;
      const isFree = freeAge > 0 && G.age < freeAge;
      const enroll = () => {
        G.inSchool = true;
        AncientSave.addLog(isFree ? '📖 家中出资供读，入读学堂，立志苦学。' : '📖 备妥束脩，正式入读学堂，立志苦学。', 'event');
        AncientModal.showResult(btn, '入学', 'good');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('📖 入读学堂',
          `寒窗苦读，方有出头之日。<br>${isFree?'家中供读，无需束脩。':'每年需缴束脩20文。'}<br>每年可于学堂备考，成绩积累后方可下场应试。`,
          [{label:'谨遵教诲，定当用功', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
      };
      if (!isFree && G.money < 20) { AncientModal.showToast('囊中羞涩，束脩尚缺 20 文，无力入学！'); return; }
      if (!isFree) { AncientModal.confirmSpend(20, '📖 备好束脩，叩门入学', () => { G.money -= 20; enroll(); AncientModal.closeModal(); }); return; }
      enroll();
    }
    AncientSave.save(); AncientRender.render();
  },

  // ── 武馆入退馆 ───────────────────────────────────────
  toggleWuguan: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (G.inWuguan) {
      G.inWuguan = false;
      AncientSave.addLog('🥋 退出武馆，不再习武。', 'info');
      AncientModal.showResult(btn, '退馆', 'info');
      AncientModal.showModal('🥋 告别武馆', `当前武试进度：${(G.militaryExamLevel||0) > 0 ? MILITARY_EXAM.levels[(G.militaryExamLevel||1)-1].name+'已过' : '未曾应试'}`,
        [{label:'就此别过', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
    } else {
      // 武馆家世免费规则同学堂
      const freeAge = {poor:0, normal:10, rich:16}[G.familyBg] || 0;
      const isFree = freeAge > 0 && G.age < freeAge;
      const enroll = () => {
        G.inWuguan = true;
        AncientSave.addLog(isFree ? '🥋 家中供资，入读武馆，立志习武强身。' : '🥋 缴纳束脩，入读武馆，立志习武强身。', 'event');
        AncientModal.showResult(btn, '入馆', 'good');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('🥋 入读武馆',
          `拳脚刀枪，勤练方成。<br>${isFree?'家中供资，无需束脩。':'每年需缴束脩20文。'}<br>每年可于武馆操练，积累实力后方可下场武试。`,
          [{label:'谨遵教头，勤加操练', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
      };
      if (!isFree && G.money < 20) { AncientModal.showToast('囊中羞涩，束脩尚缺 20 文！'); return; }
      if (!isFree) { AncientModal.confirmSpend(20, '🥋 缴纳束脩，入读武馆', () => { G.money -= 20; enroll(); AncientModal.closeModal(); }); return; }
      enroll();
    }
    AncientSave.save(); AncientRender.render();
  },

  // ── 学堂备考（每年一次） ──────────────────────────────
  studyAtSchool: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (!G.inSchool) { AncientModal.showToast('尚未入读学堂！'); return; }
    if (AncientActions.actionDone('studySchool')) { AncientModal.showToast('今年已在学堂备考过了！'); return; }
    AncientActions.markAction('studySchool');
    const gain = Math.floor(2 + (G.intel / 100) * 4 + Math.random() * 3);
    G.intel = AncientState.clamp(G.intel + gain);
    G.mood  = AncientState.clamp(G.mood - 3);
    AncientSave.addLog(`📖 学堂苦读一载，智识 +${gain}，略感疲惫。`, 'good');
    AncientModal.showResult(btn, `智识 +${gain}`, 'good');
    AncientSave.save();
    AncientModal.showModal('📖 学堂备考',
      `挑灯苦读，颇有所得。<br>智识 +${gain}，心情 -3<br><br>当前智识：${G.intel}`,
      [{label:'学无止境', sub:'', cost:'', id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  // ── 武馆操练（每年一次） ──────────────────────────────
  trainAtWuguan: (e) => {
    const btn = e && e.currentTarget;
    const G = AncientState.G;
    if (!G.inWuguan) { AncientModal.showToast('尚未入读武馆！'); return; }
    if (AncientActions.actionDone('trainWuguan')) { AncientModal.showToast('今年已在武馆操练过了！'); return; }
    AncientActions.markAction('trainWuguan');
    const gain = Math.floor(2 + (G.health / 100) * 4 + Math.random() * 3);
    G.health = AncientState.clamp(G.health + gain);
    G.mood   = AncientState.clamp(G.mood - 3);
    AncientSave.addLog(`🥋 武馆操练一载，体魄 +${gain}，略感疲累。`, 'good');
    AncientModal.showResult(btn, `体魄 +${gain}`, 'good');
    AncientSave.save();
    AncientModal.showModal('🥋 武馆操练',
      `挥汗如雨，身手渐长。<br>体魄 +${gain}，心情 -3<br><br>当前体魄：${G.health}`,
      [{label:'再接再厉', sub:'', cost:'', id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
  },

  // ══════════════════════════════════════════════════
  //  文试系统
  // ══════════════════════════════════════════════════

  openCivilExam: () => {
    const G = AncientState.G;
    const level = G.civilExamLevel || 0;
    if (level >= 6) { AncientModal.showToast('已金榜题名，无需再考！'); return; }
    if (AncientActions.actionDone('civilExam')) { AncientModal.showToast('今岁已下场应试，不可重复！'); return; }

    const nextLevel = AncientCivilData.CIVIL_LEVELS[level + 1];
    if (!nextLevel) return;

    // 智识门槛
    const intelReq = 20 + level * 10;
    if (G.intel < intelReq) {
      AncientModal.showModal('📜 尚未准备充分',
        `${nextLevel.name} 需要智识达到 ${intelReq}，<br>当前智识：${G.intel}，尚需继续苦读。`,
        [{label:'继续用功', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
      return;
    }

    if (level === 5) {
      // 殿试 → 写作流程
      AncientSchool._startEssayExam();
    } else {
      // 县试～会试 → 答题流程
      AncientSchool._startAnswerExam(level + 1);
    }
  },

  // ── 答题考试（县试到会试） ────────────────────────────
  _startAnswerExam: (examLevel) => {
    const G = AncientState.G;
    const levelInfo = AncientCivilData.CIVIL_LEVELS[examLevel];
    // 从题库随机抽5题（不重复）
    const pool = [...AncientCivilData.QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    const state = {questions: pool, current: 0, correct: 0, selected: null, multiSelected: []};
    AncientActions.markAction('civilExam');
    AncientSchool._showQuestion(examLevel, state, levelInfo);
  },

  _showQuestion: (examLevel, state, levelInfo) => {
    const q = state.questions[state.current];
    const isMulti = q.type === 'multi';
    if (!isMulti) state.selected = null;

    const opts = q.opts.map((opt, i) => {
      const isChosen = isMulti ? state.multiSelected.includes(i) : false;
      return {
        label: `${isChosen ? '✅ ' : ''}${['甲','乙','丙','丁'][i]}、${opt}`,
        sub:   isMulti ? (isChosen ? '已选（再点取消）' : '可多选') : '',
        cost:  '', id: String(i),
      };
    });
    if (isMulti) opts.push({
      label: `✅ 确认作答（已选${state.multiSelected.length}项）`,
      sub: '', cost: '', id: 'confirm',
    });

    AncientModal.showModal(
      `📜 ${levelInfo.name} — 第${state.current+1}/5题${isMulti?' 【多选】':''}`,
      `<b>${q.q}</b>`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (isMulti) {
          if (id === 'confirm') {
            const correctSet  = JSON.stringify(q.ans.slice().sort((a,b)=>a-b));
            const selectedSet = JSON.stringify(state.multiSelected.slice().sort((a,b)=>a-b));
            if (correctSet === selectedSet) state.correct++;
            AncientSchool._nextQuestion(examLevel, state, levelInfo);
          } else {
            const idx = parseInt(id);
            if (state.multiSelected.includes(idx)) {
              state.multiSelected = state.multiSelected.filter(x => x !== idx);
            } else {
              state.multiSelected.push(idx);
            }
            setTimeout(() => AncientSchool._showQuestion(examLevel, state, levelInfo), 100);
          }
        } else {
          state.selected = parseInt(id);
          if (state.selected === q.ans) state.correct++;
          AncientSchool._nextQuestion(examLevel, state, levelInfo);
        }
      }
    );
  },

  _nextQuestion: (examLevel, state, levelInfo) => {
    state.current++;
    if (state.current < state.questions.length) {
      setTimeout(() => AncientSchool._showQuestion(examLevel, state, levelInfo), 200);
    } else {
      AncientSchool._finishAnswerExam(examLevel, state, levelInfo);
    }
  },

  _finishAnswerExam: (examLevel, state, levelInfo) => {
    const G = AncientState.G;
    const passed = state.correct >= 3;
    if (passed) {
      G.civilExamLevel = examLevel;
      const titleStr = levelInfo.title ? `，荣获【${levelInfo.title}】功名` : '';
      G.mood = AncientState.clamp(G.mood + 15);
      G.money += 50 * examLevel;
      G.totalMoney += 50 * examLevel;
      AncientSave.addLog(`🎉 ${levelInfo.name}高中${titleStr}，答对 ${state.correct}/5 题！`, 'good');
      AncientModal.showModal('🎉 高中！',
        `${levelInfo.name}顺利通过！<br>答对：${state.correct} / 5 题${titleStr}<br><br>🪙 朝廷赐赏：+${50*examLevel} 文<br>😊 心情 +15${examLevel < 5 ? '<br><br>下一关：'+AncientCivilData.CIVIL_LEVELS[examLevel+1].name : '<br><br>下一关：殿试'}`,
        [{label:'金榜有名，扬眉吐气！', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      G.mood = AncientState.clamp(G.mood - 10);
      AncientSave.addLog(`😞 ${levelInfo.name}落第，答对 ${state.correct}/5 题，来年再图。`, 'bad');
      AncientModal.showModal('😞 落第',
        `${levelInfo.name}未能通过。<br>答对：${state.correct} / 5 题（需3题）<br><br>心情 -10，来年可再度下场。`,
        [{label:'来年再战', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
    }
    AncientSave.save();
  },

  // ── 殿试写作 ──────────────────────────────────────────
  _startEssayExam: () => {
    AncientActions.markAction('civilExam');
    // 随机抽1个主题
    const theme = AncientCivilData.ESSAY.themes[Math.floor(Math.random() * AncientCivilData.ESSAY.themes.length)];
    // 随机抽3个风格
    const styles = [...AncientCivilData.ESSAY.styles].sort(() => Math.random() - 0.5).slice(0, 3);
    // 随机抽3个内容角度
    const contents = [...AncientCivilData.ESSAY.contents].sort(() => Math.random() - 0.5).slice(0, 3);

    AncientModal.showModal('📜 殿试 — 钦点题目',
      `今岁殿试题目：<br><b>《${theme.name}》</b><br><i>${theme.desc}</i><br><br>请先择定文章风格：`,
      styles.map(s => ({label:s.name, sub:'', cost:'', id:s.id})),
      (styleId) => {
        AncientModal.closeModal();
        const chosenStyle = styles.find(s => s.id === styleId);
        setTimeout(() => {
          AncientModal.showModal('📜 殿试 — 文章内容',
            `题目：《${theme.name}》<br>风格：${chosenStyle.name}<br><br>再择文章主旨：`,
            contents.map(c => ({label:c.name, sub:'', cost:'', id:c.id})),
            (contentId) => {
              AncientModal.closeModal();
              const chosenContent = contents.find(c => c.id === contentId);
              AncientSchool._finishEssayExam(theme, chosenStyle, chosenContent);
            });
        }, 200);
      });
  },

  _finishEssayExam: (theme, style, content) => {
    const G = AncientState.G;
    const styleFit   = style.fit[theme.id]   || 60;
    const contentFit = content.fit[theme.id] || 60;
    const intelScore = Math.min(100, G.intel * 0.8 + Math.random() * 15);
    // 加权：风格契合度30% + 内容契合度30% + 智识40%
    const finalScore = Math.round(styleFit * 0.3 + contentFit * 0.3 + intelScore * 0.4);
    const passed = finalScore >= AncientCivilData.ESSAY.passScore;

    if (passed) {
      G.civilExamLevel = 6;
      G.examPassed = true;
      G.job = 'officer';
      G.jobRank = 0; G.jobProf = 0;
      const reward = 300 + Math.floor(Math.random() * 200);
      G.money += reward; G.totalMoney += reward;
      G.mood = AncientState.clamp(G.mood + 25);
      G.charm = AncientState.clamp(G.charm + 10);
      AncientSave.addLog(`🏆 殿试高中进士！风格：${style.name}，内容：${content.name}，得分${finalScore}，入朝为官！`, 'good');
      AncientModal.showModal('🏆 金榜题名！',
        `殿试高中，荣登进士！<br><br>风格：${style.name}（契合度 ${styleFit}）<br>主旨：${content.name}（契合度 ${contentFit}）<br>智识加成：${Math.round(intelScore)}<br><br>综合得分：<b style="font-size:20px;color:var(--amber)">${finalScore}</b> / 100（需80）<br><br>🪙 朝廷赐赏：+${reward} 文<br>😊 心情 +25`,
        [{label:'🎉 谢主隆恩，誓死效忠！', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      G.mood = AncientState.clamp(G.mood - 15);
      AncientSave.addLog(`😞 殿试落第，得分${finalScore}（需80），来年再战。`, 'bad');
      AncientModal.showModal('😞 殿试落第',
        `此番殿试，未能及第。<br><br>风格：${style.name}（契合度 ${styleFit}）<br>主旨：${content.name}（契合度 ${contentFit}）<br>智识加成：${Math.round(intelScore)}<br><br>综合得分：<b style="font-size:20px;color:var(--red)">${finalScore}</b> / 100（需80）<br><br>心情 -15，明年可再度下场。`,
        [{label:'来年必当高中！', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
    }
    AncientSave.save();
  },

  // ══════════════════════════════════════════════════
  //  武试系统
  // ══════════════════════════════════════════════════

  openMilitaryExam: () => {
    const G = AncientState.G;
    const level = G.militaryExamLevel || 0;
    if (level >= 4) { AncientModal.showToast('已武艺成名，无需再考！'); return; }
    if (AncientActions.actionDone('militaryExam')) { AncientModal.showToast('今岁已下场武试，不可重复！'); return; }

    const examData = MILITARY_EXAM.levels[level];
    const healthReq = 20 + level * 12;
    if (G.health < healthReq) {
      AncientModal.showModal('🥋 体魄尚弱',
        `${examData.name} 需要体魄达到 ${healthReq}，<br>当前体魄：${G.health}，尚需继续操练。`,
        [{label:'继续苦练', sub:'', cost:'', id:'ok'}], () => AncientModal.closeModal());
      return;
    }

    AncientActions.markAction('militaryExam');
    const oppPower = examData.oppPower[0] + Math.floor(Math.random() * (examData.oppPower[1] - examData.oppPower[0]));
    const battleState = {
      examLevel: level + 1,
      examData,
      oppPower,
      round: 1,
      totalRounds: examData.rounds,
      playerWins: 0,
      oppWins: 0,
      needWin: examData.needWin,
    };
    AncientSchool._showBattleRound(battleState);
  },

  _showBattleRound: (bs) => {
    const G = AncientState.G;
    // 如果胜负已分提前结束
    if (bs.playerWins >= bs.needWin || bs.oppWins >= bs.needWin || bs.round > bs.totalRounds) {
      AncientSchool._finishMilitaryExam(bs);
      return;
    }
    AncientModal.showModal(
      `⚔️ ${bs.examData.name} — 第${bs.round}/${bs.totalRounds}场`,
      `对手实力：${bs.oppPower}<br>当前：你 ${bs.playerWins}胜 / 对手 ${bs.oppWins}胜<br><br>选择出招：`,
      MILITARY_EXAM.moves.map(m => ({label:m.name, sub:m.desc, cost:'', id:m.id})),
      (moveId) => {
        AncientModal.closeModal();
        const playerMove = MILITARY_EXAM.moves.find(m => m.id === moveId);
        const oppMove    = MILITARY_EXAM.moves[Math.floor(Math.random() * MILITARY_EXAM.moves.length)];
        const playerPower = G.health * 0.6 + Math.random() * 30;
        const result = AncientSchool._calcBattle(moveId, oppMove.id, playerPower, bs.oppPower);
        if (result > 0) bs.playerWins++;
        else if (result < 0) bs.oppWins++;
        // 平局不计

        const resultText = result > 0 ? '你胜出这一场！' : result < 0 ? '对手胜出这一场。' : '势均力敌，平局！';
        setTimeout(() => {
          AncientModal.showModal(
            `⚔️ 第${bs.round}场结果`,
            `你出招：${playerMove.name}<br>对手出招：${oppMove.name}<br><br>${resultText}<br><br>当前：你 ${bs.playerWins}胜 / 对手 ${bs.oppWins}胜`,
            [{label:'继续', sub:'', cost:'', id:'next'}],
            () => {
              AncientModal.closeModal();
              bs.round++;
              setTimeout(() => AncientSchool._showBattleRound(bs), 200);
            });
        }, 200);
      });
  },

  _calcBattle: (playerMove, oppMove, playerPower, oppPower) => {
    // 克制关系加成
    let bonus = 0;
    if (playerMove === 'attack' && oppMove === 'defend')  bonus = +15;
    if (playerMove === 'attack' && oppMove === 'feint')   bonus = -10;
    if (playerMove === 'defend' && oppMove === 'feint')   bonus = +10;
    if (playerMove === 'defend' && oppMove === 'attack')  bonus = -15;
    if (playerMove === 'feint'  && oppMove === 'attack')  bonus = +10;
    if (playerMove === 'feint'  && oppMove === 'defend')  bonus = -10;
    const total = playerPower + bonus;
    if (total > oppPower + 5)  return 1;
    if (total < oppPower - 5)  return -1;
    return 0;
  },

  _finishMilitaryExam: (bs) => {
    const G = AncientState.G;
    const passed = bs.playerWins >= bs.needWin;
    if (passed) {
      G.militaryExamLevel = bs.examLevel;
      if (bs.examLevel >= 4) {
        G.militaryExamPassed = true;
        G.job = 'soldier';
        G.jobRank = 0; G.jobProf = 0;
        const reward = 200 + Math.floor(Math.random() * 150);
        G.money += reward; G.totalMoney += reward;
        G.mood = AncientState.clamp(G.mood + 20);
        AncientSave.addLog(`🏆 武殿试高中，授职入伍！赐赏 ${reward}文。`, 'good');
        AncientModal.showModal('🏆 武艺超群，授职入伍！',
          `武殿试顺利通过，授职入伍！<br><br>🪙 朝廷赐赏：+${reward} 文<br>😊 心情 +20`,
          [{label:'🎉 誓死报国！', sub:'', cost:'', id:'ok'}],
          () => { AncientModal.closeModal(); AncientRender.render(); });
      } else {
        G.mood = AncientState.clamp(G.mood + 12);
        const reward = 30 * bs.examLevel;
        G.money += reward; G.totalMoney += reward;
        AncientSave.addLog(`🎉 ${bs.examData.name}通过！赐赏 ${reward}文，晋级下一关。`, 'good');
        AncientModal.showModal(`🎉 ${bs.examData.name}通过！`,
          `你赢得 ${bs.playerWins}/${bs.totalRounds} 场<br><br>🪙 赐赏：+${reward} 文<br>😊 心情 +12<br><br>下一关：${MILITARY_EXAM.levels[bs.examLevel].name}`,
          [{label:'再接再厉！', sub:'', cost:'', id:'ok'}],
          () => { AncientModal.closeModal(); AncientRender.render(); });
      }
    } else {
      G.mood = AncientState.clamp(G.mood - 8);
      AncientSave.addLog(`😞 ${bs.examData.name}落败，赢${bs.playerWins}/${bs.totalRounds}场，来年再战。`, 'bad');
      AncientModal.showModal('😞 武试落败',
        `${bs.examData.name}未能通过。<br>赢得：${bs.playerWins} / ${bs.totalRounds} 场（需${bs.needWin}场）<br><br>心情 -8，来年可再度应试。`,
        [{label:'来年再战！', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
    }
    AncientSave.save();
  },

  // ── 兼容旧接口 ────────────────────────────────────────
  gradeFromScore: (score) => {
    if (score >= 92) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 48) return 'D';
    if (score >= 35) return 'E';
    return 'F';
  },
  selfStudy: (e) => AncientSchool.studyAtSchool(e),
  takeExam:  ()  => AncientSchool.openCivilExam(),
};

window.AncientSchool   = AncientSchool;
window.toggleSchool    = AncientSchool.toggleSchool;
window.toggleWuguan    = AncientSchool.toggleWuguan;
window.studyAtSchool   = AncientSchool.studyAtSchool;
window.trainAtWuguan   = AncientSchool.trainAtWuguan;
window.openCivilExam   = AncientSchool.openCivilExam;
window.openMilitaryExam = AncientSchool.openMilitaryExam;
window.selfStudy       = AncientSchool.selfStudy;
window.takeExam        = AncientSchool.takeExam;
