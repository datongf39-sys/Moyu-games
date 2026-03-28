/**
 * ═══════════════════════════════════════════════════════════
 * 升级数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpUpgradesData = {
  upgrades: [
    { id: 'u1', name: '人才培训', desc: '点击×2', cost: 500, bought: false },
    { id: 'u2', name: '绩效激励', desc: 'CPS×1.5', cost: 3000, bought: false },
    { id: 'u3', name: '自动化', desc: '点击×5', cost: 15000, bought: false },
    { id: 'u4', name: '全球化', desc: 'CPS×2', cost: 60000, bought: false },
    { id: 'u5', name: '上市融资', desc: '+¥2M', cost: 300000, bought: false },
    { id: 'u6', name: '垄断地位', desc: 'CPS×5', cost: 1000000, bought: false }
  ]
};

// 导出
window.CorpUpgradesData = CorpUpgradesData;
