/**
 * ═══════════════════════════════════════════════════════════
 * 食材数据模块
 * ═══════════════════════════════════════════════════════════
 */

const ingredientsData = {
  ingredients: {
    beans: 100,
    milk: 80,
    water: 200,
    sugar: 50,
    syrup: 20,
    cream: 30,
    matcha: 15,
    ice: 100
  },
  maxIng: {
    beans: 200,
    milk: 200,
    water: 500,
    sugar: 100,
    syrup: 50,
    cream: 80,
    matcha: 50,
    ice: 200
  },
  ingNames: {
    beans: '咖啡豆',
    milk: '牛奶',
    water: '净水',
    sugar: '白糖',
    syrup: '果糖',
    cream: '奶油',
    matcha: '抹茶粉',
    ice: '冰块'
  },
  ingIcons: {
    beans: '☕',
    milk: '🥛',
    water: '💧',
    sugar: '🍬',
    syrup: '🍯',
    cream: '🧴',
    matcha: '🍵',
    ice: '🧊'
  }
};

// 导出
window.CafeIngredientsData = ingredientsData;
