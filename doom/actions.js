const DoomActions = {
  nextDay: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.day++
    D.hour = 8
    D.isDay = true
    D.timeOfDay = 30
    
    if (window.DoomSystems) window.DoomSystems.consumeResources()
    if (window.DoomEventSystem) window.DoomEventSystem.triggerRandom()
    if (window.DoomTaskSystem) window.DoomTaskSystem.genDailyTasks()
    
    window.DoomUtils.addLog(`🌅 第${D.day}天开始`, 'linfo')
    if (window.DoomRender) window.DoomRender.render()
  },
  
  passTime: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.timeOfDay -= 2
    D.hour = Math.floor(8 + (30 - D.timeOfDay) / 30 * 16)
    
    if (D.hour >= 20) {
      D.isDay = false
    }
    
    if (D.timeOfDay <= 0) {
      DoomActions.nextDay()
    }
    
    if (window.DoomRender) window.DoomRender.render()
  },
  
  explore: locId => {
    if (window.DoomExploreSystem) window.DoomExploreSystem.explore(locId)
  },
  
  repairVan: amt => {
    if (window.DoomVanSystem) window.DoomVanSystem.repairVan(amt)
  },
  
  buyUpgrade: id => {
    if (window.DoomVanSystem) window.DoomVanSystem.buyUpgrade(id)
  },
  
  buyEquip: id => {
    if (window.DoomVanSystem) window.DoomVanSystem.buyEquip(id)
  },
  
  useItem: id => {
    if (window.DoomInventorySystem) window.DoomInventorySystem.useItem(id)
  },
  
  craftItem: type => {
    if (window.DoomInventorySystem) window.DoomInventorySystem.craftItem(type)
  },
  
  chooseEvent: i => {
    if (window.DoomEventSystem) window.DoomEventSystem.chooseEvent(i)
  },
  
  upgradeSkill: (svId, skill) => {
    const D = window.DoomCore?.getDoom()
    if (!D || D.skillPoints <= 0) return
    
    const sv = D.survivors.find(s => s.id === svId)
    if (!sv) return
    
    sv.skills[skill]++
    D.skillPoints--
    
    window.DoomUtils.addLog(`⭐ 升级${D.skillNames[skill]}技能`, 'lok')
    if (window.DoomRender) window.DoomRender.render()
  },
  
  feedSurvivor: svIdx => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (D.resources.food >= 5) {
      D.resources.food -= 5
      D.survivors[svIdx].hunger = Math.min(100, D.survivors[svIdx].hunger + 30)
      window.DoomUtils.addLog('🥫 喂食 +30 饱食', 'lok')
      if (window.DoomRender) window.DoomRender.render()
    } else {
      window.DoomUtils.addLog('❌ 食物不足', 'lbad')
    }
  },
  
  waterSurvivor: svIdx => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (D.resources.water >= 5) {
      D.resources.water -= 5
      D.survivors[svIdx].thirst = Math.min(100, D.survivors[svIdx].thirst + 30)
      window.DoomUtils.addLog('💧 喂水 +30 口渴', 'lok')
      if (window.DoomRender) window.DoomRender.render()
    } else {
      window.DoomUtils.addLog('❌ 水不足', 'lbad')
    }
  }
}

window.DoomActions = DoomActions
