/**
 * ═══════════════════════════════════════════════════════════
 * 项目数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpProjectsData = {
  projPool: [
    { name: '电商平台', reward: 3000, time: 20, req: 2, icon: '🛒', desc: '需 2 人' },
    { name: '移动 App', reward: 8000, time: 45, req: 5, icon: '📱', desc: '需 5 人' },
    { name: '数据中台', reward: 25000, time: 90, req: 15, icon: '📊', desc: '需 15 人' },
    { name: 'AI 优化', reward: 60000, time: 150, req: 30, icon: '🤖', desc: '需 AI 实验室', rd: 'ai' },
    { name: '海外并购', reward: 150000, time: 300, req: 80, icon: '🌍', desc: '需法务部', rd: 'legal' },
    { name: '政府项目', reward: 400000, time: 600, req: 150, icon: '🏛️', desc: '需法务部', rd: 'legal' },
    { name: '独角兽孵化', reward: 1000000, time: 1200, req: 300, icon: '🦄', desc: '需全球部', rd: 'global' }
  ]
};

// 导出
window.CorpProjectsData = CorpProjectsData;
