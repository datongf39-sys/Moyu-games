(function() {
  console.log('[Farm] 开始初始化...')
  console.log('[Farm] FarmBaseData:', window.FarmBaseData)
  console.log('[Farm] FarmFieldsData:', window.FarmFieldsData)
  console.log('[Farm] FarmSeedsData:', window.FarmSeedsData)
  
  window.F = {}
  
  // Merge all data modules
  if (window.FarmBaseData) Object.assign(window.F, window.FarmBaseData)
  if (window.FarmFieldsData) Object.assign(window.F, window.FarmFieldsData)
  if (window.FarmSeedsData) Object.assign(window.F, window.FarmSeedsData)
  if (window.FarmAnimalsData) Object.assign(window.F, window.FarmAnimalsData)
  if (window.FarmWorkersData) Object.assign(window.F, window.FarmWorkersData)
  if (window.FarmToolsData) Object.assign(window.F, window.FarmToolsData)
  if (window.FarmWeatherData) Object.assign(window.F, window.FarmWeatherData)
  if (window.FarmAchievementsData) Object.assign(window.F, window.FarmAchievementsData)
  
  console.log('[Farm] 合并后的 window.F:', window.F)
  console.log('[Farm] window.F.seeds:', window.F.seeds)
  console.log('[Farm] window.F.fields:', window.F.fields)
  
  // Set farm instance
  if (window.FarmCore) window.FarmCore.setFarm(window.F)
  
  // Add helper methods
  window.F.recalc = function() {
    // Recalculate CPS and other values
  }
  
  window.F.totalStaff = function() {
    return this.workers.length
  }
  
  window.F.hcost = function(h) {
    // Calculate hire cost
    return h.cost
  }
  
  console.log('[Farm] FarmCore 中的 farm:', window.FarmCore.getFarm())
  
  // Initialize
  if (window.FarmInit) {
    window.FarmInit.init()
  }
})()
