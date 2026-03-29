const AncientDiseases = {
  checkDisease: () => {
    if (!AncientState.G.diseases) AncientState.G.diseases = [];
    const riskBase = 0.06 + (1 - AncientState.G.health/100) * 0.14;
    if (Math.random() < riskBase && AncientState.G.diseases.length < 3){
      const existing = AncientState.G.diseases.map(d => d.id);
      const candidates = AncientDiseasesData.DISEASES.filter(d => !existing.includes(d.id));
      if (candidates.length > 0){
        const d = candidates[Math.floor(Math.random()*candidates.length)];
        AncientState.G.diseases.push({...d, turnsLeft: 2+d.level});
        AncientSave.addLog(`🤒 身染【${d.name}】，需早日延医问诊！`, 'bad');
      }
    }
    AncientState.G.diseases.forEach(d => {
      AncientState.G.health = AncientState.clamp(AncientState.G.health - d.healthPerYear);
      AncientState.G.mood   = AncientState.clamp(AncientState.G.mood   - d.moodPerYear);
      if (d.deathRisk > 0 && Math.random() < d.deathRisk){
        AncientState.G.dead = true; AncientState.G.deathCause = `因【${d.name}】久治不愈，于${AncientState.G.age}岁含恨离世，令人扼腕。`;
      }
    });
  },

  openClinicTreatment: () => {
    if (!AncientState.G.diseases || AncientState.G.diseases.length === 0){
      AncientModal.showModal('⚕️ 身体无恙','身体安泰，并无染恙，无需诊治。',
        [{label:'甚好',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      return;
    }
    AncientModal.showModal('⚕️ 择疾问诊','目下身患数症，请择一诊治：',
      AncientState.G.diseases.map((d,i) => ({label:`${d.icon} ${d.name}（${['','轻恙','中症','重症','危症'][d.level]}）`, sub:d.desc, cost:'', id:String(i)})),
      (id) => { AncientModal.closeModal(); AncientDiseases.openDoctorSelect(parseInt(id)); });
  },

  openDoctorSelect: (diseaseIdx) => {
    const d = AncientState.G.diseases[diseaseIdx]; if (!d) return;
    AncientModal.showModal(`⚕️ 延医治【${d.name}】`, `${d.desc}<br><br>延请坐堂大夫，诊金越丰则成效越高，然有术无术，天命尚在：`,
      AncientDiseasesData.DOCTORS.filter(doc => AncientState.G.money >= doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}`,
        sub: '约有'+Math.round(Math.min(99, Math.max(1, (d.cureBase+doc.successBonus)*100)))+'% 把握',
        cost: `🪙${doc.cost}文`, id: doc.id
      })).concat(AncientDiseasesData.DOCTORS.filter(doc => AncientState.G.money < doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}（诊金不足）`, sub:'', cost:`🪙${doc.cost}文`, id:'_skip_'+doc.id
      }))),
      (id) => { AncientModal.closeModal(); if (id.startsWith('_skip_')) return; AncientDiseases.doTreatment(diseaseIdx, id); });
  },

  doTreatment: (diseaseIdx, docId) => {
    const d = AncientState.G.diseases[diseaseIdx]; const doc = AncientDiseasesData.DOCTORS.find(x => x.id === docId);
    if (!d || !doc) return;
    if (AncientState.G.money < doc.cost){ AncientModal.showToast('诊金不足，无法延请此大夫！'); return; }
    AncientModal.confirmSpend(doc.cost, `⚕️ 延请【${doc.name}】诊治【${d.name}】`, () => {
      AncientState.G.money -= doc.cost;
      const successRate = Math.min(0.99, Math.max(0.01, d.cureBase + doc.successBonus));
      if (Math.random() < successRate){
        AncientState.G.diseases.splice(diseaseIdx, 1);
        const healBonus = 5 + doc.successBonus * 20;
        AncientState.G.health = AncientState.clamp(AncientState.G.health + healBonus);
        AncientSave.addLog(`✅ 【${doc.name}】妙手回春，【${d.name}】已愈！健康复增 +${Math.round(healBonus)}。`, 'good');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('✅ 妙手回春！', `${doc.emoji} ${doc.name}妙手回春！<br><br>已全然痊愈，身轻如燕。`,
          [{label:'大夫妙手，感激涕零',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      } else {
        const dmg = 3 + d.level;
        AncientState.G.health = AncientState.clamp(AncientState.G.health - dmg);
        AncientSave.addLog(`❌ 【${doc.name}】诊治无效，【${d.name}】未见起色，健康损耗 -${dmg}。`, 'bad');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('❌ 药石无灵', `${doc.emoji} ${doc.name}所开方子未见成效，病症仍缠身。<br><br>仍萦绕不去，令人忧虑。健康 -${dmg}`,
          [{label:'再寻良医',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      }
    });
  }
};

window.AncientDiseases = AncientDiseases;
window.checkDisease = AncientDiseases.checkDisease;
window.openClinicTreatment = AncientDiseases.openClinicTreatment;
