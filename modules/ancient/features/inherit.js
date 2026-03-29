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
      AncientModal.showModal('📜 立遗嘱',
        '膝下尚无子嗣，没必要立遗嘱。',
        [{label:'知道了', sub:'', cost:'', id:'ok'}],
        () => AncientModal.closeModal()
      );
      return;
    }
    
    // 构建选项
    const opts = allChildren.map(child => ({
      label: `${child.emoji} ${child.name}`,
      sub: `${child.gender==='male'?'子':'女'} · ${child.age}岁 ${child.isIllegitimate?'（私生）':''}`,
      cost: '',
      id: `heir_${child.index}_${child.isIllegitimate?'illegitimate':'legitimate'}`
    }));
    
    AncientModal.showModal('📜 立遗嘱',
      '择一子嗣为继承人，待百年之后，家业有所托付。<br><br>可选子嗣：',
      opts,
      (id) => {
        AncientModal.closeModal();
        const parts = id.split('_');
        const childIndex = parseInt(parts[1]);
        const isIllegitimate = parts[2] === 'illegitimate';
        const sourceArray = isIllegitimate ? G.illegitimateChildren : G.children;
        const selectedChild = sourceArray[childIndex];
        
        if (selectedChild) {
          // 保存遗嘱
          G.will = {
            heirName: selectedChild.name,
            heirType: isIllegitimate ? 'illegitimate' : (selectedChild.motherType || 'spouse'),
            heirGender: selectedChild.gender,
            heirEmoji: selectedChild.emoji
          };
          
          AncientSave.addLog(`📜 立下遗嘱，百年之后由 ${selectedChild.name} 继承家业。`, 'event');
          AncientModal.showModal('📜 遗嘱已成',
            `已立 <b>${selectedChild.emoji} ${selectedChild.name}</b> 为继承人。<br><br>待百年之后，其将继承你所有钱财地产。`,
            [{label:'甚好', sub:'', cost:'', id:'ok'}],
            () => AncientModal.closeModal()
          );
          AncientSave.save();
        }
      }
    );
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
    
    AncientModal.confirm('⚠️ 重新来过',
      '此举乃重头再来，一旦为之，此生已矣。<br><br>若有子嗣，可由子嗣继承家业；若无子嗣，则重新来过。<br><br>是否确认？',
      () => {
        AncientModal.closeModal();
        
        // 标记死亡
        G.dead = true;
        G.deathCause = '重新来过';
        
        // 执行继承
        const hasHeir = AncientInherit.executeInheritance();
        
        if (!hasHeir) {
          // 无继承人，重新生成角色
          AncientState.G = null;
          AncientState.initGame();
          AncientSave.addLog('🌅 无子嗣继承，重新来过，开启新的人生。', 'event');
          AncientSave.save();
          AncientRender.render();
        }
      }
    );
  },

  // 旧的继承函数（保留兼容性）
  inheritChild: (idx) => {
    const child = AncientState.G.children[idx];
    if (!child || child.age < 18){ AncientModal.showToast('此子尚未及冠，不可托付家业！'); return; }
    const prev = {name:AncientState.G.name, emoji:AncientState.G.emoji, age:AncientState.G.age, money:AncientState.G.money};
    const newAncestors = [...AncientState.G.ancestors, {name:AncientState.G.name, emoji:AncientState.G.emoji, age:AncientState.G.age, rel:'先祖'}];
    const inheritMoney = Math.floor(AncientState.G.money * 0.4);
    AncientState.initGame(prev);
    AncientState.G.name=child.name; AncientState.G.given=child.name.slice(1); AncientState.G.surname=child.name[0];
    AncientState.G.gender=child.gender; AncientState.G.emoji=child.emoji; AncientState.G.age=child.age;
    AncientState.G.money=inheritMoney+50; AncientState.G.ancestors=newAncestors; AncientState.G.log=[];
    AncientSave.addLog(`🌅 承继 ${newAncestors[newAncestors.length-1].name} 之遗志，${child.name} 开始书写自己的人生。`, 'event');
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientInherit = AncientInherit;
window.inheritChild = AncientInherit.inheritChild;
window.makeWill = AncientInherit.makeWill;
window.restartLife = AncientInherit.restartLife;
