/**
 * ═══════════════════════════════════════════════════════════
 * 里程碑数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpMilestonesData = {
  milestones: [
    { name: '第一桶金', desc: '营收¥10,000', done: false, icon: '💰' },
    { name: '初具规模', desc: '员工 10 人', done: false, icon: '👥' },
    { name: '股市初体验', desc: '持有股票', done: false, icon: '📈' },
    { name: '项目达人', desc: '完成 5 项目', done: false, icon: '📋' },
    { name: '百人企业', desc: '员工 100 人', done: false, icon: '🏢' },
    { name: '亿元俱乐部', desc: '营收¥1 亿', done: false, icon: '💎' }
  ]
};

// 导出
window.CorpMilestonesData = CorpMilestonesData;
