/**
 * ═══════════════════════════════════════════════════════════
 * 主入口模块 - 导出所有功能到全局并合并数据
 * ═══════════════════════════════════════════════════════════
 */

// 等待所有模块加载完成后，将常用函数导出到全局作用域
(function() {
  // 合并所有数据模块到 C 对象
  window.C = {};
  
  if (window.CafeBaseData) Object.assign(window.C, window.CafeBaseData);
  if (window.CafeIngredientsData) Object.assign(window.C, window.CafeIngredientsData);
  if (window.CafeEquipmentData) Object.assign(window.C, window.CafeEquipmentData);
  if (window.CafeStaffData) Object.assign(window.C, window.CafeStaffData);
  if (window.CafeVIPData) Object.assign(window.C, window.CafeVIPData);
  if (window.CafeReviewsData) Object.assign(window.C, window.CafeReviewsData);
  if (window.CafeEventsData) Object.assign(window.C, window.CafeEventsData);
  if (window.CafeResearchData) Object.assign(window.C, window.CafeResearchData);
  
  // 工具函数直接暴露
  if (window.CafeUtils) {
    window.$ = window.CafeUtils.$;
    window.fmt = window.CafeUtils.fmt;
    window.addLog = window.CafeUtils.addLog;
    window.sw = window.CafeUtils.sw;
    window.ts = window.CafeUtils.ts;
  }
  
  // 系统模块
  window.CafeSystems = {
    orders: window.CafeOrders,
    ingredients: window.CafeIngredients,
    equipment: window.CafeEquipment,
    staff: window.CafeStaff,
    vip: window.CafeVIP,
    reviews: window.CafeReviews
  };
  
  // 功能模块
  window.CafeFeatures = {
    brew: window.CafeBrew,
    research: window.CafeResearch
  };
  
  // 核心和 UI
  window.CafeCoreModule = window.CafeCore;
  window.CafeUIModule = window.CafeUI;
  
  // 操作函数暴露到全局（供 onclick 使用）
  if (window.CafeActions) {
    window.genOrder = window.CafeActions.genOrder;
    window.startBrew = window.CafeActions.startBrew;
    window.doStepAction = window.CafeActions.doStepAction;
    window.nextStep = window.CafeActions.nextStep;
    window.completeBrew = window.CafeActions.completeBrew;
    window.buyEquip = window.CafeActions.buyEquip;
    window.hireStaff = window.CafeActions.hireStaff;
    window.restock = window.CafeActions.restock;
    window.activateEvent = window.CafeActions.activateEvent;
    window.recruitVip = window.CafeActions.recruitVip;
    window.startResearch = window.CafeActions.startResearch;
    window.toggleOpen = window.CafeActions.toggleOpen;
    window.callCustomer = window.CafeActions.callCustomer;
    window.createCustom = window.CafeActions.createCustom;
    window.drawRevChart = window.CafeActions.drawRevChart;
  }
  
  // 存档系统函数暴露到全局
  if (window.CafeSave) {
    window.save = window.CafeSave.save;
    window.load = window.CafeSave.load;
    window.saveBack = window.CafeSave.saveBack;
    window.resetGame = window.CafeSave.resetGame;
    window.st = window.CafeSave.st;
  }
  
  // 渲染函数
  if (window.CafeRender) {
    window.render = window.CafeRender.render;
  }
  
  console.log('[Cafe] 所有模块已加载到全局作用域');
  console.log('[Cafe] 数据模块:', Object.keys(window.C || {}));
  console.log('[Cafe] 系统模块:', Object.keys(window.CafeSystems || {}));
  console.log('[Cafe] 功能模块:', Object.keys(window.CafeFeatures || {}));
})();
