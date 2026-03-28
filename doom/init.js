const DoomInit = {
  init: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    // Load saved data
    if (window.DoomSave) window.DoomSave.load()
    
    // Generate daily tasks
    if (window.DoomTaskSystem) window.DoomTaskSystem.genDailyTasks()
    
    // Render initial UI
    if (window.DoomRender) window.DoomRender.render()
    
    // Log startup
    window.DoomUtils.addLog('🚐 末日房车求生系统启动', 'linfo')
    window.DoomUtils.addLog('点击地点探索，收集资源生存下去', 'linfo')
    
    // Start core loop
    if (window.DoomCore) window.DoomCore.start()
  }
}

window.DoomInit = DoomInit
