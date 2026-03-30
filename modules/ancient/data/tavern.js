// ============================================================
// data/tavern.js — 酒楼业态纯数据
// ============================================================

const AncientTavernData = {

  // ── 食材库 ────────────────────────────────────────────────
  INGREDIENTS: [
    { id:'pork',       name:'猪肉',   icon:'🥩', type:'肉类', price:20 },
    { id:'beef',       name:'牛肉',   icon:'🥩', type:'肉类', price:30 },
    { id:'chicken',    name:'鸡肉',   icon:'🍗', type:'禽类', price:25 },
    { id:'fish',       name:'鲜鱼',   icon:'🐟', type:'水产', price:25 },
    { id:'shrimp',     name:'河虾',   icon:'🦐', type:'水产', price:30 },
    { id:'tofu',       name:'豆腐',   icon:'🫕', type:'豆制品', price:8 },
    { id:'bamboo',     name:'竹笋',   icon:'🎋', type:'蔬菜', price:12 },
    { id:'chili',      name:'辣椒',   icon:'🌶️', type:'调料', price:8 },
    { id:'vinegar',    name:'醋',     icon:'🍶', type:'调料', price:6 },
    { id:'soy',        name:'酱油',   icon:'🫙', type:'调料', price:6 },
    { id:'wine',       name:'黄酒',   icon:'🍷', type:'调料', price:10 },
    { id:'fermented',  name:'腌料',   icon:'🧂', type:'调料', price:10 },
  ],

  // ── 做法 ──────────────────────────────────────────────────
  METHODS: [
    { id:'steam',  name:'蒸', icon:'♨️' },
    { id:'fry',    name:'煎', icon:'🍳' },
    { id:'stir',   name:'炒', icon:'🥘' },
    { id:'deep',   name:'炸', icon:'🫕' },
    { id:'boil',   name:'煮', icon:'🍲' },
    { id:'roast',  name:'烤', icon:'🔥' },
  ],

  // ── 菜谱（八大菜系各两道） ────────────────────────────────
  RECIPES: [
    // 川菜
    {
      id:'sichuan_mapo', cuisine:'川菜', icon:'🌶️', name:'麻婆豆腐',
      desc:'麻辣鲜香，豆腐嫩滑，食客趋之若鹜。',
      ingredients: ['tofu','pork','chili'], method:'stir',
      price: 18, repBonus: 2,
    },
    {
      id:'sichuan_boiled', cuisine:'川菜', icon:'🥩', name:'水煮肉片',
      desc:'红汤翻滚，肉片嫩而不柴，辣而不燥。',
      ingredients: ['pork','chili','tofu'], method:'boil',
      price: 22, repBonus: 3,
    },
    // 鲁菜
    {
      id:'lu_squirrel', cuisine:'鲁菜', icon:'🐟', name:'糖醋鲤鱼',
      desc:'鲁菜头牌，酸甜适口，色泽红亮。',
      ingredients: ['fish','vinegar','soy'], method:'deep',
      price: 28, repBonus: 3,
    },
    {
      id:'lu_dezhou', cuisine:'鲁菜', icon:'🍗', name:'德州扒鸡',
      desc:'骨肉分离，五香浓郁，久负盛名。',
      ingredients: ['chicken','soy','wine'], method:'boil',
      price: 25, repBonus: 3,
    },
    // 粤菜
    {
      id:'yue_roast', cuisine:'粤菜', icon:'🍖', name:'脆皮烧鹅',
      desc:'皮脆肉嫩，油光鲜亮，南北食客皆称妙。',
      ingredients: ['chicken','fermented','soy'], method:'roast',
      price: 35, repBonus: 4,
    },
    {
      id:'yue_shrimp', cuisine:'粤菜', icon:'🦐', name:'白灼虾',
      desc:'原汁原味，鲜甜爽脆，功夫在火候。',
      ingredients: ['shrimp','soy'], method:'steam',
      price: 30, repBonus: 3,
    },
    // 苏菜
    {
      id:'su_lion', cuisine:'苏菜', icon:'🥩', name:'狮子头',
      desc:'肥而不腻，入口即化，淮扬精髓所在。',
      ingredients: ['pork','tofu','soy'], method:'deep',
      price: 25, repBonus: 3,
    },
    {
      id:'su_crystal', cuisine:'苏菜', icon:'🐷', name:'水晶肴肉',
      desc:'皮冻透明如水晶，醇香不腥，下酒一绝。',
      ingredients: ['pork','fermented','vinegar'], method:'boil',
      price: 28, repBonus: 4,
    },
    // 浙菜
    {
      id:'zhe_dongpo', cuisine:'浙菜', icon:'🍖', name:'东坡肉',
      desc:'色泽红亮，酥烂不碎，文人雅士最爱。',
      ingredients: ['pork','soy','wine'], method:'boil',
      price: 28, repBonus: 3,
    },
    {
      id:'zhe_westlake', cuisine:'浙菜', icon:'🐟', name:'西湖醋鱼',
      desc:'酸甜鲜嫩，以湖鱼入馔，风雅十足。',
      ingredients: ['fish','vinegar','wine'], method:'steam',
      price: 30, repBonus: 4,
    },
    // 闽菜
    {
      id:'min_foTiao', cuisine:'闽菜', icon:'🫕', name:'佛跳墙',
      desc:'食材二十余种，香气溢坛，僧人闻之破戒。',
      ingredients: ['fish','shrimp','chicken'], method:'steam',
      price: 60, repBonus: 8,
    },
    {
      id:'min_lychee', cuisine:'闽菜', icon:'🥩', name:'荔枝肉',
      desc:'形似荔枝，酸甜适中，闽地名肴。',
      ingredients: ['pork','vinegar','soy'], method:'deep',
      price: 22, repBonus: 2,
    },
    // 湘菜
    {
      id:'xiang_fish', cuisine:'湘菜', icon:'🐟', name:'剁椒鱼头',
      desc:'红椒铺满鱼头，蒸出一片火红热烈。',
      ingredients: ['fish','chili','fermented'], method:'steam',
      price: 30, repBonus: 4,
    },
    {
      id:'xiang_mao', cuisine:'湘菜', icon:'🥩', name:'毛氏红烧肉',
      desc:'肥而不腻，深受食客追捧。',
      ingredients: ['pork','soy','chili'], method:'boil',
      price: 25, repBonus: 3,
    },
    // 徽菜
    {
      id:'hui_stinky', cuisine:'徽菜', icon:'🐟', name:'臭鳜鱼',
      desc:'腌制发酵，臭中飘香，初闻皱眉再尝难忘。',
      ingredients: ['fish','fermented','wine'], method:'fry',
      price: 35, repBonus: 5,
    },
    {
      id:'hui_bamboo', cuisine:'徽菜', icon:'🎋', name:'问政山笋',
      desc:'徽州山珍，清鲜脆嫩，文人雅集必备。',
      ingredients: ['bamboo','pork','soy'], method:'boil',
      price: 20, repBonus: 2,
    },
  ],

  // ── 顾客类型 ──────────────────────────────────────────────
  CUSTOMER_TYPES: [
    { id:'common',   name:'寻常食客', icon:'🧑', orderCount:1, budget:30  },
    { id:'scholar',  name:'书生',     icon:'📚', orderCount:1, budget:25  },
    { id:'merchant', name:'商贾',     icon:'💰', orderCount:2, budget:80  },
    { id:'official', name:'小官',     icon:'🎩', orderCount:2, budget:100 },
    { id:'noble',    name:'贵客',     icon:'👑', orderCount:3, budget:200 },
  ],

  // ── 坐堂随机事件（开业期间触发） ─────────────────────────
  OPERATE_EVENTS: [
    { type:'good', rep:3,  text:'今日来了一桌乡绅，吃得满意，临走留下赏钱。' },
    { type:'good', rep:5,  text:'有文人在楼中吟诗，引来众多食客驻足，生意格外红火。' },
    { type:'bad',  rep:-4, text:'今日食材送来时已有些不新鲜，有食客皱眉而去。' },
    { type:'bad',  rep:-3, text:'邻桌食客发生争执，几桌客人提前离席。' },
    { type:'info', rep:1,  text:'今日客流平稳，无甚波折，账目略有盈余。' },
    { type:'good', rep:8,  text:'厨子使出压箱底手艺，引得食客竞相传颂。' },
    { type:'bad',  rep:-5, text:'邻街新开了一家酒楼，今日客流明显减少。' },
    { type:'good', rep:10, text:'县令微服私访，吃了一顿便饭，临走大加赞赏，口碑传遍全城。' },
  ],

  // ── 厨子工钱（每年） ──────────────────────────────────────
  CHEF_COST:   { 1:60, 2:120, 3:200, 4:300, 5:500 },
  CHEF_TIERS:  ['学厨','普通厨子','熟手厨子','老师傅','名厨'],

  // ── 小二工钱（每年） ──────────────────────────────────────
  WAITER_COST: 80,

  // ── 托管抽成 ──────────────────────────────────────────────
  MANAGER_CUT: 0.3,
};

window.AncientTavernData = AncientTavernData;
