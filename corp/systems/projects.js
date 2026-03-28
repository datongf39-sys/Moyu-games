/**
 * ═══════════════════════════════════════════════════════════
 * 项目系统模块
 * ═══════════════════════════════════════════════════════════
 */

const projects = {
  // 可接项目池
  pool: [
    { name: '电商平台', reward: 3000, time: 20, req: 2, icon: '🛒', desc: '需 2 人' },
    { name: '移动 App', reward: 8000, time: 45, req: 5, icon: '📱', desc: '需 5 人' },
    { name: '数据中台', reward: 25000, time: 90, req: 15, icon: '📊', desc: '需 15 人' },
    { name: 'AI 优化', reward: 60000, time: 150, req: 30, icon: '🤖', desc: '需 AI 实验室', rd: 'ai' },
    { name: '海外并购', reward: 150000, time: 300, req: 80, icon: '🌍', desc: '需法务部', rd: 'legal' },
    { name: '政府项目', reward: 400000, time: 600, req: 150, icon: '🏛️', desc: '需法务部', rd: 'legal' },
    { name: '独角兽孵化', reward: 1000000, time: 1200, req: 300, icon: '🦄', desc: '需全球部', rd: 'global' },
  ],
  
  // 当前可接项目
  available: [],
  
  // 进行中项目
  active: [],
  
  // 完成数
  done: 0,

  // 刷新项目
  refresh() {
    this.available = [];
    const G = window.CorpData?.G;
    const hasL = G?.depts?.find(d => d.id === 'legal')?.built;
    const hasG = G?.depts?.find(d => d.id === 'global')?.built;
    const hasAI = G?.depts?.find(d => d.id === 'ai')?.built;
    
    const pool = this.pool.filter(p => 
      (!p.rd) || 
      (p.rd === 'legal' && hasL) || 
      (p.rd === 'global' && hasG) || 
      (p.rd === 'ai' && hasAI)
    );
    
    for (let i = 0; i < 4; i++) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (r) this.available.push({ ...r, progress: 0 });
    }
  },

  // 开始项目
  start(index) {
    const p = this.available[index];
    const G = window.CorpData?.G;
    const employees = window.CorpEmployees;
    
    if (!p || !G || !employees || employees.total() < p.req || this.active.length >= 3) {
      return false;
    }
    
    this.active.push({ ...p, progress: 0 });
    this.available.splice(index, 1);
    
    return { success: true, project: p };
  },

  // 更新进度
  update() {
    this.active.forEach((p, i) => {
      p.progress += 1 / (p.time * 10);
      if (p.progress >= 1) {
        const G = window.CorpData?.G;
        const r = Math.floor(p.reward * G.projMult);
        G.cash += r;
        G.total += r;
        this.done++;
        this.active.splice(i, 1);
        return { completed: true, project: p, reward: r };
      }
    });
    return null;
  }
};

// 导出
window.CorpProjects = projects;
