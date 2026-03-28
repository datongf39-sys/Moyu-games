/**
 * ═══════════════════════════════════════════════════════════
 * 部门系统模块
 * ═══════════════════════════════════════════════════════════
 */

const depts = {
  list: [
    { id: 'hr', name: '人力资源部', desc: '雇人成本 -15%', cost: 800, built: false, icon: '👥' },
    { id: 'rd', name: '研发部', desc: '点击收益×2', cost: 2000, built: false, icon: '🔬' },
    { id: 'sales', name: '销售部', desc: '自动 +500/s', cost: 5000, built: false, icon: '📊' },
    { id: 'fin', name: '财务部', desc: '股票收益×1.5', cost: 10000, built: false, icon: '💹' },
    { id: 'legal', name: '法务部', desc: '解锁超大项目', cost: 20000, built: false, icon: '⚖️' },
    { id: 'pr', name: '公关部', desc: '危机损失 -50%', cost: 15000, built: false, icon: '📣' },
    { id: 'ai', name: 'AI 实验室', desc: '全体 CPS×2', cost: 80000, built: false, icon: '🤖' },
    { id: 'global', name: '海外事业部', desc: '项目奖励×1.5', cost: 200000, built: false, icon: '🌍' },
  ],

  // 建立部门
  build(id) {
    const d = this.list.find(x => x.id === id);
    const G = window.CorpData?.G;
    
    if (!d || !G || d.built || G.cash < d.cost) return false;
    
    G.cash -= d.cost;
    d.built = true;
    
    // 立即生效
    if (id === 'rd') G.clickVal *= 2;
    if (id === 'global') G.projMult *= 1.5;
    
    return { success: true, dept: d };
  },

  // 是否有某个部门
  has(id) {
    return this.list.find(d => d.id === id)?.built || false;
  }
};

// 导出
window.CorpDepts = depts;
