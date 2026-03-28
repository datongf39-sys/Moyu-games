let DoomCore = {
  doom: null,
  tick: 0,
  
  setDoom: doom => {
    DoomCore.doom = doom
  },
  
  getDoom: () => {
    return DoomCore.doom
  },
  
  start: () => {
    setInterval(() => {
      DoomCore.tick++
      
      if (window.DoomSystems) window.DoomSystems.updateSurvivors()
      if (window.DoomSystems) window.DoomSystems.updateRadiation()
      if (window.DoomSystems) window.DoomSystems.applyVanUpgrades()
      
      if (DoomCore.tick % 10 === 0 && window.DoomTaskSystem) {
        window.DoomTaskSystem.checkTasks()
      }
      
      if (DoomCore.tick % 30 === 0 && window.DoomFeatures) {
        window.DoomFeatures.checkAch()
        window.DoomFeatures.checkLevelUp()
      }
      
      if (DoomCore.tick % 5 === 0 && window.DoomRender) {
        window.DoomRender.render()
      }
      
      if (DoomCore.tick % 600 === 0 && window.DoomSave) {
        window.DoomSave.save()
      }
    }, 100)
  }
}

window.DoomCore = DoomCore
