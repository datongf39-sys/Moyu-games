/**
 * ═══════════════════════════════════════════════════════════
 * 配方研发功能模块
 * ═══════════════════════════════════════════════════════════
 */

const research = {
  // 开始研发
  start(drinkId) {
    const drink = C.menu.find(m => m.id === drinkId);
    if (!drink || !drink.pendingUnlock || drink.unlocked) return false;
    
    // 检查食材是否足够
    const ok = window.CafeIngredients?.check(drink.ing);
    if (!ok) {
      addLog('clog', '⚠️ 食材不足，无法研发', 'lbad');
      return false;
    }
    
    // 消耗食材
    window.CafeIngredients?.consume(drink.ing);
    
    // 解锁饮品
    drink.unlocked = true;
    drink.pendingUnlock = false;
    
    addLog('clog', `✅ 配方研发成功！${drink.icon}${drink.name} 已加入菜单`, 'lok');
    return true;
  },

  // 检查是否可以研发
  canResearch(drinkId) {
    const drink = C.menu.find(m => m.id === drinkId);
    if (!drink || !drink.pendingUnlock || drink.unlocked) return false;
    return window.CafeIngredients?.check(drink.ing);
  },

  // 获取待研发配方
  getPending() {
    return C.menu.filter(m => m.pendingUnlock && !m.unlocked);
  },

  // 创建自定义配方
  createCustom() {
    if (C.done < 50 || C.customRecipes.length >= Math.floor(C.done / 50)) {
      return false;
    }
    
    const names = ['特调拿铁', '秘制冷萃', '招牌特饮', '季节限定', '店主特供'];
    const icons = ['☕', '🍵', '🧊', '', '✨'];
    const n = names[Math.floor(Math.random() * names.length)];
    const ico = icons[Math.floor(Math.random() * icons.length)];
    
    C.customRecipes.push({ name: n, icon: ico, price: 45 + Math.floor(Math.random() * 30) });
    addLog('clog', `🧪 创建配方：${ico}${n}`, 'lok');
    return true;
  },

  // 是否可以创建自定义配方
  canCreateCustom() {
    return C.done >= 50 && C.customRecipes.length < Math.floor(C.done / 50);
  }
};

// 导出
window.CafeResearch = research;
