const DoomSave = {
  save: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    try {
      const saveData = {
        day: D.day,
        hour: D.hour,
        isDay: D.isDay,
        vanHp: D.vanHp,
        radiation: D.radiation,
        infection: D.infection,
        morale: D.morale,
        xp: D.xp,
        skillPoints: D.skillPoints,
        level: D.level,
        resources: D.resources,
        survivors: D.survivors,
        vanUpgrades: D.vanUpgrades,
        vanEquip: D.vanEquip,
        inventory: D.inventory,
        achievements: D.achievements,
        map: D.map.map(m => ({
          id: m.id,
          explored: m.explored,
          current: m.current
        })),
        dailyTasks: D.dailyTasks
      }
      localStorage.setItem('doom', JSON.stringify(saveData))
    } catch (e) {
      console.error('Save failed:', e)
    }
  },
  
  load: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    try {
      const saved = JSON.parse(localStorage.getItem('doom') || '{}')
      if (saved.day !== undefined) {
        D.day = saved.day
        D.hour = saved.hour
        D.isDay = saved.isDay
        D.vanHp = saved.vanHp || 100
        D.radiation = saved.radiation || 0
        D.infection = saved.infection || 0
        D.morale = saved.morale || 80
        D.xp = saved.xp || 0
        D.skillPoints = saved.skillPoints || 0
        D.level = saved.level || 1
        D.resources = saved.resources || D.resources
        D.survivors = saved.survivors || D.survivors
        D.vanUpgrades = saved.vanUpgrades || D.vanUpgrades
        D.vanEquip = saved.vanEquip || D.vanEquip
        D.inventory = saved.inventory || D.inventory
        D.achievements = saved.achievements || D.achievements
        if (saved.map) {
          saved.map.forEach(sm => {
            const m = D.map.find(x => x.id === sm.id)
            if (m) {
              m.explored = sm.explored
              m.current = sm.current
            }
          })
        }
        D.dailyTasks = saved.dailyTasks || []
      }
    } catch (e) {
      console.error('Load failed:', e)
    }
  },
  
  saveBack: () => {
    DoomSave.save()
    location.href = 'index.html'
  },
  
  resetGame: () => {
    if (!confirm('确定要从头开始吗？所有进度将清空！')) return
    localStorage.removeItem('doom')
    location.reload()
  }
}

window.DoomSave = DoomSave
