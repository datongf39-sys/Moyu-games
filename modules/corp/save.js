/**
 * ═══════════════════════════════════════════════════════════
 * 存档系统模块
 * ═══════════════════════════════════════════════════════════
 */

// 保存游戏
function save() {
  try {
    const upgradesSave = G.upgrades ? G.upgrades.map(u => ({ id: u.id, bought: u.bought })) : [];
    localStorage.setItem('corp', JSON.stringify({
      cash: G.cash, total: G.total, cps: G.cps, clickVal: G.clickVal,
      xp: G.xp, xpMax: G.xpMax, level: G.level,
      staffCounts: G.staffCounts, employees: G.employees,
      shares: G.shares, avgBasis: G.avgBasis, stockHist: G.stockHist,
      depts: G.depts, office: G.office,
      upgradesBought: upgradesSave,
      hrPolicy: G.hrPolicy, culture: G.culture,
      projDone: G.projDone, projMult: G.projMult, effMult: G.effMult, happyB: G.happyB,
      milestones: G.milestones,
      activeProjects: G.activeProjects,
      news: G.news,
      rivals: G.rivals
    }));
  } catch (e) {
    console.error('保存失败:', e);
  }
}

// 加载游戏
function load() {
  try {
    const s = JSON.parse(localStorage.getItem('corp') || '{}');
    if (s.cash) {
      const fields = ['cash', 'total', 'cps', 'clickVal', 'xp', 'xpMax', 'level',
        'staffCounts', 'employees', 'shares', 'avgBasis', 'stockHist', 'depts', 'office',
        'hrPolicy', 'culture', 'projDone', 'projMult', 'effMult', 'happyB', 'milestones',
        'activeProjects', 'news', 'rivals'];
      fields.forEach(k => { 
        if (s[k] !== undefined) {
          if (Array.isArray(G[k]) && Array.isArray(s[k])) {
            G[k] = [...s[k]];
          } else if (typeof G[k] === 'object' && G[k] !== null) {
            G[k] = { ...G[k], ...s[k] };
          } else {
            G[k] = s[k];
          }
        }
      });
      
      // 恢复 upgrades
      if (G.upgrades && s.upgradesBought) {
        s.upgradesBought.forEach(su => {
          const u = G.upgrades.find(x => x.id === su.id);
          if (u) u.bought = su.bought;
        });
      }
      
      // 重新计算 CPS
      if (typeof window.CorpEmployees?.recalc === 'function') {
        window.CorpEmployees.recalc();
      }
    }
  } catch (e) {
    console.error('加载失败:', e);
  }
}

// 保存并返回
function saveBack() {
  save();
  location.href = 'index.html';
}

// 重置游戏
function resetGame() {
  if (!confirm('确定要从头开始吗？所有进度将清空！')) return;
  localStorage.removeItem('corp');
  location.reload();
}

// 主题切换
function st(t) {
  localStorage.setItem('moyu-theme', t);
  document.documentElement.setAttribute('data-theme', t);
}

// 导出
window.CorpSave = { save, load, saveBack, resetGame, st };
