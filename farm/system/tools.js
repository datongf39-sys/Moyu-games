const FarmToolsSystem = {
  buyTool: id => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const t = F.tools.find(x => x.id === id)
    if (!t || t.bought || F.gold < t.cost) return
    
    F.gold -= t.cost
    t.bought = true
    
    if (id === 'harvester') F.autoHarvest = true
    
    window.FarmUtils.addLog(`🔧 购入${t.icon}${t.name}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  buyUpgrade: id => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const u = F.upgrades.find(x => x.id === id)
    if (!u || u.bought || F.gold < u.cost) return
    
    F.gold -= u.cost
    u.bought = true
    
    window.FarmUtils.addLog(`🔬 解锁:${u.name}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  hasGreenhouse: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return false
    return F.tools.find(t => t.id === 'greenhouse')?.bought || false
  },
  
  hasPesticide: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return false
    return F.tools.find(t => t.id === 'pesticide')?.bought || false
  }
}

window.FarmToolsSystem = FarmToolsSystem
