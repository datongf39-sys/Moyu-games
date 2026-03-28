const AncientDiseasesData = {
  DISEASES: [
    {id:'cold',   name:'风寒',     icon:'🤧',level:1,healthPerYear:5, moodPerYear:3, deathRisk:0,   cureBase:0.85,desc:'普通风寒，多喝热水便好。'},
    {id:'fever',  name:'伤寒高热', icon:'🤒',level:2,healthPerYear:10,moodPerYear:5, deathRisk:0.01,cureBase:0.70,desc:'高热不退，需尽快就医。'},
    {id:'plague', name:'瘟疫',     icon:'☣️',level:3,healthPerYear:20,moodPerYear:8, deathRisk:0.05,cureBase:0.45,desc:'时疫传播，死亡率极高。'},
    {id:'poison', name:'中毒',     icon:'🐍',level:4,healthPerYear:18,moodPerYear:6, deathRisk:0.04,cureBase:0.50,desc:'毒素侵体，需专门解毒。'},
    {id:'wound',  name:'刀伤溃烂', icon:'🩹',level:2,healthPerYear:12,moodPerYear:4, deathRisk:0.02,cureBase:0.65,desc:'伤口感染，化脓溃烂。'},
    {id:'cough',  name:'痨病咳嗽', icon:'😮‍💨',level:3,healthPerYear:15,moodPerYear:7, deathRisk:0.03,cureBase:0.55,desc:'咳嗽日久，损伤肺腑。'},
  ],

  DOCTORS: [
    {id:'folk',  name:'赤脚郎中',icon:'👴',cost:15, successBonus:0,   desc:'乡野郎中，价廉但手艺一般'},
    {id:'local', name:'本地医师',icon:'👨‍⚕️',cost:40, successBonus:0.15,desc:'坐堂大夫，技术稳妥'},
    {id:'famous',name:'名医',    icon:'🧑‍⚕️',cost:120,successBonus:0.30,desc:'城中名医，治愈率高'},
    {id:'sage',  name:'神医',   icon:'🏆',cost:300,successBonus:0.45,desc:'国手神医，几乎无不治之症'},
  ]
};

window.AncientDiseasesData = AncientDiseasesData;
window.DISEASES = AncientDiseasesData.DISEASES;
window.DOCTORS = AncientDiseasesData.DOCTORS;
