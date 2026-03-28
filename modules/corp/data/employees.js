/**
 * ═══════════════════════════════════════════════════════════
 * 员工数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpEmployeesData = {
  hires: [
    { id: 'intern', name: '实习生', desc: '+¥1/s', base: 30, cps: 1, icon: '🧑' },
    { id: 'junior', name: '初级员工', desc: '+¥5/s', base: 120, cps: 5, icon: '👩' },
    { id: 'senior', name: '高级员工', desc: '+¥20/s', base: 500, cps: 20, icon: '👨‍💼' },
    { id: 'manager', name: '项目经理', desc: '+¥80/s', base: 2000, cps: 80, icon: '👩‍' },
    { id: 'director', name: '总监', desc: '+¥300/s', base: 8000, cps: 300, icon: '🧑‍💼' },
    { id: 'vp', name: '副总裁', desc: '+¥1200/s', base: 35000, cps: 1200, icon: '🤵' },
    { id: 'ceo2', name: '联合创始人', desc: '+¥5000/s', base: 150000, cps: 5000, icon: '👑' }
  ]
};

// 导出
window.CorpEmployeesData = CorpEmployeesData;
