const FarmFeatures = {
  checkAch: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.achievements.forEach(a => {
      if (!a.done && a.check(F)) {
        a.done = true
        window.FarmUtils.addLog(`🏆 成就:${a.icon}${a.name}`, 'lok')
      }
    })
  }
}

window.FarmFeatures = FarmFeatures
