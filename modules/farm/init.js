const FarmInit = {
  init: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    // Init market prices
    F.seeds.forEach(s => {
      F.marketPrices[s.id] = s.profit
      F.stock[s.id] = 0
    })
    
    // Load saved data
    if (window.FarmSave) window.FarmSave.load()
    
    // Init market
    if (window.FarmMarketSystem) window.FarmMarketSystem.refresh()
    
    // Render initial UI
    if (window.FarmRender) window.FarmRender.render()
    
    // Log startup
    window.FarmUtils.addLog('🌱 农业项目管理系统启动', 'linfo')
    window.FarmUtils.addLog('点击空地种植，点击成熟作物收获', 'linfo')
    
    // Start core loop
    if (window.FarmCore) window.FarmCore.start()
  }
}

window.FarmInit = FarmInit
