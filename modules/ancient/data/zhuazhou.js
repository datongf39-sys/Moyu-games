// 抓周物品数据
const AncientZhuazhouData = {
  ITEMS: [
    {
      id: 'brush',
      name: '毛笔',
      icon: '🖌️',
      desc: '文房四宝之首，寓意文采风流',
      statBonus: { intel: 2 },
      specialFlag: null,
      selectText: '你伸出小手，在诸般物件中径直抓住了那支毛笔，攥得紧紧的，任谁也夺不走。',
      reactionText: '父亲愣了片刻，随即朗声大笑：「此子日后必是读书的料！」众人纷纷道贺。'
    },
    {
      id: 'book',
      name: '书卷',
      icon: '📖',
      desc: '圣贤之书，寓意金榜题名',
      statBonus: { intel: 1, mood: 1 },
      specialFlag: null,
      selectText: '你对那卷书似乎颇有兴趣，伸手拍了拍，又将它抱在怀里，咿咿呀呀地叫着。',
      reactionText: '旁边的长辈捋须点头：「抱书而笑，他日必登科第。」'
    },
    {
      id: 'abacus',
      name: '算盘',
      icon: '🧮',
      desc: '精打细算，寓意商贾之才',
      statBonus: { intel: 1, charm: 1 },
      specialFlag: null,
      selectText: '你被那算盘的声音吸引，抓起来噼里啪啦拨弄了几下，笑得眯起了眼。',
      reactionText: '母亲喜道：「这孩子脑子灵，将来是个会盘算的。」'
    },
    {
      id: 'gold',
      name: '金锭',
      icon: '🥇',
      desc: '金银财宝，寓意富贵荣华',
      statBonus: { mood: 1, charm: 1 },
      specialFlag: null,
      selectText: '你不假思索地抓住金锭，小手攥得死紧，怎么哄都不肯松开。',
      reactionText: '族中长辈哄堂大笑：「认得金银，这孩子是个有福气的！」'
    },
    {
      id: 'sword',
      name: '木剑',
      icon: '🗡️',
      desc: '三尺青锋，寓意武将之才',
      statBonus: { health: 2 },
      specialFlag: null,
      selectText: '你抓起木剑，挥了两下，虽是歪歪斜斜，却有模有样。',
      reactionText: '父亲拍腿叫好：「好！有将才之相！」众人皆笑着叫好。'
    },
    {
      id: 'bow',
      name: '弓箭',
      icon: '🏹',
      desc: '百步穿杨，寓意神勇善战',
      statBonus: { health: 1, mood: 1 },
      specialFlag: null,
      selectText: '你对弓箭端详了许久，用力拉了拉弓弦，发出一声闷响，咧嘴笑了。',
      reactionText: '祖父抚掌：「臂力惊人，日后是块好料子。」'
    },
    {
      id: 'hammer',
      name: '铜锤',
      icon: '🔨',
      desc: '千钧之力，寓意力大无穷',
      statBonus: { health: 2 },
      specialFlag: null,
      selectText: '那铜锤沉甸甸的，你却硬生生拖了过来，攥在手里不撒手。',
      reactionText: '众人惊叹：「这娃力气忒大！」'
    },
    {
      id: 'seal',
      name: '印章',
      icon: '🔖',
      desc: '官印在手，寓意仕途通达',
      statBonus: { intel: 1, charm: 1 },
      specialFlag: null,
      selectText: '你拿起印章，翻来覆去地看，又往掌心盖了一下，留下一个歪歪的红印。',
      reactionText: '长辈们交换了一个眼神：「抓了印，将来是要当官的。」'
    },
    {
      id: 'rouge',
      name: '胭脂',
      icon: '💄',
      desc: '胭脂水粉，寓意容貌俊美',
      statBonus: { charm: 2 },
      specialFlag: null,
      selectText: '你对那盒胭脂好奇极了，打开来用手指蘸了蘸，往脸上抹了一把，逗得众人大笑。',
      reactionText: '母亲笑弯了腰：「生得俊俏，将来定是个招人稀罕的。」'
    },
    {
      id: 'drum',
      name: '拨浪鼓',
      icon: '🥁',
      desc: '童趣玩具，寓意无忧无虑',
      statBonus: { mood: 2 },
      specialFlag: null,
      selectText: '你抓起拨浪鼓，摇得起劲，咯咯笑个不停，旁的东西一眼也不瞧。',
      reactionText: '众人见你玩得欢，也跟着笑了起来，气氛格外热闹。'
    },
    {
      id: 'cake',
      name: '糕点',
      icon: '🍰',
      desc: '美味佳肴，寓意衣食无忧',
      statBonus: { health: 1, mood: 1 },
      specialFlag: null,
      selectText: '你抱起糕点就往嘴里塞，油纸还没剥开就啃上了，急得母亲连忙来抢。',
      reactionText: '祖母笑道：「这孩子实在，知道吃是正经事，将来不会亏着自己。」'
    },
    {
      id: 'coins',
      name: '铜钱串',
      icon: '🪙',
      desc: '铜钱叮当，寓意财运亨通',
      statBonus: { mood: 1, charm: 1 },
      specialFlag: null,
      selectText: '你抓起那串铜钱，叮叮当当地摇着玩，乐此不疲，笑声不断。',
      reactionText: '父亲笑道：「将来是个乐天派，错不了。」'
    }
  ],

  // 家世对应的开场文案
  FAMILY_INTRO: {
    poor: [
      '茅屋之内，父母特地借来邻家的桌案，将几样物件摆在你面前。屋内虽简陋，却洋溢着温馨的笑容。',
      '寒舍之中，父母用平日里舍不得吃的米换来的几样物事，小心翼翼地摆在你眼前，眼中满是期盼。'
    ],
    normal: [
      '堂屋里香烛已备，亲眷们围坐一旁，屏息等待。桌上物件琳琅满目，皆是精心挑选。',
      '正厅之中，父母将抓周之物一一摆开，亲友们交头接耳，议论纷纷，气氛热烈。'
    ],
    rich: [
      '大厅张灯结彩，族中长辈齐聚，丫鬟婆子侍立两侧。红木案上，抓周之物摆放整齐，尽显富贵气象。',
      '府中设宴，宾客满座。案上金漆托盘盛着各式物件，光彩夺目，众人翘首以盼。'
    ]
  }
};

window.AncientZhuazhouData = AncientZhuazhouData;
