const DoomRender = {
  render: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (window.DoomUI) {
      window.DoomUI.renderStats()
      window.DoomUI.renderTime()
    }
    
    const $ = window.DoomUtils.$
    
    // Resources
    const resourcesEl = $('resources')
    if (resourcesEl && D.resources) {
      resourcesEl.innerHTML = Object.entries(D.resources).map(([key, val]) => {
        const max = D.maxRes[key]
        const pct = Math.min(100, val / max * 100)
        const col = pct >= 50 ? 'pbg' : pct >= 25 ? 'pba' : 'pbr'
        const warn = pct <= 15 ? '<span class="res-warn">⚠️低</span>' : ''
        return `<div class="res-bar"><div class="res-icon">${D.resIcons[key]}</div><div class="res-name">${D.resNames[key]}</div><div class="res-track"><div class="res-fill ${col}" style="width:${pct}%"></div></div><div class="res-val">${Math.floor(val)}/${max}</div>${warn}</div>`
      }).join('')
    }
    
    // Map
    const mapEl = $('map-grid')
    if (mapEl && D.map) {
      mapEl.innerHTML = D.map.slice(0, 13).map(loc => {
        const fuelNeed = 3 + Math.floor(Math.abs((loc.x || 3) - 3) + Math.abs((loc.y || 3) - 3)) * 2
        const canGo = D.resources.fuel >= fuelNeed && !D.exploring && !loc.current
        return `<div class="map-cell ${loc.current ? 'current' : ''} ${loc.explored && !loc.current ? 'explored' : ''}" onclick="${canGo ? `DoomActions.explore(${loc.id})` : ''}">
          <div>${loc.icon}</div>
          <div class="cell-label">${loc.name.slice(0, 4)}</div>
          ${!loc.explored && loc.loot === 'high' ? '<div class="loot-badge"></div>' : ''}
        </div>`
      }).join('')
    }
    
    // Survivors
    const survListEl = $('surv-list')
    if (survListEl && D.survivors) {
      survListEl.innerHTML = D.survivors.map(s => `<div class="surv-card">
      <div class="surv-top"><div><span style="font-size:12px;font-weight:500">${s.icon}${s.name}</span> <span class="bdg ${s.status === '健康' ? 'bdg-g' : s.status === '受伤' ? 'bdg-a' : 'bdg-r'}">${s.status}</span></div><span style="font-size:10px;color:var(--faint)">${s.role}</span></div>
      <div class="res-bar" style="padding:3px 0;border:none"><div class="res-icon">❤️</div><div class="res-track"><div class="res-fill ${s.hp >= 60 ? 'pbg' : s.hp >= 30 ? 'pba' : 'pbr'}" style="width:${s.hp / s.maxHp * 100}%"></div></div><div class="res-val" style="font-size:9px">${s.hp}/${s.maxHp}</div></div>
      <div class="res-bar" style="padding:3px 0;border:none"><div class="res-icon">🍞</div><div class="res-track"><div class="res-fill pbg" style="width:${s.hunger}%"></div></div><div class="res-val" style="font-size:9px">${s.hunger}%</div></div>
      <div class="surv-stats">${Object.entries(s.skills).map(([sk, lv]) => `<div>${D.skillNames[sk]}:<span>${lv}</span></div>`).join('')}</div>
    </div>`).join('')
    }
    
    // Van upgrades
    const vanUpgradesEl = $('van-upgrades')
    if (vanUpgradesEl && D.vanUpgrades) {
      vanUpgradesEl.innerHTML = D.vanUpgrades.map(u => {
        const canAfford = Object.entries(u.cost).every(([r, a]) => D.resources[r] >= a)
        const costStr = Object.entries(u.cost).map(([r, a]) => `${D.resIcons[r]}${a}`).join(' ')
        return `<div class="van-slot"><div class="vs-icon">${u.icon}</div><div class="vs-info"><div class="vs-name">${u.name}</div><div class="vs-desc">${u.desc}</div></div>${u.bought ? '<span class="bdg bdg-g">已安装</span>' : `<div style="text-align:right"><div class="faint" style="margin-bottom:3px">${costStr}</div><button class="btn ba bsm" onclick="DoomActions.buyUpgrade('${u.id}')" ${canAfford ? '' : 'disabled'}>安装</button></div>`}</div>`
      }).join('')
    }
    
    // Van equipment
    const vanEquipEl = $('van-equip')
    if (vanEquipEl && D.vanEquip) {
      vanEquipEl.innerHTML = D.vanEquip.map(e => {
        const canAfford = Object.entries(e.cost).every(([r, a]) => D.resources[r] >= a)
        const costStr = Object.entries(e.cost).map(([r, a]) => `${D.resIcons[r]}${a}`).join(' ')
        return `<div class="van-slot"><div class="vs-icon">${e.icon}</div><div class="vs-info"><div class="vs-name">${e.name}</div><div class="vs-desc">${e.desc}</div></div>${e.bought ? '<span class="bdg bdg-g">已装备</span>' : `<div style="text-align:right"><div class="faint">${costStr}</div><button class="btn ba bsm" onclick="DoomActions.buyEquip('${e.id}')" ${canAfford ? '' : 'disabled'}>安装</button></div>`}</div>`
      }).join('')
    }
    
    // Inventory
    const inventoryEl = $('inventory')
    if (inventoryEl && D.inventory) {
      D.weight = D.inventory.reduce((a, i) => a + i.weight * i.count, 0)
      const wp = (D.weight / D.maxWeight) * 100
      inventoryEl.innerHTML = D.inventory.map(item => `
        <div class="row"><div><div class="rn">${item.icon}${item.name}</div><div class="rdd">${item.type}·${item.weight}kg/件·共${(item.weight * item.count).toFixed(1)}kg</div></div>
        <div class="rr"><span class="faint">×${item.count}</span><button class="btn bg bxs" onclick="DoomActions.useItem('${item.id}')" ${item.count > 0 ? '' : 'disabled'}>使用</button></div></div>`).join('')
    }
    
    // Crafting
    const craftingEl = $('crafting')
    if (craftingEl) {
      craftingEl.innerHTML = D.vanUpgrades.find(u => u.id === 'lab')?.bought ? `
        <div class="row"><div class="rn">🧪 消炎药</div><div class="rr"><span class="faint">需 5 废料 +2 电池</span><button class="btn bg bsm" onclick="DoomActions.craftItem('bandage')" ${D.resources.scrap >= 5 && D.resources.battery >= 2 ? '' : 'disabled'}>合成</button></div></div>
        <div class="row"><div class="rn">🔥 燃烧瓶</div><div class="rr"><span class="faint">需 3 废料 +2 燃料</span><button class="btn br bsm" onclick="DoomActions.craftItem('molotov')" ${D.resources.scrap >= 3 && D.resources.fuel >= 2 ? '' : 'disabled'}>合成</button></div></div>`
        : '<div class="faint" style="padding:8px">需要安装研究实验室才能合成物品</div>'
    }
    
    // Tasks
    const tasksEl = $('daily-tasks')
    if (tasksEl && D.dailyTasks) {
      tasksEl.innerHTML = D.dailyTasks.map(t => {
        const done = t.done || (t.check && t.check())
        return `<div class="row"><div><div class="rn">${t.icon} ${t.text}</div></div><div class="rr">${done ? '<span class="bdg bdg-g">✓完成</span>' : '<span class="faint">进行中</span>'}</div></div>`
      }).join('')
    }
    
    // Achievements
    const achEl = $('doom-ach')
    if (achEl && D.achievements) {
      achEl.innerHTML = D.achievements.map(a => `<div class="row">
        <div><div class="rn">${a.icon}${a.name}</div><div class="rdd">${a.desc}</div></div>
        <div class="rr">${a.done ? '<span class="bdg bdg-g">✓</span>' : '<span class="faint">未达成</span>'}</div>
      </div>`).join('')
    }
    
    // Location
    const curLoc = D.map.find(m => m.current)
    if (curLoc) {
      const locIcon = $('loc-icon')
      const locName = $('loc-name')
      const locDesc = $('loc-desc')
      if (locIcon) locIcon.textContent = curLoc.icon
      if (locName) locName.textContent = curLoc.name
      if (locDesc) locDesc.textContent = curLoc.desc || '未知区域'
    }
    
    // Threats
    const threatsEl = $('threats')
    if (threatsEl) {
      threatsEl.innerHTML = `
        <div class="row"><div class="rn">🧟 丧尸密度</div><div class="rr"><span class="bdg ${D.day<3?'bdg-g':D.day<7?'bdg-a':'bdg-r'}">${D.day<3?'低':D.day<7?'中':'高'}</span></div></div>
        <div class="row"><div class="rn">☢️ 辐射扩散</div><div class="rr"><span class="bdg ${D.radiation<30?'bdg-g':'bdg-r'}">${D.radiation<30?'安全':'危险'}</span></div></div>
        <div class="row"><div class="rn">⚡ 物资稀缺</div><div class="rr"><span class="bdg ${D.resources.food>30?'bdg-g':D.resources.food>10?'bdg-a':'bdg-r'}">${D.resources.food>30?'充足':D.resources.food>10?'紧张':'危急'}</span></div></div>
      `
    }
    
    // Quick actions
    const quickActionsEl = $('quick-actions')
    if (quickActionsEl) {
      quickActionsEl.innerHTML = `
        <div class="row"><div class="rn">🔧 紧急修车</div><div class="rr"><span class="faint">需要 10 废料</span><button class="btn bg bsm" onclick="DoomActions.repairVan()" ${D.resources.scrap>=10?'':'disabled'}>修复</button></div></div>
        <div class="row"><div class="rn">💧 净化用水</div><div class="rr"><span class="faint">+15 水</span><button class="btn bc bsm" onclick="if(D.resources.battery>=2){D.resources.battery-=2;D.resources.water=Math.min(D.maxRes.water,D.resources.water+15);DoomUtils.addLog('💧 净化用水 +15','lok');DoomRender.render()}" ${D.resources.battery>=2?'':'disabled'}>净化</button></div></div>
        <div class="row"><div class="rn">🍲 烹饪食物</div><div class="rr"><span class="faint">+20 食物</span><button class="btn ba bsm" onclick="if(D.resources.scrap>=3){D.resources.scrap-=3;D.resources.food=Math.min(D.maxRes.food,D.resources.food+20);DoomUtils.addLog('🍲 烹饪食物 +20','lok');DoomRender.render()}" ${D.resources.scrap>=3?'':'disabled'}>烹饪</button></div></div>
      `
    }
    
    // Explore team
    const exploreTeamEl = $('explore-team')
    if (exploreTeamEl) {
      const selLoc = D.map.find(m => m.id === D.selectedLocId)
      exploreTeamEl.innerHTML = `<div class="row"><div class="rn">探索中</div><div class="rr"><span class="bdg ${D.exploring?'bdg-a pulse':'bdg-g'}">${D.exploring?'进行中':'待命'}</span></div></div>
        <div class="row"><div class="rn">搜刮加成</div><div class="rr"><span class="faint">+${D.survivors.reduce((a,s)=>a+(s.skills?.scavenge||0),0)*10}%</span></div></div>`
    }
    
    // Loot log
    const lootLogEl = $('loot-log')
    if (lootLogEl) {
      lootLogEl.innerHTML = '<div class="faint" style="padding:4px">暂无探索记录</div>'
    }
    
    // Rad warning
    const radWarningEl = $('rad-warning')
    if (radWarningEl) {
      const highRadLocs = D.map.filter(m => m.explored && m.rad > 50)
      radWarningEl.innerHTML = highRadLocs.length > 0 
        ? highRadLocs.map(m => `<div class="row"><div class="rn">${m.icon}${m.name}</div><div class="rr"><span class="bdg bdg-r">${m.rad}rem</span></div></div>`).join('')
        : '<div class="faint" style="padding:8px">无高辐射区域</div>'
    }
    
    // Item use
    const itemUseEl = $('item-use')
    if (itemUseEl) {
      itemUseEl.innerHTML = '<div class="faint" style="padding:8px">选择物品使用</div>'
    }
    
    // Inv stats
    const invStatsEl = $('inv-stats')
    if (invStatsEl && D.inventory) {
      const totalItems = D.inventory.reduce((a, i) => a + i.count, 0)
      const totalWeight = D.inventory.reduce((a, i) => a + i.weight * i.count, 0)
      invStatsEl.innerHTML = `
        <div class="row"><div class="rn">物品总数</div><div class="rr">${totalItems} 件</div></div>
        <div class="row"><div class="rn">总重量</div><div class="rr">${totalWeight.toFixed(1)}kg</div></div>
        <div class="row"><div class="rn">背包容量</div><div class="rr">${D.weight.toFixed(1)}/${D.maxWeight}kg</div></div>
      `
    }
    
    // Van status detail
    const vanStatusDetailEl = $('van-status-detail')
    if (vanStatusDetailEl) {
      vanStatusDetailEl.innerHTML = `
        <div class="row"><div class="rn">🚐 房车耐久</div><div class="rr">${Math.floor(D.vanHp)}/${D.vanMaxHp}</div></div>
        <div class="row"><div class="rn">📦 载重容量</div><div class="rr">${D.maxWeight}kg</div></div>
      `
    }
    
    // Van repair
    const vanRepairEl = $('van-repair')
    if (vanRepairEl) {
      const repairCost = Math.floor((D.vanMaxHp - D.vanHp) * 0.5)
      vanRepairEl.innerHTML = D.vanHp >= D.vanMaxHp 
        ? '<div class="faint" style="padding:8px">房车状态良好</div>'
        : `<div class="row"><div class="rn">🔧 修复房车</div><div class="rr"><span class="faint">${D.resIcons.scrap}${repairCost}</span><button class="btn bg bsm" onclick="DoomActions.repairVan()" ${D.resources.scrap >= repairCost ? '' : 'disabled'}>修复</button></div></div>`
    }
    
    // Survivor skills
    const survSkillsEl = $('surv-skills')
    if (survSkillsEl && D.survivors && D.survivors.length > 0) {
      const allSkills = {}
      D.survivors.forEach(s => {
        Object.entries(s.skills).forEach(([k, v]) => {
          allSkills[k] = (allSkills[k] || 0) + v
        })
      })
      survSkillsEl.innerHTML = Object.entries(allSkills).map(([k, v]) => 
        `<div class="row"><div class="rn">${D.skillNames[k]}</div><div class="rr">Lv.${v}</div></div>`
      ).join('') || '<div class="faint" style="padding:8px">无技能</div>'
    }
    
    // Assignments
    const assignmentsEl = $('assignments')
    if (assignmentsEl && D.survivors) {
      assignmentsEl.innerHTML = D.survivors.map(s => 
        `<div class="row"><div class="rn">${s.icon}${s.name}</div><div class="rr"><select class="btn bsm"><option>待命</option><option>探索</option><option>采集</option></select></div></div>`
      ).join('')
    }
    
    // Personal status
    const pStatusEl = $('p-status')
    if (pStatusEl) {
      const hpPct = D.survivors[0]?.hp || 100
      const hpColor = hpPct >= 60 ? 'var(--green)' : hpPct >= 30 ? 'var(--amber)' : 'var(--red)'
      const radC = D.radiation > 50 ? 'var(--red)' : D.radiation > 20 ? 'var(--amber)' : 'var(--green)'
      pStatusEl.innerHTML = `
        <div class="row"><div class="rn">❤️ 生命值</div><div class="rr"><span style="color:${hpColor}">${hpPct}%</span></div></div>
        <div class="row"><div class="rn">☢️ 辐射量</div><div class="rr"><span style="color:${radC}">${D.radiation}rem</span></div></div>
        <div class="row"><div class="rn">🦠 感染度</div><div class="rr"><span style="color:${D.infection>30?'var(--red)':'var(--green)'}">${D.infection}%</span></div></div>
        <div class="row"><div class="rn">💪 经验值</div><div class="rr"><span class="faint">${D.xp} XP</span></div></div>
        ${D.radiation>20?`<div class="mt8"><button class="btn bg bsm" onclick="if(D.resources.medicine>=5){D.resources.medicine-=5;D.radiation=Math.max(0,D.radiation-20);DoomUtils.addLog('💊 服用抗辐射药','lok');DoomRender.render()}" ${D.resources.medicine>=5?'':'disabled'}>💊 服用抗辐射药 (需 5 医药)</button></div>`:''}
      `
    }
    
    // Skill tree
    const skillTreeEl = $('skill-tree')
    if (skillTreeEl && D.skills) {
      skillTreeEl.innerHTML = Object.entries(D.skills).map(([sk, lv]) => 
        `<div class="row"><div><div class="rn">${D.skillNames[sk]}</div><div class="rdd">${'★'.repeat(lv)}${'☆'.repeat(5 - lv)}</div></div><div class="rr"><button class="btn bc bxs" onclick="if(D.xp>=50*(D.skills['${sk}']+1)){D.xp-=50*(D.skills['${sk}']+1);D.skills['${sk}']++;DoomUtils.addLog('⬆️ 技能升级:${D.skillNames[sk]}','lok');DoomRender.render()}" ${D.xp>=50*(lv+1)?'':'disabled'}>升级 (${50*(lv+1)}XP)</button></div></div>`
      ).join('')
    }
    
    // Rad detail
    const radDetailEl = $('rad-detail')
    if (radDetailEl) {
      const radC = D.radiation > 50 ? 'var(--red)' : D.radiation > 20 ? 'var(--amber)' : 'var(--green)'
      const hasGasMask = D.vanEquip.find(e => e.id === 'gasmask')?.bought
      radDetailEl.innerHTML = `
        <div class="row"><div class="rn">当前辐射</div><div class="rr"><span style="color:${radC}">${D.radiation}rem</span></div></div>
        <div class="row"><div class="rn">感染度</div><div class="rr"><span style="color:${D.infection>30?'var(--red)':'var(--green)'}">${D.infection}%</span></div></div>
        <div class="row"><div class="rn">抗辐射装备</div><div class="rr"><span class="bdg ${hasGasMask?'bdg-g':'bdg-r'}">${hasGasMask?'已装备':'未装备'}</span></div></div>
      `
    }
    
    // Doom stats
    const doomStatsEl = $('doom-stats')
    if (doomStatsEl) {
      doomStatsEl.innerHTML = `
        <div class="row"><div class="rn">存活天数</div><div class="rr"><span class="faint">${D.day}天</span></div></div>
        <div class="row"><div class="rn">探索地点</div><div class="rr"><span class="faint">${D.map.filter(m=>m.explored&&m.id!==0).length}/${D.map.length-1}处</span></div></div>
        <div class="row"><div class="rn">招募总数</div><div class="rr"><span class="faint">${D.survivors.length}人</span></div></div>
        <div class="row"><div class="rn">升级数量</div><div class="rr"><span class="faint">${D.vanUpgrades.filter(u=>u.bought).length}项</span></div></div>
      `
    }
  }
}

window.DoomRender = DoomRender
