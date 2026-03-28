/**
 * ═══════════════════════════════════════════════════════════
 * 初始化模块
 * ═══════════════════════════════════════════════════════════
 */

// 初始化游戏
function init() {
  // 加载存档
  load();
  
  // 初始化股票历史
  if (G.stocks) {
    G.stocks.forEach(st => {
      if (!G.stockHist[st.id]) G.stockHist[st.id] = [st.price];
    });
  }
  
  // 初始化菜单状态
  if (G.menu) {
    G.menu.forEach(m => { if (!m.req) m.unlocked = true; });
  }
  
  // 初始新闻
  if (G.news && G.news.length === 0 && window.CorpNews) {
    window.CorpNews.gen();
  }
  
  // 初始项目
  if (G.projects && G.projects.length === 0 && window.CorpProjects) {
    window.CorpProjects.refresh();
  }
  
  // 初始渲染
  if (typeof render === 'function') render();
  
  // 启动日志
  addLog('clog', '🏢 公司运营系统启动', 'linfo');
  
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
window.CorpInit = { init };
