const DoomInventoryData = {
  inventory: [
    { id: 'bandage', name: '绷带', icon: '🩹', count: 3, weight: 0.2, type: 'medical', heal: 15 },
    { id: 'canned', name: '罐头食品', icon: '🥫', count: 8, weight: 0.5, type: 'food', food: 20 },
    { id: 'water_b', name: '净水器', icon: '🧴', count: 2, weight: 0.3, type: 'tool' },
    { id: 'lockpick', name: '撬锁器', icon: '🔧', count: 1, weight: 0.1, type: 'tool' },
    { id: 'molotov', name: '汽油瓶', icon: '🔥', count: 0, weight: 0.3, type: 'weapon', damage: 50 }
  ]
}

window.DoomInventoryData = DoomInventoryData
