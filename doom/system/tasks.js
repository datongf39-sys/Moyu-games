const DoomTaskSystem = {
  genDailyTasks: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.dailyTasks = [
      { text: '收集 10L 水', done: false, check: () => D.resources.water >= 10, reward: { scrap: 5 }, icon: '💧' },
      { text: '储备 20 单位食物', done: false, check: () => D.resources.food >= 20, reward: { medicine: 2 }, icon: '🥫' },
      { text: '修复房车', done: false, check: () => D.vanHp >= 80, reward: { xp: 50 }, icon: '🔧' }
    ]
  },
  
  checkTasks: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.dailyTasks.forEach(t => {
      if (!t.done && t.check()) {
        t.done = true
        if (t.reward) {
          Object.entries(t.reward).forEach(([res, amt]) => {
            if (D.resources[res] !== undefined) {
              D.resources[res] += amt
            } else if (res === 'xp') {
              D.xp += amt
            }
          })
        }
      }
    })
  }
}

window.DoomTaskSystem = DoomTaskSystem
