// Save system
const AncientSave = {
  save: () => {
    localStorage.setItem('ancient', JSON.stringify(AncientState.G));
  },
  
  load: () => {
    try {
      const d = JSON.parse(localStorage.getItem('ancient') || 'null');
      if (d) { Object.assign(AncientState.G, d); return true; }
      return false;
    } catch(e) { return false; }
  },
  
  addLog: (text, type='info') => {
    AncientState.G.log.unshift({age: AncientState.G.age, text, type});
    if (AncientState.G.log.length > 200) AncientState.G.log.pop();
  },
  
  roll: (rate) => {
    return Math.random() < Math.max(0.05, Math.min(0.95, rate));
  }
};

window.AncientSave = AncientSave;
