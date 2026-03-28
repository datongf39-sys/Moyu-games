const FarmWorkersSystem = {
  hire: i => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const wp = F.workerPool[i]
    if (!wp || F.gold < wp.cost) return
    
    F.gold -= wp.cost
    F.workers.push({ ...wp, id: Date.now() })
    F.workerPool.splice(i, 1)
    
    window.FarmUtils.addLog(`✅ 雇用${wp.icon}${wp.name}`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  getTotalSalary: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return 0
    return F.workers.reduce((a, w) => a + w.salary, 0)
  },
  
  getWorkSpeed: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return 1
    return 1 + F.workers.filter(w => w.task === 'plant' || true).reduce((a, w) => a + w.skill * 0.05, 0)
  }
}

window.FarmWorkersSystem = FarmWorkersSystem
