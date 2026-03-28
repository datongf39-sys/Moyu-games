/**
 * ═══════════════════════════════════════════════════════════
 * HR 政策数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpPolicyData = {
  hrPolicy: [
    { id: 'flex', name: '弹性工时', desc: '效率 +5% 幸福 +15%', cost: 2000, bought: false },
    { id: 'remote', name: '远程办公', desc: '离职率 -20%', cost: 3000, bought: false },
    { id: 'bonus', name: '年终奖', desc: '幸福 +25%', cost: 5000, bought: false },
    { id: 'stock', name: '员工持股', desc: '离职率 -40% 效率 +10%', cost: 10000, bought: false }
  ]
};

// 导出
window.CorpPolicyData = CorpPolicyData;
