const DoomMapData = {
  map: [
    { id: 0, name: '基地营地', icon: '🏠', explored: true, current: true, rad: 0, loot: 'low', desc: '你的根据地', x: 3, y: 3 },
    { id: 1, name: '废弃超市', icon: '🏪', explored: false, rad: 0, loot: 'high', desc: '可能有大量食物和水', x: 2, y: 2, drops: { food: [10, 40], water: [5, 25], medicine: [0, 8] } },
    { id: 2, name: '加油站', icon: '⛽', explored: false, rad: 5, loot: 'medium', desc: '燃料储量丰富，但有危险', x: 4, y: 2, drops: { fuel: [15, 40], ammo: [0, 15], scrap: [5, 20] } },
    { id: 3, name: '医院废墟', icon: '🏥', explored: false, rad: 15, loot: 'high', desc: '医疗物资丰富，但辐射严重', x: 2, y: 4, drops: { medicine: [10, 30], battery: [2, 8] } },
    { id: 4, name: '军事基地', icon: '🪖', explored: false, rad: 20, loot: 'high', desc: '弹药和物资，但防守严密', x: 4, y: 1, drops: { ammo: [20, 60], scrap: [10, 30], food: [5, 15] } },
    { id: 5, name: '居民区', icon: '🏘️', explored: false, rad: 5, loot: 'medium', desc: '普通住宅区，各类物资', x: 1, y: 3, drops: { food: [5, 20], water: [5, 20], scrap: [5, 15] } },
    { id: 6, name: '工厂', icon: '🏭', explored: false, rad: 10, loot: 'medium', desc: '零件和废料', x: 5, y: 3, drops: { scrap: [20, 50], battery: [3, 10], fuel: [5, 15] } },
    { id: 7, name: '学校', icon: '🏫', explored: false, rad: 0, loot: 'low', desc: '基础物资和少量医疗', x: 3, y: 1, drops: { food: [5, 15], medicine: [2, 8] } },
    { id: 8, name: '公园', icon: '🌳', explored: false, rad: 0, loot: 'low', desc: '植物和天然水源', x: 1, y: 1, drops: { food: [3, 12], water: [10, 30] } },
    { id: 9, name: '地下室', icon: '🕳️', explored: false, rad: 0, loot: 'high', desc: '可能有幸存者物资', x: 5, y: 1, drops: { food: [10, 25], water: [5, 20], ammo: [5, 20], battery: [1, 5] } },
    { id: 10, name: '核电站', icon: '☢️', explored: false, rad: 80, loot: 'high', desc: '危险！辐射极高，物资丰富', x: 5, y: 5, drops: { battery: [10, 30], scrap: [30, 80] } },
    { id: 11, name: '港口', icon: '⚓', explored: false, rad: 5, loot: 'medium', desc: '可能有船用物资', x: 1, y: 5, drops: { fuel: [10, 30], scrap: [15, 40] } },
    { id: 12, name: '地铁站', icon: '🚇', explored: false, rad: 10, loot: 'medium', desc: '地下网络，可连接多个地点', x: 3, y: 5, drops: { food: [5, 20], water: [5, 20], scrap: [10, 25] } }
  ]
}

window.DoomMapData = DoomMapData
