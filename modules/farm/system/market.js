const FarmMarketSystem = {
  refresh: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.seeds.forEach(s => {
      F.marketPrices[s.id] = Math.floor(s.profit * (0.7 + Math.random() * 0.8))
    })
    
    F.wholesale = []
    const seeds = F.seeds.slice().sort(() => Math.random() - 0.5).slice(0, 3)
    seeds.forEach(s => {
      F.wholesale.push({
        crop: s.id,
        name: s.name,
        icon: s.icon,
        qty: 10 + Math.floor(Math.random() * 20),
        price: Math.floor(s.profit * 1.3)
      })
    })
  },
  
  sellStock: id => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const qty = F.stock[id] || 0
    if (qty <= 0) return
    
    const price = F.marketPrices[id]
    const earn = qty * price
    F.gold += earn
    F.stock[id] = 0
    
    const seed = F.seeds.find(s => s.id === id)
    window.FarmUtils.tlog(`💰 出售${seed?.icon || '🌾'}${id} ×${qty} +¥${earn}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  fillWholesale: i => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const w = F.wholesale[i]
    if (!w) return
    
    const have = F.stock[w.crop] || 0
    if (have < w.qty) {
      window.FarmUtils.addLog(`❌ 库存不足 (${have}/${w.qty})`, 'lbad')
      return
    }
    
    F.stock[w.crop] -= w.qty
    const earn = w.qty * w.price
    F.gold += earn
    
    window.FarmUtils.tlog(`📦 完成批发订单:${w.icon}${w.name}×${w.qty} +¥${earn}`, 'lok')
    F.wholesale.splice(i, 1)
    if (window.FarmRender) window.FarmRender.render()
  },
  
  setupStall: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    if (F.stall.active) return
    if (F.gold < F.stall.cost) return
    
    F.gold -= F.stall.cost
    F.stall.active = true
    window.FarmUtils.addLog('🏪 开设农贸摊位', 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  updateStall: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    if (!F.stall.active) return
    
    F.stall.revenue += 5 + F.workers.length * 2
    F.gold += 5 + F.workers.length * 2
  }
}

window.FarmMarketSystem = FarmMarketSystem
