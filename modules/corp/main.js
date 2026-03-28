/**
 * ═══════════════════════════════════════════════════════════
 * 主入口模块 - 导出所有功能到全局并合并数据
 * ═══════════════════════════════════════════════════════════
 */

// 等待所有模块加载完成后，将常用函数导出到全局作用域
(function() {
  // 合并所有数据模块到 G 对象
  window.G = {};
  
  if (window.CorpBaseData) Object.assign(window.G, window.CorpBaseData);
  if (window.CorpEmployeesData) Object.assign(window.G, window.CorpEmployeesData);
  if (window.CorpStocksData) Object.assign(window.G, window.CorpStocksData);
  if (window.CorpDeptsData) Object.assign(window.G, window.CorpDeptsData);
  if (window.CorpOfficeData) Object.assign(window.G, window.CorpOfficeData);
  if (window.CorpUpgradesData) Object.assign(window.G, window.CorpUpgradesData);
  if (window.CorpPolicyData) Object.assign(window.G, window.CorpPolicyData);
  if (window.CorpCultureData) Object.assign(window.G, window.CorpCultureData);
  if (window.CorpProjectsData) Object.assign(window.G, window.CorpProjectsData);
  if (window.CorpRivalsData) Object.assign(window.G, window.CorpRivalsData);
  if (window.CorpNewsData) Object.assign(window.G, window.CorpNewsData);
  if (window.CorpMilestonesData) Object.assign(window.G, window.CorpMilestonesData);
  
  // 添加 recalc 和 totalStaff 方法
  G.recalc = function() {
    let c = 0;
    G.hires.forEach(h => c += (G.staffCounts[h.id] || 0) * h.cps);
    if (G.depts.find(d => d.id === 'sales')?.built) c += 500;
    if (G.depts.find(d => d.id === 'ai')?.built) c *= 2;
    if (G.culture.find(x => x.id === 'c1')?.bought) c *= 1.2;
    if (G.upgrades.find(x => x.id === 'u2')?.bought) c *= 1.5;
    if (G.upgrades.find(x => x.id === 'u4')?.bought) c *= 2;
    if (G.upgrades.find(x => x.id === 'u6')?.bought) c *= 5;
    c *= G.effMult;
    G.cps = c;
  };
  
  G.totalStaff = function() {
    return Object.values(G.staffCounts).reduce((a, b) => a + b, 0);
  };
  
  G.hcost = function(h) {
    const cnt = G.staffCounts[h.id] || 0;
    const disc = G.depts.find(d => d.id === 'hr')?.built ? .85 : 1;
    return Math.floor(h.base * Math.pow(1.13, cnt) * (disc || 1));
  };
  
  // 工具函数直接暴露
  if (window.CorpUtils) {
    window.$ = window.CorpUtils.$;
    window.fmt = window.CorpUtils.fmt;
    window.LVS = window.CorpUtils.LVS;
    window.mood = window.CorpUtils.mood;
    window.addLog = window.CorpUtils.addLog;
    window.sw = window.CorpUtils.sw;
    window.ts = window.CorpUtils.ts;
  }
  
  // 系统模块
  window.CorpSystems = {
    employees: window.CorpEmployees,
    stocks: window.CorpStocks,
    depts: window.CorpDepts,
    office: window.CorpOffice,
    projects: window.CorpProjects,
    news: window.CorpNews
  };
  
  // 功能模块
  window.CorpFeatures = {
    click: window.CorpFeatureClick,
    milestones: window.CorpMilestones
  };
  
  // 核心和 UI
  window.CorpCoreModule = window.CorpCore;
  window.CorpUIModule = window.CorpUI;
  
  // 操作函数暴露到全局（供 onclick 使用）
  if (window.CorpActions) {
    window.doClick = window.CorpActions.doClick;
    window.hire = window.CorpActions.hire;
    window.buySt = window.CorpActions.buySt;
    window.sellSt = window.CorpActions.sellSt;
    window.buyDept = window.CorpActions.buyDept;
    window.buyOffice = window.CorpActions.buyOffice;
    window.buyUpgrade = window.CorpActions.buyUpgrade;
    window.buyPolicy = window.CorpActions.buyPolicy;
    window.buyCulture = window.CorpActions.buyCulture;
    window.refreshProj = window.CorpActions.refreshProj;
    window.startProj = window.CorpActions.startProj;
    window.drawChart = window.CorpActions.drawChart;
  }
  
  // 存档系统函数暴露到全局
  if (window.CorpSave) {
    window.save = window.CorpSave.save;
    window.load = window.CorpSave.load;
    window.saveBack = window.CorpSave.saveBack;
    window.resetGame = window.CorpSave.resetGame;
    window.st = window.CorpSave.st;
  }
  
  // 渲染函数
  if (window.CorpRender) {
    window.render = window.CorpRender.render;
  }
  
  // 里程碑检查
  if (window.CorpMilestones) {
    window.checkMiles = window.CorpMilestones.check;
  }
  
  console.log('[Corp] 所有模块已加载到全局作用域');
  console.log('[Corp] 数据模块:', Object.keys(window.G || {}));
  console.log('[Corp] 系统模块:', Object.keys(window.CorpSystems || {}));
  console.log('[Corp] 功能模块:', Object.keys(window.CorpFeatures || {}));
})();
