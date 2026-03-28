/**
 * ═══════════════════════════════════════════════════════════
 * 渲染模块
 * ═══════════════════════════════════════════════════════════
 */

function render() {
  // 基础数据
  $('cash').textContent = fmt(C.cash);
  $('done').textContent = C.done;
  $('sat').textContent = C.satisfaction + '%';
  const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
  $('starlbl').textContent = stars[Math.min(C.starLevel, 4)];
  $('stard').textContent = stars[Math.min(C.starLevel, 4)] + ' ' + ['新手店', '人气店', '网红店', '精品店', '大师店'][Math.min(C.starLevel, 4)];
  $('today').textContent = fmt(C.todayRev);
  $('maxprice').textContent = fmt(C.maxPrice);
  const avg = C.scores.length ? Math.floor(C.scores.slice(-10).reduce((a, b) => a + b, 0) / Math.min(C.scores.length, 10)) : 0;
  $('avgscore').textContent = avg ? avg + '分' : '--';
  drawRevChart();

  // 客户队列
  $('queue').innerHTML = C.orders.length
    ? C.orders.map(o => `<div class="row"><div><div class="rn">${o.icon}${o.name}${o.vip ? ' 👑' : ''}</div><div class="rdd">${o.drinkIcon}${o.drinkName} ${o.extra.join('·')} ·${fmt(o.price)}</div></div><div class="rr"><span class="faint" style="color:${o.timeLeft < 20 ? 'var(--red)' : 'var(--muted)'}">${Math.ceil(o.timeLeft)}s</span></div></div>`).join('')
    : '<div class="faint" style="padding:8px">暂无客户</div>';

  // 门店状态
  $('shopstatus').innerHTML = `<div class="row"><div class="rn">营业状态</div><div class="rr"><span class="bdg bdg-g pulse">营业中</span></div></div>
    <div class="row"><div class="rn">活动状态</div><div class="rr">${C.activeEvent ? `<span class="bdg bdg-a">${C.activeEvent.icon}${C.activeEvent.name}` : '<span class="faint">无活动</span>'}</div></div>
    <div class="row"><div class="rn">员工人数</div><div class="rr"><span class="faint">${C.staff.length}人</span></div></div>
    <div class="row"><div class="rn">菜单数量</div><div class="rr"><span class="faint">${C.menu.filter(m => m.unlocked).length}/${C.menu.length}款</span></div></div>`;

  // 员工状态
  $('staffstatus').innerHTML = C.staff.map(s => `<div class="row"><div class="rn">${s.icon}${s.name}</div><div class="rr"><span class="faint">${s.role}</span><span>Lv.${s.skill}</span></div></div>`).join('');

  // 热门饮品
  const sorted = Object.entries(C.popularDrinks).sort((a, b) => b[1] - a[1]).slice(0, 4);
  $('popular').innerHTML = sorted.map(([id, cnt]) => {
    const m = C.menu.find(x => x.id === id);
    return `<div class="row"><div class="rn">${m?.icon || '☕'}${m?.name || id}</div><div class="rr"><span class="faint">${cnt}杯</span></div></div>`;
  }).join('') || '<div class="faint" style="padding:8px">暂无数据</div>';

  // 制作订单
  $('q-count').textContent = `${C.orders.length}个订单`;
  const callBtn = document.getElementById('call-btn');
  if (callBtn) {
    callBtn.disabled = !C.isOpen;
    callBtn.style.opacity = C.isOpen ? '1' : '0.4';
  }
  $('brew-orders').innerHTML = C.orders.map(o => `
    <div class="order-card ${C.currentOrder?.id === o.id ? 'selected' : ''} ${o.timeLeft < 20 ? 'urgent' : ''}" onclick="startBrew(${o.id})">
      <div class="oc-top"><div class="oc-name">${o.icon}${o.name}${o.vip ? ' 👑' : ''}</div><div class="oc-time" style="color:${o.timeLeft < 20 ? 'var(--red)' : 'var(--muted)'}">${Math.ceil(o.timeLeft)}s</div></div>
      <div class="oc-drink">${o.drinkIcon}${o.drinkName}</div>
      <div class="oc-req">${o.extra.length ? o.extra.join(' · ') : ''} · <span style="color:var(--amber)">${fmt(o.price)}</span></div>
    </div>`).join('') || '<div class="faint" style="padding:16px;text-align:center">等待客户...</div>';

  // 制作区域
  if (C.currentOrder && C.brewSteps.length) {
    $('brew-title').textContent = `制作 ${C.currentOrder.drinkIcon}${C.currentOrder.drinkName}`;
    $('brew-steps').innerHTML = C.brewSteps.map((step, i) => {
      const isActive = i === C.currentStep && !C.brewDone;
      const isDone = step.done;
      let action = '';
      if (isActive) {
        if (step.type === 'click') {
          action = `<button class="btn ba bsm" onclick="doStepAction('click')">${step.icon} ${step.name.slice(0, 4)} (${step.clicks || 0}/${step.maxClicks})</button>`;
        } else if (step.type === 'wait') {
          action = `<div class="step-progress"><div class="step-pf" style="width:${(step.elapsed / step.duration) * 100}%"></div></div>`;
        } else if (step.type === 'hold') {
          const hasStaff = C.isOpen && C.staff.some(s => s.skill >= 2);
          const holdBtn = hasStaff ? '' : `<button class="btn ba bxs" onmousedown="window._holding=true" onmouseup="window._holding=false" ontouchstart="window._holding=true;event.preventDefault()" ontouchend="window._holding=false;event.preventDefault()" style="margin-left:6px;user-select:none">按住</button>`;
          action = `<div class="step-progress"><div class="step-pf" style="width:${step.progress || 0}%"></div></div>${holdBtn}`;
        } else if (step.type === 'choice') {
          action = `<div style="display:flex;gap:4px">${step.options.map(o => `<button class="btn ba bxs" onclick="doStepAction('choice','${o}')" style="font-size:16px;padding:2px 6px">${o}</button>`).join('')}</div>`;
        }
      }
      return `<div class="brew-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}">
        <div class="step-icon">${isDone ? '✅' : isActive ? step.icon : '⬜'}</div>
        <div class="step-name">${step.name}</div>
        <div class="step-action">${action}</div>
      </div>`;
    }).join('');
    $('brew-result').innerHTML = '';
  } else if (C.brewDone) {
    $('brew-title').textContent = '制作完成！';
    $('brew-steps').innerHTML = '<div style="text-align:center;padding:20px;font-size:32px">☕ 完成！</div>';
    $('brew-result').innerHTML = '';
  } else {
    $('brew-title').textContent = '选择左侧订单开始制作';
    $('brew-steps').innerHTML = '<div class="faint" style="padding:20px;text-align:center">← 选择订单</div>';
    $('brew-result').innerHTML = '';
  }

  // 菜单
  $('menu-list').innerHTML = C.menu.map(m => `
    <div class="recipe-card">
      <div class="rc-top"><div class="rc-name">${m.icon}${m.name}</div><div class="rc-price">${fmt(m.price)}</div></div>
      <div class="rdd">${m.req ? `需要：${C.equipNames[m.req] || m.req}` : '基础款'}</div>
      <div style="margin-top:6px">${m.unlocked ? '<span class="bdg bdg-g">已解锁</span>' : m.pendingUnlock ? '<span class="bdg bdg-a" onclick="sw(2)" style="cursor:pointer">⚗️ 点此去研发</span>' : '<span class="bdg bdg-r">未解锁</span>'}</div>
    </div>`).join('');

  // 配方研发
  const pendingDrinks = C.menu.filter(m => m.pendingUnlock && !m.unlocked);
  let recipeHtml = '';
  if (pendingDrinks.length > 0) {
    recipeHtml += `<div style="font-size:10px;font-weight:500;margin-bottom:8px;color:var(--amber)">⚗️ 待研发配方 (${pendingDrinks.length})</div>`;
    recipeHtml += pendingDrinks.map(m => {
      const ingList = Object.entries(m.ing).map(([k, v]) => `${C.ingIcons[k]}${C.ingNames[k]}×${v}`).join('、');
      const canResearch = Object.entries(m.ing).every(([k, v]) => C.ingredients[k] >= v);
      return `<div class="card mb8" style="padding:10px">
        <div style="font-size:12px;font-weight:500;margin-bottom:4px">${m.icon}${m.name}</div>
        <div style="font-size:9px;color:var(--muted);margin-bottom:8px">所需食材：${ingList}</div>
        <div style="font-size:9px;color:var(--faint);margin-bottom:8px">需要设备：${C.equipNames[m.req]}</div>
        <button class="btn ba bfull bsm" onclick="startResearch('${m.id}')" ${canResearch ? '' : 'disabled'}>
          ${canResearch ? '🧪 开始研发' : '⚠️ 食材不足'}
        </button>
      </div>`;
    }).join('');
  }
  if (pendingDrinks.length === 0 && C.menu.filter(m => !m.unlocked && !m.pendingUnlock).length > 0) {
    recipeHtml += `<div style="font-size:10px;color:var(--faint);padding:8px">购买对应设备后可在此研发新饮品</div>`;
  }
  if (pendingDrinks.length === 0 && C.menu.every(m => m.unlocked)) {
    recipeHtml += `<div style="font-size:10px;color:var(--green);padding:8px">✅ 所有饮品已解锁</div>`;
  }
  recipeHtml += `<div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px">
    <div style="font-size:10px;color:var(--muted);margin-bottom:6px">自定义配方（每完成 50 杯可创建 1 个）</div>
    <div class="row"><div class="rn">制作经验</div><div class="rr"><span class="faint">${C.done}杯</span></div></div>
    <button class="btn ba bfull mt8 bsm" onclick="createCustom()" ${C.done >= 50 && C.customRecipes.length < Math.floor(C.done / 50) ? '' : 'disabled'}>🧪 创建自定义配方</button>
  </div>`;
  $('recipe-lab').innerHTML = recipeHtml;
  $('custom-recipes').innerHTML = C.customRecipes.length
    ? C.customRecipes.map(r => `<div class="recipe-card"><div class="rc-top"><div class="rc-name">${r.icon}${r.name}</div><div class="rc-price">${fmt(r.price)}</div></div></div>`).join('')
    : '<div class="faint" style="padding:8px">暂无自定义配方</div>';

  // VIP
  $('vip-count').textContent = `${C.vips.length}位 VIP`;
  $('vip-list').innerHTML = C.vips.slice(0, 8).map(v => `
    <div class="vip-card">
      <div class="vc-icon">${v.icon}</div>
      <div class="vc-info">
        <div class="vc-name">${v.name} ${v.mood}</div>
        <div class="vc-desc">常点：${v.fav}</div>
        <div class="vc-stat">消费${v.visits}次 · ${fmt(v.spent)}</div>
      </div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无 VIP</div>';
  $('vip-perks').innerHTML = `<div class="row"><div class="rn">VIP 专属折扣</div><div class="rr"><button class="btn ba bsm" onclick="recruitVip()">招募 VIP (¥200)</button></div></div>
    <div class="row"><div class="rn">积分兑换</div><div class="rr"><span class="faint">1 积分=¥0.1</span></div></div>
    <div class="row"><div class="rn">生日特权</div><div class="rr"><span class="faint">免费升杯</span></div></div>`;
  $('vip-points').innerHTML = `<div class="row"><div class="rn">总积分</div><div class="rr"><span style="color:var(--amber)">${C.vipPoints}</span></div></div>
    <div class="row"><div class="rn">VIP 数量</div><div class="rr"><span class="faint">${C.vips.length}人</span></div></div>
    <button class="btn ba bsm bfull mt8" onclick="C.vipPoints+=50;addLog('clog','⭐ 签到积分 +50','lok');render()">📅 每日签到积分</button>`;
  $('vip-stats').innerHTML = `<div class="row"><div class="rn">回访率</div><div class="rr"><span style="color:var(--green)">${C.vips.length ? Math.floor(70 + Math.random() * 20) + '%' : '--'}</span></div></div>
    <div class="row"><div class="rn">平均消费</div><div class="rr"><span class="faint">${C.vips.length ? fmt(C.vips.reduce((a, v) => a + v.spent, 0) / C.vips.length) : '--'}</span></div></div>`;

  // 库存
  $('ingredients').innerHTML = Object.entries(C.ingredients).map(([k, v]) => {
    const max = C.maxIng[k], pct = v / max * 100;
    return `<div class="ing-row"><div class="ing-icon">${C.ingIcons[k]}</div><div class="ing-name">${C.ingNames[k]}</div><div class="ing-track"><div class="ing-fill" style="width:${pct}%;background:${pct < 20 ? 'var(--red)' : pct < 50 ? 'var(--amber)' : 'var(--green)'}"></div></div><div class="ing-val">${v}/${max}</div></div>`;
  }).join('');
  $('restock').innerHTML = `<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:4px;padding:3px 0 7px;border-bottom:1px solid var(--border);margin-bottom:4px;font-size:9px;color:var(--faint)"><span>材料</span><span>单价</span><span style="text-align:center">+20 件</span><span style="text-align:center">+50 件</span></div>` +
    Object.keys(C.ingredients).map(k => {
      const up = RCOSTS[k], c20 = Math.ceil(up * 20), c50 = Math.ceil(up * 50),
        cur = C.ingredients[k], max = C.maxIng[k], low = cur / max < 0.2;
      return `<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:4px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:5px"><span style="font-size:14px">${C.ingIcons[k]}</span><div><div style="font-size:11px;font-weight:500">${C.ingNames[k]}${low ? '<span style="color:var(--red);font-size:9px"> ⚠️</span>' : ''}</div><div style="font-size:9px;color:var(--faint)">${cur}/${max}</div></div></div><div style="font-size:10px;color:var(--amber);text-align:right;padding-right:6px">¥${up}/件</div><button class="btn bo bxs" onclick="restock('${k}',20)" ${C.cash >= c20 ? '' : 'disabled'} style="flex-direction:column;line-height:1.3;padding:3px 7px">+20<br><span style="font-size:8px;opacity:.75">¥${c20}</span></button><button class="btn bo bxs" onclick="restock('${k}',50)" ${C.cash >= c50 ? '' : 'disabled'} style="flex-direction:column;line-height:1.3;padding:3px 7px">+50<br><span style="font-size:8px;opacity:.75">¥${c50}</span></button></div>`;
    }).join('') + `<div style="margin-top:8px;padding:5px 8px;background:var(--surface);border-radius:3px;font-size:9px;color:var(--faint)">💰 当前现金：<span style="color:var(--amber);font-weight:500">${fmt(C.cash)}</span></div>`;

  // 设备
  $('equipment').innerHTML = Object.entries(C.equipment).map(([k, v]) => `
    <div class="row"><div><div class="rn">${v ? '✅ ' : ''}${C.equipNames[k]}</div><div class="rdd">${C.equipDesc[k]}</div></div>
    <div class="rr">${v ? '<span class="bdg bdg-g">已购置</span>' : `<span class="faint">${fmt(C.equipCost[k])}</span><button class="btn bo bsm" onclick="buyEquip('${k}')" ${C.cash >= C.equipCost[k] ? '' : 'disabled'}>购买</button>`}</div></div>`).join('');

  // 招聘
  $('hiring').innerHTML = C.staffPool.map((s, i) => `
    <div class="row"><div><div class="rn">${s.icon}${s.name}</div><div class="rdd">${s.role}·技能 Lv.${s.skill}</div></div>
    <div class="rr"><span class="faint">${fmt(s.cost)}</span><button class="btn bo bsm" onclick="hireStaff(${i})" ${C.cash >= s.cost ? '' : 'disabled'}>招聘</button></div></div>`).join('') || '<div class="faint" style="padding:8px">已无可招聘员工</div>';

  // 评价
  $('reviews').innerHTML = C.reviews.slice(0, 8).map(r => `
    <div class="review">
      <div class="rv-top"><span>${r.icon}${r.name}</span><span>${'⭐'.repeat(Math.floor(r.score / 20))} ${r.score}分</span></div>
      <div class="rv-content">"${r.text}" - 点了${r.drink}</div>
    </div>`).join('') || '<div class="faint" style="padding:8px">暂无评价</div>';

  // 活动
  $('events').innerHTML = C.events.map((ev, i) => `
    <div class="row"><div><div class="rn">${ev.icon}${ev.name}</div><div class="rdd">${ev.desc}</div></div>
    <div class="rr">${ev.active ? '<span class="bdg bdg-a">进行中</span>' : `<span class="faint">${fmt(ev.cost)}</span><button class="btn bo bsm" onclick="activateEvent(${i})" ${C.cash >= ev.cost ? '' : 'disabled'}>开始</button>`}</div></div>`).join('');

  // 声誉
  $('reputation').innerHTML = `<div class="row"><div class="rn">总体声誉</div><div class="rr"><span style="color:var(--amber)">${C.satisfaction}%</span></div></div>
    <div class="row"><div class="rn">差评数量</div><div class="rr"><span class="faint">${C.reviews.filter(r => r.score < 60).length}条</span></div></div>
    <div class="row"><div class="rn">五星评价</div><div class="rr"><span style="color:var(--green)">${C.reviews.filter(r => r.score >= 90).length}条</span></div></div>`;
}

// 导出
window.CafeRender = { render };
