const DoomVanData = {
  vanUpgrades: [
    { id: 'armor', name: '车身装甲', desc: '房车防御 +50%', cost: { scrap: 30, battery: 2 }, bought: false, icon: '🛡️' },
    { id: 'solar', name: '太阳能板', desc: '每天 +5 电池', cost: { scrap: 20, battery: 5 }, bought: false, icon: '☀️' },
    { id: 'storage', name: '扩容储物', desc: '背包容量 +30kg', cost: { scrap: 15 }, bought: false, icon: '📦' },
    { id: 'filter', name: '净水系统', desc: '每天产水 +10L', cost: { scrap: 25, battery: 3 }, bought: false, icon: '💧' },
    { id: 'med', name: '车载药箱', desc: '医疗上限×2', cost: { scrap: 20, medicine: 5 }, bought: false, icon: '🏥' },
    { id: 'radio', name: '无线电台', desc: '提前收到威胁预警', cost: { scrap: 30, battery: 8 }, bought: false, icon: '📻' },
    { id: 'turret', name: '自动炮塔', desc: '自动抵御攻击', cost: { scrap: 50, ammo: 20, battery: 10 }, bought: false, icon: '🔫' },
    { id: 'lab', name: '研究实验室', desc: '解锁配方合成', cost: { scrap: 40, battery: 15 }, bought: false, icon: '🧪' }
  ],
  vanEquip: [
    { id: 'gps', name: 'GPS 导航', desc: '显示物资点位置', cost: { battery: 5 }, bought: false, icon: '🗺️' },
    { id: 'snorkel', name: '防水改装', desc: '可探索洪水区域', cost: { scrap: 20 }, bought: false, icon: '🌊' },
    { id: 'gasmask', name: '防毒面具', desc: '辐射抗性 +50%', cost: { scrap: 15, medicine: 3 }, bought: false, icon: '😷' },
    { id: 'winch', name: '绞盘', desc: '救援被困幸存者', cost: { scrap: 10 }, bought: false, icon: '⛓️' }
  ]
}

window.DoomVanData = DoomVanData
