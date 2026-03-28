/**
 * ═══════════════════════════════════════════════════════════
 * 核心操作模块
 * ═══════════════════════════════════════════════════════════
 */

// 注意：本模块依赖 utils.js 和 data.js 已加载，直接使用全局变量

// 点击创收
function doClick() {
  G.cash += G.clickVal;
  G.total += G.clickVal;
  G.xp += G.clickVal;
  while (G.xp >= G.xpMax) {
    G.xp -= G.xpMax;
    G.xpMax = Math.floor(G.xpMax * 1.6);
    G.level++;
    G.clickVal = Math.floor(G.clickVal * 1.4);
    addLog('clog', `🎊 升级！Lv.${G.level} ${LVS[Math.min(G.level - 1, 5)]}`, 'lok');
  }
  checkMiles();
  if (typeof render === 'function') render();
}

// 雇用员工
function hire(id) {
  const h = G.hires.find(x => x.id === id), cost = G.hcost(h);
  if (G.cash < cost) return;
  G.cash -= cost;
  G.staffCounts[id] = (G.staffCounts[id] || 0) + 1;
  const ns = ['小李', '小王', '小张', '小刘', '小陈', '小吴', '小赵', '小孙'];
  G.employees.push({
    id: Date.now(),
    name: ns[Math.floor(Math.random() * ns.length)],
    role: h.name,
    mood: 75 + Math.floor(Math.random() * 20),
    cps: h.cps,
    icon: h.icon
  });
  G.recalc();
  checkMiles();
  addLog('clog', `✅ 雇用${h.icon}${h.name} 花费${fmt(cost)}`, 'lok');
  if (typeof render === 'function') render();
}

// 买入股票
function buySt(id) {
  const st = G.stocks.find(s => s.id === id);
  if (G.cash < st.price) return;
  G.cash -= st.price;
  G.shares[id] = (G.shares[id] || 0) + 1;
  const prev = G.avgBasis[id] || st.price;
  G.avgBasis[id] = (prev * (G.shares[id] - 1) + st.price) / G.shares[id];
  addLog('tlog', `📈 买入${st.name}@${fmt(st.price)}`, 'linfo');
  checkMiles();
  if (typeof render === 'function') render();
}

// 卖出股票
function sellSt(id) {
  const st = G.stocks.find(s => s.id === id);
  if (!(G.shares[id] > 0)) return;
  const fin = G.depts.find(d => d.id === 'fin')?.built, earn = st.price * (fin ? 1.5 : 1);
  const pnl = earn - (G.avgBasis[id] || 0);
  G.cash += earn;
  G.shares[id]--;
  addLog('tlog', `📉 卖出${st.name}@${fmt(earn)} 盈亏:${pnl >= 0 ? '+' : ''}${fmt(pnl)}`, 'lok');
  if (typeof render === 'function') render();
}

// 建立部门
function buyDept(id) {
  const d = G.depts.find(x => x.id === id);
  if (d.built || G.cash < d.cost) return;
  G.cash -= d.cost;
  d.built = true;
  if (id === 'rd') G.clickVal *= 2;
  if (id === 'global') G.projMult *= 1.5;
  G.recalc();
  addLog('clog', `🏗️ 建立${d.icon}${d.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 装修办公室
function buyOffice(id) {
  const o = G.office.find(x => x.id === id);
  if (o.bought || G.cash < o.cost) return;
  G.cash -= o.cost;
  o.bought = true;
  const em = { chairs: 1.1, coffee: 1.05, lounge: 1.08, roof: 1.15 };
  if (em[id]) G.effMult *= em[id];
  G.recalc();
  addLog('clog', `🏠 装修${o.icon}${o.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 购买升级
function buyUpgrade(id) {
  const u = G.upgrades.find(x => x.id === id);
  if (u.bought || G.cash < u.cost) return;
  G.cash -= u.cost;
  u.bought = true;
  u.fn();
  addLog('clog', `🚀 解锁:${u.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 实施政策
function buyPolicy(id) {
  const p = G.hrPolicy.find(x => x.id === id);
  if (p.bought || G.cash < p.cost) return;
  G.cash -= p.cost;
  p.bought = true;
  addLog('clog', `📜 实施:${p.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 确立文化
function buyCulture(id) {
  const c = G.culture.find(x => x.id === id);
  if (c.bought || G.cash < c.cost) return;
  G.cash -= c.cost;
  c.bought = true;
  G.recalc();
  addLog('clog', `🎯 确立:${c.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 刷新项目
function refreshProj() {
  G.projects = [];
  const hasL = G.depts.find(d => d.id === 'legal')?.built,
    hasG = G.depts.find(d => d.id === 'global')?.built,
    hasAI = G.depts.find(d => d.id === 'ai')?.built;
  const pool = G.projPool.filter(p => (!p.rd) || (p.rd === 'legal' && hasL) || (p.rd === 'global' && hasG) || (p.rd === 'ai' && hasAI));
  for (let i = 0; i < 4; i++) {
    const r = pool[Math.floor(Math.random() * pool.length)];
    if (r) G.projects.push({ ...r, progress: 0 });
  }
  if (typeof render === 'function') render();
}

// 开始项目
function startProj(i) {
  const p = G.projects[i];
  if (!p || G.totalStaff() < p.req || G.activeProjects.length >= 3) return;
  G.activeProjects.push({ ...p, progress: 0 });
  G.projects.splice(i, 1);
  addLog('clog', `📋 开始:${p.icon}${p.name}`, 'linfo');
  if (typeof render === 'function') render();
}

// 检查里程碑
function checkMiles() {
  G.milestones.forEach(m => {
    if (!m.done && m.check()) {
      m.done = true;
      addLog('clog', `🏆 里程碑:${m.icon}${m.name}`, 'lok');
    }
  });
}

// 生成新闻
function genNews() {
  const n = { ...G.newsPool[Math.floor(Math.random() * G.newsPool.length)], time: ts() };
  G.news.unshift(n);
  if (G.news.length > 10) G.news.pop();
  addLog('clog', `📰 ${n.i} ${n.t}`, 'linfo');
  if (n.e === 'c+') G.cash *= 1.04;
  if (n.e === 'p-') G.cps *= 0.97;
  if (n.e === 'p+') G.cps *= 1.03;
  if (n.e === 'crisis') {
    G.cash *= 0.85;
    addLog('clog', '☠️ 经济危机！现金损失 15%', 'lbad');
  }
  const inner = G.news.map(x => `<span style="margin-right:40px">${x.i} ${n.t}</span>`).join('');
  if ($('nticker')) $('nticker').innerHTML = inner + inner;
}

// 绘制图表
function drawChart(id, hist, col) {
  const cv = $(id);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (hist.length < 2) return;
  const mn = Math.min(...hist), mx = Math.max(...hist), range = mx - mn || 1;
  ctx.beginPath();
  hist.forEach((v, i) => {
    const x = i / (hist.length - 1) * cv.width,
      y = cv.height - (v - mn) / range * (cv.height - 6) - 3;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = col || '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineTo(cv.width, cv.height);
  ctx.lineTo(0, cv.height);
  ctx.closePath();
  ctx.fillStyle = (col || '#fbbf24') + '22';
  ctx.fill();
}

// 导出
window.CorpActions = {
  doClick, hire, buySt, sellSt, buyDept, buyOffice, buyUpgrade,
  buyPolicy, buyCulture, refreshProj, startProj, checkMiles, genNews, drawChart
};
