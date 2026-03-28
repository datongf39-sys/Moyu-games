const DoomVanSystem = {
  repairVan: amount => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const cost = amount
    if (D.resources.scrap < cost) {
      window.DoomUtils.addLog(`🔩 废料不足！需要${cost}废料`, 'lbad')
      return
    }
    
    D.resources.scrap -= cost
    D.vanHp = Math.min(D.vanMaxHp, D.vanHp + amount)
    window.DoomUtils.addLog(`🔧 修复房车 +${amount}HP`, 'lok')
    if (window.DoomRender) window.DoomRender.render()
  },
  
  buyUpgrade: id => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const u = D.vanUpgrades.find(x => x.id === id)
    if (!u || u.bought) return
    
    const canAfford = Object.entries(u.cost).every(([res, amt]) => D.resources[res] >= amt)
    if (!canAfford) {
      window.DoomUtils.addLog('❌ 资源不足', 'lbad')
      return
    }
    
    Object.entries(u.cost).forEach(([res, amt]) => D.resources[res] -= amt)
    u.bought = true
    
    if (id === 'storage') D.maxWeight += 30
    if (id === 'med') D.maxRes.medicine *= 2
    
    window.DoomUtils.addLog(`🔧 安装升级:${u.name}`, 'lok')
    if (window.DoomRender) window.DoomRender.render()
  },
  
  buyEquip: id => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const e = D.vanEquip.find(x => x.id === id)
    if (!e || e.bought) return
    
    const canAfford = Object.entries(e.cost).every(([res, amt]) => D.resources[res] >= amt)
    if (!canAfford) {
      window.DoomUtils.addLog('❌ 资源不足', 'lbad')
      return
    }
    
    Object.entries(e.cost).forEach(([res, amt]) => D.resources[res] -= amt)
    e.bought = true
    
    window.DoomUtils.addLog(`⚙️ 安装设备:${e.name}`, 'lok')
    if (window.DoomRender) window.DoomRender.render()
  }
}

window.DoomVanSystem = DoomVanSystem
