/**
 * ═══════════════════════════════════════════════════════════
 * 食材系统模块
 * ═══════════════════════════════════════════════════════════
 */

const ingredients = {
  // 补货成本
  costs: { beans: 5, milk: 2, water: 0.5, sugar: 1, syrup: 3, cream: 4, matcha: 8, ice: 0.5 },

  // 补货
  restock(ing, amt) {
    const cost = Math.ceil(this.costs[ing] * amt);
    if (C.cash < cost) {
      addLog('clog', `💸 现金不足！补${amt}个${C.ingNames[ing]}需¥${cost}`, 'lbad');
      return false;
    }
    
    C.cash -= cost;
    C.ingredients[ing] = Math.min(C.maxIng[ing], C.ingredients[ing] + amt);
    addLog('clog', `📦 补货 ${C.ingNames[ing]}×${amt}，花费¥${cost}`, 'linfo');
    return true;
  },

  // 检查食材是否足够
  check(recipe) {
    return Object.entries(recipe).every(([k, v]) => C.ingredients[k] >= v);
  },

  // 消耗食材
  consume(recipe) {
    Object.entries(recipe).forEach(([k, v]) => {
      C.ingredients[k] = Math.max(0, C.ingredients[k] - v);
    });
  },

  // 低库存警告
  getLowStock() {
    const low = [];
    Object.entries(C.ingredients).forEach(([k, v]) => {
      if (v < C.maxIng[k] * 0.2) {
        low.push({ ing: k, name: C.ingNames[k], current: v, max: C.maxIng[k] });
      }
    });
    return low;
  },

  // 自动补货（如果有资深员工）
  autoRestock() {
    const low = this.getLowStock();
    if (low.length && C.staff.some(s => s.role === '资深咖啡师')) {
      const item = low[0];
      const cost = this.costs[item.ing];
      if (C.cash >= cost * 20) {
        this.restock(item.ing, 20);
      }
    }
  }
};

// 导出
window.CafeIngredients = ingredients;
