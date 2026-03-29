const AncientItems = {
  SHOP_ITEMS_POOL: [
    {id:'herbal',    name:'草药包',   icon:'🌿',price:15, effect:{health:15},         desc:'山间采得的寻常草药，晒干煎服，略有苦涩。虽非名贵药材，然日积月累，也能固本培元，强健些许。', stackable:true, tags:['general']},
    {id:'book',      name:'经典文集', icon:'📚',price:30, effect:{intel:10},           desc:'前朝大儒手录之文集，字字珠玑，博览其中，如与先贤对话。读罢掩卷，只觉心胸开阔，智识大有裨益。', stackable:true, tags:['general']},
    {id:'rouge',     name:'胭脂水粉', icon:'💄',price:25, effect:{charm:12},           desc:'坊间名铺精制，取上等胭脂研磨而成，色泽饱满，敷上面颊顿显神采。出门待客，自是风姿倍增。', stackable:true, tags:['general']},
    {id:'wine',      name:'美酒一坛', icon:'🍶',price:20, effect:{mood:15},            desc:'窖藏三年的陈酿，启封时酒香四溢，令人心旷神怡。饮上几口，烦忧尽散，不觉间心情舒畅了许多。', stackable:true, tags:['general']},
    {id:'tonic',     name:'大补丸',   icon:'💊',price:60, effect:{health:30},          desc:'据闻此丸以数十味名贵药材秘制，炮制繁琐，工序考究。一丸入口，补气养血，效验远胜寻常草药，坊间索价颇高，物有所值。', stackable:true, tags:['general']},
    {id:'jade',      name:'翡翠玉佩', icon:'💚',price:80, effect:{charm:20,mood:10},   desc:'通透碧绿的上品翡翠，玉质细腻温润。古人云，君子无故，玉不去身。常年佩戴，养气润身，举止间自添几分风雅气度。', stackable:false,tags:['general']},
    {id:'sword',     name:'宝剑一柄', icon:'⚔️',price:100,effect:{health:10,mood:10},  desc:'工匠精心锻造的利剑，剑身寒光凛凛，握于手中沉甸甸的踏实。每日挥剑练功，既强健体魄，又振奋精神，颇为提气。',stackable:false,tags:['general']},
    {id:'bigbag',    name:'大布袋',   icon:'🎒',price:50, effect:{bagExpand:5},        desc:'厚实耐用的宽口布袋，针脚绵密，容量宽裕。有了这个，行囊再也不用愁装不下了，多带五件物什，绰绰有余。', stackable:false,tags:['general']},
    {id:'herb_pack', name:'草药调理包', icon:'🌱',price:50, effect:{health:6},         desc:'以黄芪、党参、茯苓等数味药材配伍而成，每日取出少许煎服，徐徐调养，固本培元。效验虽不及大夫亲诊，然胜在随时可取，无需等待，细水长流，自有功效。', stackable:true, tags:['general']},
    {id:'fertility_sachet', name:'催子香囊', icon:'🌸',price:100, effect:{fertility:0.05}, desc:'以百年陈艾、益母草、当归等数十味药材秘制而成，置于床头，夜夜熏染。坊间传言有奇效，求子之人趋之若鹜。使用后本年生育概率提升 5%，效果不与大夫调养叠加，取较高者。', stackable:true, tags:['general']},
    {id:'bk_farmer', name:'农耕要术', icon:'📗',price:70, effect:{jobProf:10},isJobBook:true,desc:'前人积数十年经验写就，从选种、施肥到节气耕作，事无巨细，皆有记载。农夫读来如获至宝，照书施为，熟练精进不在话下。',jobId:'farmer', stackable:true, tags:['jobbook']},
    {id:'bk_smith',  name:'锻造秘典', icon:'📘',price:70, effect:{jobProf:10},isJobBook:true,desc:'铁匠世家祖传的手艺秘录，火候、锤法、淬火之道，尽在其中。反复研读，自能触类旁通，锻造技艺大有长进。',jobId:'smith',  stackable:true, tags:['jobbook']},
    {id:'bk_merch',  name:'商道经',   icon:'📙',price:70, effect:{jobProf:10},isJobBook:true,desc:'走南闯北的老行商留下的压箱底之物，记载了进货压价、开口成交的诸般门道。行商读来，犹如有老师傅在旁指点，少走许多弯路。',jobId:'merchant',stackable:true, tags:['jobbook']},
    {id:'bk_doctor', name:'医典精要', icon:'📕',price:70, effect:{jobProf:10},isJobBook:true,desc:'历代名医手稿汇编而成，望闻问切之道、药材配伍之法，言简意赅，深入浅出。药师研读，自能精进医术，诊治更添把握。',jobId:'doctor', stackable:true, tags:['jobbook']},
    {id:'bk_soldier',name:'兵法三十六计',icon:'📜',price:70,effect:{jobProf:10},isJobBook:true,desc:'沙场老将的毕生心血，排兵布阵、进退攻守之道尽在其中。士兵熟读，临阵自能心中有数，不再手忙脚乱。',jobId:'soldier',stackable:true,tags:['jobbook']},
    {id:'gift_poem', name:'精装诗集', icon:'📝',price:30, effect:{},isGift:true,giftTrait:['才华横溢','温文尔雅'],favorBonus:15,desc:'名家手书、装帧精良的诗文合集，纸张考究，墨香扑鼻。赠予有才情之人，对方见之必然爱不释手，情谊自是更进一层。',stackable:true,tags:['gift']},
    {id:'gift_wine', name:'陈年佳酿', icon:'🍷',price:35, effect:{},isGift:true,giftTrait:['豪爽仗义','风趣幽默'],favorBonus:15,desc:'窖藏多年的老酒，启封时酒香漫出，令人垂涎。豪爽之人最爱此物，把酒言欢，一坛下肚，什么隔阂都没了。',stackable:true,tags:['gift']},
    {id:'gift_flower',name:'鲜花一束',icon:'💐',price:20, effect:{},isGift:true,giftTrait:['温柔体贴','活泼开朗'],favorBonus:15,desc:'清晨采摘的时令鲜花，色泽娇艳，露水未干。赠予温柔活泼之人，对方见了必然眉开眼笑，好感倍增。',stackable:true,tags:['gift']},
    {id:'gift_chess',name:'象棋一副', icon:'♟️',price:40, effect:{},isGift:true,giftTrait:['沉稳内敛','严肃认真'],favorBonus:15,desc:'做工精细的云石棋子，手感圆润，棋盘纹路清晰。沉稳内敛之人最好此道，收到此礼，少不得要拉你对弈一局。',stackable:true,tags:['gift']},
    {id:'gift_gen',  name:'精美首饰', icon:'💍',price:55, effect:{},isGift:true,giftTrait:[],favorBonus:10,desc:'工匠精心打造的时兴首饰，款式雅致，做工讲究。无论何人收到，皆会心生欢喜，是走动送礼的体面之选。',stackable:true,tags:['gift']},
  ]
};

window.AncientItems = AncientItems;
