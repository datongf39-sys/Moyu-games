const FarmUI = {
  renderWeather: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    const w = F.weathers[F.weather]
    const $ = window.FarmUtils.$
    
    $('weatherlbl').textContent = w.icon + ' ' + w.name
    const wstrip = $('wstrip')
    if (wstrip) {
      const wsIcon = wstrip.querySelector('.ws-icon')
      const wsName = wstrip.querySelector('.ws-name')
      const wsDesc = wstrip.querySelector('.ws-desc')
      const wsNext = wstrip.querySelector('#next-weather')
      if (wsIcon) wsIcon.textContent = w.icon
      if (wsName) wsName.textContent = w.name
      if (wsDesc) wsDesc.textContent = w.desc
      if (wsNext) wsNext.textContent = Math.ceil(F.weatherTimer) + 's'
    }
  },
  
  renderSeason: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    const $ = window.FarmUtils.$
    const seasons = [
      { n: '春季', i: '🌸' },
      { n: '夏季', i: '☀️' },
      { n: '秋季', i: '🍂' },
      { n: '冬季', i: '❄️' }
    ]
    
    const seasonLbl = $('season-lbl')
    const seasonStrip = $('season-strip')
    if (seasonLbl) seasonLbl.textContent = seasons[F.season].i + seasons[F.season].n
    if (seasonStrip) seasonStrip.innerHTML = seasons.map((s, i) => 
      `<div class="season-block ${i === F.season ? 'current' : ''}">${s.i} ${s.n}</div>`
    ).join('')
  },
  
  renderStats: () => {
    const F = window.FarmCore?.getFarm()
    if (!F) return
    
    const $ = window.FarmUtils.$
    
    const gold = $('gold')
    const harvested = $('harvested')
    const workerCnt = $('worker-cnt')
    const animalCnt = $('animal-cnt')
    if (gold) gold.textContent = Math.floor(F.gold)
    if (harvested) harvested.textContent = F.harvested
    if (workerCnt) workerCnt.textContent = F.workers.length
    if (animalCnt) animalCnt.textContent = F.animals.length
  }
}

window.FarmUI = FarmUI
