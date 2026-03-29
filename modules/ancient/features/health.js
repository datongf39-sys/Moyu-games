const AncientHealth = {
  exercise: (e) => {
    const btn = e && e.currentTarget;
    if (AncientActions.actionDone('exercise')){ AncientModal.showToast('今岁已操练过一回，不可再劳！'); return; }
    if (AncientState.G.money < 5){ AncientModal.showToast('囊中无钱，无力置办补品练功！'); return; }
    AncientModal.confirmSpend(5, '🏃 置办补品，强身健体', () => {
      AncientActions.markAction('exercise'); AncientState.G.money -= 5;
      if (AncientSave.roll(0.4 + (AncientState.G.health/100)*0.5)){
        const gain = 3 + Math.floor(Math.random()*4);
        AncientState.G.health = AncientState.clamp(AncientState.G.health + gain);
        AncientSave.addLog(`🏃 操练有成，身强体健，健康+${gain}。`, 'good'); AncientModal.showResult(btn, `健康+${gain}`, 'good');
        AncientModal.showModal('🏃 操练有成', `健康+${gain}`,
          [{label:'身轻体健',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      } else {
        AncientSave.addLog(`😓 练功途中用力过猛，扭伤腰背，白费功夫。`, 'bad'); AncientModal.showResult(btn, '受伤了', 'bad');
        AncientModal.showModal('😓 练功受伤','练功不得法，扭伤腰背，空耗气力。',
          [{label:'唉',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
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
      AncientSave.addLog(`🧘 静心调息，心旷神怡，心情+${mg}${ig>0?'，智识有所精进+'+ig:''}。`, 'good');
      AncientModal.showResult(btn, `心情+${mg}`, 'good'); AncientSave.save();
      AncientModal.showModal('🧘 调息有成', `心情+${mg}${ig>0?'<br>智识+'+ig:''}`,
        [{label:'神清气爽',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      AncientSave.addLog(`🙄 心猿意马，坐立难安，调息无成。`, 'info');
      AncientModal.showResult(btn, '心神不定', 'info'); AncientSave.save();
      AncientModal.showModal('🙄 心猿意马','今日心绪纷乱，无缘入静。',
        [{label:'就此作罢',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  },

  visitNeighbor: (e) => {
    const btn = e && e.currentTarget;
    AncientActions.markAction('visitNeighbor');
    if (AncientSave.roll(0.55 + (AncientState.G.charm/100)*0.35)){
      const mg = 2 + Math.floor(Math.random()*4);
      const cg = Math.floor(Math.random()*3);
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood + mg); AncientState.G.charm = AncientState.clamp(AncientState.G.charm + cg);
      AncientSave.addLog(`🍵 登门拜访邻里，言笑晏晏，心情+${mg}${cg>0?'，谈吐间魅力见长+'+cg:''}。`, 'good');
      AncientModal.showResult(btn, `心情+${mg}`, 'good'); AncientSave.save();
      AncientModal.showModal('🍵 邻里叙旧', `心情+${mg}${cg>0?'<br>魅力+'+cg:''}`,
        [{label:'邻里和睦',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    } else {
      AncientState.G.mood = AncientState.clamp(AncientState.G.mood - 3);
      AncientSave.addLog(`😒 登门拜访，邻里今日不在，白跑一趟。`, 'info');
      AncientModal.showResult(btn, '扑空了', 'info'); AncientSave.save();
      AncientModal.showModal('😒 吃了个闭门羹','扑空而归，心情 -3。',
        [{label:'改日再登门',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    }
  }
};

window.AncientHealth = AncientHealth;
window.exercise = AncientHealth.exercise;
window.meditate = AncientHealth.meditate;
window.visitNeighbor = AncientHealth.visitNeighbor;
