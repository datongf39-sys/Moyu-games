const FarmFieldsSystem = {
  plant: fieldId => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const field = F.fields[fieldId]
    if (!field || field.crop) return
    
    const seed = F.seeds.find(s => s.id === F.selectedSeed)
    if (!seed) return
    
    if (seed.req && !F.upgrades.find(u => u.id === seed.req)?.bought) {
      const upgrade = F.upgrades.find(u => u.id === seed.req)
      window.FarmUtils.addLog(`❌ 需要${upgrade?.name || '升级'}才能种植`, 'lbad')
      return
    }
    
    field.crop = seed.id
    field.progress = 0
    field.pest = false
    window.FarmUtils.addLog(`🌱 在地块${fieldId + 1}种下${seed.icon}${seed.name}`, 'linfo')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  harvest: fieldId => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const field = F.fields[fieldId]
    if (!field || !field.crop || field.progress < 1) return
    
    const seed = F.seeds.find(s => s.id === field.crop)
    if (!seed) return
    
    const wMult = F.weathers[F.weather].mult
    const sMult = F.season === 0 ? 1.2 : F.season === 2 ? 1.1 : 1
    const ghMult = F.tools.find(t => t.id === 'greenhouse')?.bought ? 1.3 : 1
    const qualMult = field.quality || 1
    const price = Math.floor(seed.profit * (F.marketPrices[field.crop] / seed.profit) * qualMult)
    
    F.gold += price
    F.harvested++
    F.stock[field.crop] = (F.stock[field.crop] || 0) + 1
    
    window.FarmUtils.addLog(`✅ 收获${seed.icon}${seed.name} +¥${price}`, 'lok')
    
    field.crop = null
    field.progress = 0
    field.pest = false
    field.quality = 1
    
    if (window.FarmFeatures?.checkAch) window.FarmFeatures.checkAch()
    if (window.FarmRender) window.FarmRender.render()
  },
  
  harvestAll: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    F.fields.forEach((f, i) => {
      if (f.crop && f.progress >= 1) FarmFieldsSystem.harvest(i)
    })
  },
  
  plantAll: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    F.fields.forEach((f, i) => {
      if (!f.crop) FarmFieldsSystem.plant(i)
    })
  },
  
  killPest: fieldId => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const field = F.fields[fieldId]
    if (!field || !field.pest) return
    
    field.pest = false
    window.FarmUtils.addLog(`💊 消灭地块${fieldId + 1}的病虫害`, 'lok')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  updateGrowth: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    F.fields.forEach(f => {
      if (!f.crop || f.progress >= 1) return
      
      const seed = F.seeds.find(s => s.id === f.crop)
      if (!seed) return
      
      const wMult = F.weathers[F.weather].mult
      const sMult = F.season === 0 ? 1.2 : F.season === 2 ? 1.1 : 1
      const ghMult = F.tools.find(t => t.id === 'greenhouse')?.bought ? 1.3 : 1
      const wcMult = F.tools.find(t => t.id === 'watercan')?.bought ? 1.1 : 1
      const wkMult = 1 + F.workers.filter(w => w.task === 'plant' || true).reduce((a, w) => a + w.skill * 0.05, 0)
      
      f.progress += 0.001 * (1 / seed.time) * 100 * wMult * sMult * ghMult * wkMult * wcMult
      
      if (f.progress >= 1) {
        f.progress = 1
        window.FarmUtils.addLog(`✅ ${seed.icon}${seed.name}在地块${f.id + 1}成熟了！`, 'lok')
      }
    })
  }
}

window.FarmFieldsSystem = FarmFieldsSystem
