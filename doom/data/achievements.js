const DoomAchievementsData = {
  achievements: [
    { name: '第一夜', desc: '存活第 1 天', check: d => d.day >= 1, done: false, icon: '🌙' },
    { name: '囤货达人', desc: '食物超过 80', check: d => d.resources.food >= 80, done: false, icon: '🥫' },
    { name: '团队力量', desc: '招募 3 名幸存者', check: d => d.survivors.length >= 3, done: false, icon: '👥' },
    { name: '房车改造', desc: '完成 3 项升级', check: d => d.vanUpgrades.filter(u => u.bought).length >= 3, done: false, icon: '🚐' },
    { name: '一周求生', desc: '存活 7 天', check: d => d.day >= 7, done: false, icon: '📅' },
    { name: '幸运探索者', desc: '探索 5 个地点', check: d => d.map.filter(m => m.explored && m.id !== 0).length >= 5, done: false, icon: '🗺️' }
  ]
}

window.DoomAchievementsData = DoomAchievementsData
