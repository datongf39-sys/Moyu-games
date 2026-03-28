/**
 * ═══════════════════════════════════════════════════════════
 * 基础数据模块
 * ═══════════════════════════════════════════════════════════
 */

const baseData = {
  // 基础状态
  cash: 500,
  done: 0,
  satisfaction: 80,
  todayRev: 0,
  totalRev: 0,
  starLevel: 0,
  maxPrice: 0,
  scores: [],
  revHistory: [],
  isOpen: true,

  // 订单系统
  orders: [],
  maxOrders: 5,
  currentOrder: null,
  brewSteps: [],
  currentStep: 0,
  brewDone: false,

  // 菜单系统
  menu: [
    { id: 'drip', name: '手冲咖啡', icon: '☕', price: 28, unlocked: true, req: '', steps: ['grind', 'bloom', 'pour', 'wait'], ing: { beans: 15, water: 200 }, popularity: 0 },
    { id: 'espresso', name: '意式浓缩', icon: '🍵', price: 22, unlocked: false, req: 'espresso', steps: ['load', 'extract', 'serve'], ing: { beans: 12 }, popularity: 0 },
    { id: 'americano', name: '美式咖啡', icon: '☕', price: 25, unlocked: false, req: 'espresso', steps: ['load', 'extract', 'dilute'], ing: { beans: 12, water: 150 }, popularity: 0 },
    { id: 'latte', name: '拿铁', icon: '🥛', price: 35, unlocked: false, req: 'frothing', steps: ['extract', 'froth', 'pour', 'latte_art'], ing: { beans: 12, milk: 150 }, popularity: 0 },
    { id: 'matcha_latte', name: '抹茶拿铁', icon: '🍵', price: 38, unlocked: false, req: 'frothing', steps: ['mix_matcha', 'froth', 'pour'], ing: { matcha: 8, milk: 150, sugar: 5 }, popularity: 0 },
    { id: 'cold_brew', name: '冷萃咖啡', icon: '🧊', price: 40, unlocked: false, req: 'cold_brew', steps: ['grind', 'cold_steep', 'filter', 'serve_cold'], ing: { beans: 20, water: 200, ice: 50 }, popularity: 0 },
    { id: 'cappuccino', name: '卡布奇诺', icon: '☕', price: 33, unlocked: false, req: 'frothing', steps: ['extract', 'froth_heavy', 'layer'], ing: { beans: 12, milk: 100, cream: 20 }, popularity: 0 },
    { id: 'caramel', name: '焦糖玛奇朵', icon: '🍮', price: 42, unlocked: false, req: 'frothing', steps: ['extract', 'froth', 'syrup', 'top'], ing: { beans: 12, milk: 120, syrup: 15 }, popularity: 0 }
  ],

  // 热门饮品
  popularDrinks: {},

  // 自定义配方
  customRecipes: [],

  // 制作步骤定义
  stepDefs: {
    grind: { name: '研磨咖啡豆', type: 'click', clicks: 0, maxClicks: 5, icon: '⚙️' },
    bloom: { name: '注水闷蒸', type: 'wait', duration: 3, elapsed: 0, icon: '💧' },
    pour: { name: '缓慢注水', type: 'hold', progress: 0, icon: '🫗' },
    wait: { name: '等待萃取', type: 'wait', duration: 4, elapsed: 0, icon: '⏱️' },
    load: { name: '填充咖啡粉', type: 'click', clicks: 0, maxClicks: 3, icon: '🔩' },
    extract: { name: '意式萃取', type: 'wait', duration: 2, elapsed: 0, icon: '⚡' },
    serve: { name: '出品', type: 'click', clicks: 0, maxClicks: 1, icon: '🫱' },
    dilute: { name: '注入热水', type: 'hold', progress: 0, icon: '💧' },
    froth: { name: '打奶泡', type: 'click', clicks: 0, maxClicks: 4, icon: '🥛' },
    pour2: { name: '分层倒入', type: 'hold', progress: 0, icon: '🫗' },
    latte_art: { name: '拉花', type: 'choice', choice: null, options: ['🌸', '', '❤️', '🌊'], icon: '🎨' },
    mix_matcha: { name: '调制抹茶', type: 'click', clicks: 0, maxClicks: 4, icon: '🍵' },
    froth_heavy: { name: '厚奶泡', type: 'click', clicks: 0, maxClicks: 6, icon: '🥛' },
    layer: { name: '分层', type: 'hold', progress: 0, icon: '🫗' },
    syrup: { name: '加入焦糖', type: 'click', clicks: 0, maxClicks: 2, icon: '🍯' },
    top: { name: '顶层装饰', type: 'choice', choice: null, options: ['🍮', '⭐', '✨', '🌈'], icon: '✨' },
    cold_steep: { name: '冷萃浸泡', type: 'wait', duration: 6, elapsed: 0, icon: '🧊' },
    filter: { name: '过滤', type: 'hold', progress: 0, icon: '🔍' },
    serve_cold: { name: '加冰出品', type: 'click', clicks: 0, maxClicks: 2, icon: '🧊' }
  }
};

// 导出
window.CafeBaseData = baseData;
