const DoomSurvivorsData = {
  survivors: [
    {
      id: 1,
      name: '主角',
      icon: '🧑',
      hp: 100,
      maxHp: 100,
      hunger: 80,
      thirst: 80,
      morale: 80,
      skills: {
        scavenge: 2,
        medic: 1,
        combat: 1,
        mechanic: 1,
        cook: 0
      },
      role: '领队',
      isPlayer: true,
      status: '健康'
    }
  ],
  skills: {
    scavenge: 0,
    medic: 0,
    combat: 0,
    mechanic: 0,
    cook: 0,
    sneak: 0,
    trade: 0
  },
  skillNames: {
    scavenge: '搜刮',
    medic: '医疗',
    combat: '战斗',
    mechanic: '机械',
    cook: '烹饪',
    sneak: '潜行',
    trade: '交易'
  }
}

window.DoomSurvivorsData = DoomSurvivorsData
