// ============================================================
// data/inn.js — 客栈业态纯数据
// ============================================================

const AncientInnData = {

  // ── 楼层解锁配置 ─────────────────────────────────────────
  FLOORS: [
    { id: 1, name: '一楼', unlockCost: 0,    unlocked: true  },
    { id: 2, name: '二楼', unlockCost: 800,  unlocked: false },
    { id: 3, name: '三楼', unlockCost: 2000, unlocked: false },
  ],

  // ── 客房类型（按等级） ────────────────────────────────────
  // tier: 'ren'=人字, 'di'=地字, 'tian'=天字
  ROOM_TYPES: [
    {
      id: 'ren', name: '人字号房', icon: '🏮',
      floor: 1, tier: 1,
      unlockCost: 120,   // 购置费（首间含在客栈价格中，后续购置此费）
      pricePerNight: 15, // 每晚房钱
      desc: '简单木床，粗布被褥，干净朴素',
      maxDecorSlots: 3,
    },
    {
      id: 'di', name: '地字号房', icon: '🪔',
      floor: 2, tier: 2,
      unlockCost: 350,
      pricePerNight: 40,
      desc: '雕花木床，软榻茶桌，颇为雅致',
      maxDecorSlots: 4,
    },
    {
      id: 'tian', name: '天字号房', icon: '🏯',
      floor: 3, tier: 3,
      unlockCost: 900,
      pricePerNight: 100,
      desc: '紫檀大床，绫罗帷幔，富贵逼人',
      maxDecorSlots: 5,
    },
  ],

  // ── 公共设施 ──────────────────────────────────────────────
  FACILITIES: [
    {
      id: 'bathhouse',  name: '澡堂',   icon: '🛁',
      floor: 1, unlockCost: 500,
      satisfyBonus: 5,  // 全局满意度加成（适用于所有入住客人）
      desc: '热水充足，澡桶宽大，洗去一路风尘',
    },
    {
      id: 'pool_di',    name: '浴池（地字）', icon: '♨️',
      floor: 2, unlockCost: 700,
      satisfyBonus: 8,
      desc: '青石浴池，药草浸泡，令人神清气爽',
    },
    {
      id: 'pool_tian',  name: '浴池（天字）', icon: '🌊',
      floor: 3, unlockCost: 1200,
      satisfyBonus: 12,
      desc: '雕栏玉砌，温泉引入，奢靡至极',
    },
    {
      id: 'teahouse',   name: '茶室',   icon: '🍵',
      floor: 1, unlockCost: 300,
      satisfyBonus: 4,
      desc: '名茶数十种，茶艺娴熟，客人流连忘返',
    },
    {
      id: 'garden',     name: '后花园', icon: '🌸',
      floor: 1, unlockCost: 600,
      satisfyBonus: 6,
      desc: '假山流水，花木扶疏，心旷神怡',
    },
    {
      id: 'winery',     name: '酒窖',   icon: '🍷',
      floor: 2, unlockCost: 800,
      satisfyBonus: 7,
      desc: '藏酒千坛，佳酿飘香，令侠客文士皆折服',
    },
    {
      id: 'theater',    name: '戏台',   icon: '🎭',
      floor: 1, unlockCost: 1000,
      satisfyBonus: 10,
      desc: '每夜开戏，丝竹管弦，高朋满座',
    },
  ],

  // ── 装饰品（人字号专属） ─────────────────────────────────
  DECOR_REN: [
    { id:'ren_lantern', name:'红纸灯笼', icon:'🏮', cost:20,  satisfyBonus:2, desc:'驱散昏暗，添几分暖意' },
    { id:'ren_mat',     name:'草编席子', icon:'🛏️', cost:15,  satisfyBonus:1, desc:'简朴实用，夏日清凉' },
    { id:'ren_curtain', name:'粗布窗帘', icon:'🪟', cost:18,  satisfyBonus:1, desc:'遮风挡光，勉强得用' },
    { id:'ren_table',   name:'木质小几', icon:'🪵', cost:30,  satisfyBonus:2, desc:'置茶杯书卷，颇为方便' },
    { id:'ren_mirror',  name:'铜镜',     icon:'🪞', cost:40,  satisfyBonus:3, desc:'面容得以整理，出行体面' },
    { id:'ren_plant',   name:'盆栽翠竹', icon:'🎋', cost:25,  satisfyBonus:2, desc:'绿意盎然，令人心宁' },
  ],

  // ── 装饰品（地字号专属） ─────────────────────────────────
  DECOR_DI: [
    { id:'di_scroll',   name:'字画条幅', icon:'🖼️', cost:80,  satisfyBonus:4, desc:'名家手迹，书卷气十足' },
    { id:'di_silkbed',  name:'丝绸床褥', icon:'🛏️', cost:120, satisfyBonus:5, desc:'柔软光滑，一夜好眠' },
    { id:'di_vase',     name:'青瓷花瓶', icon:'🏺', cost:90,  satisfyBonus:4, desc:'插几枝时花，雅意盎然' },
    { id:'di_incense',  name:'香炉熏香', icon:'🪔', cost:60,  satisfyBonus:3, desc:'香气沁人，祛除疲惫' },
    { id:'di_screen',   name:'雕花屏风', icon:'🪵', cost:150, satisfyBonus:6, desc:'精雕细琢，隔而不断' },
    { id:'di_table',    name:'紫木茶桌', icon:'🍵', cost:200, satisfyBonus:7, desc:'配以名茶，待客有礼' },
  ],

  // ── 装饰品（天字号专属） ─────────────────────────────────
  DECOR_TIAN: [
    { id:'tian_jade',   name:'翠玉摆件', icon:'💎', cost:400, satisfyBonus:8,  desc:'晶莹剔透，价值连城' },
    { id:'tian_bed',    name:'紫檀架子床', icon:'🛏️', cost:600, satisfyBonus:10, desc:'雕龙刻凤，富贵逼人' },
    { id:'tian_lamp',   name:'琉璃宫灯', icon:'🪔', cost:350, satisfyBonus:7,  desc:'五彩流光，宛若仙境' },
    { id:'tian_carpet', name:'西域波斯毯', icon:'🎨', cost:500, satisfyBonus:9,  desc:'远道而来，异域风情' },
    { id:'tian_art',    name:'名家山水画', icon:'🖼️', cost:800, satisfyBonus:12, desc:'真迹珍品，观之心旷神怡' },
    { id:'tian_screen', name:'象牙屏风', icon:'🪵', cost:1000, satisfyBonus:15, desc:'奢华至极，令贵客叹为观止' },
  ],

  // ── 客人等级（根据外貌描述判断，刻意模糊，让玩家难以一眼断定） ───
  GUEST_TIERS: [
    {
      id: 'poor', name: '寒素客', tier: 1,
      preferTier: 1,
      budgetRange: [12, 30],
      looks: [
        '一件粗布短褂，袖口磨损发毛，腰间别着个破旧葫芦。',
        '草鞋沾了泥，裤腿高高挽起，像是刚从田间赶来。',
        '身上的棉袍洗得泛白，背着个鼓鼓囊囊的麻布包袱。',
        '头上扎着蓝布巾，衣裳干净，是最寻常的织法。',
        '穿一件半旧的青色长衫，衬得人略显斯文，鞋底磨得薄了。',
        '手执一把折扇，扇骨已有裂纹，进门时四处打量了一圈，没有落座。',
        '背着个漆皮匣子，进门问了价，沉默片刻，又开口问了一遍。',
        '神色疲惫，眼下青黑，穿的是件半新不旧的灰袍，靴子有些跟脚。',
        '衣裳缝补过几处，头发用根木簪绾着，进门先问可不可以自带铺盖。',
        '年岁不大，穿一件蓝底白花的棉布衫，提着个竹编篓子，像是读过两年书的。',
      ],
    },
    {
      id: 'middle', name: '寻常客', tier: 2,
      preferTier: 2,
      budgetRange: [35, 80],
      looks: [
        '细棉长衫，腰间系一根素色绦带，举止不慌不忙。',
        '一身熟褐色绸袍，略有些皱，像是赶了远路。',
        '头戴方巾，手提一个上了锁的木匣，像是走南闯北的货商。',
        '儒巾士袍，书卷气十足，随身带着个砚台包。',
        '穿着朴素，一件洗旧的深蓝布袍，腰带的扣件是铜制的，有些分量。',
        '满脸风霜，衣裳不算新，靴子是好皮料的，走路带风。',
        '粗布外氅，里头露出一截细布里衬，问话时用词斟酌，颇有见识。',
        '衣料光鲜，配色讲究，随行一个小厮，提着两个包袱。',
        '随行一个小厮，衣裳普通，主仆二人进门时都没说话，小厮把行李搁在脚边，等着。',
        '指间戴着枚金戒指，进门时摘下来揣进袖子里，开口问了价。',
        '气度从容，进门要了壶茶，掏钱时数了又数，放下刚好的数目。',
      ],
    },
    {
      id: 'rich', name: '贵气客', tier: 3,
      preferTier: 3,
      budgetRange: [90, 200],
      looks: [
        '锦袍玉带，随行两名小厮提着行李，气度不凡。',
        '一件狐裘大氅随手搭在臂上，腰间挂着块羊脂白玉。',
        '华服如云，举手投足间带着从小养成的世家气度。',
        '穿一件半旧的素色袍子，头发只用木簪绾着，靴子是鹿皮的，鞋底几乎没有磨损。',
        '衣裳颜色低调，布料垂感极好，随从只带一个，行李却是三口箱子。',
        '神情淡然，只带一个仆从，开口问价时嗓音平稳，听完报价说了声"行"。',
        '满面风尘，衣袍有几处褶皱，随从从怀里取出一张名帖递上来。',
        '言谈举止不疾不徐，问了两句房间朝向与被褥厚薄，听完点了点头。',
        '面容普通，衣着素净，腕间一串木珠子，进门时随从已经先去看过房间。',
        '在柜台上放了锭银子，说了句"不必找了"，转身去看墙上挂的字画。',
      ],
    },
  ],

  // ── 安排房间时的结算规则 ──────────────────────────────────
  // roomTier - guestPreferTier：
  //   0:  合适，收房间原价，无事
  //  +1:  升级住，客人觉得被宰，玩家赔出房间原价，扣声誉，不计投诉
  //  +2:  严重升级，同上，赔钱，大扣声誉，计投诉
  //  -1:  降级住，客人不满，给半价（不超过该等级价格上限），扣声誉，不计投诉
  //  -2:  严重降级，同上，给半价，大扣声誉，计投诉
  ROOM_MATCH_RULES: {
    '2':  { repDelta: -10, complaint: true,  compensate: true,  halfPrice: false, desc: '房间太过阔气，客人觉得被宰，大声嚷嚷，执意要求赔偿。' },
    '1':  { repDelta: -5,  complaint: false, compensate: true,  halfPrice: false, desc: '房间超出预算，客人皱眉不悦，认为掌柜故意安排，要求赔偿。' },
    '0':  { repDelta: 0,   complaint: false, compensate: false, halfPrice: false, desc: '房间与客人身份相符，一切如常。' },
    '-1': { repDelta: -5,  complaint: false, compensate: false, halfPrice: true,  desc: '房间条件不合身份，客人皱眉不悦，给的钱打了折扣。' },
    '-2': { repDelta: -10, complaint: true,  compensate: false, halfPrice: true,  desc: '房间与身份悬殊太大，客人大发雷霆，勉强丢下半价钱拂袖而去。' },
  },

  // 各等级客人对应的价格上限（半价时不超过此值）
  GUEST_PRICE_CAP: { 1: 15, 2: 40, 3: 100 },

  // ── 年度随机事件（旺季/淡季/奇遇） ─────────────────────
  YEAR_EVENTS: [
    { type:'good', repDelta: 5,  guestBonus: 2, text:'近日有商队路过，客栈迎来一批大主顾，宾客盈门。' },
    { type:'good', repDelta: 8,  guestBonus: 3, text:'有文人墨客在此小住，留下诗句，客栈因此声名大噪。' },
    { type:'good', repDelta: 3,  guestBonus: 1, text:'新修官道途经此处，过路旅人明显增多。' },
    { type:'bad',  repDelta: -5, guestBonus: -2,text:'近来时疫流行，行旅减少，客栈生意冷清。' },
    { type:'bad',  repDelta: -3, guestBonus:-1, text:'邻街新开了一家客栈，揽走不少客人。' },
    { type:'bad',  repDelta: -6, guestBonus: 0, text:'有客人在店中遗失财物，闹了一场，名声受损。' },
    { type:'info', repDelta: 0,  guestBonus: 0, text:'本年风调雨顺，往来客人平平，无甚波折。' },
    { type:'good', repDelta:10,  guestBonus: 4, text:'县令微服路经此处，对客栈大加称赞，口碑传遍方圆百里。' },
    { type:'bad',  repDelta: -4, guestBonus:-1, text:'今年连绵阴雨，道路泥泞，旅客出行减少。' },
    { type:'good', repDelta: 6,  guestBonus: 2, text:'逢集市庙会，四方商贩云集，带动客栈生意兴旺。' },
  ],

  // ── 投诉阈值与关店规则 ───────────────────────────────────
  COMPLAINT_LIMIT: 3,      // 一年内累计投诉次数达到此值则关店调查
  SHUTDOWN_PENALTY_TEXT:
    '官差登门，称本店本年经营不善，客诉频频，责令停业整顿，本年营业收入悉数充公！',
};

window.AncientInnData = AncientInnData;
