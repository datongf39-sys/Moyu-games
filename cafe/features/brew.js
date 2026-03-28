/**
 * ═══════════════════════════════════════════════════════════
 * 制作咖啡功能模块
 * ═══════════════════════════════════════════════════════════
 */

const brew = {
  // 开始制作
  start(orderId) {
    const order = C.orders.find(o => o.id === orderId);
    if (!order) return false;
    
    const drink = C.menu.find(m => m.id === order.drink);
    if (!drink) return false;
    
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
    
    return true;
  },

  // 执行步骤操作
  doAction(type, extra) {
    const step = C.brewSteps[C.currentStep];
    if (!step || step.done) return;
    
    if (type === 'click') {
      step.clicks++;
      if (step.clicks >= step.maxClicks) {
        step.done = true;
        this.nextStep();
      }
    }
    
    if (type === 'hold_progress') {
      step.progress = extra;
      if (step.progress >= 100) {
        step.done = true;
        this.nextStep();
      }
    }
    
    if (type === 'choice') {
      step.choice = extra;
      step.done = true;
      this.nextStep();
    }
  },

  // 下一步
  nextStep() {
    C.currentStep++;
    if (C.currentStep >= C.brewSteps.length) {
      this.complete();
    }
  },

  // 完成制作
  complete() {
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
    
    // 移除订单
    const idx = C.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) C.orders.splice(idx, 1);
    
    // 更新热门饮品
    if (!C.popularDrinks[order.drink]) C.popularDrinks[order.drink] = 0;
    C.popularDrinks[order.drink]++;
    
    // 更新 VIP 记录
    if (order.vip) {
      window.CafeVIP?.recordVisit(order.name, price, order.drinkName);
    }
    
    // 添加评价
    if (Math.random() < .4) {
      window.CafeReviews?.add(order.name, order.icon, score, order.drinkName);
    }
    
    // 更新满意度
    C.satisfaction = Math.max(0, Math.min(100, C.satisfaction + (score >= 80 ? 2 : -3)));
    C.starLevel = Math.floor(C.done / 50);
    
    addLog('clog', `✅ 完成 ${order.drinkIcon}${order.drinkName} +${fmt(price)} 评分${score}`, 'lok');
    
    // 重置状态
    C.currentOrder = null;
    C.brewSteps = [];
    C.currentStep = 0;
    C.brewDone = false;
  },

  // 当前步骤索引
  currentStepIndex() {
    return C.currentStep;
  },

  // 是否正在制作
  isBrewing() {
    return C.currentOrder !== null && C.brewSteps.length > 0;
  }
};

// 导出
window.CafeBrew = brew;
