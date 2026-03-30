// ══════════════════════════════════════════════════════
//  civil.js  —  科举 & 官员数据
// ══════════════════════════════════════════════════════

const AncientCivilData = {

  // ── 文试等级定义 ────────────────────────────────────
  CIVIL_LEVELS: [
    {level:0, name:'白丁',   title:'',       questCount:0},
    {level:1, name:'县试',   title:'',       questCount:5},
    {level:2, name:'府试',   title:'',       questCount:5},
    {level:3, name:'院试',   title:'秀才',   questCount:5},
    {level:4, name:'乡试',   title:'举人',   questCount:5},
    {level:5, name:'会试',   title:'贡士',   questCount:5},
    {level:6, name:'殿试',   title:'进士',   questCount:0},
  ],

  // ── 文试题库 ────────────────────────────────────────
  QUESTIONS: [
    {type:'single', q:'「温故而知新」出自哪部典籍？',             opts:['《论语》','《孟子》','《大学》','《中庸》'],         ans:0},
    {type:'single', q:'「己所不欲，勿施于人」是何人所言？',       opts:['孟子','孔子','荀子','墨子'],                         ans:1},
    {type:'single', q:'科举制度始于哪个朝代？',                   opts:['汉朝','唐朝','隋朝','宋朝'],                         ans:2},
    {type:'single', q:'「水善利万物而不争」出自《道德经》第几章？',opts:['第三章','第八章','第十六章','第二十五章'],           ans:1},
    {type:'single', q:'「但愿人长久，千里共婵娟」的作者是？',     opts:['李白','杜甫','苏轼','王维'],                         ans:2},
    {type:'single', q:'「春蚕到死丝方尽」的下一句是？',           opts:['蜡炬成灰泪始干','落红不是无情物','化作春泥更护花','此情可待成追忆'], ans:0},
    {type:'single', q:'四书指《大学》《中庸》《论语》与？',       opts:['《孟子》','《荀子》','《易经》','《诗经》'],         ans:0},
    {type:'single', q:'「锄禾日当午」的作者是？',                 opts:['白居易','李绅','杜甫','韩愈'],                       ans:1},
    {type:'single', q:'五行相生的顺序中，木生？',                 opts:['金','水','火','土'],                                 ans:2},
    {type:'single', q:'「天时不如地利，地利不如人和」出自？',     opts:['《论语》','《孟子》','《荀子》','《韩非子》'],       ans:1},
    {type:'single', q:'《诗经》共收录诗歌多少篇？',               opts:['二百篇','三百零五篇','四百篇','五百篇'],             ans:1},
    {type:'single', q:'「不患寡而患不均」是谁的主张？',           opts:['孟子','孔子','墨子','韩非子'],                       ans:1},
    {type:'single', q:'科举考试中，乡试第一名称为？',             opts:['状元','榜眼','解元','会元'],                         ans:2},
    {type:'single', q:'「知之为知之，不知为不知」强调的是？',     opts:['勤学','诚实','谦逊','仁义'],                         ans:1},
    {type:'single', q:'古代「束脩」原指？',                       opts:['学费','束腰带','干肉','书籍'],                       ans:2},
    {type:'single', q:'「青青子衿，悠悠我心」出自？',             opts:['《诗经》','《楚辞》','《论语》','《孟子》'],         ans:0},
    {type:'single', q:'「居庙堂之高则忧其民」出自范仲淹的？',     opts:['《醉翁亭记》','《岳阳楼记》','《赤壁赋》','《滕王阁序》'], ans:1},
    {type:'single', q:'古代「三纲」中不包括？',                   opts:['君为臣纲','父为子纲','夫为妻纲','师为徒纲'],         ans:3},
    {type:'single', q:'「仁义礼智信」合称五常，其中居首的是？',   opts:['义','礼','仁','信'],                                 ans:2},
    {type:'single', q:'「路漫漫其修远兮，吾将上下而求索」的作者是？', opts:['屈原','宋玉','贾谊','司马相如'],               ans:0},
    {type:'multi',  q:'以下哪些属于「四书五经」中的四书？',       opts:['《论语》','《孟子》','《诗经》','《大学》'],         ans:[0,1,3]},
    {type:'multi',  q:'以下哪些是儒家推崇的「五常」？',           opts:['仁','义','勇','信'],                                 ans:[0,1,3]},
    {type:'multi',  q:'以下哪些属于古代「六艺」？',               opts:['礼','乐','书','兵'],                                 ans:[0,1,2]},
    {type:'multi',  q:'科举殿试可能获得的名次包括？',             opts:['状元','榜眼','探花','解元'],                         ans:[0,1,2]},
    {type:'multi',  q:'以下哪些是唐代著名诗人？',                 opts:['李白','杜甫','苏轼','王维'],                         ans:[0,1,3]},
  ],

  // ── 殿试写作数据 ────────────────────────────────────
  ESSAY: {
    passScore: 80,
    themes: [
      {id:'benevolence', name:'仁政爱民',  desc:'论君主以仁德治国之道'},
      {id:'water',       name:'治水安民',  desc:'论疏导洪患、造福百姓之策'},
      {id:'talent',      name:'举贤任能',  desc:'论广纳贤才、知人善用之法'},
      {id:'border',      name:'守边御敌',  desc:'论固守边疆、抵御外侮之要'},
      {id:'farming',     name:'劝农桑蚕',  desc:'论重农固本、充实国库之道'},
      {id:'education',   name:'兴学育才',  desc:'论广设学堂、教化百姓之功'},
    ],
    styles: [
      {id:'plain',     name:'质朴刚健', fit:{benevolence:70,water:80,talent:60,border:85,farming:75,education:60}},
      {id:'elegant',   name:'辞藻华美', fit:{benevolence:75,water:55,talent:80,border:60,farming:50,education:85}},
      {id:'logical',   name:'条理严密', fit:{benevolence:65,water:85,talent:90,border:70,farming:80,education:75}},
      {id:'emotional', name:'情真意切', fit:{benevolence:90,water:65,talent:70,border:55,farming:70,education:80}},
      {id:'classical', name:'引经据典', fit:{benevolence:80,water:70,talent:85,border:65,farming:60,education:90}},
      {id:'bold',      name:'立意新奇', fit:{benevolence:60,water:75,talent:75,border:80,farming:65,education:70}},
    ],
    contents: [
      {id:'history',  name:'引史为鉴', fit:{benevolence:80,water:70,talent:85,border:75,farming:65,education:90}},
      {id:'people',   name:'以民为本', fit:{benevolence:95,water:80,talent:65,border:60,farming:85,education:70}},
      {id:'law',      name:'立法制度', fit:{benevolence:65,water:75,talent:80,border:70,farming:70,education:75}},
      {id:'nature',   name:'顺应天时', fit:{benevolence:70,water:90,talent:60,border:65,farming:90,education:60}},
      {id:'virtue',   name:'修身正己', fit:{benevolence:85,water:60,talent:75,border:70,farming:65,education:85}},
      {id:'military', name:'强兵备战', fit:{benevolence:55,water:65,talent:70,border:95,farming:60,education:55}},
    ],
  },

  // ── 殿试得分 → 初始官职品级 ────────────────────────
  // jobRank 0-17 对应18个品级
  EXAM_RANK_TABLE: [
    {minScore:95, jobRank:8,  title:'状元/榜眼/探花', desc:'名列三甲，直授正五品'},
    {minScore:88, jobRank:6,  title:'进士出身',        desc:'二甲进士，授从六品'},
    {minScore:80, jobRank:4,  title:'同进士出身',      desc:'三甲同进士，授正七品'},
  ],

  // ── 官员18级品级定义 ────────────────────────────────
  OFFICER_RANKS: [
    {rank:0,  name:'从九品', salaryBase:80},
    {rank:1,  name:'正九品', salaryBase:90},
    {rank:2,  name:'从八品', salaryBase:105},
    {rank:3,  name:'正八品', salaryBase:120},
    {rank:4,  name:'从七品', salaryBase:140},
    {rank:5,  name:'正七品', salaryBase:160},
    {rank:6,  name:'从六品', salaryBase:185},
    {rank:7,  name:'正六品', salaryBase:210},
    {rank:8,  name:'从五品', salaryBase:240},
    {rank:9,  name:'正五品', salaryBase:275},
    {rank:10, name:'从四品', salaryBase:315},
    {rank:11, name:'正四品', salaryBase:360},
    {rank:12, name:'从三品', salaryBase:410},
    {rank:13, name:'正三品', salaryBase:470},
    {rank:14, name:'从二品', salaryBase:540},
    {rank:15, name:'正二品', salaryBase:620},
    {rank:16, name:'从一品', salaryBase:720},
    {rank:17, name:'一品大员',salaryBase:850},
  ],

  // ── 官员任职地点表 ──────────────────────────────────
  OFFICIAL_POSTINGS: [
    {rank:0,  places:['qinghe','anping'],                       desc:'初任地方，历练为主'},
    {rank:1,  places:['qinghe','anping'],                       desc:'初任地方，历练为主'},
    {rank:2,  places:['qinghe','anping'],                       desc:'初任地方，历练为主'},
    {rank:3,  places:['qinghe','anping'],                       desc:'初任地方，历练为主'},
    {rank:4,  places:['qinghe','anping','jiangnan','bianzhou'], desc:'升任要县，独当一面'},
    {rank:5,  places:['qinghe','anping','jiangnan','bianzhou'], desc:'升任要县，独当一面'},
    {rank:6,  places:['jiangnan','bianzhou','xibei','lingnan'], desc:'外放重镇，封疆大吏'},
    {rank:7,  places:['jiangnan','bianzhou','xibei','lingnan'], desc:'外放重镇，封疆大吏'},
    {rank:8,  places:['jiangnan','bianzhou','xibei','lingnan'], desc:'外放重镇，封疆大吏'},
    {rank:9,  places:['jiangnan','bianzhou','xibei','lingnan'], desc:'外放重镇，封疆大吏'},
    {rank:10, places:['xibei','lingnan','jiangnan','bianzhou'], desc:'总督一方，位高权重'},
    {rank:11, places:['xibei','lingnan','jiangnan','bianzhou'], desc:'总督一方，位高权重'},
    {rank:12, places:['xibei','lingnan','jiangnan','bianzhou'], desc:'总督一方，位高权重'},
    {rank:13, places:['xibei','lingnan','jiangnan','bianzhou'], desc:'总督一方，位高权重'},
    {rank:14, places:['jiangnan','bianzhou','xibei','lingnan'], desc:'位极人臣，钦差巡察'},
    {rank:15, places:['jiangnan','bianzhou','xibei','lingnan'], desc:'位极人臣，钦差巡察'},
    {rank:16, places:['jiangnan','bianzhou','xibei','lingnan'], desc:'位极人臣，钦差巡察'},
    {rank:17, places:['jiangnan','bianzhou','xibei','lingnan'], desc:'位极人臣，钦差巡察'},
  ],

  // ── 官员周期目标池 ──────────────────────────────────
  TERM_GOALS: [
    {id:'morale',    name:'民心稳定', desc:'任期内民心须达到 {value} 以上',  type:'min',   valueRange:[60,85]},
    {id:'tax',       name:'税收达标', desc:'任期内累计税收须达 {value} 文',   type:'total', valueRange:[500,2000]},
    {id:'policy',    name:'颁布政策', desc:'须颁布「{value}」政策',           type:'policy',valueRange:null},
    {id:'population',name:'人口增长', desc:'任期内人口须增加 {value} 人',     type:'total', valueRange:[50,200]},
    {id:'disaster',  name:'妥善救灾', desc:'任期内须成功处理 {value} 次灾情', type:'total', valueRange:[1,3]},
  ],

  // ── 官员可颁布的政策池 ──────────────────────────────
  POLICIES: [
    {id:'birth',    name:'鼓励生育', desc:'减免生育家庭赋税，人口增长加快',  effect:{populationMod:+0.15, moraleMod:+5,  taxMod:-0.05}},
    {id:'farmland', name:'开垦荒田', desc:'鼓励百姓开荒，粮食产量提升',      effect:{populationMod:+0.05, moraleMod:+8,  taxMod:+0.05}},
    {id:'reduce',   name:'轻徭薄赋', desc:'降低赋税，百姓安居乐业',          effect:{populationMod:+0.10, moraleMod:+15, taxMod:-0.15}},
    {id:'school',   name:'兴建学堂', desc:'广设学堂，教化百姓',              effect:{populationMod:+0.05, moraleMod:+10, taxMod:-0.10}},
    {id:'militia',  name:'征募乡勇', desc:'扩充地方武装，治安好转',          effect:{populationMod:-0.05, moraleMod:+5,  taxMod:-0.05}},
    {id:'commerce', name:'开放商路', desc:'鼓励商贸往来，税收增加',          effect:{populationMod:+0.05, moraleMod:+3,  taxMod:+0.15}},
    {id:'corvee',   name:'大兴土木', desc:'修缮城墙水利，劳役繁重',          effect:{populationMod:-0.10, moraleMod:-10, taxMod:+0.10}},
  ],

  // ── 公文事件池 ──────────────────────────────────────
  // successRate: 正确选项的成功概率（0=错误选项直接失败）
  // success/fail: 对应的反馈文案和效果
  EDICTS: [
    {
      id:'flood', icon:'🌊', name:'洪水告急', type:'disaster',
      desc:'境内河水暴涨，良田尽没，百姓流离失所，请大人定夺。',
      options:[
        {
          label:'开仓放粮，全力救灾',
          successRate: 0.70,
          success: {text:'粮食及时发放，百姓得以果腹，民心大振，四方称颂。',          moraleMod:+15, taxMod:-100, populationMod:+10, merit:+20},
          fail:    {text:'仓官中饱私囊，粮食层层克扣，到百姓手里寥寥无几，民怨反增。',moraleMod:-8,  taxMod:-100, populationMod:-5,  merit:-5},
        },
        {
          label:'上报朝廷，等候旨意',
          successRate: 0,
          fail:    {text:'文书往来耽误时日，灾情已蔓延全境，百姓怨声载道。',           moraleMod:-5,  taxMod:0,    populationMod:-5,  merit:-3},
        },
        {
          label:'征发徭役，堵截洪水',
          successRate: 0.45,
          success: {text:'民夫拼死堵口，洪水暂时得控，损失尚在可接受范围内。',         moraleMod:-5,  taxMod:0,    populationMod:0,   merit:+8},
          fail:    {text:'徭役繁重，民夫怨声载道，堤坝又告决口，死伤惨重。',           moraleMod:-18, taxMod:0,    populationMod:-15, merit:-8},
        },
      ]
    },
    {
      id:'drought', icon:'☀️', name:'旱情肆虐', type:'disaster',
      desc:'连月不雨，庄稼枯死，民间已有饿殍，急请大人处置。',
      options:[
        {
          label:'减免赋税，安抚民心',
          successRate: 0.75,
          success: {text:'赋税减免，百姓稍得喘息，民心渐稳，熬过了旱季。',             moraleMod:+12, taxMod:-80,  populationMod:+5,  merit:+15},
          fail:    {text:'减税公文下达迟缓，基层官吏阳奉阴违，百姓并未受惠，怨气未消。',moraleMod:-3,  taxMod:-80,  populationMod:0,   merit:+2},
        },
        {
          label:'祭天祈雨，安定人心',
          successRate: 0.50,
          success: {text:'祭祀仪式庄严肃穆，百姓信心大增，士气得以稳定。',             moraleMod:+5,  taxMod:-20,  populationMod:0,   merit:+3},
          fail:    {text:'祈雨无果，旱情持续，百姓嘲讽大人只会烧香拜佛，民心更散。',   moraleMod:-8,  taxMod:-20,  populationMod:0,   merit:-2},
        },
        {
          label:'强征粮食，充实仓廪',
          successRate: 0,
          fail:    {text:'强征之下民不聊生，饿死者众，此举无异于饮鸩止渴。',            moraleMod:-15, taxMod:+100, populationMod:-15, merit:-8},
        },
      ]
    },
    {
      id:'locusts', icon:'🦗', name:'蝗灾来袭', type:'disaster',
      desc:'蝗虫铺天盖地，田间颗粒无收，百姓惶惶不安。',
      options:[
        {
          label:'组织百姓捕蝗灭虫',
          successRate: 0.65,
          success: {text:'全民动员捕蝗，蝗情得到遏制，百姓齐心协力，民心凝聚。',       moraleMod:+10, taxMod:-50,  populationMod:+5,  merit:+18},
          fail:    {text:'捕蝗不力，蝗虫越聚越多，收成几近绝收，百姓饥寒交迫。',       moraleMod:-10, taxMod:-50,  populationMod:-8,  merit:-3},
        },
        {
          label:'从邻县购粮救急',
          successRate: 0.70,
          success: {text:'购粮及时运抵，百姓熬过了蝗灾，对大人感恩戴德。',             moraleMod:+8,  taxMod:-150, populationMod:0,   merit:+10},
          fail:    {text:'粮商趁机哄抬物价，购粮耗资巨大，且运粮途中遭劫，所获有限。', moraleMod:0,   taxMod:-150, populationMod:0,   merit:+2},
        },
        {
          label:'上报了事，静观其变',
          successRate: 0,
          fail:    {text:'坐视不理，蝗灾肆虐，民间饿殍遍野，大人之名臭遍全境。',       moraleMod:-15, taxMod:0,    populationMod:-10, merit:-10},
        },
      ]
    },
    {
      id:'bandit', icon:'⚔️', name:'盗匪猖獗', type:'security',
      desc:'近来山中匪寇出没，劫掠商旅，百姓人心惶惶。',
      options:[
        {
          label:'调兵剿匪，还境平安',
          successRate: 0.65,
          success: {text:'官兵奋勇，匪首就擒，商路重开，百姓拍手称快。',               moraleMod:+12, taxMod:-60,  populationMod:+5,  merit:+15},
          fail:    {text:'剿匪不力，官兵反被伏击，损兵折将，匪寇更加嚣张。',           moraleMod:-8,  taxMod:-60,  populationMod:0,   merit:-5},
        },
        {
          label:'招安匪首，化敌为友',
          successRate: 0.55,
          success: {text:'匪首归顺，麾下散去，边境得以安定，此乃上策。',               moraleMod:+5,  taxMod:-20,  populationMod:0,   merit:+8},
          fail:    {text:'匪首虚与委蛇，得了好处却依然为祸，百姓大失所望。',           moraleMod:-10, taxMod:-20,  populationMod:0,   merit:-5},
        },
        {
          label:'坐视不理，匪患自消',
          successRate: 0,
          fail:    {text:'匪患日益猖獗，商旅绝迹，百姓深居简出，民心涣散。',           moraleMod:-15, taxMod:-80,  populationMod:-10, merit:-10},
        },
      ]
    },
    {
      id:'lawsuit', icon:'⚖️', name:'民间诉讼', type:'justice',
      desc:'境内大族与贫民争地，双方各执一词，请大人公断。',
      options:[
        {
          label:'查明实情，秉公断案',
          successRate: 0.70,
          success: {text:'大人明察秋毫，判决公正，两方心服口服，百姓交口称赞。',       moraleMod:+10, taxMod:0,    populationMod:0,   merit:+12},
          fail:    {text:'证据不足，判决草率，败诉一方鸣冤击鼓，官司越闹越大。',       moraleMod:-5,  taxMod:0,    populationMod:0,   merit:-3},
        },
        {
          label:'偏袒大族，息事宁人',
          successRate: 0,
          fail:    {text:'贫民含冤，此事传遍乡里，百姓寒心，皆道大人徇私枉法。',       moraleMod:-10, taxMod:+50,  populationMod:-5,  merit:-8},
        },
        {
          label:'两边调停，各退一步',
          successRate: 0.60,
          success: {text:'调停得法，双方各让一步，纷争平息，乡里重归和睦。',           moraleMod:+3,  taxMod:0,    populationMod:0,   merit:+5},
          fail:    {text:'调停不成，双方皆不满意，矛盾激化，甚至大打出手。',           moraleMod:-5,  taxMod:0,    populationMod:0,   merit:-2},
        },
      ]
    },
    {
      id:'migration', icon:'🚶', name:'流民涌入', type:'civil',
      desc:'邻境大批流民涌入，粮食吃紧，安置颇为棘手。',
      options:[
        {
          label:'开设粥棚，妥善安置',
          successRate: 0.65,
          success: {text:'粥棚井然有序，流民得到妥善安置，境内人口大增，感恩之声不绝。',moraleMod:+15, taxMod:-80,  populationMod:+20, merit:+18},
          fail:    {text:'灾民太饿，疯狂涌入粥棚，秩序大乱，官兵未能维持，许多人反而没吃上，民心下降。',moraleMod:-8, taxMod:-80, populationMod:+5, merit:+2},
        },
        {
          label:'驱逐流民，闭境拒入',
          successRate: 0,
          fail:    {text:'强行驱逐，流民哭嚎遍野，此事传开，大人落得个冷血之名。',     moraleMod:-12, taxMod:0,    populationMod:-5,  merit:-8},
        },
        {
          label:'编入户籍，开荒授田',
          successRate: 0.70,
          success: {text:'流民得地安家，勤恳耕作，数年后境内大为繁荣。',               moraleMod:+8,  taxMod:-50,  populationMod:+15, merit:+12},
          fail:    {text:'土地分配不均，本地百姓与流民产生摩擦，矛盾频发。',           moraleMod:-5,  taxMod:-50,  populationMod:+5,  merit:+2},
        },
      ]
    },
    {
      id:'epidemic', icon:'☣️', name:'疫病蔓延', type:'disaster',
      desc:'境内突发疫病，已有数十人染病，恐有大规模传播之虞。',
      options:[
        {
          label:'封锁病区，延请名医',
          successRate: 0.70,
          success: {text:'名医妙手，疫情得到控制，百姓对大人的决断赞不绝口。',         moraleMod:+8,  taxMod:-120, populationMod:+10, merit:+20},
          fail:    {text:'名医束手无策，疫情仍在蔓延，封锁耗费甚巨，却收效甚微。',     moraleMod:-5,  taxMod:-120, populationMod:-10, merit:+3},
        },
        {
          label:'焚烧病死者遗物',
          successRate: 0.60,
          success: {text:'及时焚毁疫源，疫情未能扩散，此举虽残忍，却救了大多数人。',   moraleMod:-3,  taxMod:-30,  populationMod:+5,  merit:+8},
          fail:    {text:'焚烧引发骚乱，病死者家属奋起反抗，秩序大乱。',               moraleMod:-12, taxMod:-30,  populationMod:-5,  merit:-3},
        },
        {
          label:'秘而不报，自求多福',
          successRate: 0,
          fail:    {text:'疫情爆发，死者众多，事情败露，大人隐瞒之罪昭然若揭，民心尽失。',moraleMod:-20, taxMod:0,  populationMod:-20, merit:-15},
        },
      ]
    },
    {
      id:'repair', icon:'🏗️', name:'城墙失修', type:'civil',
      desc:'城墙年久失修，多处坍塌，若遇外敌恐难抵御。',
      options:[
        {
          label:'拨款修缮，强固城防',
          successRate: 0.75,
          success: {text:'城墙修葺一新，百姓安心，军士士气大振。',                     moraleMod:+5,  taxMod:-100, populationMod:0,   merit:+10},
          fail:    {text:'承包商以次充好，修缮完毕不久便再度坍塌，钱财打了水漂。',     moraleMod:-3,  taxMod:-100, populationMod:0,   merit:-2},
        },
        {
          label:'征发民夫，无偿修缮',
          successRate: 0.55,
          success: {text:'民夫齐心，城墙修缮完毕，虽有怨言，终究安全。',               moraleMod:-5,  taxMod:0,    populationMod:0,   merit:+5},
          fail:    {text:'民夫怠工，修缮质量低劣，且劳役繁重引发逃亡，人口流失。',     moraleMod:-12, taxMod:0,    populationMod:-8,  merit:-3},
        },
        {
          label:'暂缓修缮，留待来年',
          successRate: 0,
          fail:    {text:'拖延塞责，城防废弛，朝廷问责下来，大人颜面尽失。',           moraleMod:0,   taxMod:0,    populationMod:0,   merit:-5},
        },
      ]
    },
  ],
};

window.AncientCivilData = AncientCivilData;
