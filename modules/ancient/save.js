// Save system
const AncientSave = {
  save: () => {
    localStorage.setItem('ancient', JSON.stringify(AncientState.G));
  },
  
  load: () => {
    try {
      const d = JSON.parse(localStorage.getItem('ancient') || 'null');
      if (d) {
        Object.assign(AncientState.G, d);
        // ── 旧存档字段兼容补丁 ──────────────────────────
        const G = AncientState.G;
        if (!Array.isArray(G.inventory))          G.inventory = [];
        if (G.bagLimit == null)                   G.bagLimit = 5;
        if (!Array.isArray(G.diseases))           G.diseases = [];
        if (!Array.isArray(G.npcs))               G.npcs = [];
        if (!Array.isArray(G.concubines))         G.concubines = [];
        if (!Array.isArray(G.lovers))             G.lovers = [];
        if (!Array.isArray(G.children))           G.children = [];
        if (!Array.isArray(G.siblings))           G.siblings = [];
        if (!Array.isArray(G.parents))            G.parents = [];
        if (!Array.isArray(G.ancestors))          G.ancestors = [];
        if (!Array.isArray(G.estates))            G.estates = [];
        if (!Array.isArray(G.pendingMarriage))    G.pendingMarriage = [];
        if (!Array.isArray(G.illegitimateChildren)) G.illegitimateChildren = [];
        if (!Array.isArray(G.actionsThisYear))    G.actionsThisYear = [];
        if (!Array.isArray(G.tasksDoneThisYear))  G.tasksDoneThisYear = [];
        if (!Array.isArray(G.log))                G.log = [];
        if (G.venueStamina == null)               G.venueStamina = 100;
        if (G.spouseFavor == null)                G.spouseFavor = 80;
        if (G.civilExamLevel == null)             G.civilExamLevel = 0;
        if (G.militaryExamLevel == null)          G.militaryExamLevel = 0;
        if (G.civilExamGrade == null)             G.civilExamGrade = G.schoolGrade || 'F';
        if (G.militaryExamGrade == null)          G.militaryExamGrade = 'F';
        if (G.civilExamRecommended == null)       G.civilExamRecommended = G.examRecommended || false;
        if (G.militaryExamRecommended == null)    G.militaryExamRecommended = false;
        if (G.militaryExamPassed == null)         G.militaryExamPassed = false;
        if (G.inWuguan == null)                   G.inWuguan = false;
        if (G._pregnancyBoostSachetCount == null) G._pregnancyBoostSachetCount = 0;
        // ────────────────────────────────────────────────
        return true;
      }
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