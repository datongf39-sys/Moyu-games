const AncientEstate = {
  // 计算当前所有地产的总容量
  getTotalCapacity: () => {
    return (AncientState.G.estates||[]).reduce((sum, e) => sum + (e.capacity||0), 0);
  },
  
  // 计算当前已居住人数
  getCurrentResidents: () => {
    return (AncientState.G.estates||[]).reduce((sum, e) => sum + (e.residents||[]).length, 0);
  },
  
  // 检查是否还有空余容量
  hasAvailableCapacity: (additional=1) => {
    const totalCap = AncientEstate.getTotalCapacity();
    const current = AncientEstate.getCurrentResidents();
    return current + additional <= totalCap;
  },
  
  familyResidents: () => {
    const list = [{name:AncientState.G.name, label:`${AncientState.G.name}（本人）`, emoji:AncientState.G.emoji}];
    if (AncientState.G.married && AncientState.G.spouseName) list.push({name:AncientState.G.spouseName, label:`${AncientState.G.spouseName}（配偶）`, emoji:AncientState.G.spouseEmoji||'👤'});
    (AncientState.G.children||[]).forEach(c => list.push({name:c.name, label:`${c.name}（${c.gender==='male'?'子':'女'}·${c.age}岁）`, emoji:c.emoji}));
    (AncientState.G.concubines||[]).forEach(c => list.push({name:c.name, label:`${c.name}（${c.role==='concubine'?'妾室':'面首'}）`, emoji:c.emoji}));
    return list;
  },

  addToEstate: (estateIdx, residentName) => {
    const e = AncientState.G.estates[estateIdx]; if (!e) return;
    if (!e.residents) e.residents = [];
    if (e.residents.includes(residentName)){ AncientModal.showToast('此人已在此宅安居，无需重复安置！'); return; }
    if (e.residents.length >= e.capacity){ AncientModal.showToast('此宅已住满，无处再容！'); return; }
    AncientState.G.estates.forEach((oe,oi) => { if (oi!==estateIdx && oe.residents) oe.residents = oe.residents.filter(r => r!==residentName); });
    e.residents.push(residentName);
    AncientSave.save(); AncientRender.render();
  },

  removeFromEstate: (estateIdx, residentName) => {
    const e = AncientState.G.estates[estateIdx]; if (!e || !e.residents) return;
    e.residents = e.residents.filter(r => r !== residentName);
    AncientSave.save(); AncientRender.render();
  },

  buyEstate: (estateId) => {
    const tmpl = AncientEstates.ESTATES.find(e => e.id === estateId); if (!tmpl) return;
    if (AncientState.G.money < tmpl.price){ AncientModal.showToast('囊中羞涩，钱财不足以置产！'); return; }
    AncientModal.confirmSpend(tmpl.price, `${tmpl.icon} 购置【${tmpl.name}】\n可容 ${tmpl.capacity} 口`, () => {
      AncientState.G.money -= tmpl.price;
      if (!AncientState.G.estates) AncientState.G.estates = [];
      AncientState.G.estates.push({...tmpl, eid:'e_'+Date.now(), residents:[]});
      AncientSave.addLog(`🏠 购置【${tmpl.name}】，费银 ${tmpl.price}文，已纳入名下恒产。`, 'event');
      AncientSave.save();
      AncientModal.showModal('🏠 购置成功', `${tmpl.icon} <b>${tmpl.name}</b> 已登记造册，纳入名下恒产。`,
        [{label:'置产有道',sub:'',cost:'',id:'ok'}], () => { AncientModal.closeModal(); AncientRender.render(); });
    });
  },

  sellEstate: (idx) => {
    const e = AncientState.G.estates[idx]; if (!e) return;
    const hasMinor = AncientState.G.children.some(c => c.age<18 && (e.residents||[]).includes(c.name));
    if (hasMinor){ AncientModal.showToast('此宅尚有未成年子嗣居住，不可轻易售出！'); return; }
    const sellPrice = Math.floor(e.price * 0.6);
    AncientModal.showModal('🏠 确认售出', `将【${e.name}】以 ${sellPrice}文 售出？原价 ${e.price}文，今以六折回收，是否继续？`,
      [{label:`✅ 立契出售，得 ${sellPrice}文`,sub:'',cost:'',id:'yes'}],
      (id) => {
        AncientModal.closeModal();
        if (id==='yes'){
          AncientState.G.money += sellPrice; AncientState.G.estates.splice(idx, 1);
          AncientSave.addLog(`🏠 立契售出【${e.name}】，得银 ${sellPrice}文。`, 'info');
          AncientSave.save(); AncientRender.render();
        }
      });
  },
  
  // 检查某地产是否可以安置外室（不能有正室、妾室、子女）
  canPlaceLover: (estateIdx) => {
    const e = AncientState.G.estates[estateIdx]; if (!e) return false;
    const residents = e.residents || [];
    // 检查是否有正室
    if (AncientState.G.married && AncientState.G.spouseName && residents.includes(AncientState.G.spouseName)) return false;
    // 检查是否有妾室
    if (AncientState.G.concubines && AncientState.G.concubines.some(c => residents.includes(c.name))) return false;
    // 检查是否有子女
    if (AncientState.G.children && AncientState.G.children.some(c => residents.includes(c.name))) return false;
    return true;
  },
  
  // 检查地产是否可以安置某人（外室约束）
  canPlaceResident: (estateIdx, residentName, residentType) => {
    const e = AncientState.G.estates[estateIdx]; if (!e) return {can:false, reason:''};
    const isResidential = e.id !== 'farm' && e.id !== 'shop';
    if (!isResidential) return {can:false, reason:'此乃田庄商铺，非居所，不可安置人口'};
    
    const residents = e.residents || [];
    if (residentType === 'lover'){
      // 外室不能与正室、妾室、子女同住
      if (AncientState.G.married && AncientState.G.spouseName && residents.includes(AncientState.G.spouseName)){
        return {can:false, reason:'此宅已有正室居住，恐生事端'};
      }
      if (AncientState.G.concubines && AncientState.G.concubines.some(c => residents.includes(c.name))){
        return {can:false, reason:'此宅已有妾室居住，恐生是非'};
      }
      if (AncientState.G.children && AncientState.G.children.some(c => residents.includes(c.name))){
        return {can:false, reason:'此宅已有子女居住，恐惹闲话'};
      }
    }
    return {can:true, reason:''};
  },
  
  // 打开地产管理弹窗
  openManageModal: (idx) => {
    const e = AncientState.G.estates[idx]; if (!e) return;
    const residents = e.residents || [];
    const isResidential = e.id !== 'farm' && e.id !== 'shop';

    if (e.type === 'shop') {
      if (window.AncientTavernPlay) { AncientTavernPlay.openManageModal(idx); return; }
      // 降级：没有经营系统时只显示出售
      AncientModal.showModal(`${e.icon} 管理【${e.name}】`,
        `此乃<b>商铺</b>，非居所，不可留人入住。<br>年入：${e.incomePerYear||0}文`,
        [{label:'🏠 立契出售', sub:`得 ${Math.floor(e.price*0.6)}文`, cost:'', id:'sell', style:'red'}],
        (id) => { AncientModal.closeModal(); if (id==='sell') AncientEstate.sellEstate(idx); });
      return;
    }

    if (e.type === 'farm') {
      AncientModal.showModal(`${e.icon} 管理【${e.name}】`,
        `此乃<b>田庄</b>，非居所，不可留人入住。<br>年入：${e.incomePerYear||0}文`,
        [{label:'🏠 立契出售', sub:`得 ${Math.floor(e.price*0.6)}文`, cost:'', id:'sell', style:'red'}],
        (id) => { AncientModal.closeModal(); if (id==='sell') AncientEstate.sellEstate(idx); });
      return;
    }

    if (!isResidential) return;
    
    // 住宅类地产：显示出售和人员配置选项
    const opts = [
      {label:'🏠 立契出售', sub:`得 ${Math.floor(e.price*0.6)}文`, cost:'', id:'sell', style:'red'},
      {label:'👥 人员配置', sub:`宅中人口：${residents.length}/${e.capacity}口`, cost:'', id:'residents'}
    ];
    
    AncientModal.showModal(`${e.icon} 管理【${e.name}】`,
      `${e.desc}<br>可容 ${e.capacity} 口 ${e.incomePerYear>0?`<br>年入：${e.incomePerYear}文`:''}`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id==='sell') AncientEstate.sellEstate(idx);
        else if (id==='residents') AncientEstate.openResidentConfig(idx);
      });
  },
  
  // 打开人员配置界面
  openResidentConfig: (estateIdx) => {
    const e = AncientState.G.estates[estateIdx]; if (!e) return;
    const residents = e.residents || [];
    const familyMembers = AncientEstate.familyResidents();
    const availableMembers = familyMembers.filter(fm => !residents.includes(fm.name));
    
    const opts = [];
    // 显示当前入住人员（可移出）
    residents.forEach(r => {
      opts.push({label:`❌ 迁出 ${r}`, sub:'令其迁离此宅', cost:'', id:`remove_${r}`});
    });
    // 显示可入住人员
    availableMembers.forEach(fm => {
      if (residents.length < e.capacity){
        opts.push({label:`✅ 迁入 ${fm.label}`, sub:`尚余 ${e.capacity-residents.length} 处`, cost:'', id:`add_${fm.name}`});
      }
    });
    
    if (opts.length === 0){
      AncientModal.showToast('此宅已无可迁入或迁出之人！');
      return;
    }
    
    AncientModal.showModal(`👥 【${e.name}】宅中人口`,
      `现居 ${residents.length} 口，可容 ${e.capacity} 口`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id.startsWith('remove_')){
          const name = id.replace('remove_','');
          AncientEstate.removeFromEstate(estateIdx, name);
          setTimeout(() => AncientEstate.openManageModal(estateIdx), 300);
        } else if (id.startsWith('add_')){
          const name = id.replace('add_','');
          AncientEstate.addToEstate(estateIdx, name);
          setTimeout(() => AncientEstate.openManageModal(estateIdx), 300);
        }
      });
  }
};

window.AncientEstate = AncientEstate;
window.getTotalCapacity = AncientEstate.getTotalCapacity;
window.getCurrentResidents = AncientEstate.getCurrentResidents;
window.hasAvailableCapacity = AncientEstate.hasAvailableCapacity;
window.familyResidents = AncientEstate.familyResidents;
window.addToEstate = AncientEstate.addToEstate;
window.removeFromEstate = AncientEstate.removeFromEstate;
window.buyEstate = AncientEstate.buyEstate;
window.sellEstate = AncientEstate.sellEstate;
window.openEstateManageModal = AncientEstate.openManageModal;
window.canPlaceLover = AncientEstate.canPlaceLover;
window.canPlaceResident = AncientEstate.canPlaceResident;
