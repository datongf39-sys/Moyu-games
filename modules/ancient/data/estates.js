const AncientEstates = {
  ESTATES:[
    {id:'shack',  name:'茅草屋',icon:'🏚️',price:80,  capacity:3, desc:'简陋草屋，勉强遮风挡雨', incomePerYear:0},
    {id:'cottage',name:'小院',  icon:'🏠',price:200, capacity:5, desc:'带院子的小房，温馨宜居',  incomePerYear:0},
    {id:'house',  name:'宅院',  icon:'🏡',price:500, capacity:8, desc:'宽敞宅院，颇具体面',       incomePerYear:0},
    {id:'mansion',name:'大宅',  icon:'🏛️',price:1500,capacity:14,desc:'豪门大宅，富贵气象',       incomePerYear:0},
    {id:'farm',   name:'田庄',  icon:'🌾',price:300, capacity:5, desc:'附带农田，每年有额外收入', incomePerYear:30},
    {id:'shop',   name:'商铺',  icon:'🏪',price:400, capacity:3, desc:'坐商铺子，每年稳定收入',   incomePerYear:50},
  ],

  LOCATIONS:[
    // ── 社交场所 ─────────────────────────────────────────
    {id:'tavern', name:'酒楼',    icon:'🍶',minAge:14,cat:'social',desc:'三教九流汇聚，江湖消息灵通',
     spots:[
      {id:'s1',name:'大堂雅座',  desc:'喧闹热情，豪客云集',     basePeople:3},
      {id:'s2',name:'二楼包间',  desc:'富商文人，私下叙谈',     basePeople:2},
      {id:'s3',name:'后院茶棚',  desc:'市井百姓，家常闲聊',     basePeople:2},
     ]},
    {id:'poetry', name:'诗会',    icon:'📜',minAge:12,cat:'social',desc:'文人雅集，吟诗作对',
     spots:[
      {id:'p1',name:'梅林吟台',  desc:'文人聚首，吟风弄月',     basePeople:2},
      {id:'p2',name:'书斋讲席',  desc:'博学鸿儒，传道授业',     basePeople:1},
      {id:'p3',name:'水榭曲廊',  desc:'才子佳人，互赠词章',     basePeople:3},
     ]},
    {id:'market', name:'集市',    icon:'🛍️',minAge:8, cat:'social',desc:'人声鼎沸，形形色色',
     spots:[
      {id:'m1',name:'粮食摊',    desc:'农民小贩，热闹非凡',     basePeople:4},
      {id:'m2',name:'布行绸缎',  desc:'商贾云集，讨价还价',     basePeople:3},
      {id:'m3',name:'茶水摊',    desc:'过路行人，稍作歇脚',     basePeople:2},
     ]},
    {id:'temple', name:'庙会',    icon:'⛩️',minAge:6, cat:'social',desc:'香火旺盛，祈福纳祥',
     spots:[
      {id:'t1',name:'正殿香坛',  desc:'虔诚香客，祈福许愿',     basePeople:3},
      {id:'t2',name:'庙前广场',  desc:'百姓游乐，摆摊献艺',     basePeople:5},
      {id:'t3',name:'后山禅院',  desc:'僧侣修行，清净幽雅',     basePeople:1},
     ]},
    {id:'garden', name:'园林',    icon:'🌸',minAge:14,cat:'social',desc:'达官显贵游乐之所',
     spots:[
      {id:'g1',name:'荷花池边',  desc:'名媛淑女，踏青游赏',     basePeople:2},
      {id:'g2',name:'假山石径',  desc:'公子哥儿，吟诗斗趣',     basePeople:2},
      {id:'g3',name:'宴客厅堂',  desc:'贵族聚会，高谈阔论',     basePeople:3},
     ]},

    // ── 功能场所 ─────────────────────────────────────────
    {id:'clinic', name:'医馆',    icon:'⚕️',minAge:0, cat:'service',desc:'悬壶济世，救死扶伤',
     spots:[
      {id:'c1',name:'诊室',      desc:'坐堂大夫，问诊把脉',     basePeople:1},
      {id:'c2',name:'药柜堂',    desc:'各色药材，配方取药',     basePeople:1},
     ]},
    {id:'shopst', name:'杂货铺',  icon:'🏪',minAge:0, cat:'service',desc:'日用百货，一应俱全',
     spots:[
      {id:'sh1',name:'铺面',     desc:'掌柜伙计，热情迎客',     basePeople:1},
     ]},
    {id:'school', name:'学堂',    icon:'🏫',minAge:6, cat:'service',desc:'读书识字，蒙学开智，文试备考之所',
     spots:[
      {id:'sc1',name:'学堂内',   desc:'先生讲学，学童诵读',     basePeople:3},
     ]},
    {id:'wuguan', name:'武馆',    icon:'🥋',minAge:6, cat:'service',desc:'习武强身，武试备考之所',
     spots:[
      {id:'wu1',name:'演武场',   desc:'教头操练，刀枪对练',     basePeople:4},
      {id:'wu2',name:'内功堂',   desc:'修习内功，强健体魄',     basePeople:2},
     ]},
  ]
};

window.AncientEstates = AncientEstates;
window.AncientLocations = AncientEstates;
window.ESTATES = AncientEstates.ESTATES;
window.LOCATIONS = AncientEstates.LOCATIONS;
