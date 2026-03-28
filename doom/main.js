(function() {
  console.log('[Doom] 开始初始化...')
  console.log('[Doom] DoomBaseData:', window.DoomBaseData)
  console.log('[Doom] DoomResourcesData:', window.DoomResourcesData)
  console.log('[Doom] DoomSurvivorsData:', window.DoomSurvivorsData)
  
  window.D = {}
  
  // Merge all data modules
  if (window.DoomBaseData) Object.assign(window.D, window.DoomBaseData)
  if (window.DoomResourcesData) Object.assign(window.D, window.DoomResourcesData)
  if (window.DoomInventoryData) Object.assign(window.D, window.DoomInventoryData)
  if (window.DoomSurvivorsData) Object.assign(window.D, window.DoomSurvivorsData)
  if (window.DoomVanData) Object.assign(window.D, window.DoomVanData)
  if (window.DoomMapData) Object.assign(window.D, window.DoomMapData)
  if (window.DoomEventsData) Object.assign(window.D, window.DoomEventsData)
  if (window.DoomAchievementsData) Object.assign(window.D, window.DoomAchievementsData)
  
  console.log('[Doom] 合并后的 window.D:', window.D)
  console.log('[Doom] window.D.survivors:', window.D.survivors)
  console.log('[Doom] window.D.resources:', window.D.resources)
  
  // Set doom instance
  if (window.DoomCore) window.DoomCore.setDoom(window.D)
  
  // Add helper methods
  window.D.recalc = function() {
    // Recalculate values
  }
  
  window.D.totalSurvivors = function() {
    return this.survivors.length
  }
  
  console.log('[Doom] DoomCore 中的 doom:', window.DoomCore.getDoom())
  
  // Initialize
  if (window.DoomInit) {
    window.DoomInit.init()
  }
})()
