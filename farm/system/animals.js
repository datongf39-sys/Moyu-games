const FarmAnimalsSystem = {
  buy: id => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const at = F.animalTypes.find(a => a.id === id)
    if (!at) return
    
    const max = F.upgrades.find(u => u.id === 'ranch')?.bought ? 8 : 3
    if (F.gold < at.cost || F.animals.length >= max) return
    
    F.gold -= at.cost
    F.animals.push({
      ...at,
      id: Date.now(),
      hp: 100,
      hunger: 100,
      produce: { ...at.produce },
      timer: 0
    })
    
    window.FarmUtils.addLog(`🐾 购入${at.icon}${at.name}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  feed: idx => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    if (F.gold < 5) return
    
    F.gold -= 5
    F.animals[idx].hunger = 100
    F.animals[idx].hp = Math.min(100, F.animals[idx].hp + 20)
    
    window.FarmUtils.addLog(`🍎 喂食${F.animals[idx].icon}${F.animals[idx].name}`, 'linfo')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  collect: idx => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const a = F.animals[idx]
    if (!a || a.timer < a.produce.time) return
    
    F.animalProducts[a.produce.item] = (F.animalProducts[a.produce.item] || 0) + a.produce.val
    a.timer = 0
    
    window.FarmUtils.addLog(`🥚 收获 ${a.produce.icon}${F.productNames[a.produce.item]}×${a.produce.val}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  sell: item => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const prices = { egg: 3, pork: 12, milk: 8, wool: 6, honey: 10 }
    const qty = F.animalProducts[item] || 0
    if (qty <= 0) return
    
    const earn = qty * prices[item]
    F.gold += earn
    F.animalProducts[item] = 0
    
    window.FarmUtils.tlog(`💰 出售${F.productIcons[item]}${F.productNames[item]}×${qty} +¥${earn}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  update: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.animals.forEach(a => {
      a.timer = (a.timer || 0) + 0.1
      a.hunger = Math.max(0, a.hunger - 0.02)
      
      if (a.hunger <= 0) {
        a.timer = Math.min(a.timer, a.produce.time - 0.1)
      }
    })
  },
  
  getMax: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return 3
    return F.upgrades.find(u => u.id === 'ranch')?.bought ? 8 : 3
  }
}

window.FarmAnimalsSystem = FarmAnimalsSystem
