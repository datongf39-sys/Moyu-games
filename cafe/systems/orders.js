/**
 * ═══════════════════════════════════════════════════════════
 * 订单系统模块
 * ═══════════════════════════════════════════════════════════
 */

const orders = {
  // 生成订单
  generate() {
    if (C.orders.length >= C.maxOrders) return null;
    
    const avail = C.menu.filter(m => m.unlocked);
    if (!avail.length) return null;
    
    const drink = avail[Math.floor(Math.random() * avail.length)];
    const vipChance = C.vips.length > 0 && Math.random() < .3;
    const isVip = vipChance;
    
    const CNAMES = ['李先生', '王女士', '张先生', '刘女士', '陈先生', '吴女士', '赵先生', '孙女士', '周先生', '徐女士', '秘书小姐', '程序员先生', '设计师女士', '老板娘', '外卖小哥'];
    const ICONS = ['👨', '', '🧔', '👧', '👴', '', '🧕', ''];
    const cust = CNAMES[Math.floor(Math.random() * CNAMES.length)];
    const custIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
    
    const extraOpts = [];
    if (Math.random() < .3) extraOpts.push('少冰');
    if (Math.random() < .25) extraOpts.push('少糖');
    if (Math.random() < .2) extraOpts.push('加大杯');
    
    const price = Math.floor(drink.price * (1 + (extraOpts.includes('加大杯') ? .3 : 0)) * (C.activeEvent?.mult || 1));
    
    const order = { 
      id: Date.now(), 
      name: cust, 
      icon: custIcon, 
      drink: drink.id, 
      drinkName: drink.name, 
      drinkIcon: drink.icon, 
      extra: extraOpts, 
      price, 
      vip: isVip, 
      timeLeft: 60, 
      patience: 60 
    };
    
    C.orders.push(order);
    return order;
  },

  // 移除订单
  remove(orderId) {
    const idx = C.orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      C.orders.splice(idx, 1);
      return true;
    }
    return false;
  },

  // 更新订单（每帧调用）
  update() {
    C.orders.forEach((o, i) => {
      o.timeLeft -= 0.1;
      if (o.timeLeft <= 0) {
        C.satisfaction = Math.max(0, C.satisfaction - 5);
        addLog('clog', `😤 ${o.icon}${o.name}等太久离开了`, 'lbad');
        C.orders.splice(i, 1);
      }
    });
  },

  // 清空超时订单
  clearTimeout() {
    C.orders = C.orders.filter(o => o.timeLeft > 0);
  }
};

// 导出
window.CafeOrders = orders;
