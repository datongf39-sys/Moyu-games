/**
 * ═══════════════════════════════════════════════════════════
 * 里程碑系统
 * ═══════════════════════════════════════════════════════════
 */

const milestones = {
  list: [
    { name: '第一桶金', desc: '营收¥10,000', check: () => {
      const G = window.CorpData?.G;
      return G && G.total >= 10000;
    }, done: false, icon: '💰' },
    
    { name: '初具规模', desc: '员工 10 人', check: () => {
      const employees = window.CorpEmployees;
      return employees && employees.total() >= 10;
    }, done: false, icon: '👥' },
    
    { name: '股市初体验', desc: '持有股票', check: () => {
      const stocks = window.CorpStocks;
      return stocks && Object.values(stocks.shares).some(v => v > 0);
    }, done: false, icon: '📈' },
    
    { name: '项目达人', desc: '完成 5 项目', check: () => {
      const projects = window.CorpProjects;
      return projects && projects.done >= 5;
    }, done: false, icon: '📋' },
    
    { name: '百人企业', desc: '员工 100 人', check: () => {
      const employees = window.CorpEmployees;
      return employees && employees.total() >= 100;
    }, done: false, icon: '🏢' },
    
    { name: '亿元俱乐部', desc: '营收¥1 亿', check: () => {
      const G = window.CorpData?.G;
      return G && G.total >= 1e8;
    }, done: false, icon: '💎' },
  ],

  // 检查里程碑
  check() {
    const addLog = window.CorpUtils?.addLog;
    this.list.forEach(m => {
      if (!m.done && m.check()) {
        m.done = true;
        addLog('clog', `🏆 里程碑:${m.icon}${m.name}`, 'lok');
      }
    });
  }
};

// 导出
window.CorpMilestones = milestones;
