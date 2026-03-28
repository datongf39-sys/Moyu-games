/**
 * ═══════════════════════════════════════════════════════════
 * 核心操作模块
 * ═══════════════════════════════════════════════════════════
 */

// 生成订单
function genOrder() {
  if (C.orders.length >= C.maxOrders) return;
  const avail = C.menu.filter(m => m.unlocked);
  const drink = avail[Math.floor(Math.random() * avail.length)];
  const vipChance = C.vips.length > 0 && Math.random() < .3;
  const isVip = vipChance;
  const CNAMES = ['李先生', '王女士', '张先生', '刘女士', '陈先生', '吴女士', '赵先生', '孙女士', '周先生', '徐女士', '秘书小姐', '程序员先生', '设计师女士', '老板娘', '外卖小哥'];
  const ICONS = ['👨', '', '🧔', '👧', '👴', '', '🧕', '👱'];
  const cust = CNAMES[Math.floor(Math.random() * CNAMES.length)];
  const custIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
  const extraOpts = [];
  if (Math.random() < .3) extraOpts.push('少冰');
  if (Math.random() < .25) extraOpts.push('少糖');
  if (Math.random() < .2) extraOpts.push('加大杯');
  const price = Math.floor(drink.price * (1 + (extraOpts.includes('加大杯') ? .3 : 0)) * (C.activeEvent?.mult || 1));
  C.orders.push({ id: Date.now(), name: cust, icon: custIcon, drink: drink.id, drinkName: drink.name, drinkIcon: drink.icon, extra: extraOpts, price, vip: isVip, timeLeft: 60, patience: 60 });
}

// 开始制作
function startBrew(orderId) {
  const order = C.orders.find(o => o.id === orderId);
  if (!order) return;
  const drink = C.menu.find(m => m.id === order.drink);
  if (!drink) return;
  C.currentOrder = order;
  C.brewSteps = drink.steps.map(sid => {
    const def = { ...C.stepDefs[sid] };
    def.id = sid;
    if (def.type === 'click') {
      def.clicks = 0;
      if (sid === 'grind' && C.equipment.grinder) def.maxClicks = 3;
    }
    if (def.type === 'wait') def.elapsed = 0;
    if (def.type === 'hold') def.progress = 0;
    if (def.type === 'choice') def.choice = null;
    return def;
  });
  C.currentStep = 0;
  C.brewDone = false;
  window._holding = false;
  if (typeof render === 'function') render();
}

// 执行步骤操作
function doStepAction(type, extra) {
  const step = C.brewSteps[C.currentStep];
  if (!step || step.done) return;
  
  if (type === 'click') {
    step.clicks++;
    if (step.clicks >= step.maxClicks) {
      step.done = true;
      nextStep();
    }
  }
  if (type === 'hold_progress') {
    step.progress = extra;
    if (step.progress >= 100) {
      step.done = true;
      nextStep();
    }
  }
  if (type === 'choice') {
    step.choice = extra;
    step.done = true;
    nextStep();
  }
  
  if (typeof render === 'function') render();
}

// 下一步
function nextStep() {
  C.currentStep++;
  if (C.currentStep >= C.brewSteps.length) completeBrew();
}

// 完成制作
function completeBrew() {
  C.brewDone = true;
  const order = C.currentOrder;
  if (!order) return;
  
  const score = Math.floor(75 + Math.random() * 25);
  const syrupBonus = C.equipment.syrup_pump ? 1.1 : 1;
  const price = Math.floor(order.price * syrupBonus);
  
  C.cash += price;
  C.totalRev += price;
  C.todayRev += price;
  C.done++;
  
  if (price > C.maxPrice) C.maxPrice = price;
  C.scores.push(score);
  C.revHistory.push(price);
  
  const idx = C.orders.findIndex(o => o.id === order.id);
  if (idx >= 0) C.orders.splice(idx, 1);
  
  if (!C.popularDrinks[order.drink]) C.popularDrinks[order.drink] = 0;
  C.popularDrinks[order.drink]++;
  
  if (order.vip || Math.random() < .1) {
    const vip = C.vips.find(v => v.name === order.name);
    if (vip) {
      vip.visits++;
      vip.spent += price;
    } else {
      C.vips.push({ name: order.name, icon: order.icon, visits: 1, spent: price, fav: order.drinkName, mood: '😊' });
    }
  }
  
  if (Math.random() < .4) {
    const pos = score >= 85;
    const posRevs = ['☕ 咖啡超好喝！', '下次还来！', '环境很好，咖啡也不错', '制作过程太专业了', '这是我喝过最好的拿铁', '会推荐给朋友'];
    const negRevs = ['等了好久...', '咖啡有点凉', '口感一般般', '有点贵', '没想象中好喝'];
    const ts = new Date().toTimeString().slice(0, 8);
    C.reviews.unshift({
      name: order.name,
      icon: order.icon,
      score: score,
      text: (pos ? posRevs : negRevs)[Math.floor(Math.random() * (pos ? posRevs : negRevs).length)],
      drink: order.drinkName,
      time: ts
    });
    if (C.reviews.length > 20) C.reviews.pop();
  }
  
  C.satisfaction = Math.max(0, Math.min(100, C.satisfaction + (score >= 80 ? 2 : -3)));
  C.starLevel = Math.floor(C.done / 50);
  
  addLog('clog', `✅ 完成 ${order.drinkIcon}${order.drinkName} +${fmt(price)} 评分${score}`, 'lok');
  
  C.currentOrder = null;
  C.brewSteps = [];
  C.currentStep = 0;
  C.brewDone = false;
  
  if (typeof render === 'function') render();
}

// 购买设备
function buyEquip(id) {
  const cost = C.equipCost[id];
  if (C.cash < cost || C.equipment[id]) return;
  C.cash -= cost;
  C.equipment[id] = true;
  C.menu.forEach(m => {
    if (m.req === id) m.pendingUnlock = true;
  });
  addLog('clog', `🔧 购入 ${C.equipNames[id]}！前往配方研发解锁新饮品`, 'lok');
  if (typeof render === 'function') render();
}

// 招聘员工
function hireStaff(i) {
  const sp = C.staffPool[i];
  if (C.cash < sp.cost) return;
  C.cash -= sp.cost;
  C.staff.push({ ...sp, id: Date.now(), mood: 80 });
  C.staffPool.splice(i, 1);
  addLog('clog', `✅ 招聘 ${sp.icon}${sp.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 补货
const RCOSTS = { beans: 5, milk: 2, water: 0.5, sugar: 1, syrup: 3, cream: 4, matcha: 8, ice: 0.5 };
function restock(ing, amt) {
  const cost = Math.ceil(RCOSTS[ing] * amt);
  if (C.cash < cost) {
    addLog('clog', `💸 现金不足！补${amt}个${C.ingNames[ing]}需¥${cost}`, 'lbad');
    return;
  }
  C.cash -= cost;
  C.ingredients[ing] = Math.min(C.maxIng[ing], C.ingredients[ing] + amt);
  addLog('clog', `📦 补货 ${C.ingNames[ing]}×${amt}，花费¥${cost}`, 'linfo');
  if (typeof render === 'function') render();
}

// 激活活动
function activateEvent(i) {
  const ev = C.events[i];
  if (ev.active || C.cash < ev.cost) return;
  C.cash -= ev.cost;
  ev.active = true;
  C.activeEvent = ev;
  addLog('clog', `🎪 开始活动：${ev.name}`, 'lok');
  if (typeof render === 'function') render();
}

// 招募 VIP
function recruitVip() {
  if (C.cash < 200) return;
  C.cash -= 200;
  const names = ['李先生', '王女士', '张先生', '刘女士', '陈先生', '吴女士', '赵先生', '孙女士'];
  const icons = ['👨', '👩', '🧔', '', '👴', '👵', '🧕', ''];
  const n = names[Math.floor(Math.random() * names.length)];
  const icon = icons[Math.floor(Math.random() * icons.length)];
  C.vips.push({ name: n, icon, visits: 1, spent: 0, fav: '手冲咖啡', mood: '😊' });
  addLog('clog', `👑 VIP 会员加入：${n}`, 'lok');
  if (typeof render === 'function') render();
}

// 开始研发
function startResearch(drinkId) {
  const drink = C.menu.find(m => m.id === drinkId);
  if (!drink || !drink.pendingUnlock || drink.unlocked) return;
  
  const ok = Object.entries(drink.ing).every(([k, v]) => C.ingredients[k] >= v);
  if (!ok) {
    addLog('clog', '⚠️ 食材不足，无法研发', 'lbad');
    return;
  }
  
  Object.entries(drink.ing).forEach(([k, v]) => C.ingredients[k] -= v);
  drink.unlocked = true;
  drink.pendingUnlock = false;
  
  addLog('clog', `✅ 配方研发成功！${drink.icon}${drink.name} 已加入菜单`, 'lok');
  if (typeof render === 'function') render();
  sw(2);
}

// 切换营业状态
function toggleOpen() {
  C.isOpen = !C.isOpen;
  const btn = document.getElementById('open-btn');
  if (btn) {
    btn.textContent = C.isOpen ? '营业中' : '已打烊';
    btn.style.background = C.isOpen ? 'var(--green-l)' : 'rgba(220,38,38,.08)';
    btn.style.color = C.isOpen ? 'var(--green)' : 'var(--red)';
  }
  addLog('clog', C.isOpen ? '🟢 开始营业' : '🔴 已打烊，完成手头订单后休息', 'linfo');
  if (typeof render === 'function') render();
}

// 叫号
function callCustomer() {
  if (!C.isOpen) {
    addLog('clog', '⛔ 打烊中，无法叫号', 'lbad');
    return;
  }
  genOrder();
  addLog('clog', '🔔 叫号！新客人进入', 'linfo');
  if (typeof render === 'function') render();
}

// 创建自定义配方
function createCustom() {
  const names = ['特调拿铁', '秘制冷萃', '招牌特饮', '季节限定', '店主特供'];
  const icons = ['☕', '🍵', '🧊', '', '✨'];
  const n = names[Math.floor(Math.random() * names.length)];
  const ico = icons[Math.floor(Math.random() * icons.length)];
  C.customRecipes.push({ name: n, icon: ico, price: 45 + Math.floor(Math.random() * 30) });
  addLog('clog', `🧪 创建配方：${ico}${n}`, 'lok');
  if (typeof render === 'function') render();
}

// 绘制营收图表
function drawRevChart() {
  const cv = $('rev-chart');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  const hist = C.revHistory.slice(-20);
  if (hist.length < 2) return;
  const mn = Math.min(...hist), mx = Math.max(...hist), range = mx - mn || 1;
  ctx.beginPath();
  hist.forEach((v, i) => {
    const x = i / (hist.length - 1) * cv.width,
      y = cv.height - (v - mn) / range * (cv.height - 6) - 3;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = '#d4a44c';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineTo(cv.width, cv.height);
  ctx.lineTo(0, cv.height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(212,164,76,.15)';
  ctx.fill();
}

// 导出
window.CafeActions = {
  genOrder, startBrew, doStepAction, nextStep, completeBrew,
  buyEquip, hireStaff, restock, activateEvent, recruitVip,
  startResearch, toggleOpen, callCustomer, createCustom, drawRevChart
};
