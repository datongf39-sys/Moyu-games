/**
 * ═══════════════════════════════════════════════════════════
 * 股票数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpStocksData = {
  stocks: [
    { id: 'own', name: '本公司', price: 10, vol: .04, base: 10 },
    { id: 'tech', name: '科技龙头', price: 150, vol: .025, base: 150 },
    { id: 'bank', name: '国有大行', price: 45, vol: .01, base: 45 },
    { id: 'start', name: '新兴创业', price: 22, vol: .06, base: 22 },
    { id: 'gold', name: '黄金 ETF', price: 380, vol: .008, base: 380 }
  ]
};

// 导出
window.CorpStocksData = CorpStocksData;
