const DoomUI = {
  renderStats: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const $ = window.DoomUtils.$
    
    const days = $('days')
    const survCount = $('surv-count')
    const vanHp = $('van-hp')
    const radLv = $('rad-lv')
    const morale = $('morale')
    
    if (days) days.textContent = D.day
    if (survCount) survCount.textContent = D.survivors.length
    if (vanHp) vanHp.textContent = Math.floor(D.vanHp) + '%'
    if (radLv) radLv.textContent = Math.floor(D.radiation) + ' rem'
    if (morale) morale.textContent = Math.floor(D.morale)
  },
  
  renderTime: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    const $ = window.DoomUtils.$
    
    const dnIcon = $('dn-icon')
    const dnPhase = $('dn-phase')
    const dnTime = $('dn-time')
    const dnBar = $('dn-bar')
    const nextPhase = $('next-phase')
    
    if (dnIcon) dnIcon.textContent = D.isDay ? '☀️' : '🌙'
    if (dnPhase) dnPhase.textContent = D.isDay ? '白天' : '夜晚'
    if (dnTime) dnTime.textContent = D.isDay ? `上午 ${D.hour}:00` : `下午 ${D.hour}:00`
    if (dnBar) dnBar.style.width = (D.isDay ? D.timeOfDay : 100 - D.timeOfDay) + '%'
    if (nextPhase) nextPhase.textContent = D.isDay ? `${12 - D.hour}h 后入夜` : `${24 - D.hour}h 后日出`
  }
}

window.DoomUI = DoomUI
