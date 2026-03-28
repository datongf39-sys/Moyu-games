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
        AncientSave.addLog(`🤒 染上了【${d.name}】，需要及时就医！`, 'bad');
      }
    }
    AncientState.G.diseases.forEach(d => {
      AncientState.G.health = AncientState.clamp(AncientState.G.health - d.healthPerYear);
      AncientState.G.mood   = AncientState.clamp(AncientState.G.mood   - d.moodPerYear);
      if (d.deathRisk > 0 && Math.random() < d.deathRisk){
        AncientState.G.dead = true; AncientState.G.deathCause = `因【${d.name}】不治，${AncientState.G.age}岁含恨离世。`;
      }
    });
  },

  openClinicTreatment: () => {
    if (!AncientState.G.diseases || AncientState.G.diseases.length === 0){
      AncientModal.showModal('⚕️ 身体无恙','你目前没有任何疾病，无需治疗。',
        [{label:'好的',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      return;
    }
    AncientModal.showModal('⚕️ 选择要治疗的疾病','你目前患有：',
      AncientState.G.diseases.map((d,i) => ({label:`${d.icon} ${d.name}（${['','轻症','中症','重症','危症'][d.level]}）`, sub:d.desc, cost:'', id:String(i)})),
      (id) => { AncientModal.closeModal(); AncientDiseases.openDoctorSelect(parseInt(id)); });
  },

  openDoctorSelect: (diseaseIdx) => {
    const d = AncientState.G.diseases[diseaseIdx]; if (!d) return;
    AncientModal.showModal(`⚕️ 治疗【${d.name}】`, `${d.desc}\n\n选择大夫（越贵成功率越高，最低成功率 1%，最低失败率 1%）：`,
      AncientDiseasesData.DOCTORS.filter(doc => AncientState.G.money >= doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}`,
        sub: '成功率约' + Math.round(Math.min(99, Math.max(1, (d.cureBase+doc.successBonus)*100))) + '%',
        cost: `🪙${doc.cost}文`, id: doc.id
      })).concat(AncientDiseasesData.DOCTORS.filter(doc => AncientState.G.money < doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}（钱不够）`, sub:'', cost:`🪙${doc.cost}文`, id:'_skip_'+doc.id
      }))),
      (id) => { AncientModal.closeModal(); if (id.startsWith('_skip_')) return; AncientDiseases.doTreatment(diseaseIdx, id); });
  },

  doTreatment: (diseaseIdx, docId) => {
    const d = AncientState.G.diseases[diseaseIdx]; const doc = AncientDiseasesData.DOCTORS.find(x => x.id === docId);
    if (!d || !doc) return;
    if (AncientState.G.money < doc.cost){ AncientModal.showToast('钱不够！'); return; }
    AncientModal.confirmSpend(doc.cost, `⚕️ 请【${doc.name}】治疗【${d.name}】`, () => {
      AncientState.G.money -= doc.cost;
      const successRate = Math.min(0.99, Math.max(0.01, d.cureBase + doc.successBonus));
      if (Math.random() < successRate){
        AncientState.G.diseases.splice(diseaseIdx, 1);
        const healBonus = 5 + doc.successBonus * 20;
        AncientState.G.health = AncientState.clamp(AncientState.G.health + healBonus);
        AncientSave.addLog(`✅ 【${doc.name}】妙手回春，治愈了【${d.name}】！健康+${Math.round(healBonus)}。`, 'good');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('✅ 治愈成功！', `${doc.emoji} ${doc.name}妙手回春！<br><br>【${d.name}】已痊愈。<br>健康+${Math.round(healBonus)}`,
          [{label:'多谢大夫',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      } else {
        const dmg = 3 + d.level;
        AncientState.G.health = AncientState.clamp(AncientState.G.health - dmg);
        AncientSave.addLog(`❌ 【${doc.name}】治疗【${d.name}】失败，病情未见好转，健康 -${dmg}。`, 'bad');
        AncientSave.save(); AncientRender.render();
        AncientModal.showModal('❌ 治疗未愈', `${doc.emoji} ${doc.name}开的方子未见成效。<br><br>【${d.name}】仍在缠绕。<br>健康 -${dmg}`,
          [{label:'再想办法',sub:'',cost:'',id:'ok'}], () => AncientModal.closeModal());
      }
    });
  }
};

window.AncientDiseases = AncientDiseases;
window.checkDisease = AncientDiseases.checkDisease;
window.openClinicTreatment = AncientDiseases.openClinicTreatment;
