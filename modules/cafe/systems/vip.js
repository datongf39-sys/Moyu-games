/**
 * ═══════════════════════════════════════════════════════════
 * VIP 系统模块
 * ═══════════════════════════════════════════════════════════
 */

const vip = {
  // 招募 VIP
  recruit() {
    if (C.cash < 200) return false;
    
    C.cash -= 200;
    const names = ['李先生', '王女士', '张先生', '刘女士', '陈先生', '吴女士', '赵先生', '孙女士'];
    const icons = ['👨', '👩', '🧔', '', '👴', '👵', '', ''];
    const n = names[Math.floor(Math.random() * names.length)];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    
    C.vips.push({ name: n, icon, visits: 1, spent: 0, fav: '手冲咖啡', mood: '😊' });
    addLog('clog', `👑 VIP 会员加入：${n}`, 'lok');
    return true;
  },

  // 更新 VIP 消费记录
  recordVisit(name, spent, drink) {
    const v = C.vips.find(v => v.name === name);
    if (v) {
      v.visits++;
      v.spent += spent;
      v.fav = drink;
    }
  },

  // 获取 VIP 总数
  count() {
    return C.vips.length;
  },

  // VIP 总消费
  totalSpent() {
    return C.vips.reduce((a, v) => a + v.spent, 0);
  },

  // 回访率
  revisitRate() {
    if (!C.vips.length) return 0;
    const repeat = C.vips.filter(v => v.visits > 1).length;
    return Math.floor(repeat / C.vips.length * 100);
  },

  // 平均消费
  avgSpent() {
    if (!C.vips.length) return 0;
    return Math.floor(this.totalSpent() / C.vips.length);
  }
};

// 导出
window.CafeVIP = vip;
