const DoomSystems = {
  createSurvivor: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return null
    
    const names = ['老陈', '小美', '阿强', '王叔', '李姐', '小黑', '老周', '小芳', '大力', '阿飞']
    const icons = ['👩', '👨', '🧔', '👴', '👵', '🧕', '🧑', '👱']
    const skills = {
      scavenge: Math.floor(Math.random() * 3),
      medic: Math.floor(Math.random() * 3),
      combat: Math.floor(Math.random() * 3),
      mechanic: Math.floor(Math.random() * 3),
      cook: Math.floor(Math.random() * 3),
      sneak: Math.floor(Math.random() * 2),
      trade: Math.floor(Math.random() * 2)
    }
    
    return {
      id: Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      hp: 60 + Math.floor(Math.random() * 40),
      maxHp: 100,
      hunger: 50 + Math.floor(Math.random() * 30),
      thirst: 50 + Math.floor(Math.random() * 30),
      morale: 50 + Math.floor(Math.random() * 30),
      skills,
      role: '幸存者',
      status: '健康'
    }
  },
  
  consumeResources: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const cnt = D.survivors.length
    D.resources.food = Math.max(0, D.resources.food - cnt * 3)
    D.resources.water = Math.max(0, D.resources.water - cnt * 4)
    
    window.DoomUtils.addLog(`📅 第${D.day}天开始，消耗${cnt * 3}食物${cnt * 4}水`, 'linfo')
  },
  
  updateSurvivors: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    D.survivors.forEach(s => {
      s.hunger = Math.max(0, s.hunger - 15)
      s.thirst = Math.max(0, s.thirst - 20)
      
      if (s.hunger < 20 || s.thirst < 20) {
        s.hp = Math.max(1, s.hp - 10)
        s.morale = Math.max(0, s.morale - 10)
      }
      
      if (s.hp < 30) s.status = '危险'
      else if (s.hp < 60) s.status = '受伤'
      else s.status = '健康'
    })
  },
  
  applyVanUpgrades: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (D.vanUpgrades.find(u => u.id === 'solar')?.bought) {
      D.resources.battery = Math.min(D.maxRes.battery, D.resources.battery + 5)
      window.DoomUtils.addLog('☀️ 太阳能充电 +5 电池', 'linfo')
    }
    
    if (D.vanUpgrades.find(u => u.id === 'filter')?.bought) {
      D.resources.water = Math.min(D.maxRes.water, D.resources.water + 10)
      window.DoomUtils.addLog('💧 净水系统产水 +10L', 'linfo')
    }
  },
  
  updateRadiation: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const gasmask = D.vanEquip.find(e => e.id === 'gasmask')?.bought
    D.radiation = Math.max(0, D.radiation - 0.5)
    D.infection = Math.max(0, D.infection - 0.2)
    
    const medicSkill = D.survivors.reduce((a, s) => a + s.skills.medic, 0)
    if (medicSkill > 0) {
      D.infection = Math.max(0, D.infection - medicSkill * 0.1)
    }
    
    const mechSkill = D.survivors.reduce((a, s) => a + s.skills.mechanic, 0)
    if (mechSkill > 0 && D.vanHp < D.vanMaxHp) {
      D.vanHp = Math.min(D.vanMaxHp, D.vanHp + mechSkill * 0.05)
    }
  }
}

window.DoomSystems = DoomSystems
