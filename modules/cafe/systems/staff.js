/**
 * ═══════════════════════════════════════════════════════════
 * 员工系统模块
 * ═══════════════════════════════════════════════════════════
 */

const staff = {
  // 招聘池
  pool: [
    { name: '阿明', icon: '👨', skill: 1, role: '学徒咖啡师', cost: 200, salary: 50 },
    { name: '小晴', icon: '👩', skill: 2, role: '咖啡师', cost: 500, salary: 120 },
    { name: '老李', icon: '🧔', skill: 3, role: '资深咖啡师', cost: 1200, salary: 280 }
  ],

  // 招聘员工
  hire(poolIndex) {
    const sp = this.pool[poolIndex];
    if (C.cash < sp.cost) return false;
    
    C.cash -= sp.cost;
    C.staff.push({ ...sp, id: Date.now(), mood: 80 });
    this.pool.splice(poolIndex, 1);
    
    addLog('clog', `✅ 招聘 ${sp.icon}${sp.name}`, 'lok');
    return true;
  },

  // 检查是否有某职位员工
  hasRole(role) {
    return C.isOpen && C.staff.some(s => s.role === role);
  },

  // 获取员工技能等级
  getMaxSkill() {
    if (!C.isOpen) return 0;
    return Math.max(...C.staff.map(s => s.skill), 0);
  },

  // 更新员工心情
  updateMood() {
    C.staff.forEach(s => {
      s.mood = Math.max(10, Math.min(100, s.mood + (Math.random() > .45 ? 1 : -1) * 3));
    });
  },

  // 平均心情
  avgMood() {
    if (C.staff.length <= 1) return 90; // 只有店主
    const moods = C.staff.filter(s => s.role !== '店主').map(s => s.mood);
    return moods.length ? Math.floor(moods.reduce((a, b) => a + b, 0) / moods.length) : 80;
  },

  // 员工总数（不包括店主）
  count() {
    return C.staff.filter(s => s.role !== '店主').length;
  }
};

// 导出
window.CafeStaff = staff;
