const AncientInherit = {
  // 显示立遗嘱弹窗
  makeWill: () => {
    const G = AncientState.G;
    
    // 收集所有子嗣（含私生子）
    const allChildren = [];
    
    // 正妻和妾室的子女
    if (G.children && G.children.length > 0) {
      G.children.forEach((c, idx) => {
        allChildren.push({
          name: c.name,
          gender: c.gender,
          age: c.age,
          emoji: c.emoji,
          type: c.motherType || 'spouse',
          index: idx,
          isIllegitimate: false
        });
      });
    }
    
    // 私生子
    if (G.illegitimateChildren && G.illegitimateChildren.length > 0) {
      G.illegitimateChildren.forEach((c, idx) => {
        allChildren.push({
          name: c.name,
          gender: c.gender,
          age: c.age,
          emoji: c.emoji,
          type: 'lover',
          index: idx,
          isIllegitimate: true
        });
      });
    }
    
    // 没有子嗣
    if (allChildren.length === 0) {
      AncientModal.showModal('📜 托付家业',
        '膝下尚无子嗣，家业无人可托，<br>这字据……暂时还用不上。',
        [{label:'↩ 搁笔作罢', sub:'', cost:'', id:'ok'}],
        () => AncientModal.closeModal()
      );
      return;
    }
    
    // 已有继承人，先确认是否更换
    const will = G.will;
    if (will) {
      AncientModal.showModal('📜 托付家业',
        `字据已立，${will.heirName} 为现任继承人。<br><br>是否要更换？`,
        [
          {label:'✅ 重新择定', sub:'', cost:'', id:'change'},
          {label:'↩ 维持原样', sub:'', cost:'', id:'cancel'}
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'cancel') return;
          // 继续选择继承人流程
          showSelectModal();
        }
      );
    } else {
      // 没有继承人，直接选择
      showSelectModal();
    }
    
    // 显示选择继承人弹窗
    function showSelectModal() {
      // 构建选项
      const opts = allChildren.map(child => ({
        label: child.name,
        sub: `${child.gender==='male'?'子':'女'} · ${child.age}岁 ${child.isIllegitimate?'（私生）':''}`,
        cost: '',
        id: `heir_${child.index}_${child.isIllegitimate?'illegitimate':'legitimate'}`
      }));
      
      AncientModal.showModal('📜 托付家业',
        '人生无常，百年之后家业总需有人承继。<br>择一子嗣，立下字据，<br>待那一日到来，也算有所交代。',
        [
          ...opts,
          {label:'↩ 暂且搁置', sub:'', cost:'', id:'cancel'}
        ],
        (id) => {
          if (id === 'cancel') {
            AncientModal.closeModal();
            return;
          }
          
          const parts = id.split('_');
          const childIndex = parseInt(parts[1]);
          const isIllegitimate = parts[2] === 'illegitimate';
          const sourceArray = isIllegitimate ? G.illegitimateChildren : G.children;
          const selectedChild = sourceArray[childIndex];
          
          if (selectedChild) {
            const oldHeirName = will ? will.heirName : null;
            
            // 保存遗嘱
            G.will = {
              heirName: selectedChild.name,
              heirType: isIllegitimate ? 'illegitimate' : (selectedChild.motherType || 'spouse'),
              heirGender: selectedChild.gender,
              heirEmoji: selectedChild.emoji
            };
            
            if (oldHeirName) {
              // 更换继承人
              AncientSave.addLog(`📜 更换字据，由 ${selectedChild.name} 取代 ${oldHeirName} 承继家业。`, 'event');
              AncientModal.showModal('📜 字据已立',
                `墨迹落定，字据已改。<br><br>${selectedChild.name} 已被立为新的继承人，<br>待百年之后，钱财地产皆归其所有。<br><br>但愿那一日来得晚些。`,
                [{label:'但愿如此', sub:'', cost:'', id:'ok'}],
                () => AncientModal.closeModal()
              );
            } else {
              // 首次立遗嘱
              AncientSave.addLog(`📜 立下字据，百年之后由 ${selectedChild.name} 承继家业。`, 'event');
              AncientModal.showModal('📜 字据已立',
                `墨迹落定，字据已成。<br><br>${selectedChild.name} 已被立为继承人，<br>待百年之后，钱财地产皆归其所有。<br><br>但愿那一日来得晚些。`,
                [{label:'但愿如此', sub:'', cost:'', id:'ok'}],
                () => AncientModal.closeModal()
              );
            }
            AncientSave.save();
          }
        }
      );
    }
  },

  // 执行继承（死亡后自动调用）
  executeInheritance: () => {
    const G = AncientState.G;
    const will = G.will;
    
    let heir = null;
    let heirSource = '';
    
    // 有遗嘱，按遗嘱继承
    if (will) {
      if (will.heirType === 'illegitimate') {
        heir = G.illegitimateChildren.find(c => c.name === will.heirName);
        heirSource = 'illegitimate';
      } else {
        heir = G.children.find(c => c.name === will.heirName);
        heirSource = 'legitimate';
      }
    } 
    // 无遗嘱，找年龄最大的子嗣
    else {
      // 先找合法子女中年龄最大的
      if (G.children && G.children.length > 0) {
        heir = G.children.reduce((oldest, c) => c.age > oldest.age ? c : oldest, G.children[0]);
        heirSource = 'legitimate';
      }
      // 没有合法子女，找私生子中年龄最大的
      else if (G.illegitimateChildren && G.illegitimateChildren.length > 0) {
        heir = G.illegitimateChildren.reduce((oldest, c) => c.age > oldest.age ? c : oldest, G.illegitimateChildren[0]);
        heirSource = 'illegitimate';
      }
    }
    
    // 有继承人
    if (heir) {
      const prev = {
        name: G.name,
        emoji: G.emoji,
        age: G.age,
        money: G.money,
        estates: G.estates
      };
      
      const newAncestors = [...(G.ancestors || []), {
        name: G.name,
        emoji: G.emoji,
        age: G.age,
        rel: '先祖'
      }];
      
      // 继承所有钱财和地产
      const inheritMoney = G.money;
      const inheritEstates = G.estates.map(e => ({...e}));
      
      // 子嗣本身的钱财 + 继承来的钱财
      const heirOwnMoney = heir.money || 0;
      const totalMoney = inheritMoney + heirOwnMoney;
      
      // 初始化新游戏
      AncientState.initGame(prev);
      
      // 设置继承人信息
      AncientState.G.name = heir.name;
      AncientState.G.given = heir.name.slice(1);
      AncientState.G.surname = heir.name[0];
      AncientState.G.gender = heir.gender;
      AncientState.G.emoji = heir.emoji;
      AncientState.G.age = heir.age;
      AncientState.G.money = totalMoney + 50;  // 额外给 50 文起步
      AncientState.G.estates = inheritEstates;
      AncientState.G.ancestors = newAncestors;
      AncientState.G.log = [];
      // 继承子嗣的职业、智识等属性
      AncientState.G.job = heir.job || 'none';
      AncientState.G.jobRank = heir.jobRank || 0;
      AncientState.G.jobProf = heir.jobProf || 0;
      AncientState.G.intelligence = heir.intelligence || 0;
      
      const willText = will ? '依遗嘱' : '按长幼';
      AncientSave.addLog(`🌅 ${willText}承继 ${newAncestors[newAncestors.length-1].name} 之遗志，${heir.name} 开始书写自己的人生。<br><br>继承钱财：🪙${inheritMoney} 文<br>子女自有：🪙${heirOwnMoney} 文<br>总计：🪙${totalMoney + 50} 文<br>继承地产：${inheritEstates.length}处`, 'event');
      
      AncientSave.save();
      AncientRender.render();
      return true;
    }
    
    // 无继承人，重新生成角色（不继承）
    return false;
  },

  // 重新来过（主动死亡）
  restartLife: () => {
    const G = AncientState.G;
    
    AncientModal.confirm('⚠️ 此生已矣',
      '此举无可挽回，一旦为之，<br>这一世的悲欢离合便就此落幕。<br><br>若膝下有子嗣，可由其承继家业，<br>延续这一脉的香火；<br>若无，则一切归零，重头再来。<br><br>当真要如此？',
      () => {
        AncientModal.closeModal();
        
        // 标记死亡
        G.dead = true;
        G.deathCause = '重新来过';
        
        // 显示讣告界面，让玩家选择继承人
        AncientSave.save();
        if (window.AncientRender) {
          window.AncientRender.renderObituary();
        }
      }
    );
  },

  // 继承函数（从讣告界面点击子嗣时调用）
  inheritChild: (idx) => {
    const G = AncientState.G;
    const selectedHeir = G.children[idx];
    
    if (!selectedHeir || selectedHeir.age < 18){ 
      AncientModal.showToast('此子尚未及冠，不可托付家业！'); 
      return; 
    }
    
    const prev = {
      name: G.name, 
      emoji: G.emoji, 
      age: G.age, 
      money: G.money,
      estates: G.estates
    };
    
    const newAncestors = [
      ...G.ancestors, 
      {name: G.name, emoji: G.emoji, age: G.age, rel: '先祖'}
    ];
    
    // 检查是否有遗嘱
    const will = G.will;
    let inheritMoney = 0;
    let moneyText = '';
    let moneyHeirName = '';
    let hasInheritance = G.money > 0 || (G.estates && G.estates.length > 0);
    
    if (will) {
      // 有遗嘱：钱财归遗嘱指定的子嗣
      const moneyHeir = G.children.find(c => c.name === will.heirName);
      moneyHeirName = will.heirName;
      
      if (moneyHeir && moneyHeir !== selectedHeir) {
        // 继承人不是钱财继承人
        inheritMoney = 0;
        moneyText = `<br><br>💰 钱财归属：${will.heirEmoji} ${will.heirName}（依字据）<br>🏠 地产归属：${selectedHeir.emoji} ${selectedHeir.name}（你选定）`;
      } else {
        // 继承人就是钱财继承人，全拿
        inheritMoney = G.money;
      }
    } else {
      // 无遗嘱：钱财归年龄最大的子嗣
      const eldestChild = G.children.reduce((oldest, c) => c.age > oldest.age ? c : oldest, G.children[0]);
      moneyHeirName = eldestChild.name;
      
      if (eldestChild !== selectedHeir) {
        // 继承人不是最年长的子嗣
        inheritMoney = 0;
        moneyText = `<br><br>💰 钱财归属：${eldestChild.emoji} ${eldestChild.name}（最年长）<br>🏠 地产归属：${selectedHeir.emoji} ${selectedHeir.name}（你选定）`;
      } else {
        // 继承人就是最年长的子嗣，全拿
        inheritMoney = G.money;
      }
    }
    
    // 继承地产
    const inheritEstates = G.estates.map(e => ({...e}));
    
    AncientState.initGame(prev);
    AncientState.G.name = selectedHeir.name;
    AncientState.G.given = selectedHeir.name.slice(1);
    AncientState.G.surname = selectedHeir.name[0];
    AncientState.G.gender = selectedHeir.gender;
    AncientState.G.emoji = selectedHeir.emoji;
    AncientState.G.age = selectedHeir.age;
    AncientState.G.money = inheritMoney + 50;  // 额外给 50 文起步
    AncientState.G.estates = inheritEstates;
    AncientState.G.ancestors = newAncestors;
    AncientState.G.log = [];
    
    // 继承子嗣本身的职业、智识等属性
    AncientState.G.job = selectedHeir.job || 'none';
    AncientState.G.jobRank = selectedHeir.jobRank || 0;
    AncientState.G.jobProf = selectedHeir.jobProf || 0;
    AncientState.G.intelligence = selectedHeir.intelligence || 0;
    
    let willText = '';
    if (will) {
      willText = inheritMoney > 0 ? '依字据承继' : '承继';
    } else {
      willText = inheritMoney > 0 ? '承继（最年长）' : '承继';
    }
    
    AncientSave.addLog(`🌅 ${willText} ${newAncestors[newAncestors.length-1].name} 之遗志，${selectedHeir.name} 开始书写自己的人生。`, 'event');
    
    // 保存后显示继承弹窗
    AncientSave.save();
    
    // 构建地产列表
    let estateList = '';
    if (inheritEstates && inheritEstates.length > 0) {
      estateList = inheritEstates.map(e => `  🏠 ${e.name}`).join('<br>');
    }
    
    // 根据情况显示不同弹窗
    if (hasInheritance) {
      if (will) {
        // 情况一：有字据且有遗产
        AncientModal.showModal('🕯️ 音容宛在，家业有托',
          `${prev.name} 已于 ${prev.age} 岁驾鹤西归。<br><br>临终所立字据，今日兑现——<br>${selectedHeir.name} 依字据承继了家业：<br><br>  🪙 钱财：${inheritMoney} 文${estateList ? '<br>' + estateList : ''}<br><br>${prev.name} 的期许，且记在心里。`,
          [{label:'承先人遗志，自此启程', sub:'', cost:'', id:'ok'}],
          () => {
            AncientModal.closeModal();
            AncientRender.render();
          }
        );
      } else {
        // 情况二：无字据但有遗产
        AncientModal.showModal('🕯️ 斯人已逝，后继有人',
          `${prev.name} 已于 ${prev.age} 岁撒手人寰。<br><br>身后留下的家业，<br>如今落入了你的手中：<br><br>  🪙 钱财：${inheritMoney} 文${estateList ? '<br>' + estateList : ''}<br><br>往后的路，只能靠自己走了。`,
          [{label:'挑起这副担子', sub:'', cost:'', id:'ok'}],
          () => {
            AncientModal.closeModal();
            AncientRender.render();
          }
        );
      }
    } else {
      // 情况三：无遗产可继承
      AncientModal.showModal('🕯️ 斯人已逝',
        `${prev.name} 已于 ${prev.age} 岁撒手人寰。<br><br>身后未留下什么，<br>只有这条命。<br><br>往后的路，从头开始。`,
        [{label:'白手起家，再创一番', sub:'', cost:'', id:'ok'}],
        () => {
          AncientModal.closeModal();
          AncientRender.render();
        }
      );
    }
  }
};

window.AncientInherit = AncientInherit;
window.inheritChild = AncientInherit.inheritChild;
window.makeWill = AncientInherit.makeWill;
window.restartLife = AncientInherit.restartLife;
