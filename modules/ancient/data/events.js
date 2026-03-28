const AncientEvents = {
  RANDOM_EVENTS: [
    {w:8, age:[0,100], text:'今年风调雨顺，五谷丰登，偶得横财。',   type:'good',money:20},
    {w:6, age:[10,100],text:'偶遇贵人，得到指点，增长见识。',        type:'good',intel:5},
    {w:5, age:[16,100],text:'习得一门手艺，技艺有所精进。',          type:'good',intel:3,money:10},
    {w:4, age:[18,100],text:'经营有道，意外获得一笔财富。',          type:'good',money:50},
    {w:3, age:[20,60], text:'在集市上做成一笔大买卖，盆满钵满。',   type:'good',money:80},
    {w:5, age:[0,100], text:'身体倍棒，吃嘛嘛香。',                 type:'good',health:5},
    {w:4, age:[10,100],text:'结交了一位好友，心情舒畅。',            type:'good',mood:10},
    {w:3, age:[15,100],text:'外出游历，见闻大增，魅力与智识俱长。', type:'good',intel:4,charm:4},
    {w:3, age:[20,100],text:'声名远播，乡邻交口称赞，魅力大涨。',   type:'good',mood:8,charm:6},
    {w:2, age:[20,50], text:'科举考试意外上榜，光耀门楣！',          type:'good',money:100,intel:5,reqIntel:60},
    {w:10,age:[0,100], text:'平淡无奇地度过了这一年。',              type:'info'},
    {w:8, age:[0,100], text:'四季更迭，岁月如梭。',                  type:'info'},
    {w:6, age:[20,100],text:'在茶馆听说了一些奇闻异事。',            type:'info'},
    {w:7, age:[0,100], text:'今年收成不好，日子有些拮据。',          type:'bad',money:-20},
    {w:5, age:[0,100], text:'染了风寒，大病一场，健康大损。',        type:'bad',health:-12,money:-15},
    {w:4, age:[30,100],text:'遭遇盗贼，损失了一些钱财。',            type:'bad',money:-30},
    {w:3, age:[0,100], text:'与人发生口角，心情低落。',              type:'bad',mood:-8},
    {w:3, age:[40,100],text:'年岁渐长，身体大不如前。',              type:'bad',health:-8},
    {w:2, age:[50,100],text:'旧伤复发，卧病在床数月。',              type:'bad',health:-15,money:-20},
    {w:2, age:[0,100], text:'家中遭遇火灾，损失惨重！',              type:'bad',money:-60,mood:-15},
    {w:2, age:[10,40], text:'容貌受损，魅力有所下滑。',              type:'bad',charm:-8},
    {w:5, age:[18,45], text:'沙场征战，身负轻伤，险象环生。',        type:'bad',health:-20,job:'soldier'},
  ],

  SCHOOL_EVENTS: [
    {text:'先生今日讲授《论语》，受益匪浅。',          mood:0,  intel:1},
    {text:'在学堂与同窗切磋文章，相互砥砺。',          mood:3,  intel:1},
    {text:'先生布置繁重功课，挑灯夜读，甚是辛苦。',    mood:-4, intel:2},
    {text:'同窗欺侮，心情低落，但意志愈发坚定。',      mood:-5, intel:0},
    {text:'今日偷懒打盹，被先生罚站半日。',            mood:-3, intel:0},
    {text:'与先生对答如流，得到当众夸赞，心情大好。',  mood:6,  intel:1},
    {text:'阅览藏书阁，读到一本奇书，眼界大开。',      mood:2,  intel:3},
  ],

  ESSAY_PROMPTS: [
    {title:'论仁义礼智信',desc:'儒家五常，试论其要义与践行之道。'},
    {title:'试论君子之道',desc:'何为君子？从修身、齐家、治国三方面阐述。'},
    {title:'水善利万物而不争',desc:'以老子之言，论处世之哲学。'},
    {title:'民为贵，社稷次之',desc:'论民本思想在治国中的体现。'},
    {title:'知行合一',desc:'王阳明之学，论知与行的关系。'},
    {title:'天下兴亡，匹夫有责',desc:'论个人与国家命运之关联。'},
  ],

  GRADE_INFO: {
    F:{label:'F',color:'#ef4444',intelBonus:0, desc:'惨不忍睹，先生摇头叹气。'},
    E:{label:'E',color:'#f97316',intelBonus:1, desc:'勉强及格，仍需努力。'},
    D:{label:'D',color:'#f59e0b',intelBonus:2, desc:'中规中矩，马马虎虎。'},
    C:{label:'C',color:'#84cc16',intelBonus:3, desc:'成绩尚可，略有所得。'},
    B:{label:'B',color:'#22c55e',intelBonus:4, desc:'颇为出色，先生点头称许。'},
    A:{label:'A',color:'#06b6d4',intelBonus:6, desc:'才华横溢，同窗侧目。'},
    S:{label:'S',color:'#a855f7',intelBonus:10,desc:'天纵奇才，名动学堂！'},
  }
};

window.AncientEvents = AncientEvents;
