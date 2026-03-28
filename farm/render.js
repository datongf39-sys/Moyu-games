const FarmRender = {
  renderPlot: (field, small) => {
    const F = window.FarmCore?.getFarm()
    if (!F) return ''
    
    const seed = F.seeds.find(s => s.id === field.crop)
    const pct = Math.min(100, field.progress * 100)
    const ready = field.progress >= 1
    const pest = field.pest
    
    if (!field.crop) {
      return `<div class="plot" onclick="FarmFieldsSystem.plant(${field.id})">
        <div style="font-size:${small ? 12 : 18}px;color:var(--faint)">+</div>
        ${!small ? '<div class="plot-label">空地</div>' : ''}
      </div>`
    }
    
    return `<div class="plot ${ready ? 'ready' : ''} ${pest ? 'pest' : ''}" 
      onclick="${pest ? `FarmFieldsSystem.killPest(${field.id})` : ready ? `FarmFieldsSystem.harvest(${field.id})` : ''}">
      <div${pest ? ' class="pulse"' : ''}>${pest ? '🐛' : seed.icon}</div>
      ${!small ? `<div class="plot-label">${pest ? '点击除虫' : ready ? '点击收获' : (pct.toFixed(0) + '%')}</div>` : ''}
      <div class="plot-bar"><div class="plot-pf" style="width:${pct}%"></div></div>
    </div>`
  },
  
  render: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    if (window.FarmUI) {
      window.FarmUI.renderWeather()
      window.FarmUI.renderSeason()
      window.FarmUI.renderStats()
    }
    
    const $ = window.FarmUtils.$
    
    // Field overview
    $('overview-field').innerHTML = F.fields.map(f => FarmRender.renderPlot(f, true)).join('')
    $('main-field').innerHTML = F.fields.map(f => FarmRender.renderPlot(f, false)).join('')
    
    // Seeds
    $('seeds').innerHTML = F.seeds.map(s => {
      const unlocked = !s.req || F.upgrades.find(u => u.id === s.req)?.bought
      return `<div class="row">
        <div><div class="rn">${s.icon}${s.name}${!unlocked ? '🔒' : ''}</div>
        <div class="rdd">成熟:${s.time}s·利润:¥${s.profit}</div></div>
        <div class="rr">
          <button class="btn ${F.selectedSeed === s.id ? 'bg' : 'bo'} bsm" 
            onclick="F.selectedSeed='${s.id}';FarmRender.render()" 
            ${unlocked ? '' : 'disabled'}>选择</button>
        </div>
      </div>`
    }).join('')
    
    // Tools & upgrades
    $('tools').innerHTML = F.tools.map(t => `<div class="row">
      <div><div class="rn">${t.bought ? '✅ ' : ''}${t.icon}${t.name}</div><div class="rdd">${t.desc}</div></div>
      <div class="rr">${t.bought ? '<span class="bdg bdg-g">已购</span>' : 
        `<span class="faint">¥${t.cost}</span><button class="btn bo bsm" onclick="FarmToolsSystem.buyTool('${t.id}')" 
        ${F.gold >= t.cost ? '' : 'disabled'}>购买</button>`}
      </div>
    </div>`).join('')
    
    $('land-upgrade').innerHTML = F.upgrades.map(u => `<div class="row">
      <div><div class="rn">${u.bought ? '✅ ' : ''}${u.icon}${u.name}</div><div class="rdd">${u.desc}</div></div>
      <div class="rr">${u.bought ? '<span class="bdg bdg-g">已解锁</span>' : 
        `<span class="faint">¥${u.cost}</span><button class="btn bo bsm" onclick="FarmToolsSystem.buyUpgrade('${u.id}')" 
        ${F.gold >= u.cost ? '' : 'disabled'}>解锁</button>`}
      </div>
    </div>`).join('')
    
    // Crop status
    const growing = F.fields.filter(f => f.crop && f.progress < 1).length
    const ready = F.fields.filter(f => f.crop && f.progress >= 1).length
    const pests = F.fields.filter(f => f.pest).length
    $('crop-status').innerHTML = `
      <div class="row"><div class="rn">生长中</div><div class="rr"><span style="color:var(--amber)">${growing}块</span></div></div>
      <div class="row"><div class="rn">可收获</div><div class="rr"><span style="color:var(--green)">${ready}块</span></div></div>
      <div class="row"><div class="rn">病虫害</div><div class="rr"><span style="color:${pests > 0 ? 'var(--red)' : 'var(--faint)'}">${pests}块</span></div></div>
    `
    
    // Animals
    $('my-animals').innerHTML = F.animals.map((a, i) => `<div class="animal-card">
      <div class="ac-icon">${a.icon}</div>
      <div class="ac-info">
        <div class="ac-name">${a.name}</div>
        <div class="ac-desc">${a.desc}</div>
        <div class="ac-stats">
          <div>生命：<span style="color:${a.hp >= 60 ? 'var(--green)' : a.hp >= 30 ? 'var(--amber)' : 'var(--red)'}">${a.hp}%</span></div>
          <div>饱食：<span>${a.hunger || 100}%</span></div>
        </div>
        <div class="mt8 flex gap6">
          <button class="btn bo bxs" onclick="FarmAnimalsSystem.feed(${i})" ${F.gold >= 5 ? '' : 'disabled'}>喂食 (¥5)</button>
          <button class="btn bg bxs" onclick="FarmAnimalsSystem.collect(${i})" ${(a.timer || 0) >= a.produce.time ? '' : 'disabled'}>
            收获${a.produce.icon}(${Math.floor(a.timer || 0)}/${a.produce.time}s)
          </button>
        </div>
      </div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无牲畜</div>'
    
    const max = FarmAnimalsSystem.getMax()
    $('buy-animals').innerHTML = F.animalTypes.map(at => `<div class="animal-card">
      <div class="ac-icon">${at.icon}</div>
      <div class="ac-info">
        <div class="ac-name">${at.name}</div>
        <div class="ac-desc">${at.desc}</div>
      </div>
      <div class="rr">
        <span class="faint">¥${at.cost}</span>
        <button class="btn bo bsm" onclick="FarmAnimalsSystem.buy('${at.id}')" 
          ${F.gold >= at.cost && F.animals.length < max ? '' : 'disabled'}>购买</button>
      </div>
    </div>`).join('')
    
    $('animal-products').innerHTML = Object.entries(F.animalProducts).map(([item, qty]) => 
      `<div class="row">
        <div class="rn">${F.productIcons[item]}${F.productNames[item]}</div>
        <div class="rr">
          <span class="faint">×${qty}</span>
          <button class="btn bg bxs" onclick="FarmAnimalsSystem.sell('${item}')" ${qty > 0 ? '' : 'disabled'}>出售</button>
        </div>
      </div>`
    ).join('')
    
    $('animal-mgmt').innerHTML = `
      <div class="row"><div class="rn">当前数量</div><div class="rr"><span class="faint">${F.animals.length}/${max}</span></div></div>
      <div class="row"><div class="rn">饲料消耗</div><div class="rr"><span class="faint">${F.animals.length * 5}/天</span></div></div>
    `
    
    $('ranch-upgrade').innerHTML = F.upgrades.filter(u => u.id === 'ranch').map(u => `<div class="row">
      <div><div class="rn">${u.bought ? '✅ ' : ''}${u.icon}${u.name}</div><div class="rdd">${u.desc}</div></div>
      <div class="rr">${u.bought ? '<span class="bdg bdg-g">已升级</span>' : 
        `<span class="faint">¥${u.cost}</span><button class="btn bo bsm" onclick="FarmToolsSystem.buyUpgrade('${u.id}')" 
        ${F.gold >= u.cost ? '' : 'disabled'}>升级</button>`}
      </div>
    </div>`).join('')
    
    // Market
    $('market-prices').innerHTML = F.seeds.map(s => {
      const price = F.marketPrices[s.id]
      const base = s.profit
      const trend = price > base
      return `<div class="market-item">
        <div class="mi-icon">${s.icon}</div>
        <div class="mi-info">
          <div class="mi-name">${s.name}</div>
          <div class="mi-price">¥${price}/个 <span class="mi-trend" style="color:${trend ? 'var(--green)' : 'var(--red)'}">${trend ? '↑' : '↓'}</span></div>
        </div>
        <div class="rr">
          <span class="faint">库存:${F.stock[s.id] || 0}</span>
          <button class="btn bg bxs" onclick="FarmMarketSystem.sellStock('${s.id}')" ${(F.stock[s.id] || 0) > 0 ? '' : 'disabled'}>出售</button>
        </div>
      </div>`
    }).join('')
    
    $('my-stock').innerHTML = Object.entries(F.stock).map(([id, qty]) => {
      const s = F.seeds.find(x => x.id === id)
      return `<div class="row">
        <div class="rn">${s?.icon || '🌾'}${s?.name || id}</div>
        <div class="rr"><span class="faint">×${qty}</span></div>
      </div>`
    }).join('')
    
    $('wholesale').innerHTML = F.wholesale.map((w, i) => `<div class="row">
      <div><div class="rn">${w.icon}${w.name}</div><div class="rdd">需要×${w.qty}·单价¥${w.price}</div></div>
      <div class="rr">
        <span class="faint">库存:${F.stock[w.crop] || 0}</span>
        <button class="btn ba bsm" onclick="FarmMarketSystem.fillWholesale(${i})" 
          ${(F.stock[w.crop] || 0) >= w.qty ? '' : 'disabled'}>完成</button>
      </div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无批发订单</div>'
    
    $('stall').innerHTML = `
      <div class="row"><div class="rn">摊位状态</div><div class="rr">
        ${F.stall.active ? '<span class="bdg bdg-g">营业中</span>' : 
          `<button class="btn ba bsm" onclick="FarmMarketSystem.setupStall()" 
          ${F.gold >= F.stall.cost ? '' : 'disabled'}>开设摊位 (¥${F.stall.cost})</button>`}
      </div></div>
      ${F.stall.active ? `<div class="row"><div class="rn">摊位营收</div><div class="rr"><span style="color:var(--amber)">¥${Math.floor(F.stall.revenue)}</span></div></div>` : ''}
    `
    
    // Workers
    $('my-workers').innerHTML = F.workers.map(w => `<div class="worker-card">
      <div class="wc-icon">${w.icon}</div>
      <div class="wc-info">
        <div class="wc-name">${w.name}</div>
        <div class="wc-role">${w.role}·技能 Lv.${w.skill}</div>
        <div class="wc-stats">薪资:<span>¥${w.salary}/s</span></div>
      </div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无工人</div>'
    
    $('hire-workers').innerHTML = F.workerPool.map((w, i) => `<div class="worker-card">
      <div class="wc-icon">${w.icon}</div>
      <div class="wc-info">
        <div class="wc-name">${w.name}</div>
        <div class="wc-role">${w.role}</div>
      </div>
      <div class="rr">
        <span class="faint">¥${w.cost}</span>
        <button class="btn bo bsm" onclick="FarmWorkersSystem.hire(${i})" ${F.gold >= w.cost ? '' : 'disabled'}>雇用</button>
      </div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无可招募工人</div>'
    
    $('wages').innerHTML = `
      <div class="row"><div class="rn">工资总支出</div><div class="rr"><span class="faint">¥${FarmWorkersSystem.getTotalSalary()}/s</span></div></div>
      <div class="row"><div class="rn">工作加速</div><div class="rr"><span style="color:var(--green)">+${(FarmWorkersSystem.getWorkSpeed() - 1) * 100}%</span></div></div>
    `
    
    $('task-assign').innerHTML = `
      <div class="row"><div class="rn">🌱 种植</div><div class="rr"><span class="faint">${Math.floor(F.workers.length / 3)}人</span></div></div>
      <div class="row"><div class="rn">🌾 收割</div><div class="rr"><span class="faint">${Math.floor(F.workers.length / 3)}人</span></div></div>
      <div class="row"><div class="rn">🐄 照料牲畜</div><div class="rr"><span class="faint">${F.workers.length - Math.floor(F.workers.length / 3) * 2}人</span></div></div>
    `
    
    // Research
    const hasRd3 = F.upgrades.find(u => u.id === 'rd3')?.bought
    $('hybrid-lab').innerHTML = hasRd3 ? `
      <div style="font-size:10px;color:var(--muted);margin-bottom:10px">选择两种作物进行杂交，消耗¥200</div>
      <div id="hybrid-select" class="flex gap6 mb8">
        ${F.seeds.slice(0, 4).map(s => `<button class="btn ${F.researchTarget?.a?.id === s.id || F.researchTarget?.b?.id === s.id ? 'bg' : 'bo'} bxs" 
          onclick="window._hybridA='${s.id}'">
          ${s.icon}
        </button>`).join('')}
      </div>
      <div class="faint mb8">已选:${F.researchTarget ? `${F.researchTarget.a.icon}${F.researchTarget.a.name} × ${F.researchTarget.b.icon}${F.researchTarget.b.name}` : '未选'}</div>
      ${F.researchTarget ? `<div class="pb mb8"><div class="pbf pbg" style="width:${F.researchProg}%"></div></div><div class="faint">${F.researchProg.toFixed(0)}%</div>` : ''}
      <button class="btn bg bfull mt8" onclick="FarmResearchSystem.start('${F.seeds[0].id}','${F.seeds[2].id}')" ${F.gold >= 200 ? '' : 'disabled'}>🧬 开始杂交 (¥200)</button>
    ` : '<div class="faint" style="padding:8px">需要解锁高级研发</div>'
    
    $('hybrids').innerHTML = F.hybrids.map(h => `<div class="hybrid-card">
      <div class="flex gap6 mb4"><span style="font-size:16px">${h.icon}</span><span style="font-size:11px;font-weight:500">${h.name}</span></div>
      <div class="faint">成熟:${h.time}s·利润:¥${h.profit}</div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无杂交品种</div>'
    
    $('research-progress').innerHTML = F.upgrades.map(u => `<div class="row">
      <div><div class="rn">${u.bought ? '✅ ' : ''}${u.icon}${u.name}</div><div class="rdd">${u.desc}</div></div>
      <div class="rr">${u.bought ? '<span class="bdg bdg-g">已解锁</span>' : 
        `<span class="faint">¥${u.cost}</span><button class="btn bo bsm" onclick="FarmToolsSystem.buyUpgrade('${u.id}')" 
        ${F.gold >= u.cost ? '' : 'disabled'}>解锁</button>`}
      </div>
    </div>`).join('')
    
    $('tech-tree').innerHTML = `
      <div class="row"><div class="rn">研发等级</div><div class="rr"><span class="faint">Lv.${F.upgrades.filter(u => u.bought).length}</span></div></div>
      <div class="row"><div class="rn">解锁品种</div><div class="rr"><span style="color:var(--green)">${F.seeds.filter(s => !s.req || F.upgrades.find(u => u.id === s.req)?.bought).length}种</span></div></div>
      <div class="row"><div class="rn">杂交品种</div><div class="rr"><span class="faint">${F.hybrids.length}种</span></div></div>
    `
    
    // Pest alert
    const pestFields = F.fields.filter(f => f.pest)
    $('pest-alert').innerHTML = pestFields.length ? pestFields.map(f => `<div class="row">
      <div><div class="rn">🐛 地块${f.id + 1}病虫害</div><div class="rdd">点击地块除虫</div></div>
      <div class="rr"><button class="btn br bsm" onclick="FarmFieldsSystem.killPest(${f.id})">除虫</button></div>
    </div>`).join('') : '<div class="faint" style="padding:8px">✅ 暂无病虫害</div>'
    
    // Market quick
    const topSeed = F.seeds.reduce((a, s) => F.marketPrices[s.id] > F.marketPrices[a.id] ? s : a, F.seeds[0])
    $('mkt-quick').innerHTML = `
      <div class="row"><div class="rn">最高价作物</div><div class="rr"><span style="color:var(--amber)">${topSeed.icon}${topSeed.name} ¥${F.marketPrices[topSeed.id]}</span></div></div>
      <div class="row"><div class="rn">当前季节加成</div><div class="rr"><span style="color:var(--green)">${F.season === 0 ? '春季 +20%' : F.season === 2 ? '秋季 +10%' : '无加成'}</span></div></div>
    `
    
    // Achievements
    $('achievements').innerHTML = F.achievements.map(a => `<div class="row">
      <div><div class="rn">${a.icon}${a.name}</div><div class="rdd">${a.desc}</div></div>
      <div class="rr">${a.done ? '<span class="bdg bdg-g">✓</span>' : '<span class="faint">未达成</span>'}</div>
    </div>`).join('')
  }
}

window.FarmRender = FarmRender
