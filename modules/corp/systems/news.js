/**
 * ═══════════════════════════════════════════════════════════
 * 新闻系统模块
 * ═══════════════════════════════════════════════════════════
 */

const news = {
  pool: [
    { t: '央行降息，市场流动性提升', e: 's+', i: '📈' },
    { t: '科技监管出台，行业承压', e: 's-', i: '📉' },
    { t: '消费信心指数创历史新高', e: 'c+', i: '🎉' },
    { t: '能源价格上涨，运营成本增加', e: 'p-', i: '⚡' },
    { t: 'AI 技术突破，生产效率提升', e: 'p+', i: '🤖' },
    { t: '贸易摩擦升级，出口受阻', e: 's-', i: '🚢' },
    { t: '竞争对手获大额融资', e: 'rv+', i: '⚔️' },
    { t: '监管放松，营商环境改善', e: 'a+', i: '✅' },
    { t: '人才争夺加剧，薪资上涨', e: 'hc+', i: '💰' },
    { t: '突发全球经济危机', e: 'crisis', i: '☠️' },
  ],
  
  list: [],

  // 生成新闻
  generate() {
    const n = { ...this.pool[Math.floor(Math.random() * this.pool.length)], time: this.ts() };
    this.list.unshift(n);
    if (this.list.length > 10) this.list.pop();
    
    // 应用效果
    this.applyEffect(n);
    
    return n;
  },

  // 应用效果
  applyEffect(n) {
    const G = window.CorpData?.G;
    if (!G) return;
    
    if (n.e === 'c+') G.cash *= 1.04;
    if (n.e === 'p-') G.cps *= 0.97;
    if (n.e === 'p+') G.cps *= 1.03;
    if (n.e === 'crisis') {
      G.cash *= 0.85;
    }
  },

  // 时间格式化
  ts() {
    return new Date().toTimeString().slice(0, 8);
  }
};

// 导出
window.CorpNews = news;
