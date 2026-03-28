let FarmCore = {
  farm: null,
  tick: 0,
  
  setFarm: farm => {
    FarmCore.farm = farm
  },
  
  getFarm: () => {
    return FarmCore.farm
  },
  
  start: () => {
    setInterval(() => {
      FarmCore.tick++
      
      if (window.FarmWeatherSystem) window.FarmWeatherSystem.update()
      if (window.FarmFieldsSystem) window.FarmFieldsSystem.updateGrowth()
      if (window.FarmAnimalsSystem) window.FarmAnimalsSystem.update()
      if (window.FarmWeatherSystem) window.FarmWeatherSystem.changeSeason()
      if (window.FarmResearchSystem) window.FarmResearchSystem.update()
      if (window.FarmMarketSystem) window.FarmMarketSystem.updateStall()
      
      if (FarmCore.farm?.autoHarvest && FarmCore.tick % 20 === 0) {
        if (window.FarmFieldsSystem) window.FarmFieldsSystem.harvestAll()
      }
      
      if (window.FarmToolsSystem && window.FarmToolsSystem.hasPesticide()) {
        FarmCore.farm?.fields.forEach(f => {
          if (f.pest) f.pest = false
        })
      }
      
      if (FarmCore.tick % 5 === 0 && window.FarmRender) {
        window.FarmRender.render()
      }
      
      if (FarmCore.tick % 300 === 0 && window.FarmSave) {
        window.FarmSave.save()
      }
    }, 100)
  }
}

window.FarmCore = FarmCore
