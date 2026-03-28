/**
 * ═══════════════════════════════════════════════════════════
 * 员工数据模块
 * ═══════════════════════════════════════════════════════════
 */

const staffData = {
  staff: [
    { id: 'self', name: '你自己', icon: '🧑', skill: 1, role: '店主', mood: 90 }
  ],
  staffPool: [
    { name: '阿明', icon: '👨', skill: 1, role: '学徒咖啡师', cost: 200, salary: 50 },
    { name: '小晴', icon: '👩', skill: 2, role: '咖啡师', cost: 500, salary: 120 },
    { name: '老李', icon: '🧔', skill: 3, role: '资深咖啡师', cost: 1200, salary: 280 }
  ]
};

// 导出
window.CafeStaffData = staffData;
