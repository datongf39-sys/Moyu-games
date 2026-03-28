const DoomEventSystem = {
  showEvent: ev => {
    const $ = window.DoomUtils.$
    if (!$('evt-overlay')) return
    
    $('evt-icon').textContent = ev.icon
    $('evt-title').textContent = ev.title
    $('evt-desc').textContent = ev.desc
    $('evt-choices').innerHTML = ev.choices.map((c, i) =>
      `<button class="btn ba bfull" onclick="DoomEventSystem.chooseEvent(${i})" style="margin-bottom:4px">${c.text}</button>`
    ).join('')
    
    $('evt-overlay').style.display = 'flex'
    window._evtChoices = ev.choices
  },
  
  chooseEvent: i => {
    const choices = window._evtChoices
    if (!choices || !choices[i]) return
    
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    choices[i].fn(D)
    window.DoomUtils.$('evt-overlay').style.display = 'none'
    if (window.DoomRender) window.DoomRender.render()
  },
  
  triggerRandom: () => {
    const D = window.DoomCore?.getDoom()
    if (!D) return
    
    if (Math.random() < 0.6) {
      const ev = D.eventPool[Math.floor(Math.random() * D.eventPool.length)]
      if (ev) DoomEventSystem.showEvent(ev)
    }
  }
}

window.DoomEventSystem = DoomEventSystem
