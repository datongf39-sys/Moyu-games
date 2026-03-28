/**
 * ═══════════════════════════════════════════════════════════
 * 基础数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpBaseData = {
  cash: 1000,
  total: 0,
  cps: 0,
  clickVal: 10,
  xp: 0,
  xpMax: 100,
  level: 1,
  staffCounts: {},
  employees: [],
  shares: {},
  stockHist: {},
  avgBasis: {},
  projects: [],
  activeProjects: [],
  news: [],
  projDone: 0,
  projMult: 1,
  effMult: 1,
  happyB: 0
};

// 导出
window.CorpBaseData = CorpBaseData;
