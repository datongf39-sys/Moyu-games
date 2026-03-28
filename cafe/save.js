/**
 * ═══════════════════════════════════════════════════════════
 * 存档系统模块
 * ═══════════════════════════════════════════════════════════
 */

// 保存游戏
function save() {
  try {
    localStorage.setItem('cafe', JSON.stringify({
      cash: C.cash,
      done: C.done,
      satisfaction: C.satisfaction,
      todayRev: C.todayRev,
      totalRev: C.totalRev,
      starLevel: C.starLevel,
      maxPrice: C.maxPrice,
      scores: C.scores,
      revHistory: C.revHistory,
      ingredients: C.ingredients,
      equipment: C.equipment,
      staff: C.staff,
      vips: C.vips,
      reviews: C.reviews,
      events: C.events,
      activeEvent: C.activeEvent,
      customRecipes: C.customRecipes,
      popularDrinks: C.popularDrinks,
      menuState: C.menu.map(m => ({ id: m.id, unlocked: m.unlocked, pendingUnlock: m.pendingUnlock || false }))
    }));
  } catch (e) {
    console.error('保存失败:', e);
  }
}

// 加载游戏
function load() {
  try {
    const s = JSON.parse(localStorage.getItem('cafe') || '{}');
    if (s.cash) {
      // 恢复基础数据
      const fields = ['cash', 'done', 'satisfaction', 'todayRev', 'totalRev', 'starLevel', 'maxPrice', 'scores', 'revHistory'];
      fields.forEach(k => { if (s[k] !== undefined) C[k] = s[k]; });
      
      // 恢复食材
      if (s.ingredients) {
        const defaultIng = { beans: 100, milk: 80, water: 200, sugar: 50, syrup: 20, cream: 30, matcha: 15, ice: 100 };
        C.ingredients = { ...defaultIng, ...s.ingredients };
      }
      
      // 恢复设备
      if (s.equipment) C.equipment = { ...C.equipment, ...s.equipment };
      
      // 恢复员工
      if (s.staff) {
        const validRoles = ['店主', '学徒咖啡师', '咖啡师', '资深咖啡师'];
        C.staff = s.staff.filter(s => validRoles.includes(s.role));
        if (!C.staff.some(s => s.role === '店主')) {
          C.staff.unshift({ id: 'self', name: '你自己', icon: '🧑', skill: 1, role: '店主', mood: 90 });
        }
      }
      
      // 恢复 VIP 和评价
      if (s.vips) C.vips = s.vips;
      if (s.reviews) C.reviews = s.reviews;
      
      // 恢复活动
      if (s.events) C.events = s.events;
      if (s.activeEvent) C.activeEvent = s.activeEvent;
      
      // 恢复自定义配方和热门饮品
      if (s.customRecipes) C.customRecipes = s.customRecipes;
      if (s.popularDrinks) C.popularDrinks = s.popularDrinks;
      
      // 恢复菜单状态
      if (s.menuState) {
        s.menuState.forEach(ms => {
          const m = C.menu.find(x => x.id === ms.id);
          if (m) {
            m.unlocked = ms.unlocked;
            m.pendingUnlock = ms.pendingUnlock || false;
          }
        });
      }
    } else {
      // 全新存档，只解锁基础款
      if (C.menu) C.menu.forEach(m => { if (!m.req) m.unlocked = true; });
    }
    
    // 确保 isOpen 有正确初始值
    if (C.isOpen === undefined) C.isOpen = true;
  } catch (e) {
    console.error('加载失败:', e);
  }
}

// 保存并返回
function saveBack() {
  save();
  location.href = 'index.html';
}

// 重置游戏
function resetGame() {
  if (!confirm('确定要从头开始吗？所有进度将清空！')) return;
  localStorage.removeItem('cafe');
  location.reload();
}

// 主题切换
function st(t) {
  localStorage.setItem('moyu-theme', t);
  document.documentElement.setAttribute('data-theme', t);
}

// 导出
window.CafeSave = { save, load, saveBack, resetGame, st };
