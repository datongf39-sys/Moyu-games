const AncientHealth = {
  exercise: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('exercise')){ AncientModal.showToast('今年已经锻炼过了！'); return; }
    if (AncientState.G.money < 5){ AncientModal.showToast('没有钱买补品练功！'); return; }
    AncientModal.confirmSpend(5, '🏃 购买补品强身健体', () => {
      AncientActions.markAction('exercise'); AncientState.G.money -= 5;
      if (AncientSave.roll(0.4 + (AncientState.G.health/100)*0.5)){
        const gain = 3 + Math.floor(Math.random()*4);
        AncientState.G.health = AncientState.clamp(AncientState.G.health + gain);
        AncientSave.addLog(`🏃 强身健体，健康+${gain}。`, 'good'); AncientModal.showResult(btn, `健康+${gain}`, 'good');
        AncientModal.showModal('🏃 锻炼有成', `健康+${gain}`,
          [{label:'甚好',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      } else {
        AncientSave.addLog(`😓 练功途中扭伤了腰。`, 'bad'); AncientModal.showResult(btn, '受伤了', 'bad');
        AncientModal.showModal('😓 扭伤','练功途中扭伤，白费功夫。',
          [{label:'唉',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      }
      AncientSave.save(); AncientRender.render();
    });
  },

  healSelf: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('healSelf')){ AncientModal.showToast('今年已经看过大夫了！'); return; }
    if (AncientState.G.money < 40){ AncientModal.showToast('没有足够的钱看大夫！'); return; }
    AncientModal.confirmSpend(40, '⚕️ 求医问药', () => {
      AncientActions.markAction('healSelf'); AncientState.G.money -= 40;
      if (AncientSave.roll(0.7)){
        const gain = 8 + Math.floor(Math.random()*8);
        AncientState.G.health = AncientState.clamp(AncientState.G.health + gain);
        AncientSave.addLog(`⚕️ 找药师看诊，健康+${gain}。`, 'good'); AncientModal.showResult(btn, `健康+${gain}`, 'good');
      } else {
        AncientSave.addLog(`😤 药师开的药方效果平平。`, 'bad'); AncientModal.showResult(btn, '效果一般', 'bad');
      }
      AncientSave.save(); AncientRender.render();
    });
  },

  meditate: (e) => {
    const btn = e && e.currentTarget;
    AncientActions.markAction('meditate');
    if (AncientSave.roll(0.6 + (AncientState.G.mood/100)*0.3)){
      const mg = 3 + Math.floor(Math.random()*5);
      const ig = Math.random() < 0.5 ? 1 : 0;
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood + mg); AncientState.G.intel = AncientState.clamp(AncientState.G.intel + ig);
      AncientSave.addLog(`🧘 静心打坐，心情+${mg}${ig>0?' 智识+'+ig:''}。`, 'good');
      AncientModal.showResult(btn, `心情+${mg}`, 'good'); AncientSave.save();
      AncientModal.showModal('🧘 心旷神怡', `心情+${mg}${ig>0?'<br>智识+'+ig:''}`,
        [{label:'身心俱泰',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      AncientSave.addLog(`🙄 坐立难安，修身养性失败。`, 'info');
      AncientModal.showResult(btn, '心神不定', 'info'); AncientSave.save();
      AncientModal.showModal('🙄 心神不宁','今日无缘静心。',
        [{label:'罢了',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },

  visitNeighbor: (e) => {
    const btn = e && e.currentTarget;
    AncientActions.markAction('visitNeighbor');
    if (AncientSave.roll(0.55 + (AncientState.G.charm/100)*0.35)){
      const mg = 2 + Math.floor(Math.random()*4);
      const cg = Math.floor(Math.random()*3);
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood + mg); AncientState.G.charm = AncientState.clamp(AncientState.G.charm + cg);
      AncientSave.addLog(`🍵 拜访邻里，心情+${mg}${cg>0?' 魅力+'+cg:''}。`, 'good');
      AncientModal.showResult(btn, `心情+${mg}`, 'good'); AncientSave.save();
      AncientModal.showModal('🍵 闲话家常', `心情+${mg}${cg>0?'<br>魅力+'+cg:''}`,
        [{label:'不错不错',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood - 3);
      AncientSave.addLog(`😒 邻里今日不在，扑了个空。`, 'info');
      AncientModal.showResult(btn, '扑空了', 'info'); AncientSave.save();
      AncientModal.showModal('😒 扑了个空','心情 -3',
        [{label:'下次',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  }
};

window.AncientHealth = AncientHealth;
window.exercise = AncientHealth.exercise;
window.healSelf = AncientHealth.healSelf;
window.meditate = AncientHealth.meditate;
window.visitNeighbor = AncientHealth.visitNeighbor;
