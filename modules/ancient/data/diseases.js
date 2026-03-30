// ══════════════════════════════════════════════════════
//  diseases.js  —  疾病、大夫、药材配方数据
// ══════════════════════════════════════════════════════

const AncientDiseasesData = {

  // ── 疾病库 ───────────────────────────────────────────
  DISEASES: [
    {id:'cold',       name:'风寒',     icon:'🤧', level:1, healthPerYear:5,  moodPerYear:3,  deathRisk:0,    cureBase:0.85, desc:'普通风寒，多喝热水便好。'},
    {id:'fever',      name:'伤寒高热', icon:'🤒', level:2, healthPerYear:10, moodPerYear:5,  deathRisk:0.01, cureBase:0.70, desc:'高热不退，需尽快就医。'},
    {id:'plague',     name:'瘟疫',     icon:'☣️', level:4, healthPerYear:20, moodPerYear:8,  deathRisk:0.05, cureBase:0.45, desc:'时疫传播，死亡率极高。'},
    {id:'poison',     name:'中毒',     icon:'🐍', level:3, healthPerYear:18, moodPerYear:6,  deathRisk:0.04, cureBase:0.50, desc:'毒素侵体，需专门解毒。'},
    {id:'wound',      name:'刀伤溃烂', icon:'🩹', level:2, healthPerYear:12, moodPerYear:4,  deathRisk:0.02, cureBase:0.65, desc:'伤口感染，化脓溃烂。'},
    {id:'cough',      name:'痨病咳嗽', icon:'😮‍💨', level:3, healthPerYear:15, moodPerYear:7,  deathRisk:0.03, cureBase:0.55, desc:'咳嗽日久，损伤肺腑。'},
    {id:'heatstroke', name:'中暑',     icon:'🌡️', level:1, healthPerYear:6,  moodPerYear:4,  deathRisk:0,    cureBase:0.90, desc:'暑热难耐，头晕乏力。'},
    {id:'joint',      name:'风湿痹症', icon:'🦴', level:2, healthPerYear:8,  moodPerYear:6,  deathRisk:0,    cureBase:0.60, desc:'关节酸痛，阴雨尤甚。'},
    {id:'dysentery',  name:'痢疾',     icon:'🤢', level:2, healthPerYear:10, moodPerYear:7,  deathRisk:0.01, cureBase:0.70, desc:'腹痛腹泻，水土不服所致。'},
    {id:'eyedis',     name:'目疾',     icon:'👁️', level:1, healthPerYear:4,  moodPerYear:5,  deathRisk:0,    cureBase:0.75, desc:'双目昏花，视物不清。'},
    {id:'heartdis',   name:'心悸怔忡', icon:'💔', level:3, healthPerYear:12, moodPerYear:8,  deathRisk:0.03, cureBase:0.55, desc:'心跳异常，时常气短。'},
    {id:'starvation', name:'饥寒交迫', icon:'😰', level:2, healthPerYear:10, moodPerYear:10, deathRisk:0.01, cureBase:0.80, desc:'食不果腹，体力大损。'},
  ],

  // ── 大夫库 ───────────────────────────────────────────
  DOCTORS: [
    {id:'folk',   name:'赤脚郎中', icon:'👴',    cost:15,  successBonus:0,    desc:'乡野郎中，价廉但手艺一般'},
    {id:'local',  name:'本地医师', icon:'👨‍⚕️', cost:40,  successBonus:0.15, desc:'坐堂大夫，技术稳妥'},
    {id:'famous', name:'名医',     icon:'🧑‍⚕️', cost:120, successBonus:0.30, desc:'城中名医，治愈率高'},
    {id:'sage',   name:'神医',     icon:'🏆',    cost:300, successBonus:0.45, desc:'国手神医，几乎无不治之症'},
  ],

  // ── 药材配方库 ───────────────────────────────────────
  // ingredients : 正确药材组合
  // decoys      : 干扰药材（混入选项中）
  // steps       : 制药步骤
  //   type:'grind' → 研磨，需点击 times 次
  //   type:'boil'  → 煎煮，需点击确认 times 次
  RECIPES: [
    {
      diseaseId: 'cold',
      name: '驱寒汤',
      desc: '散寒解表，发汗祛风',
      ingredients: ['生姜','葱白','紫苏'],
      decoys:      ['黄连','大黄','石膏'],
      steps: [
        {type:'grind', target:'生姜', times:3, desc:'将生姜切片研碎'},
        {type:'boil',  target:'全药', times:1, desc:'合药入锅，文火煎煮'},
      ],
    },
    {
      diseaseId: 'fever',
      name: '退热饮',
      desc: '清热解毒，退烧降温',
      ingredients: ['石膏','知母','甘草'],
      decoys:      ['生姜','葱白','肉桂'],
      steps: [
        {type:'grind', target:'石膏', times:4, desc:'将石膏研磨成粉'},
        {type:'grind', target:'知母', times:2, desc:'知母切片研碎'},
        {type:'boil',  target:'全药', times:1, desc:'合药入锅，武火煎煮'},
      ],
    },
    {
      diseaseId: 'plague',
      name: '解疫丹',
      desc: '清瘟败毒，扶正祛邪',
      ingredients: ['黄连','黄芩','板蓝根','金银花'],
      decoys:      ['生姜','肉桂','葱白'],
      steps: [
        {type:'grind', target:'黄连',   times:4, desc:'黄连研末'},
        {type:'grind', target:'板蓝根', times:3, desc:'板蓝根捣碎'},
        {type:'boil',  target:'全药',   times:2, desc:'合药文火慢煎，去渣取汁'},
      ],
    },
    {
      diseaseId: 'poison',
      name: '解毒散',
      desc: '以毒攻毒，化解毒素',
      ingredients: ['绿豆','甘草','金银花'],
      decoys:      ['附子','乌头','半夏'],
      steps: [
        {type:'grind', target:'绿豆', times:3, desc:'绿豆研末'},
        {type:'boil',  target:'全药', times:1, desc:'合药煎汤，去渣饮用'},
      ],
    },
    {
      diseaseId: 'wound',
      name: '生肌膏',
      desc: '活血化瘀，消炎生肌',
      ingredients: ['三七','黄芪','白芷'],
      decoys:      ['大黄','石膏','知母'],
      steps: [
        {type:'grind', target:'三七', times:5, desc:'三七研成极细粉末'},
        {type:'grind', target:'白芷', times:3, desc:'白芷研碎'},
        {type:'boil',  target:'全药', times:1, desc:'合药以麻油熬制成膏'},
      ],
    },
    {
      diseaseId: 'cough',
      name: '润肺饮',
      desc: '润肺止咳，滋阴降火',
      ingredients: ['川贝','百合','沙参'],
      decoys:      ['黄连','大黄','附子'],
      steps: [
        {type:'grind', target:'川贝', times:4, desc:'川贝研细末'},
        {type:'boil',  target:'全药', times:2, desc:'合药文火慢炖，加冰糖收汁'},
      ],
    },
    {
      diseaseId: 'heatstroke',
      name: '消暑饮',
      desc: '清热解暑，生津止渴',
      ingredients: ['荷叶','绿豆','西瓜皮'],
      decoys:      ['肉桂','生姜','附子'],
      steps: [
        {type:'boil', target:'全药', times:1, desc:'合药煎汤，冷服'},
      ],
    },
    {
      diseaseId: 'joint',
      name: '祛风散',
      desc: '祛风除湿，舒筋活络',
      ingredients: ['独活','威灵仙','牛膝'],
      decoys:      ['川贝','百合','沙参'],
      steps: [
        {type:'grind', target:'威灵仙', times:3, desc:'威灵仙研末'},
        {type:'boil',  target:'全药',   times:2, desc:'合药煎汤，趁热服用'},
      ],
    },
    {
      diseaseId: 'dysentery',
      name: '止痢汤',
      desc: '清肠止泻，收敛固涩',
      ingredients: ['黄连','白头翁','马齿苋'],
      decoys:      ['生姜','葱白','肉桂'],
      steps: [
        {type:'grind', target:'黄连',   times:3, desc:'黄连研末'},
        {type:'boil',  target:'全药',   times:2, desc:'合药煎汤，频服'},
      ],
    },
    {
      diseaseId: 'eyedis',
      name: '明目散',
      desc: '清肝明目，退翳消障',
      ingredients: ['菊花','枸杞','决明子'],
      decoys:      ['大黄','黄连','石膏'],
      steps: [
        {type:'grind', target:'决明子', times:3, desc:'决明子研末'},
        {type:'boil',  target:'全药',   times:1, desc:'合药煎汤，熏洗并服'},
      ],
    },
    {
      diseaseId: 'heartdis',
      name: '养心汤',
      desc: '补气养心，安神定悸',
      ingredients: ['人参','麦冬','五味子'],
      decoys:      ['大黄','黄连','附子'],
      steps: [
        {type:'grind', target:'五味子', times:3, desc:'五味子研末'},
        {type:'boil',  target:'全药',   times:2, desc:'合药文火久煎，去渣取汁'},
      ],
    },
    {
      diseaseId: 'starvation',
      name: '补虚粥',
      desc: '补气健脾，恢复元气',
      ingredients: ['黄芪','大枣','山药'],
      decoys:      ['黄连','大黄','石膏'],
      steps: [
        {type:'boil',  target:'全药',   times:2, desc:'合药加粳米慢熬成粥'},
      ],
    },
  ],
};

window.AncientDiseasesData = AncientDiseasesData;
window.DISEASES = AncientDiseasesData.DISEASES;
window.DOCTORS  = AncientDiseasesData.DOCTORS;
