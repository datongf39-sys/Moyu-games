/**
 * ═══════════════════════════════════════════════════════════
 * 员工系统模块
 * ═══════════════════════════════════════════════════════════
 */

// 员工数据
const employees = {
  list: [],  // 已雇用员工
  counts: {},  // 各职位数量
  
  // 可雇用职位
  hires: [
    { id: 'intern', name: '实习生', desc: '+¥1/s', base: 30, cps: 1, icon: '🧑' },
    { id: 'junior', name: '初级员工', desc: '+¥5/s', base: 120, cps: 5, icon: '👩' },
    { id: 'senior', name: '高级员工', desc: '+¥20/s', base: 500, cps: 20, icon: '👨‍💼' },
    { id: 'manager', name: '项目经理', desc: '+¥80/s', base: 2000, cps: 80, icon: '👩‍💼' },
    { id: 'director', name: '总监', desc: '+¥300/s', base: 8000, cps: 300, icon: '🧑‍💼' },
    { id: 'vp', name: '副总裁', desc: '+¥1200/s', base: 35000, cps: 1200, icon: '🤵' },
    { id: 'ceo2', name: '联合创始人', desc: '+¥5000/s', base: 150000, cps: 5000, icon: '👑' },
  ],

  // 总员工数
  total() {
    return Object.values(this.counts).reduce((a, b) => a + b, 0);
  },

  // 计算雇用成本
  cost(h) {
    const cnt = this.counts[h.id] || 0;
    const disc = window.CorpData?.G?.depts?.find(d => d.id === 'hr')?.built ? .85 : 1;
    return Math.floor(h.base * Math.pow(1.13, cnt) * (disc || 1));
  },

  // 雇用员工
  hire(id) {
    const h = this.hires.find(x => x.id === id);
    const cost = this.cost(h);
    const G = window.CorpData?.G;
    
    if (!G || G.cash < cost) return false;
    
    G.cash -= cost;
    this.counts[id] = (this.counts[id] || 0) + 1;
    
    const ns = ['小李', '小王', '小张', '小刘', '小陈', '小吴', '小赵', '小孙'];
    this.list.push({
      id: Date.now(),
      name: ns[Math.floor(Math.random() * ns.length)],
      role: h.name,
      mood: 75 + Math.floor(Math.random() * 20),
      cps: h.cps,
      icon: h.icon
    });
    
    return { success: true, employee: this.list[this.list.length - 1] };
  },

  // 计算总 CPS
  calcCPS() {
    let c = 0;
    this.hires.forEach(h => c += (this.counts[h.id] || 0) * h.cps);
    return c;
  },

  // 更新员工心情
  updateMood() {
    const G = window.CorpData?.G;
    const hb = G?.depts?.find(d => d.id === 'hr')?.built ? 5 : 0;
    this.list.forEach(e => {
      e.mood = Math.max(10, Math.min(100, e.mood + (Math.random() > .45 ? 1 : -1) * 4 + hb));
    });
  },

  // 平均心情
  avgMood() {
    if (this.list.length === 0) return 80;
    return Math.floor(this.list.reduce((a, e) => a + e.mood, 0) / this.list.length);
  }
};

// 导出
window.CorpEmployees = employees;
