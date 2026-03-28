/**
 * ═══════════════════════════════════════════════════════════
 * 点击创收功能
 * ═══════════════════════════════════════════════════════════
 */

function doClick() {
  const G = window.CorpData?.G;
  const LVS = window.CorpUtils?.LVS;
  const addLog = window.CorpUtils?.addLog;
  
  if (!G) return;
  
  G.cash += G.clickVal;
  G.total += G.clickVal;
  G.xp += G.clickVal;
  
  // 升级检查
  while (G.xp >= G.xpMax) {
    G.xp -= G.xpMax;
    G.xpMax = Math.floor(G.xpMax * 1.6);
    G.level++;
    G.clickVal = Math.floor(G.clickVal * 1.4);
    addLog('clog', `🎊 升级！Lv.${G.level} ${LVS[Math.min(G.level - 1, 5)]}`, 'lok');
  }
  
  // 检查里程碑
  window.CorpMilestones?.check();
  
  // 重新渲染
  window.CorpRender?.render();
}

// 导出
window.CorpFeatureClick = { doClick };
