const FarmToolsData = {
  tools: [
    { id: 'watercan', name: '喷水车', desc: '自动浇水，加速 10%', cost: 300, bought: false, icon: '🚿' },
    { id: 'harvester', name: '自动收割机', desc: '自动收获成熟作物', cost: 800, bought: false, icon: '🚜' },
    { id: 'pesticide', name: '农药喷洒器', desc: '自动消灭害虫', cost: 500, bought: false, icon: '💊' },
    { id: 'greenhouse', name: '温室', desc: '所有作物速度 +30%', cost: 1500, bought: false, icon: '🏠' }
  ],
  upgrades: [
    { id: 'rd1', name: '初级研发', desc: '解锁草莓/西瓜', cost: 200, bought: false, icon: '🔬' },
    { id: 'rd2', name: '中级研发', desc: '解锁松茸/南瓜', cost: 500, bought: false, icon: '🧪' },
    { id: 'rd3', name: '高级研发', desc: '解锁玫瑰 + 杂交实验', cost: 1000, bought: false, icon: '⭐' },
    { id: 'ranch', name: '牧场升级', desc: '牲畜上限 +5', cost: 400, bought: false, icon: '🏡' }
  ]
}

window.FarmToolsData = FarmToolsData
