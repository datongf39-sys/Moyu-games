/**
 * ═══════════════════════════════════════════════════════════
 * 核心逻辑模块
 * ═══════════════════════════════════════════════════════════
 */

// 游戏主循环
let tick = 0;
setInterval(() => {
  tick++;
  
  // 订单计时器
  if (tick % 10 === 0) {
    C.orders.forEach((o, i) => {
      o.timeLeft -= 0.1;
      if (o.timeLeft <= 0) {
        C.satisfaction = Math.max(0, C.satisfaction - 5);
        addLog('clog', `😤 ${o.icon}${o.name}等太久离开了`, 'lbad');
        C.orders.splice(i, 1);
      }
    });
    
    // 自动生成订单
    if (C.isOpen && C.staff.some(s => s.role === '学徒咖啡师') && Math.random() < .3) {
      window.CafeOrders?.generate();
    }
    
    // Wait 步骤自动推进
    if (C.currentOrder && C.brewSteps[C.currentStep]?.type === 'wait') {
      const step = C.brewSteps[C.currentStep];
      const speedMult = C.staff.some(s => s.role === '资深咖啡师') ? 1.2 : 1;
      step.elapsed = (step.elapsed || 0) + speedMult;
      if (step.elapsed >= step.duration) {
        step.done = true;
        window.CafeBrew?.nextStep();
      }
    }
    
    // 员工自动操作
    if (C.currentOrder && C.brewSteps[C.currentStep]) {
      const step = C.brewSteps[C.currentStep];
      if (C.staff.some(s => s.role === '资深咖啡师' || s.role === '咖啡师')) {
        if (step.type === 'click') window.CafeBrew?.doAction('click');
        if (step.type === 'choice' && step.options?.length) {
          const opt = step.options[Math.floor(Math.random() * step.options.length)];
          window.CafeBrew?.doAction('choice', opt);
        }
      }
    }
    
    // 自动开始制作
    if (C.isOpen && !C.currentOrder && C.orders.length > 0) {
      if (C.staff.some(s => s.role === '资深咖啡师' || s.role === '咖啡师')) {
        window.CafeBrew?.start(C.orders[0].id);
      }
    }
    
    render();
  }
  
  // 自动保存（每 30 秒）
  if (tick % 300 === 0) save();
  
  // 清空今日营收（每 60 秒）
  if (tick % 600 === 0) C.todayRev = 0;
}, 100);

// 按住机制
window._holding = false;
setInterval(() => {
  const step = C.brewSteps[C.currentStep];
  if (C.currentOrder && step?.type === 'hold') {
    if (C.staff.some(s => s.role === '资深咖啡师')) {
      step.progress = Math.min(100, (step.progress || 0) + 3.6);
      window.CafeBrew?.doAction('hold_progress', step.progress);
    } else if (C.staff.some(s => s.role === '咖啡师')) {
      step.progress = Math.min(100, (step.progress || 0) + 3);
      window.CafeBrew?.doAction('hold_progress', step.progress);
    } else if (window._holding) {
      step.progress = Math.min(100, (step.progress || 0) + 3);
      window.CafeBrew?.doAction('hold_progress', step.progress);
    }
  }
}, 100);

// 导出
window.CafeCore = { tick };
