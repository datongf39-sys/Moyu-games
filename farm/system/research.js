const FarmResearchSystem = {
  start: (a, b) => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    const sa = F.seeds.find(s => s.id === a)
    const sb = F.seeds.find(s => s.id === b)
    if (!sa || !sb) return
    
    if (!F.upgrades.find(u => u.id === 'rd3')?.bought) {
      window.FarmUtils.addLog('需要高级研发', 'lbad')
      return
    }
    
    if (F.gold < 200) {
      window.FarmUtils.addLog('需要 200 金币', 'lbad')
      return
    }
    
    F.gold -= 200
    F.researchTarget = { a: sa, b: sb }
    F.researchProg = 0
    
    window.FarmUtils.addLog(`🧬 开始杂交:${sa.icon}${sa.name} × ${sb.icon}${sb.name}`, 'linfo')
    if (window.FarmRender) window.FarmRender.render()
  },
  
  update: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    if (!F.researchTarget || F.researchProg >= 100) return
    
    F.researchProg += 0.2
    
    if (F.researchProg >= 100) {
      const ra = F.researchTarget.a
      const rb = F.researchTarget.b
      const h = {
        name: `杂交${ra.name}×${rb.name}`,
        icon: '✨',
        time: Math.floor((ra.time + rb.time) / 2 * 0.8),
        profit: Math.floor((ra.profit + rb.profit) * 0.8)
      }
      
      F.hybrids.push(h)
      window.FarmUtils.rdlog(`✨ 杂交成功:${h.name} 利润¥${h.profit}`, 'lok')
      F.researchTarget = null
      F.researchProg = 0
      
      if (window.FarmFeatures?.checkAch) window.FarmFeatures.checkAch()
    }
  }
}

window.FarmResearchSystem = FarmResearchSystem
