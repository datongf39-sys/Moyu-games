/**
 * ═══════════════════════════════════════════════════════════
 * 核心逻辑模块
 * ═══════════════════════════════════════════════════════════
 */

// 游戏主循环
let tick = 0;
setInterval(() => {
  tick++;
  
  // CPS 收益
  if (G.cps > 0) {
    G.cash += G.cps / 10;
    G.total += G.cps / 10;
  }
  
  // 股票更新（每 30 秒）
  if (tick % 3000 === 0) {
    window.CorpStocks?.update();
  }
  
  // 项目进度
  G.activeProjects.forEach((p, i) => {
    p.progress += 1 / (p.time * 10);
    if (p.progress >= 1) {
      const r = Math.floor(p.reward * G.projMult);
      G.cash += r;
      G.total += r;
      G.projDone++;
      if (window.CorpUtils) window.CorpUtils.addLog('plog', `✅${p.icon}${p.name}+${fmt(r)}`, 'lok');
      if (window.CorpUtils) window.CorpUtils.addLog('clog', `🎉项目完成:${p.icon}${p.name}+${fmt(r)}`, 'lok');
      G.activeProjects.splice(i, 1);
      window.CorpMilestones?.check();
    }
  });
  
  // 竞争对手更新
  if (tick % 50 === 0) {
    G.rivals.forEach(r => {
      r.cash *= 1.02;
      r.lv = Math.max(r.lv, Math.floor(Math.log(r.cash / 1000) + 1));
    });
  }
  
  // 员工心情更新
  if (tick % 30 === 0) {
    window.CorpEmployees?.updateMood();
  }
  
  // 新闻生成
  if (tick % 600 === 0) {
    window.CorpNews?.gen();
  }
  
  // 渲染
  if (tick % 5 === 0) {
    if (window.CorpRender) window.CorpRender.render();
  }
  
  // 自动保存
  if (tick % 300 === 0) {
    if (window.CorpSave) window.CorpSave.save();
  }
}, 100);

// 导出
window.CorpCore = { tick };
