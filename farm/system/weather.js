const FarmWeatherSystem = {
  update: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.weatherTimer -= 0.1
    if (F.weatherTimer <= 0) {
      F.weather = Math.floor(Math.random() * F.weathers.length)
      F.weatherTimer = 40 + Math.random() * 80
      
      window.FarmUtils.addLog(`🌤️ 天气变为 ${F.weathers[F.weather].icon}${F.weathers[F.weather].name}`, 'linfo')
      
      if (F.weathers[F.weather].name === '暴风雨') {
        F.fields.forEach(f => {
          if (f.crop && Math.random() < 0.3) f.pest = true
        })
        window.FarmUtils.addLog('⚠️ 暴风雨引发病虫害！', 'lbad')
      }
    }
  },
  
  changeSeason: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.seasonDay += 0.01
    if (F.seasonDay >= 30) {
      F.seasonDay = 0
      F.season = (F.season + 1) % 4
      window.FarmUtils.addLog(`🌸 季节变换:${F.seasons[F.season]}季`, 'linfo')
    }
  },
  
  getMultiplier: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return 1.0
    return F.weathers[F.weather].mult
  }
}

window.FarmWeatherSystem = FarmWeatherSystem
