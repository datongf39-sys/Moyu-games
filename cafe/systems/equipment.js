/**
 * ═══════════════════════════════════════════════════════════
 * 设备系统模块
 * ═══════════════════════════════════════════════════════════
 */

const equipment = {
  // 购买设备
  buy(id) {
    const cost = C.equipCost[id];
    if (C.cash < cost || C.equipment[id]) return false;
    
    C.cash -= cost;
    C.equipment[id] = true;
    
    // 标记待解锁的饮品
    C.menu.forEach(m => {
      if (m.req === id) m.pendingUnlock = true;
    });
    
    addLog('clog', `🔧 购入 ${C.equipNames[id]}！前往配方研发解锁新饮品`, 'lok');
    return true;
  },

  // 检查设备是否拥有
  has(id) {
    return C.equipment[id] === true;
  },

  // 获取所有设备状态
  getAll() {
    return Object.entries(C.equipment).map(([k, v]) => ({
      id: k,
      name: C.equipNames[k],
      desc: C.equipDesc[k],
      cost: C.equipCost[k],
      owned: v
    }));
  },

  // 总设备数
  count() {
    return Object.values(C.equipment).filter(v => v).length;
  }
};

// 导出
window.CafeEquipment = equipment;
