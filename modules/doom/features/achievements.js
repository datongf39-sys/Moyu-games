const DoomFeatures = {
  checkAch: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.achievements.forEach(a => {
      if (!a.done && a.check(D)) {
        a.done = true
        window.DoomUtils.addLog(`🏆 成就:${a.icon}${a.name}`, 'lok')
      }
    })
  },
  
  checkLevelUp: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const xpNeeded = D.level * 100
    if (D.xp >= xpNeeded) {
      D.xp -= xpNeeded
      D.level++
      D.skillPoints++
      window.DoomUtils.addLog(`⭐ 等级提升！当前等级${D.level}`, 'lok')
    }
  }
}

window.DoomFeatures = DoomFeatures
