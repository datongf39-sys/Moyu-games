const AncientShop = {
  genYearShop: () => {
    if (!AncientState.G._shopSeed || AncientState.G._shopYear !== AncientState.G.age){
      AncientState.G._shopYear = AncientState.G.age;
      const general  = AncientItems.SHOP_ITEMS_POOL.filter(i => i.tags.includes('general'));
      const jobbooks = AncientState.G.age > 10 ? AncientItems.SHOP_ITEMS_POOL.filter(i => i.tags.includes('jobbook')) : [];
      const gifts    = AncientItems.SHOP_ITEMS_POOL.filter(i => i.tags.includes('gift'));
      const shuffle  = arr => [...arr].sort(() => Math.random()-0.5);
      const picked   = [];
      shuffle(general).slice(0, 3+Math.floor(Math.random()*2)).forEach(i => picked.push(i));
      if (gifts.length) shuffle(gifts).slice(0, 1+Math.floor(Math.random()*2)).forEach(i => picked.push(i));
      if (jobbooks.length && Math.random() < 0.6) picked.push(shuffle(jobbooks)[0]);
      const unique = [...new Map(picked.map(i => [i.id, i])).values()];
      AncientState.G._shopPool = unique.slice(0,6).map(i => i.id);
      AncientState.G._shopSeed = true;
    }
    return AncientItems.SHOP_ITEMS_POOL.filter(i => AncientState.G._shopPool && AncientState.G._shopPool.includes(i.id));
  },

  buyItemVenue: (itemId) => {
    const item = AncientItems.SHOP_ITEMS_POOL.find(i => i.id === itemId); if (!item) return;
    if (AncientState.G.money < item.price){ AncientModal.showToast('囊中羞涩，钱财不足！'); return; }
    if (!item.isGift && AncientState.G.inventory.length >= AncientState.G.bagLimit){ AncientModal.showToast('行囊已满，无处再放！'); return; }
    AncientModal.confirmSpend(item.price, `${item.icon} 购置【${item.name}】\n${item.desc}`, () => {
      AncientState.G.money -= item.price;
      AncientState.G.inventory.push({id:item.id, name:item.name, icon:item.icon, effect:item.effect,
        isGift:item.isGift||false, isJobBook:item.isJobBook||false,
        giftTrait:item.giftTrait||[], favorBonus:item.favorBonus||0, jobId:item.jobId||null});
      AncientSave.addLog(`🛍️ 于集市购入【${item.name}】，花费 ${item.price}文。`, 'info');
      AncientSave.save(); AncientModal.refreshVenueBody(); AncientModal.showToast(`【${item.name}】已入行囊！`);
    });
  },

  useItem: (slotIdx) => {
    const G = AncientState.G;
    const item = G.inventory[slotIdx]; if (!item) return;
    
    // 催子香囊特殊处理
    if (item.id === 'fertility_sachet') {
      window.useFertilitySachet(slotIdx);
      return;
    }
    
    // 礼品类
    if (item.isGift){
      const npcs = G.npcs || [];
      if (npcs.length === 0){
        AncientModal.showModal(item.icon+'  '+item.name,
          '拿着礼物左看右看，<br>却发现社交圈空空如也，<br>竟无一人可赠。<br><br>礼物还是先收着吧。',
          [{label:'↩ 收回行囊', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      const opts = npcs.map((npc, i) => {
        const matched = item.giftTrait && item.giftTrait.length > 0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        return {label:`${npc.name}（${npc.trait}）`, sub:`好感+${bonus}${matched?' ✨投其所好':''}`, cost:'', id:String(i)};
      });
      AncientModal.showModal(item.icon+'  赠送【'+item.name+'】', '请择一人赠之：', opts, (id) => {
        AncientModal.closeModal();
        const idx = parseInt(id);
        const npc = npcs[idx];
        if (!npc) return;
        const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        
        if (matched) {
          // 投其所好
          AncientModal.showModal(item.icon+'  赠予 '+npc.name,
            `将 ${item.name} 赠予 ${npc.name}，<br>对方见之眼睛一亮，连声道谢。<br><br>「这正是我最喜欢的！」<br><br>好感 +${bonus} ✨ 投其所好`,
            [{label:'赠出此物', sub:'', cost:'', id:'ok'}],
            () => {
              npc.favor = Math.min(100, npc.favor+bonus);
              G.inventory.splice(slotIdx, 1);
              AncientSave.addLog(`🎁 以【${item.name}】相赠 ${npc.name}，对方大喜过望（投其所好），好感+${bonus}。`, 'good');
              AncientSave.save();
              AncientRender.render();
            }
          );
        } else {
          // 未投其所好
          AncientModal.showModal(item.icon+'  赠予 '+npc.name,
            `将 ${item.name} 赠予 ${npc.name}，<br>对方礼貌收下，道了声谢。<br><br>虽非对方心头好，<br>心意到了，总归有些用处。<br><br>好感 +${bonus}`,
            [{label:'赠出此物', sub:'', cost:'', id:'ok'}],
            () => {
              npc.favor = Math.min(100, npc.favor+bonus);
              G.inventory.splice(slotIdx, 1);
              AncientSave.addLog(`🎁 以【${item.name}】相赠 ${npc.name}，好感+${bonus}。`, 'good');
              AncientSave.save();
              AncientRender.render();
            }
          );
        }
      });
      return;
    }
    
    // 通用道具类 - 根据物品 ID 显示不同描述
    const useData = {
      'herbal': {
        desc: '取出草药包，架锅煎服，苦涩入喉。<br>虽不是什么名贵药材，<br>聊胜于无，总归对身子有些好处。',
        effect: '健康 +15',
        btnYes: '✅ 一饮而尽',
        btnNo: '↩ 先放着'
      },
      'book': {
        desc: '展开文集，就着灯光细细研读，<br>字里行间自有前人智慧，<br>不觉间夜已深了。',
        effect: '智识 +10',
        btnYes: '✅ 挑灯研读',
        btnNo: '↩ 改日再看'
      },
      'rouge': {
        desc: '对着铜镜细细描画，<br>胭脂上颊，顿觉神采焕然一新。<br>出门待客，自是风姿倍增。',
        effect: '魅力 +12',
        btnYes: '✅ 对镜梳妆',
        btnNo: '↩ 先放着'
      },
      'wine': {
        desc: '启封，酒香扑鼻而来。<br>独酌几口，烦忧尽散，<br>飘飘然不知今夕何夕。',
        effect: '心情 +15',
        btnYes: '✅ 开坛畅饮',
        btnNo: '↩ 留着待客'
      },
      'tonic': {
        desc: '取出大补丸，就水服下。<br>丸药入腹，一股暖意徐徐散开，<br>果然名不虚传，身子骨顿觉硬朗许多。',
        effect: '健康 +30',
        btnYes: '✅ 服下此丸',
        btnNo: '↩ 先放着'
      },
      'jade': {
        desc: '将玉佩系于腰间，<br>温润的触感令人心安。<br>古人诚不欺我，君子佩玉，<br>果然神清气爽，风度自显。',
        effect: '魅力 +20  心情 +10',
        btnYes: '✅ 系于腰间',
        btnNo: '↩ 先放着'
      },
      'sword': {
        desc: '握剑起势，于院中练了一套剑法。<br>剑风呼呼，大汗淋漓，<br>练罢只觉浑身舒泰，精神振奋。',
        effect: '健康 +10  心情 +10',
        btnYes: '✅ 挥剑练功',
        btnNo: '↩ 改日再练'
      },
      'bigbag': {
        desc: '将大布袋收入行囊，<br>往后装东西宽裕多了，<br>再也不用担心放不下。',
        effect: '行囊容量 +5',
        btnYes: '✅ 收入行囊',
        btnNo: '↩ 先放着'
      },
      'herb_pack': {
        desc: '取出调理包，按方子煎煮，<br>药香弥漫，徐徐饮下。<br>效验虽不及大夫亲诊，<br>然细水长流，总归有益。',
        effect: '健康 +6',
        btnYes: '✅ 煎服调理',
        btnNo: '↩ 先放着'
      }
    };
    
    // 职业书籍类
    if (item.isJobBook) {
      const job = AncientJobs.JOBS.find(j => j.id === G.job);
      const matchJob = item.jobId ? item.jobId === G.job : true;
      const targetJob = AncientJobs.JOBS.find(j => j.id === item.jobId);
      
      if (!matchJob) {
        // 职业不匹配
        AncientModal.showModal(item.icon+'  '+item.name,
          `翻开书册，看了几页，<br>发觉书中所言与自己所从之业风马牛不相及，<br>读下去也是对牛弹琴。<br><br>此书专为 ${targetJob?targetJob.name:'特定职业'} 所著，读之无益。`,
          [{label:'↩ 合上书册', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      if (!job || G.job === 'none') {
        // 未就业
        AncientModal.showModal(item.icon+'  '+item.name,
          `翻开书册，书中所讲头头是道，<br>然自己尚未就业，<br>纵然读懂了，也无处施展。<br><br>待谋得一份差事，再来研读不迟。`,
          [{label:'↩ 合上书册', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      // 职业匹配，可以研读
      AncientModal.showModal(item.icon+'  '+item.name,
        '展开书册，对照自身经验细细研读，<br>书中所言与平日所为相互印证，<br>不觉间豁然开朗，颇有收获。<br><br>职业熟练度 +10',
        [{label:'✅ 潜心研读', sub:'', cost:'', id:'yes'}, {label:'↩ 改日再看', sub:'', cost:'', id:'no'}],
        (id) => {
          AncientModal.closeModal();
          if (id === 'yes') {
            G.jobProf += 10;
            G.inventory.splice(slotIdx, 1);
            AncientSave.addLog(`📖 研读【${item.name}】，职业熟练度 +10。`, 'good');
            AncientCareer.checkPromotion();
            AncientSave.save();
            AncientRender.render();
          }
        }
      );
      return;
    }
    
    // 通用道具确认弹窗
    const data = useData[item.id];
    if (data) {
      AncientModal.showModal(item.icon+'  '+item.name,
        data.desc+'<br><br>'+data.effect,
        [{label:data.btnYes, sub:data.effect, cost:'', id:'yes'}, {label:data.btnNo, sub:'', cost:'', id:'no'}],
        (id) => {
          AncientModal.closeModal();
          if (id === 'yes') {
            const e = item.effect || {};
            let msg = `✨ 取用【${item.name}】`;
            if (e.health) {
              G.health = AncientState.clamp(G.health + e.health);
              msg += `，健康 +${e.health}`;
            }
            if (e.mood) {
              G.mood = AncientState.clamp(G.mood + e.mood);
              msg += `，心情 +${e.mood}`;
            }
            if (e.intel) {
              G.intel = AncientState.clamp(G.intel + e.intel);
              msg += `，智识 +${e.intel}`;
            }
            if (e.charm) {
              G.charm = AncientState.clamp(G.charm + e.charm);
              msg += `，魅力 +${e.charm}`;
            }
            if (e.bagExpand) {
              G.bagLimit = Math.min(20, G.bagLimit + e.bagExpand);
              msg += `，包裹上限 +${e.bagExpand}（现${G.bagLimit}）`;
            }
            G.inventory.splice(slotIdx, 1);
            AncientSave.addLog(msg + '.', 'good');
            AncientSave.save();
            AncientRender.render();
          }
        }
      );
    }
  }
};

window.AncientShop = AncientShop;
window.genYearShop = AncientShop.genYearShop;
window.buyItemVenue = AncientShop.buyItemVenue;
window.useItem = AncientShop.useItem;
