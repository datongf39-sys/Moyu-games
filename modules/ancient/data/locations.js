// ══════════════════════════════════════════════════════
//  locations.js  —  行商 & 官员地点数据
// ══════════════════════════════════════════════════════

const AncientPlacesData = {

  // ── 起始地 ───────────────────────────────────────────
  HOME: {id:'home', name:'京城', icon:'🏯', desc:'天子脚下，繁华之地'},

  // ── 地点库 ───────────────────────────────────────────
  // rank     : 官员可被派任的最低品级（0=任何品级均可）
  // tradeOnly: true = 仅行商可去
  PLACES: [
    {
      id:'qinghe', name:'清河县', icon:'🌾', rank:0,
      desc:'农桑之地，粮食丰饶，商路平稳',
      traits:['农业兴盛','人口稠密'],
      goods:{
        buy: [
          {id:'grain',  name:'粮食', icon:'🌾', basePrice:8,  priceVar:0.15},
          {id:'cotton', name:'棉布', icon:'🧵', basePrice:20, priceVar:0.20},
          {id:'straw',  name:'草药', icon:'🌿', basePrice:15, priceVar:0.25},
        ],
        sell:[
          {id:'silk',   name:'丝绸', icon:'🎀', basePrice:80, priceVar:0.20},
          {id:'iron',   name:'铁器', icon:'⚙️', basePrice:45, priceVar:0.15},
          {id:'salt',   name:'食盐', icon:'🧂', basePrice:30, priceVar:0.10},
        ],
      },
      events:[
        {id:'harvest', text:'今岁大丰收，粮食价格下跌两成。',       effect:{goodId:'grain', priceMod:-0.20}},
        {id:'drought', text:'旱情肆虐，粮食价格暴涨。',             effect:{goodId:'grain', priceMod:+0.35}},
        {id:'bandit',  text:'路遇劫匪，货物损失一成。',              effect:{cargoLoss:0.10}},
      ],
    },
    {
      id:'anping', name:'安平镇', icon:'🏘️', rank:0,
      desc:'水陆交汇之处，商贾云集',
      traits:['商业繁荣','水运便利'],
      goods:{
        buy: [
          {id:'fish',    name:'鲜鱼', icon:'🐟', basePrice:12, priceVar:0.30},
          {id:'pottery', name:'陶器', icon:'🏺', basePrice:25, priceVar:0.20},
          {id:'hemp',    name:'麻布', icon:'🧶', basePrice:18, priceVar:0.15},
        ],
        sell:[
          {id:'silk',    name:'丝绸', icon:'🎀', basePrice:75, priceVar:0.25},
          {id:'spice',   name:'香料', icon:'🌶️', basePrice:60, priceVar:0.30},
          {id:'grain',   name:'粮食', icon:'🌾', basePrice:15, priceVar:0.10},
        ],
      },
      events:[
        {id:'flood',    text:'水患来袭，陶器需求大增，价格上涨。',    effect:{goodId:'pottery', priceMod:+0.25}},
        {id:'festival', text:'镇上节庆，香料供不应求。',               effect:{goodId:'spice',   priceMod:+0.20}},
        {id:'delay',    text:'水路拥堵，此行耗时延长，错过一轮交易。', effect:{skipRound:true}},
      ],
    },
    {
      id:'jiangnan', name:'江南府', icon:'🍃', rank:1,
      desc:'丝绸之乡，富庶天下',
      traits:['丝绸产地','文风鼎盛'],
      goods:{
        buy: [
          {id:'silk',  name:'丝绸', icon:'🎀', basePrice:55, priceVar:0.15},
          {id:'tea',   name:'茗茶', icon:'🍵', basePrice:35, priceVar:0.20},
          {id:'paper', name:'宣纸', icon:'📄', basePrice:28, priceVar:0.15},
        ],
        sell:[
          {id:'spice', name:'香料', icon:'🌶️', basePrice:70, priceVar:0.25},
          {id:'iron',  name:'铁器', icon:'⚙️', basePrice:55, priceVar:0.15},
          {id:'salt',  name:'食盐', icon:'🧂', basePrice:40, priceVar:0.10},
        ],
      },
      events:[
        {id:'silk_boom',  text:'丝绸今年大量产出，收购价走低。',      effect:{goodId:'silk',  priceMod:-0.25}},
        {id:'exam_surge', text:'科举之年，宣纸供不应求，价格飙升。',  effect:{goodId:'paper', priceMod:+0.30}},
        {id:'bandit',     text:'路遇劫匪，货物损失一成。',             effect:{cargoLoss:0.10}},
      ],
    },
    {
      id:'bianzhou', name:'汴州城', icon:'🏙️', rank:1,
      desc:'中原重镇，四方货物汇聚之地',
      traits:['交通枢纽','铁器集散'],
      goods:{
        buy: [
          {id:'iron',    name:'铁器', icon:'⚙️', basePrice:38, priceVar:0.15},
          {id:'coal',    name:'煤炭', icon:'⛏️', basePrice:20, priceVar:0.20},
          {id:'leather', name:'皮革', icon:'🪣', basePrice:32, priceVar:0.20},
        ],
        sell:[
          {id:'silk',  name:'丝绸', icon:'🎀', basePrice:85, priceVar:0.20},
          {id:'tea',   name:'茗茶', icon:'🍵', basePrice:55, priceVar:0.20},
          {id:'spice', name:'香料', icon:'🌶️', basePrice:65, priceVar:0.25},
        ],
      },
      events:[
        {id:'war_prep', text:'边境备战，铁器被朝廷征购，价格下跌。',  effect:{goodId:'iron', priceMod:-0.20}},
        {id:'merchant', text:'大商队途经，带来大批丝绸，卖价走低。',  effect:{goodId:'silk', priceMod:-0.15}},
        {id:'robbery',  text:'遭遇打劫，货物损失两成。',               effect:{cargoLoss:0.20}},
      ],
    },
    {
      id:'xibei', name:'西北边城', icon:'🏜️', rank:2,
      desc:'边疆重镇，驻军之地，物资紧缺',
      traits:['军事重镇','物资稀缺'],
      goods:{
        buy: [
          {id:'horse', name:'战马', icon:'🐎', basePrice:200, priceVar:0.20},
          {id:'fur',   name:'皮毛', icon:'🦊', basePrice:60,  priceVar:0.25},
          {id:'jade',  name:'玉石', icon:'💎', basePrice:120, priceVar:0.30},
        ],
        sell:[
          {id:'grain',  name:'粮食', icon:'🌾', basePrice:25, priceVar:0.15},
          {id:'iron',   name:'铁器', icon:'⚙️', basePrice:70, priceVar:0.15},
          {id:'cotton', name:'棉布', icon:'🧵', basePrice:45, priceVar:0.20},
        ],
      },
      events:[
        {id:'war',       text:'边境开战，粮食铁器需求大增！',          effect:{goodId:'grain', priceMod:+0.40}},
        {id:'peace',     text:'边境议和，马匹供过于求，价格下跌。',    effect:{goodId:'horse', priceMod:-0.30}},
        {id:'sandstorm', text:'沙尘暴来袭，货物受损一成半。',           effect:{cargoLoss:0.15}},
      ],
    },
    {
      id:'lingnan', name:'岭南道', icon:'🌴', rank:2,
      desc:'南疆之地，气候炎热，奇货云集',
      traits:['南疆特产','异域风情'],
      goods:{
        buy: [
          {id:'spice', name:'香料', icon:'🌶️', basePrice:40,  priceVar:0.25},
          {id:'ivory', name:'象牙', icon:'🦷', basePrice:180, priceVar:0.30},
          {id:'pearl', name:'珍珠', icon:'🫧', basePrice:150, priceVar:0.30},
        ],
        sell:[
          {id:'silk', name:'丝绸', icon:'🎀', basePrice:90, priceVar:0.20},
          {id:'tea',  name:'茗茶', icon:'🍵', basePrice:60, priceVar:0.20},
          {id:'iron', name:'铁器', icon:'⚙️', basePrice:65, priceVar:0.15},
        ],
      },
      events:[
        {id:'typhoon', text:'台风过境，港口封闭，货物受损两成。', effect:{cargoLoss:0.20}},
        {id:'tribute', text:'朝廷采购象牙，价格飙升。',           effect:{goodId:'ivory', priceMod:+0.35}},
        {id:'pirate',  text:'海盗劫掠，损失三成货物！',           effect:{cargoLoss:0.30}},
      ],
    },
    {
      id:'haidao', name:'海岛集市', icon:'🏝️', rank:0, tradeOnly:true,
      desc:'走海路方能抵达，奇货异宝无所不有，风险极高',
      traits:['海外奇货','高风险高回报'],
      goods:{
        buy: [
          {id:'coral',  name:'珊瑚',    icon:'🪸', basePrice:100, priceVar:0.40},
          {id:'pearl',  name:'珍珠',    icon:'🫧', basePrice:130, priceVar:0.35},
          {id:'exotic', name:'异域香木', icon:'🪵', basePrice:80,  priceVar:0.40},
        ],
        sell:[
          {id:'silk',  name:'丝绸', icon:'🎀', basePrice:110, priceVar:0.30},
          {id:'iron',  name:'铁器', icon:'⚙️', basePrice:90,  priceVar:0.25},
          {id:'grain', name:'粮食', icon:'🌾', basePrice:35,  priceVar:0.20},
        ],
      },
      events:[
        {id:'storm',     text:'海上风暴，损失三成货物，艰难靠岸。', effect:{cargoLoss:0.30}},
        {id:'rare_find', text:'发现奇货，额外获得一批珊瑚！',       effect:{bonusGood:{id:'coral',name:'珊瑚',icon:'🪸',qty:2}}},
        {id:'pirate',    text:'海盗劫船，损失四成货物！',           effect:{cargoLoss:0.40}},
      ],
    },
    {
      id:'siluroad', name:'西域商道', icon:'🐪', rank:0, tradeOnly:true,
      desc:'丝绸之路起点，异国商队云集，利润惊人',
      traits:['丝路贸易','异国商队'],
      goods:{
        buy: [
          {id:'jade',  name:'玉石',     icon:'💎', basePrice:90,  priceVar:0.35},
          {id:'fur',   name:'皮毛',     icon:'🦊', basePrice:50,  priceVar:0.30},
          {id:'horse', name:'汗血宝马', icon:'🐎', basePrice:250, priceVar:0.25},
        ],
        sell:[
          {id:'silk',  name:'丝绸', icon:'🎀', basePrice:120, priceVar:0.25},
          {id:'tea',   name:'茗茶', icon:'🍵', basePrice:80,  priceVar:0.25},
          {id:'paper', name:'宣纸', icon:'📄', basePrice:60,  priceVar:0.20},
        ],
      },
      events:[
        {id:'sandstorm', text:'沙暴肆虐，商队受阻，货物受损一成。',         effect:{cargoLoss:0.10}},
        {id:'exotic_buy',text:'异国商人高价求购丝绸，卖价再涨一成。',       effect:{goodId:'silk', priceMod:+0.20}},
        {id:'robbery',   text:'遭遇马贼，损失两成货物。',                   effect:{cargoLoss:0.20}},
      ],
    },
  ],
};

window.AncientPlacesData = AncientPlacesData;
