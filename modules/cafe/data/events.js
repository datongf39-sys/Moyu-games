/**
 * ═══════════════════════════════════════════════════════════
 * 活动数据模块
 * ═══════════════════════════════════════════════════════════
 */

const eventsData = {
  events: [
    { name: '情人节特饮', desc: '特制玫瑰拿铁，价格 +50%', active: false, cost: 500, mult: 1.5, icon: '💕' },
    { name: '圣诞节活动', desc: '圣诞特饮系列，客流 +30%', active: false, cost: 300, mult: 1.3, icon: '🎄' },
    { name: '买一赠一日', desc: '吸引新客，满意度 +10%', active: false, cost: 200, mult: 1.0, icon: '🎁' },
    { name: '手冲工坊', desc: '教学体验，客单价 +40%', active: false, cost: 800, mult: 1.4, icon: '🎓' }
  ],
  activeEvent: null
};

// 导出
window.CafeEventsData = eventsData;
