const FarmSeedsData = {
  seeds: [
    { id: 'wheat', name: '小麦', icon: '🌾', time: 20, profit: 15, req: null },
    { id: 'tomato', name: '番茄', icon: '🍅', time: 30, profit: 25, req: null },
    { id: 'corn', name: '玉米', icon: '🌽', time: 45, profit: 40, req: null },
    { id: 'berry', name: '草莓', icon: '🍓', time: 60, profit: 60, req: 'rd1' },
    { id: 'melon', name: '西瓜', icon: '🍉', time: 80, profit: 80, req: 'rd1' },
    { id: 'mushroom', name: '松茸', icon: '🍄', time: 120, profit: 150, req: 'rd2' },
    { id: 'pumpkin', name: '南瓜', icon: '🎃', time: 90, profit: 100, req: 'rd2' },
    { id: 'rose', name: '玫瑰', icon: '🌹', time: 100, profit: 200, req: 'rd3' }
  ]
}

window.FarmSeedsData = FarmSeedsData
