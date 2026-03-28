const FarmSave = {
  save: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    try {
      const saveData = {
        gold: F.gold,
        harvested: F.harvested,
        season: F.season,
        animals: F.animals,
        workers: F.workers,
        tools: F.tools,
        upgrades: F.upgrades,
        hybrids: F.hybrids,
        stock: F.stock,
        stall: F.stall,
        animalProducts: F.animalProducts,
        achievements: F.achievements,
        fields: F.fields.map(f => ({
          id: f.id,
          crop: f.crop,
          progress: f.progress,
          pest: f.pest
        }))
      }
      localStorage.setItem('farm', JSON.stringify(saveData))
    } catch (e) {
      console.error('Save failed:', e)
    }
  },
  
  load: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    try {
      const saved = JSON.parse(localStorage.getItem('farm') || '{}')
      if (saved.gold !== undefined) {
        F.gold = saved.gold || 200
        F.harvested = saved.harvested || 0
        F.season = saved.season || 0
        F.animals = saved.animals || []
        F.workers = saved.workers || []
        F.tools = saved.tools || F.tools
        F.upgrades = saved.upgrades || F.upgrades
        F.hybrids = saved.hybrids || []
        F.stock = saved.stock || F.stock
        F.stall = saved.stall || F.stall
        F.animalProducts = saved.animalProducts || F.animalProducts
        F.achievements = saved.achievements || F.achievements
        if (saved.fields) {
          saved.fields.forEach(sf => {
            const f = F.fields.find(x => x.id === sf.id)
            if (f) {
              f.crop = sf.crop
              f.progress = sf.progress
              f.pest = sf.pest
            }
          })
        }
      }
    } catch (e) {
      console.error('Load failed:', e)
    }
  },
  
  saveBack: () => {
    FarmSave.save()
    location.href = 'index.html'
  },
  
  resetGame: () => {
    if (!confirm('确定要从头开始吗？所有进度将清空！')) return
    localStorage.removeItem('farm')
    location.reload()
  }
}

window.FarmSave = FarmSave
