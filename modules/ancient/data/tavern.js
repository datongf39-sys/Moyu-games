// ============================================================
// data/shops/tavern.js — 酒楼业态数据
// 依赖：AncientShopPlay（需先加载 systems/shopplay.js）
// ============================================================

AncientShopPlay.register({

  // ── 基础信息 ──────────────────────────────────────────────
  type:        'tavern',          // 对应 estate.shopSubtype
  name:        '酒楼',
  desc:        '坐拥一楼，宾客盈门，八方食客皆慕名而来。',
  recipeName:  '菜谱',
  recipeBonus: 0.06,              // 每道菜谱 +6% 收益
  baseIncome:  300,               // 基础年收益（文）
  ordersPerYear: 6,               // 坐堂单数
  managerCut:  0.3,               // 托管抽成 30%

  // ── 员工（厨子） ──────────────────────────────────────────
  workerRole:  '厨子',
  workerTiers: ['学厨','普通厨子','熟手厨子','老师傅','名厨'],
  workerCost:  { 1:60, 2:120, 3:200, 4:300, 5:500 },  // 雇佣费/年

  // ── 食材 ──────────────────────────────────────────────────
  supplyName:  '食材',
  supplyTiers: ['寻常食材','中等食材','上等食材'],
  supplyCost:  { 1:50, 2:120, 3:220 },

  // ── 八大菜系·共16道菜谱 ──────────────────────────────────
  recipes: [
    // 川菜
    { id:'sichuan_mapo',     cuisine:'川菜', icon:'🌶️', name:'麻婆豆腐',   desc:'麻辣鲜香，豆腐嫩滑，食客趋之若鹜。' },
    { id:'sichuan_boiled',   cuisine:'川菜', icon:'🥩', name:'水煮肉片',   desc:'红汤翻滚，肉片嫩而不柴，辣而不燥。',   minWorkerLevel:2 },
    // 鲁菜
    { id:'lu_squirrel',      cuisine:'鲁菜', icon:'🐟', name:'糖醋鲤鱼',   desc:'鲁菜头牌，酸甜适口，色泽红亮。' },
    { id:'lu_dezhou',        cuisine:'鲁菜', icon:'🍗', name:'德州扒鸡',   desc:'骨肉分离，五香浓郁，久负盛名。',       minWorkerLevel:2 },
    // 粤菜
    { id:'yue_roast',        cuisine:'粤菜', icon:'🍖', name:'脆皮烧鹅',   desc:'皮脆肉嫩，油光鲜亮，南北食客皆称妙。', minSupplyTier:2 },
    { id:'yue_shrimp',       cuisine:'粤菜', icon:'🦐', name:'白灼虾',     desc:'原汁原味，鲜甜爽脆，功夫在火候。',     minSupplyTier:2 },
    // 苏菜（淮扬）
    { id:'su_lion',          cuisine:'苏菜', icon:'🥩', name:'狮子头',     desc:'肥而不腻，入口即化，淮扬精髓所在。' },
    { id:'su_crystal',       cuisine:'苏菜', icon:'🐷', name:'水晶肴肉',   desc:'皮冻透明如水晶，醇香不腥，下酒一绝。', minWorkerLevel:3 },
    // 浙菜
    { id:'zhe_dongpo',       cuisine:'浙菜', icon:'🍖', name:'东坡肉',     desc:'色泽红亮，酥烂不碎，文人雅士最爱。' },
    { id:'zhe_westlake',     cuisine:'浙菜', icon:'🐟', name:'西湖醋鱼',   desc:'酸甜鲜嫩，以湖鱼入馔，风雅十足。',   minSupplyTier:2 },
    // 闽菜
    { id:'min_foTiao',       cuisine:'闽菜', icon:'🫕', name:'佛跳墙',     desc:'食材二十余种，香气溢坛，僧人闻之破戒。',minWorkerLevel:4, minSupplyTier:3 },
    { id:'min_lychee',       cuisine:'闽菜', icon:'🥩', name:'荔枝肉',     desc:'形似荔枝，酸甜适中，闽地名肴。',       minWorkerLevel:2 },
    // 湘菜
    { id:'xiang_fish',       cuisine:'湘菜', icon:'🐟', name:'剁椒鱼头',   desc:'红椒铺满鱼头，蒸出一片火红热烈。' },
    { id:'xiang_mao',        cuisine:'湘菜', icon:'🥩', name:'毛氏红烧肉', desc:'据传为名臣家传，肥而不腻，深受食客追捧。',minWorkerLevel:3 },
    // 徽菜
    { id:'hui_stinky',       cuisine:'徽菜', icon:'🐟', name:'臭鳜鱼',     desc:'腌制发酵，臭中飘香，初闻皱眉再尝难忘。', minSupplyTier:2 },
    { id:'hui_bamboo',       cuisine:'徽菜', icon:'🥩', name:'问政山笋',   desc:'徽州山珍，清鲜脆嫩，文人雅集必备。',     minWorkerLevel:2 },
  ],

  // ── 坐堂随机事件 ──────────────────────────────────────────
  operateEvents: [
    // 普通事件
    { type:'good', rep:3,  money:0,  text:'今日来了一桌乡绅，点了满桌好菜，吃得满意，临走留下赏钱，口口称赞。' },
    { type:'good', rep:5,  money:0,  text:'有文人在楼中吟诗，引来众多食客驻足，生意格外红火。' },
    { type:'good', rep:2,  money:0,  text:'厨子今日状态极佳，出品比往日更胜一筹，食客纷纷回头。' },
    { type:'bad',  rep:-4, money:0,  text:'今日食材送来时已有些不新鲜，勉强入菜，有食客皱眉而去。' },
    { type:'bad',  rep:-3, money:0,  text:'邻桌食客发生争执，闹得满堂不安，几桌客人提前离席。' },
    { type:'bad',  rep:-2, money:0,  text:'厨子与伙计起了口角，出菜慢了半个时辰，食客等得不耐烦。' },
    { type:'info', rep:1,  money:0,  text:'今日客流平稳，无甚波折，账目略有盈余。' },
    { type:'info', rep:0,  money:0,  text:'风雨大作，客人稀少，只有几桌常客撑场。' },
    // 需要中等食材
    { type:'good', rep:6,  money:0,  text:'上等食材入馔，香气飘出半条街，引来过路行人纷纷入座。', minSupplyTier:2 },
    { type:'good', rep:4,  money:0,  text:'食材新鲜，厨子用心，今日出品无一退菜，食客皆满意而归。', minSupplyTier:2 },
    // 需要好厨子
    { type:'good', rep:8,  money:0,  text:'厨子使出压箱底手艺，做出一道从未见过的新菜，引得食客竞相传颂。', minWorkerLevel:3 },
    { type:'good', rep:5,  money:0,  text:'老师傅刀工精湛，今日宴席被一位富商看中，当场预订下月家宴。', minWorkerLevel:4 },
    // 特殊事件
    { type:'good', rep:10, money:0,  text:'今日恰逢县令微服私访，吃了一顿便饭，临走大加赞赏，口碑之名传遍全城。', minWorkerLevel:3, minSupplyTier:2 },
    { type:'bad',  rep:-8, money:0,  text:'厨子突然告病，临时找了个帮手顶替，出品一塌糊涂，几桌食客当场拍桌而起。' },
    { type:'bad',  rep:-5, money:0,  text:'邻街新开了一家酒楼，今日客流明显减少，需得想法子应对。' },
  ],
});
