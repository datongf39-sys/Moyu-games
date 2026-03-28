/**
 * ═══════════════════════════════════════════════════════════
 * 初始化模块
 * ═══════════════════════════════════════════════════════════
 */

// 初始化游戏
function init() {
  // 加载存档
  load();
  
  // 初始化菜单状态
  if (C.menu) {
    C.menu.forEach(m => { if (!m.req) m.unlocked = true; });
  }
  
  // 初始渲染
  if (typeof render === 'function') render();
  
  // 启动日志
  addLog('clog', '☕ 咖啡门店系统启动', 'linfo');
  addLog('clog', '💡 点击客户订单开始制作咖啡', 'linfo');
  
  // 时钟更新
  setInterval(() => {
    if ($('clk')) {
      $('clk').textContent = new Date().toTimeString().slice(0, 8);
    }
  }, 1000);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 导出
window.CafeInit = { init };
