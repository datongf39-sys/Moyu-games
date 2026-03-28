const DoomInventorySystem = {
  useItem: id => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const item = D.inventory.find(i => i.id === id)
    if (!item || item.count <= 0) return
    
    item.count--
    
    if (item.type === 'medical') {
      const s = D.survivors[0]
      if (s) {
        s.hp = Math.min(s.maxHp, s.hp + item.heal)
        window.DoomUtils.addLog(`💊 使用${item.name} 恢复${item.heal}HP`, 'lok')
      }
    }
    
    if (item.type === 'food') {
      D.resources.food = Math.min(D.maxRes.food, D.resources.food + item.food)
      window.DoomUtils.addLog(`🥫 使用${item.name} 获得${item.food}食物`, 'lok')
    }
    
    if (window.DoomRender) window.DoomRender.render()
  },
  
  craftItem: type => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (!D.vanUpgrades.find(u => u.id === 'lab')?.bought) {
      window.DoomUtils.addLog('需要安装研究实验室才能合成物品', 'lbad')
      return
    }
    
    if (type === 'bandage') {
      if (D.resources.scrap >= 5 && D.resources.battery >= 2) {
        D.resources.scrap -= 5
        D.resources.battery -= 2
        const m = D.inventory.find(i => i.id === 'bandage')
        if (m) m.count += 3
        window.DoomUtils.addLog('🧪 合成消炎药×3', 'lok')
      } else {
        window.DoomUtils.addLog('资源不足', 'lbad')
      }
    }
    
    if (type === 'molotov') {
      if (D.resources.scrap >= 3 && D.resources.fuel >= 2) {
        D.resources.scrap -= 3
        D.resources.fuel -= 2
        const m = D.inventory.find(i => i.id === 'molotov')
        if (m) m.count += 2
        window.DoomUtils.addLog('🔥 合成燃烧瓶×2', 'lok')
      } else {
        window.DoomUtils.addLog('资源不足', 'lbad')
      }
    }
    
    if (window.DoomRender) window.DoomRender.render()
  },
  
  updateWeight: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.weight = D.inventory.reduce((a, i) => a + i.weight * i.count, 0)
  }
}

window.DoomInventorySystem = DoomInventorySystem
