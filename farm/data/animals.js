const FarmAnimalsData = {
  animals: [],
  animalTypes: [
    { id: 'chicken', name: '鸡', icon: '🐔', cost: 30, desc: '产鸡蛋/3s', produce: { item: 'egg', icon: '🥚', val: 2, time: 3 } },
    { id: 'pig', name: '猪', icon: '🐷', cost: 100, desc: '肉产出高', produce: { item: 'pork', icon: '🥩', val: 8, time: 10 } },
    { id: 'cow', name: '奶牛', icon: '🐄', cost: 250, desc: '产牛奶/5s', produce: { item: 'milk', icon: '🥛', val: 5, time: 5 } },
    { id: 'sheep', name: '绵羊', icon: '🐑', cost: 150, desc: '产羊毛/8s', produce: { item: 'wool', icon: '🧶', val: 4, time: 8 } },
    { id: 'bee', name: '蜜蜂箱', icon: '🐝', cost: 80, desc: '产蜂蜜/6s', produce: { item: 'honey', icon: '🍯', val: 6, time: 6 } }
  ],
  animalProducts: { egg: 0, pork: 0, milk: 0, wool: 0, honey: 0 },
  productNames: { egg: '鸡蛋', pork: '猪肉', milk: '牛奶', wool: '羊毛', honey: '蜂蜜' },
  productIcons: { egg: '🥚', pork: '🥩', milk: '🥛', wool: '🧶', honey: '🍯' }
}

window.FarmAnimalsData = FarmAnimalsData
