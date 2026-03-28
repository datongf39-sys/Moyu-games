const DoomExploreSystem = {
  explore: locId => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const loc = D.map.find(m => m.id === locId)
    if (!loc || D.exploring) return
    
    const fuelNeeded = 3 + Math.floor(Math.abs(loc.x - 3) + Math.abs(loc.y - 3)) * 2
    if (D.resources.fuel < fuelNeeded) {
      window.DoomUtils.addLog(`⛽ 燃料不足！需要${fuelNeeded}L`, 'lbad')
      return
    }
    
    D.resources.fuel -= fuelNeeded
    D.exploring = true
    D.selectedLocId = locId
    
    window.DoomUtils.addLog(`🚐 前往 ${loc.name}...`, 'linfo')
    
    setTimeout(() => DoomExploreSystem.finishExplore(locId), 2000)
    if (window.DoomRender) window.DoomRender.render()
  },
  
  finishExplore: locId => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const loc = D.map.find(m => m.id === locId)
    if (!loc) return
    
    loc.explored = true
    D.currentLocId = locId
    D.exploring = false
    
    D.map.forEach(m => m.current = m.id === locId)
    
    if (loc.rad > 0) {
      const radRes = D.vanEquip.find(e => e.id === 'gasmask')?.bought ? 0.5 : 1
      D.radiation = Math.min(100, D.radiation + loc.rad * (radRes || 1))
      window.DoomUtils.addLog(`☢️ 受到${Math.floor(loc.rad * (radRes || 1))}rem 辐射`, 'lbad')
    }
    
    if (loc.drops) {
      Object.entries(loc.drops).forEach(([res, [min, max]]) => {
        const scav = D.survivors.reduce((a, s) => a + s.skills.scavenge, 0)
        const gpsBonus = D.vanEquip.find(e => e.id === 'gps')?.bought ? 0.3 : 0
        const bonus = 1 + scav * 0.1 + gpsBonus
        const amt = Math.floor((min + Math.random() * (max - min)) * bonus)
        D.resources[res] = Math.min(D.maxRes[res], D.resources[res] + amt)
        if (amt > 0) {
          window.DoomUtils.llog(`✅ 获得 ${D.resIcons[res]}${D.resNames[res]}×${amt}`, 'lok')
        }
      })
      D.xp += 20
    }
    
    window.DoomUtils.addLog(`📍 到达 ${loc.icon}${loc.name}`, 'linfo')
    if (window.DoomRender) window.DoomRender.render()
  }
}

window.DoomExploreSystem = DoomExploreSystem
