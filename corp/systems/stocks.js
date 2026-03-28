/**
 * ═══════════════════════════════════════════════════════════
 * 股票系统模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpStocks = {
  // 更新价格
  update() {
    if (!G.stocks) return;
    G.stocks.forEach(st => {
      const chg = (Math.random() - .47) * st.vol;
      st.price = Math.max(1, +(st.price * (1 + chg)).toFixed(2));
      G.stockHist[st.id].push(st.price);
      if (G.stockHist[st.id].length > 80) G.stockHist[st.id].shift();
    });
  },

  // 买入
  buy(id) {
    const st = G.stocks.find(s => s.id === id);
    if (!G || G.cash < st.price) return false;
    
    G.cash -= st.price;
    G.shares[id] = (G.shares[id] || 0) + 1;
    
    const prev = G.avgBasis[id] || st.price;
    G.avgBasis[id] = (prev * (G.shares[id] - 1) + st.price) / G.shares[id];
    
    return { success: true, price: st.price };
  },

  // 卖出
  sell(id) {
    const st = G.stocks.find(s => s.id === id);
    if (!G || !(G.shares[id] > 0)) return false;
    
    const fin = G.depts?.find(d => d.id === 'fin')?.built;
    const earn = st.price * (fin ? 1.5 : 1);
    const pnl = earn - (G.avgBasis[id] || 0);
    
    G.cash += earn;
    G.shares[id]--;
    
    return { success: true, earn, pnl };
  },

  // 总市值
  totalValue() {
    return G.stocks.reduce((a, st) => a + (G.shares[st.id] || 0) * st.price, 0);
  },

  // 总持股数
  totalShares() {
    return Object.values(G.shares).reduce((a, b) => a + b, 0);
  },

  // 总盈亏
  totalProfit() {
    const ti = G.stocks.reduce((a, st) => a + (G.avgBasis[st.id] || 0) * (G.shares[st.id] || 0), 0);
    const tn = G.stocks.reduce((a, st) => a + st.price * (G.shares[st.id] || 0), 0);
    return tn - ti;
  }
};

// 导出
window.CorpStocks = CorpStocks;
