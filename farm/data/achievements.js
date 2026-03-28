const FarmAchievementsData = {
  achievements: [
    { name: '初春播种', desc: '种下第一粒种子', check: f => f.harvested >= 1, done: false, icon: '🌱' },
    { name: '丰收时节', desc: '收获 50 次', check: f => f.harvested >= 50, done: false, icon: '🌾' },
    { name: '牧场主', desc: '拥有 5 头牲畜', check: f => f.animals.length >= 5, done: false, icon: '🐄' },
    { name: '研究达人', desc: '研发 1 个杂交品种', check: f => f.hybrids.length >= 1, done: false, icon: '🧪' },
    { name: '万金商人', desc: '金币超过 1000', check: f => f.gold >= 1000, done: false, icon: '💰' },
    { name: '百季丰收', desc: '收获 100 次', check: f => f.harvested >= 100, done: false, icon: '🏆' }
  ]
}

window.FarmAchievementsData = FarmAchievementsData
