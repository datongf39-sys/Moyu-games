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
    const item = AncientState.G.inventory[slotIdx]; if (!item) return;
    if (item.isGift){
      const npcs = AncientState.G.npcs || [];
      if (npcs.length === 0){ AncientModal.showToast('社交圈空无一人，无处赠礼！'); return; }
      const opts = npcs.map((npc, i) => {
        const matched = item.giftTrait && item.giftTrait.length > 0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        return {label:`${npc.emoji} ${npc.name}（${npc.trait}）`, sub:`好感+${bonus}${matched?' ✨投其所好':''}`, cost:'', id:String(i)};
      });
      AncientModal.showModal(`${item.icon} 赠送【${item.name}】`, '请择一人赠之：', opts, (id) => {
        AncientModal.closeModal(); const idx=parseInt(id); const npc=npcs[idx]; if (!npc) return;
        const matched = item.giftTrait && item.giftTrait.length>0 && item.giftTrait.includes(npc.trait);
        const bonus = matched ? Math.round(item.favorBonus*1.5) : item.favorBonus;
        npc.favor = Math.min(100, npc.favor+bonus); AncientState.G.inventory.splice(slotIdx, 1);
        AncientSave.addLog(`🎁 以【${item.name}】相赠 ${npc.name}，情谊渐增，好感+${bonus}${matched?'（投其所好，倍感欢喜）':''}。`, 'good');
        AncientSave.save(); AncientRender.render();
      }); return;
    }
    const effectDesc = item.effect
      ? Object.entries(item.effect).map(([k,v]) => {
          const names={health:'健康',mood:'心情',intel:'智识',charm:'魅力',bagExpand:'包裹',jobProf:'职业熟练度'};
          return `${names[k]||k}+${v}`;
        }).join('  ')
      : '';
    AncientModal.showModal('📦 使用物品', `${item.icon} ${item.name}<br>效果：${effectDesc||'特殊'}<br><br>是否取出使用？`,
      [{label:'✅ 取出使用', sub:effectDesc, cost:'', id:'yes'}], (id) => {
        AncientModal.closeModal(); const e=item.effect||{}; let msg=`✨ 取用【${item.name}】`;
        if (e.health){ AncientState.G.health=AncientState.clamp(AncientState.G.health+e.health); msg+=`，健康+${e.health}`; }
        if (e.mood)  { AncientState.G.mood  =AncientState.clamp(AncientState.G.mood  +e.mood);   msg+=`，心情+${e.mood}`;   }
        if (e.intel) { AncientState.G.intel =AncientState.clamp(AncientState.G.intel +e.intel);   msg+=`，智识+${e.intel}`;  }
        if (e.charm) { AncientState.G.charm =AncientState.clamp(AncientState.G.charm +e.charm);   msg+=`，魅力+${e.charm}`;  }
        if (e.bagExpand){ AncientState.G.bagLimit=Math.min(20,AncientState.G.bagLimit+e.bagExpand); msg+=`，包裹上限+${e.bagExpand}（现${AncientState.G.bagLimit}）`; }
        if (e.jobProf){
          const cj = AncientJobs.JOBS.find(j => j.id === AncientState.G.job);
          const matchJob = item.jobId ? item.jobId === AncientState.G.job : true;
          if (cj && cj.id!=='none' && matchJob){ AncientState.G.jobProf+=e.jobProf; msg+=`，熟练度+${e.jobProf}`; AncientCareer.checkPromotion(); }
          else if (!matchJob){ const tj=AncientJobs.JOBS.find(j=>j.id===item.jobId); msg+=`（此书专为${tj?tj.name:'特定职业'}所著，与当前所从之业不符，读之无益）`; }
          else { msg+=`（尚未就业，读之无从施展）`; }
        }
        AncientState.G.inventory.splice(slotIdx, 1); AncientSave.addLog(msg+'.','good'); AncientSave.save(); AncientRender.render();
      });
  }
};

window.AncientShop = AncientShop;
window.genYearShop = AncientShop.genYearShop;
window.buyItemVenue = AncientShop.buyItemVenue;
window.useItem = AncientShop.useItem;
