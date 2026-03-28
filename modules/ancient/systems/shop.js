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
    if (AncientState.G.money < item.price){ AncientModal.showToast('钱不够！'); return; }
    if (!item.isGift && AncientState.G.inventory.length >= AncientState.G.bagLimit){ AncientModal.showToast('包裹已满！'); return; }
    AncientModal.confirmSpend(item.price, `${item.icon} 购买【${item.name}】\n${item.desc}`, () => {
      AncientState.G.money -= item.price;
      AncientState.G.inventory.push({id:item.id, name:item.name, icon:item.icon, effect:item.effect,
        isGift:item.isGift||false, isJobBook:item.isJobBook||false,
        giftTrait:item.giftTrait||[], favorBonus:item.favorBonus||0, jobId:item.jobId||null});
      AncientSave.addLog(`🛍️ 在商铺购入【${item.name}】，花费 ${item.price}文。`, 'info');
      AncientSave.save(); AncientModal.refreshVenueBody(); AncientModal.showToast(`已购入【${item.name}】！`);
    });
  },

  useItem: (slotIdx) => {
    const item = AncientState.G.inventory[slotIdx]; if (!item) return;
    if (item.isGift){
      const npcs = AncientState.G.npcs || [];
      if (npcs.length === 0){ AncientModal.showToast('没有可以赠送的人！'); return; }
      const opts = npcs.map((npc, i) => {
        const matched = item.giftTrait && item.giftTrait.length > 0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        return {label:`${npc.emoji} ${npc.name}（${npc.trait}）`, sub:`好感+${bonus}${matched?' ✨投其所好':''}`, cost:'', id:String(i)};
      });
      AncientModal.showModal(`${item.icon} 赠送【${item.name}】`, '选择赠送对象：', opts, (id) => {
        AncientModal.closeModal(); const idx=parseInt(id); const npc=npcs[idx]; if (!npc) return;
        const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        npc.favor = Math.min(100, npc.favor+bonus); AncientState.G.inventory.splice(slotIdx, 1);
        AncientSave.addLog(`🎁 将【${item.name}】送给 ${npc.name}，好感+${bonus}${matched?'（投其所好）':''}。`, 'good');
        AncientSave.save(); AncientRender.render();
      }); return;
    }
    const effectDesc = item.effect
      ? Object.entries(item.effect).map(([k,v]) => {
          const names={health:'健康',mood:'心情',intel:'智识',charm:'魅力',bagExpand:'包裹',jobProf:'职业熟练度'};
          return `${names[k]||k}+${v}`;
        }).join('  ')
      : '';
    AncientModal.showModal('📦 使用物品', `${item.icon} ${item.name}\n效果：${effectDesc||'特殊'}\n\n确认使用？`,
      [{label:'✅ 确认使用', sub:effectDesc, cost:'', id:'yes'}], (id) => {
        AncientModal.closeModal(); const e=item.effect||{}; let msg=`✨ 使用了【${item.name}】`;
        if (e.health){ AncientState.G.health=AncientState.clamp(AncientState.G.health+e.health); msg+=`，健康+${e.health}`; }
        if (e.mood)  { AncientState.G.mood  =AncientState.clamp(AncientState.G.mood  +e.mood);   msg+=`，心情+${e.mood}`;   }
        if (e.intel) { AncientState.G.intel =AncientState.clamp(AncientState.G.intel +e.intel);   msg+=`，智识+${e.intel}`;  }
        if (e.charm) { AncientState.G.charm =AncientState.clamp(AncientState.G.charm +e.charm);   msg+=`，魅力+${e.charm}`;  }
        if (e.bagExpand){ AncientState.G.bagLimit=Math.min(20,AncientState.G.bagLimit+e.bagExpand); msg+=`，包裹上限+${e.bagExpand}（现${AncientState.G.bagLimit}）`; }
        if (e.jobProf){
          const cj = AncientJobs.JOBS.find(j => j.id === AncientState.G.job);
          const matchJob = item.jobId ? item.jobId === AncientState.G.job : true;
          if (cj && cj.id!=='none' && matchJob){ AncientState.G.jobProf+=e.jobProf; msg+=`，熟练度+${e.jobProf}`; AncientCareer.checkPromotion(); }
          else if (!matchJob){ const tj=AncientJobs.JOBS.find(j=>j.id===item.jobId); msg+=`（此书仅适用于${tj?tj.name:'对应职业'}，当前职业不符，无效）`; }
          else { msg+=`（当前无业，无效）`; }
        }
        AncientState.G.inventory.splice(slotIdx, 1); AncientSave.addLog(msg+'。','good'); AncientSave.save(); AncientRender.render();
      });
  }
};

window.AncientShop = AncientShop;
window.genYearShop = AncientShop.genYearShop;
window.buyItemVenue = AncientShop.buyItemVenue;
window.useItem = AncientShop.useItem;
