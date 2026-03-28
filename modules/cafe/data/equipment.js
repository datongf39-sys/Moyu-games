/**
 * ═══════════════════════════════════════════════════════════
 * 设备数据模块
 * ═══════════════════════════════════════════════════════════
 */

const equipmentData = {
  equipment: {
    espresso: false,
    frothing: false,
    cold_brew: false,
    grinder: false,
    syrup_pump: false,
    auto_temp: false
  },
  equipNames: {
    espresso: '意式咖啡机',
    frothing: '奶泡机',
    cold_brew: '冷萃设备',
    grinder: '专业磨豆机',
    syrup_pump: '果糖泵',
    auto_temp: '自动控温壶'
  },
  equipDesc: {
    espresso: '解锁浓缩/美式',
    frothing: '解锁拿铁系列',
    cold_brew: '解锁冷萃系列',
    grinder: '咖啡品质 +20%',
    syrup_pump: '果糖调味更精准',
    auto_temp: '手冲品质 +30%'
  },
  equipCost: {
    espresso: 800,
    frothing: 500,
    cold_brew: 1200,
    grinder: 1500,
    syrup_pump: 300,
    auto_temp: 900
  }
};

// 导出
window.CafeEquipmentData = equipmentData;
