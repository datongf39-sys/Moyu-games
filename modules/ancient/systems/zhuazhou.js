// 抓周系统逻辑
const AncientZhuazhou = {
  // 随机抽取 3 件物品
  getRandomItems: () => {
    const items = [...AncientZhuazhouData.ITEMS];
    const selected = [];
    for (let i = 0; i < 3 && items.length > 0; i++) {
      const idx = Math.floor(Math.random() * items.length);
      selected.push(items[idx]);
      items.splice(idx, 1);
    }
    return selected;
  },

  // 获取家世对应的开场文案
  getFamilyIntro: (familyBg) => {
    const intros = AncientZhuazhouData.FAMILY_INTRO[familyBg] || AncientZhuazhouData.FAMILY_INTRO.normal;
    return intros[Math.floor(Math.random() * intros.length)];
  },

  // 应用物品效果
  applyEffect: (item) => {
    const G = AncientState.G;
    const effects = [];
    
    if (item.statBonus) {
      if (item.statBonus.health) {
        G.health = AncientState.clamp(G.health + item.statBonus.health);
        effects.push(`健康 +${item.statBonus.health}`);
      }
      if (item.statBonus.intel) {
        G.intel = AncientState.clamp(G.intel + item.statBonus.intel);
        effects.push(`智识 +${item.statBonus.intel}`);
      }
      if (item.statBonus.charm) {
        G.charm = AncientState.clamp(G.charm + item.statBonus.charm);
        effects.push(`魅力 +${item.statBonus.charm}`);
      }
      if (item.statBonus.mood) {
        G.mood = AncientState.clamp(G.mood + item.statBonus.mood);
        effects.push(`心情 +${item.statBonus.mood}`);
      }
    }
    
    return effects;
  },

  // 显示抓周物品选择界面
  showZhuazhou: () => {
    const G = AncientState.G;
    const items = AncientZhuazhou.getRandomItems();
    const intro = AncientZhuazhou.getFamilyIntro(G.familyBg);

    // 构建物品选项
    const itemOpts = items.map((item, idx) => ({
      label: `${item.icon} ${item.name}`,
      sub: item.desc,
      cost: '',
      id: `item_${idx}`
    }));

    AncientModal.showModal('🎋 抓周',
      `你满一岁了。<br><br>${intro}<br><br>你会选择哪件物品呢？`,
      itemOpts,
      (id) => {
        const idx = parseInt(id.split('_')[1]);
        const selectedItem = items[idx];
        AncientZhuazhou.finishZhuazhou(selectedItem);
      }
    );
  },

  // 完成抓周，应用效果
  finishZhuazhou: (item) => {
    const G = AncientState.G;
    
    // 应用效果
    const effects = AncientZhuazhou.applyEffect(item);
    const effectsText = effects.length > 0 ? `<br><br>效果：${effects.join('，')}` : '';

    // 标记已抓周
    G.hasZhuazhou = true;

    // 记录日志
    AncientSave.addLog(`🎋 抓周抓了${item.name}，${effectsText ? '获赐福泽' : '平安喜乐'。}`, 'event');

    // 显示结果
    AncientModal.showModal(`${item.icon} 抓周结果`,
      `${item.selectText}<br><br>${item.reactionText}${effectsText}`,
      [{ label: '🎊 多谢长辈吉言', sub: '', cost: '', id: 'ok' }],
      () => {
        AncientModal.closeModal();
        AncientSave.save();
        AncientRender.render();
      }
    );
  },

  // 检测是否触发抓周
  checkZhuazhou: () => {
    const G = AncientState.G;
    if (G.age === 1 && !G.hasZhuazhou) {
      AncientZhuazhou.showZhuazhou();
    }
  }
};

window.AncientZhuazhou = AncientZhuazhou;
window.checkZhuazhou = AncientZhuazhou.checkZhuazhou;
