const FarmUtils = {
  $: id => document.getElementById(id),
  
  ts: () => new Date().toTimeString().slice(0, 8),
  
  fmt: num => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toString()
  },
  
  addLog: (msg, type = '') => {
    const b = FarmUtils.$('flog')
    if (!b) return
    const d = document.createElement('div')
    d.className = 'll ' + type
    d.innerHTML = `<span class="lts">[${FarmUtils.ts()}]</span> <span class="lm">${msg}</span>`
    b.prepend(d)
    while (b.children.length > 60) b.removeChild(b.lastChild)
  },
  
  tlog: (msg, type = '') => {
    const b = FarmUtils.$('trade-log')
    if (!b) return
    const d = document.createElement('div')
    d.className = 'll ' + type
    d.innerHTML = `<span class="lts">[${FarmUtils.ts()}]</span> <span class="lm">${msg}</span>`
    b.prepend(d)
    while (b.children.length > 60) b.removeChild(b.lastChild)
  },
  
  rdlog: (msg, type = '') => {
    const b = FarmUtils.$('rd-log')
    if (!b) return
    const d = document.createElement('div')
    d.className = 'll ' + type
    d.innerHTML = `<span class="lts">[${FarmUtils.ts()}]</span> <span class="lm">${msg}</span>`
    b.prepend(d)
    while (b.children.length > 60) b.removeChild(b.lastChild)
  },
  
  sw: i => {
    document.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('on', i === j))
    document.querySelectorAll('.panel').forEach((p, j) => p.classList.toggle('on', i === j))
    if (window.FarmRender) window.FarmRender.render()
  }
}

window.FarmUtils = FarmUtils
