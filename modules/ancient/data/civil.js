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
    {level:6, name:'殿试',   title:'进士',   questCount:0}, // 殿试走写作流程
  ],

  // ── 文试题库 ────────────────────────────────────────
  QUESTIONS: [
    // 单选题
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
    // 多选题
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
  EXAM_RANK_TABLE: [
    {minScore:95, jobRank:3, title:'状元/榜眼/探花', desc:'名列三甲，直授正三品'},
    {minScore:88, jobRank:2, title:'进士出身',        desc:'二甲进士，授从五品'},
    {minScore:80, jobRank:1, title:'同进士出身',      desc:'三甲同进士，授正七品'},
  ],

  // ── 官员任职地点表 ──────────────────────────────────
  // rank 对应 jobRank（0=从九品 … 4=一品）
  OFFICIAL_POSTINGS: [
    {rank:0, places:['qinghe','anping'],                          desc:'初任地方，历练为主'},
    {rank:1, places:['qinghe','anping','jiangnan','bianzhou'],    desc:'升任要县，独当一面'},
    {rank:2, places:['jiangnan','bianzhou','xibei','lingnan'],    desc:'外放重镇，封疆大吏'},
    {rank:3, places:['xibei','lingnan','jiangnan','bianzhou'],    desc:'总督一方，位高权重'},
    {rank:4, places:['jiangnan','bianzhou','xibei','lingnan'],    desc:'位极人臣，钦差巡察'},
  ],

  // ── 官员周期目标池 ──────────────────────────────────
  // 每个任期随机抽2-4个目标
  TERM_GOALS: [
    {id:'morale',   name:'民心稳定', desc:'任期内民心须达到 {value} 以上',  type:'min',   valueRange:[60,85]},
    {id:'tax',      name:'税收达标', desc:'任期内累计税收须达 {value} 文',   type:'total', valueRange:[500,2000]},
    {id:'policy',   name:'颁布政策', desc:'须颁布「{value}」政策',           type:'policy',valueRange:null},
    {id:'population',name:'人口增长',desc:'任期内人口须增加 {value} 人',     type:'total', valueRange:[50,200]},
    {id:'disaster', name:'妥善救灾', desc:'任期内须成功处理 {value} 次灾情', type:'total', valueRange:[1,3]},
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
  // 每年随机抽2-4件公文
  EDICTS: [
    // 灾情类
    {id:'flood',    icon:'🌊', name:'洪水告急',   type:'disaster',
     desc:'境内河水暴涨，良田尽没，百姓流离失所，请大人定夺。',
     options:[
       {label:'开仓放粮，全力救灾', effect:{moraleMod:+15, taxMod:-100, populationMod:+10}, merit:+20},
       {label:'上报朝廷，等候旨意', effect:{moraleMod:-5,  taxMod:0,    populationMod:-5},  merit:+2},
       {label:'征发徭役，堵截洪水', effect:{moraleMod:-10, taxMod:0,    populationMod:-10}, merit:+8},
     ]},
    {id:'drought',  icon:'☀️', name:'旱情肆虐',   type:'disaster',
     desc:'连月不雨，庄稼枯死，民间已有饿殍，急请大人处置。',
     options:[
       {label:'减免赋税，安抚民心', effect:{moraleMod:+12, taxMod:-80,  populationMod:+5},  merit:+15},
       {label:'祭天祈雨，安定人心', effect:{moraleMod:+5,  taxMod:-20,  populationMod:0},   merit:+3},
       {label:'强征粮食，充实仓廪', effect:{moraleMod:-15, taxMod:+100, populationMod:-15}, merit:-5},
     ]},
    {id:'locusts',  icon:'🦗', name:'蝗灾来袭',   type:'disaster',
     desc:'蝗虫铺天盖地，田间颗粒无收，百姓惶惶不安。',
     options:[
       {label:'组织百姓捕蝗灭虫', effect:{moraleMod:+10, taxMod:-50,  populationMod:+5},  merit:+18},
       {label:'从邻县购粮救急',   effect:{moraleMod:+8,  taxMod:-150, populationMod:0},   merit:+10},
       {label:'上报了事，静观其变',effect:{moraleMod:-12, taxMod:0,    populationMod:-8},  merit:-3},
     ]},
    // 治安类
    {id:'bandit',   icon:'⚔️', name:'盗匪猖獗',   type:'security',
     desc:'近来山中匪寇出没，劫掠商旅，百姓人心惶惶。',
     options:[
       {label:'调兵剿匪，还境平安', effect:{moraleMod:+12, taxMod:-60,  populationMod:+5},  merit:+15},
       {label:'招安匪首，化敌为友', effect:{moraleMod:+5,  taxMod:-20,  populationMod:0},   merit:+8},
       {label:'坐视不理，匪患自消', effect:{moraleMod:-15, taxMod:-80,  populationMod:-10}, merit:-10},
     ]},
    {id:'lawsuit',  icon:'⚖️', name:'民间诉讼',   type:'justice',
     desc:'境内大族与贫民争地，双方各执一词，请大人公断。',
     options:[
       {label:'查明实情，秉公断案', effect:{moraleMod:+10, taxMod:0,    populationMod:0},   merit:+12},
       {label:'偏袒大族，息事宁人', effect:{moraleMod:-8,  taxMod:+50,  populationMod:-5},  merit:-5},
       {label:'两边调停，各退一步', effect:{moraleMod:+3,  taxMod:0,    populationMod:0},   merit:+5},
     ]},
    // 民政类
    {id:'migration',icon:'🚶', name:'流民涌入',   type:'civil',
     desc:'邻境大批流民涌入，粮食吃紧，安置颇为棘手。',
     options:[
       {label:'开设粥棚，妥善安置', effect:{moraleMod:+15, taxMod:-80,  populationMod:+20}, merit:+18},
       {label:'驱逐流民，闭境拒入', effect:{moraleMod:-10, taxMod:0,    populationMod:-5},  merit:-8},
       {label:'编入户籍，开荒授田', effect:{moraleMod:+8,  taxMod:-50,  populationMod:+15}, merit:+12},
     ]},
    {id:'epidemic', icon:'☣️', name:'疫病蔓延',   type:'disaster',
     desc:'境内突发疫病，已有数十人染病，恐有大规模传播之虞。',
     options:[
       {label:'封锁病区，延请名医', effect:{moraleMod:+8,  taxMod:-120, populationMod:+10}, merit:+20},
       {label:'焚烧病死者遗物',     effect:{moraleMod:-5,  taxMod:-30,  populationMod:+5},  merit:+8},
       {label:'秘而不报，自求多福', effect:{moraleMod:-20, taxMod:0,    populationMod:-20}, merit:-15},
     ]},
    {id:'repair',   icon:'🏗️', name:'城墙失修',   type:'civil',
     desc:'城墙年久失修，多处坍塌，若遇外敌恐难抵御。',
     options:[
       {label:'拨款修缮，强固城防', effect:{moraleMod:+5,  taxMod:-100, populationMod:0},   merit:+10},
       {label:'征发民夫，无偿修缮', effect:{moraleMod:-8,  taxMod:0,    populationMod:0},   merit:+5},
       {label:'暂缓修缮，留待来年', effect:{moraleMod:0,   taxMod:0,    populationMod:0},   merit:-3},
     ]},
  ],
};

window.AncientCivilData = AncientCivilData;
