/**
 * ═══════════════════════════════════════════════════════════
 * 企业文化数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpCultureData = {
  culture: [
    { id: 'c1', name: '狼性文化', desc: 'CPS+20% 幸福 -30%', cost: 1000, bought: false },
    { id: 'c2', name: '扁平管理', desc: '项目效率 +15%', cost: 5000, bought: false },
    { id: 'c3', name: '创新驱动', desc: '解锁新项目', cost: 15000, bought: false }
  ]
};

// 导出
window.CorpCultureData = CorpCultureData;
