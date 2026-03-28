/**
 * ═══════════════════════════════════════════════════════════
 * 渲染模块
 * ═══════════════════════════════════════════════════════════
 */

// 注意：本模块依赖 utils.js, data.js, actions.js 已加载，直接使用全局变量

function render() {
  // 基础数据
  $('cash').textContent = fmt(G.cash);
  $('staff').textContent = G.totalStaff();
  $('total').textContent = fmt(G.total);
  $('lv').textContent = `Lv.${G.level} ${LVS[Math.min(G.level - 1, 5)]}`;
  const pv = G.stocks.reduce((a, st) => a + (G.shares[st.id] || 0) * st.price, 0);
  $('port').textContent = fmt(pv);
  $('portd').textContent = `持股:${Object.values(G.shares).reduce((a, b) => a + b, 0)}`;
  $('cvlbl').textContent = `+${fmt(G.clickVal)}/次`;
  $('cps').textContent = `+${fmt(G.cps)}/s`;
  $('sp').textContent = fmt(G.stocks[0].price);
  const xp = G.xp / G.xpMax * 100;
  $('xpb').style.width = Math.min(100, xp) + '%';
  $('xpt').textContent = `${Math.floor(G.xp)}/${G.xpMax}`;
  drawChart('schart', G.stockHist['own'] || [10]);
  drawChart('fchart', G.stockHist['own'] || [10]);

  // 雇用列表
  $('hirelist').innerHTML = G.hires.map(h => {
    const cnt = G.staffCounts[h.id] || 0, cost = G.hcost(h), ok = G.cash >= cost;
    return `<div class="row"><div><div class="rn">${h.icon}${h.name}<span class="faint">(${cnt})</span></div><div class="rd">${h.desc}</div></div><div class="rr"><span class="faint">${fmt(cost)}</span><button class="btn bo bsm" onclick="hire('${h.id}')" ${ok ? '' : 'disabled'}>雇用</button></div></div>`;
  }).join('');

  // 员工列表
  const avg = G.employees.length ? Math.floor(G.employees.reduce((a, e) => a + e.mood, 0) / G.employees.length) : 80;
  $('avgmood').textContent = `平均心情:${mood(avg)} ${avg}%`;
  $('emplist').innerHTML = G.employees.slice(-15).reverse().map(e => `
    <div class="emp-card">
      <div class="emp-top"><span style="font-size:11px;font-weight:500">${e.icon}${e.name}</span><span>${mood(e.mood)}</span></div>
      <div class="emp-stats"><div>职位:<span>${e.role}</span></div><div>心情:<span style="color:${e.mood >= 70 ? 'var(--green)' : e.mood >= 40 ? 'var(--amber)' : 'var(--red)'}">${e.mood}%</span></div><div>产出:<span>${fmt(e.cps)}/s</span></div></div>
    </div>`).join('') || '<div class="faint" style="padding:8px">还没有员工</div>';

  // HR 政策
  $('hrpol').innerHTML = G.hrPolicy.map(p => `<div class="row"><div><div class="rn">${p.bought ? '✅ ' : ''}${p.name}</div><div class="rd">${p.desc}</div></div><div class="rr">${p.bought ? '<span class="bdg bdg-g">已实施</span>' : `<span class="faint">${fmt(p.cost)}</span><button class="btn bo bsm" onclick="buyPolicy('${p.id}')" ${G.cash >= p.cost ? '' : 'disabled'}>实施</button>`}</div></div>`).join('');

  // 企业文化
  $('cult').innerHTML = G.culture.map(c => `<div class="row"><div><div class="rn">${c.bought ? '✅ ' : ''}${c.name}</div><div class="rd">${c.desc}</div></div><div class="rr">${c.bought ? '<span class="bdg bdg-g">已确立</span>' : `<span class="faint">${fmt(c.cost)}</span><button class="btn bo bsm" onclick="buyCulture('${c.id}')" ${G.cash >= c.cost ? '' : 'disabled'}>确立</button>`}</div></div>`).join('');

  // 股票市场
  $('mktlist').innerHTML = G.stocks.map(st => {
    const hist = G.stockHist[st.id] || [st.price], prev = hist[hist.length - 2] || st.price,
      chg = st.price - prev, pct = (chg / prev * 100).toFixed(2);
    const own = G.shares[st.id] || 0;
    return `<div class="stock-row"><div style="flex:1;font-size:11px;font-weight:500">${st.name}</div>
      <div style="font-size:10px;color:${chg >= 0 ? 'var(--green)' : 'var(--red)'};margin-right:8px">${fmt(st.price)} <span style="font-size:9px">${chg >= 0 ? '+' : ''}${pct}%</span></div>
      <span class="faint">${own}股</span>
      <button class="btn bg bxs" onclick="buySt('${st.id}')" ${G.cash >= st.price ? '' : 'disabled'}>买</button>
      <button class="btn br bxs" onclick="sellSt('${st.id}')" ${own > 0 ? '' : 'disabled'}>卖</button>
    </div>`;
  }).join('');

  // 持仓信息
  const ti = G.stocks.reduce((a, st) => a + (G.avgBasis[st.id] || 0) * (G.shares[st.id] || 0), 0);
  const tn = G.stocks.reduce((a, st) => a + st.price * (G.shares[st.id] || 0), 0);
  const profit = tn - ti;
  $('profitlbl').textContent = `总盈亏：${profit >= 0 ? '+' : ''}${fmt(profit)}`;
  $('holdings').innerHTML = G.stocks.filter(st => (G.shares[st.id] || 0) > 0).map(st => {
    const own = G.shares[st.id] || 0, basis = G.avgBasis[st.id] || 0, pnl = (st.price - basis) * own;
    return `<div class="row"><div><div class="rn">${st.name}</div><div class="rd">均价${fmt(basis)}×${own}股</div></div><div class="rr"><div style="color:${pnl >= 0 ? 'var(--green)' : 'var(--red)'};font-size:11px">${pnl >= 0 ? '+' : ''}${fmt(pnl)}</div></div></div>`;
  }).join('') || '<div class="faint" style="padding:8px">暂无持仓</div>';

  // 市场情绪
  $('sent').innerHTML = `<div class="row"><div class="rn">散户情绪</div><div class="rr"><div class="pb" style="width:80px"><div class="pbf pbg" style="width:${40 + Math.floor(Math.random() * 40)}%"></div></div></div></div>
    <div class="row"><div class="rn">机构持仓比</div><div class="rr"><div class="pb" style="width:80px"><div class="pbf pbl" style="width:${50 + Math.floor(Math.random() * 30)}%"></div></div></div></div>
    <div class="row"><div class="rn">市场恐惧指数</div><div class="rr"><div class="pb" style="width:80px"><div class="pbf pbr" style="width:${20 + Math.floor(Math.random() * 50)}%"></div></div></div></div>`;

  // 部门建设
  $('depts').innerHTML = G.depts.map(d => `<div class="slot"><div class="si">${d.icon}</div><div class="sinfo"><div class="sn">${d.name}</div><div class="sd2">${d.desc}</div></div>${d.built ? '<span class="bdg bdg-g">已建立</span>' : `<div class="flex gap6"><span class="faint">${fmt(d.cost)}</span><button class="btn bo bsm" onclick="buyDept('${d.id}')" ${G.cash >= d.cost ? '' : 'disabled'}>建立</button></div>`}</div>`).join('');

  // 办公室装修
  $('office').innerHTML = G.office.map(o => `<div class="slot"><div class="si">${o.icon}</div><div class="sinfo"><div class="sn">${o.name}</div><div class="sd2">${o.desc}</div></div>${o.bought ? '<span class="bdg bdg-g">已装修</span>' : `<div class="flex gap6"><span class="faint">${fmt(o.cost)}</span><button class="btn bo bsm" onclick="buyOffice('${o.id}')" ${G.cash >= o.cost ? '' : 'disabled'}>装修</button></div>`}</div>`).join('');

  // 公司升级
  $('upgrades').innerHTML = G.upgrades.map(u => `<div class="row"><div><div class="rn">${u.bought ? '✅ ' : ''}${u.name}</div><div class="rd">${u.desc}</div></div><div class="rr">${u.bought ? '<span class="bdg bdg-g">已解锁</span>' : `<span class="faint">${fmt(u.cost)}</span><button class="btn bo bsm" onclick="buyUpgrade('${u.id}')" ${G.cash >= u.cost ? '' : 'disabled'}>购买</button>`}</div></div>`).join('');

  // 效率总览
  $('effoverview').innerHTML = `<div class="row"><div class="rn">办公效率加成</div><div class="rr"><span class="bdg bdg-g">×${G.effMult.toFixed(2)}</span></div></div>
    <div class="row"><div class="rn">项目奖励加成</div><div class="rr"><span class="bdg bdg-b">×${G.projMult.toFixed(2)}</span></div></div>
    <div class="row"><div class="rn">员工平均效率</div><div class="rr"><span class="faint">${G.employees.length ? Math.floor(G.cps / Math.max(1, G.totalStaff()) * 10) / 10 : 0}/s</span></div></div>`;

  // 项目系统
  if (G.projects.length === 0) refreshProj();
  $('projlist').innerHTML = G.projects.map((p, i) => {
    const ok = G.totalStaff() >= p.req && G.activeProjects.length < 3;
    return `<div class="slot" style="flex-direction:column;align-items:stretch"><div class="fb mb8"><div><div class="sn">${p.icon}${p.name}</div><div class="sd2">${p.desc}·奖励<span style="color:var(--green)">${fmt(p.reward * G.projMult)}</span></div></div><button class="btn bp bsm" onclick="startProj(${i})" ${ok ? '' : 'disabled'}>接单</button></div><div class="faint">预计${p.time}秒</div></div>`;
  }).join('');
  const ap = G.activeProjects.map((p, i) => `<div class="slot" style="flex-direction:column;align-items:stretch"><div class="fb mb6"><div class="sn">${p.icon}${p.name}</div><span class="bdg bdg-b pulse">进行中</span></div><div class="pb"><div class="pbf pbg" style="width:${Math.floor(p.progress * 100)}%"></div></div><div class="faint mt8">${Math.floor(p.progress * 100)}%</div></div>`).join('') || '<div class="faint" style="padding:8px">暂无项目</div>';
  $('aproj').innerHTML = $('aproj0').innerHTML = ap;

  // 竞争对手
  $('rivals').innerHTML = G.rivals.map(r => `<div class="row"><div><div class="rn">🏢${r.name}</div><div class="rd">Lv.${r.lv}·威胁:${r.threat}</div></div><div class="rr"><span class="bdg ${r.threat === '高' ? 'bdg-r' : r.threat === '中' ? 'bdg-a' : 'bdg-g'}">${r.threat}威胁</span></div></div>`).join('');

  // 里程碑
  $('miles').innerHTML = G.milestones.map(m => `<div class="row"><div><div class="rn">${m.icon}${m.name}</div><div class="rd">${m.desc}</div></div><div class="rr">${m.done ? '<span class="bdg bdg-g">✓达成</span>' : '<span class="faint">未达成</span>'}</div></div>`).join('');

  // 公司情报
  $('intel').innerHTML = `<div class="row"><div class="rn">市场占有率</div><div class="rr"><span class="faint">${Math.min(99, Math.floor(G.total / 1e6 * 0.1 + 1))}%</span></div></div>
    <div class="row"><div class="rn">品牌价值</div><div class="rr"><span class="faint">${fmt(G.total * 0.3)}</span></div></div>
    <div class="row"><div class="rn">员工满意度</div><div class="rr"><span class="faint">${G.employees.length ? Math.floor(G.employees.reduce((a, e) => a + e.mood, 0) / G.employees.length) : 80}%</span></div></div>`;

  // 新闻列表
  $('newslist').innerHTML = G.news.map(n => `<div class="row"><div><div class="rn">${n.i}${n.t}</div><div class="rd">${n.time || ''}</div></div></div>`).join('') || '<div class="faint" style="padding:8px">暂无新闻</div>';

  // 市场影响
  $('newsimpact').innerHTML = `<div class="row"><div class="rn">当前市场偏向</div><div class="rr"><span class="bdg bdg-g">温和看涨</span></div></div><div class="row"><div class="rn">新闻数量</div><div class="rr"><span class="faint">${G.news.length}条</span></div></div>`;

  // 危机应对
  $('crisis').innerHTML = `<div class="row"><div class="rn">🛡️危机预案</div><div class="rr">${G.depts.find(d => d.id === 'pr')?.built ? '<span class="bdg bdg-g">已建立公关部</span>' : '<span class="bdg bdg-r">无公关部门</span>'}</div></div>
    <div class="row"><div class="rn">⚖️法律风险</div><div class="rr">${G.depts.find(d => d.id === 'legal')?.built ? '<span class="bdg bdg-g">低风险</span>' : '<span class="bdg bdg-a">中等风险</span>'}</div></div>`;
}

// 导出
window.CorpRender = { render };
