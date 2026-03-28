const AncientItems = {
  SHOP_ITEMS_POOL: [
    {id:'herbal',    name:'草药包',   icon:'🌿',price:15, effect:{health:15},         desc:'服用后恢复健康 +15',         stackable:true, tags:['general']},
    {id:'book',      name:'经典文集', icon:'📚',price:30, effect:{intel:10},           desc:'研读后智识 +10',             stackable:true, tags:['general']},
    {id:'rouge',     name:'胭脂水粉', icon:'💄',price:25, effect:{charm:12},           desc:'使用后魅力 +12',             stackable:true, tags:['general']},
    {id:'wine',      name:'美酒一坛', icon:'🍶',price:20, effect:{mood:15},            desc:'饮后心情 +15',               stackable:true, tags:['general']},
    {id:'tonic',     name:'大补丸',   icon:'💊',price:60, effect:{health:30},          desc:'服用后恢复健康 +30',         stackable:true, tags:['general']},
    {id:'jade',      name:'翡翠玉佩', icon:'💚',price:80, effect:{charm:20,mood:10},   desc:'佩戴后魅力 +20 心情 +10',    stackable:false,tags:['general']},
    {id:'sword',     name:'宝剑一柄', icon:'⚔️',price:100,effect:{health:10,mood:10},  desc:'强身健体，健康 +10 心情 +10',stackable:false,tags:['general']},
    {id:'bigbag',    name:'大布袋',   icon:'🎒',price:50, effect:{bagExpand:5},        desc:'背包容量 +5（最大 20）',      stackable:false,tags:['general']},
    {id:'bk_farmer', name:'农耕要术', icon:'📗',price:70, effect:{jobProf:10},isJobBook:true,desc:'农夫专用·熟练度 +10',jobId:'farmer', stackable:true, tags:['jobbook']},
    {id:'bk_smith',  name:'锻造秘典', icon:'📘',price:70, effect:{jobProf:10},isJobBook:true,desc:'铁匠专用·熟练度 +10',jobId:'smith',  stackable:true, tags:['jobbook']},
    {id:'bk_merch',  name:'商道经',   icon:'📙',price:70, effect:{jobProf:10},isJobBook:true,desc:'行商专用·熟练度 +10',jobId:'merchant',stackable:true, tags:['jobbook']},
    {id:'bk_doctor', name:'医典精要', icon:'📕',price:70, effect:{jobProf:10},isJobBook:true,desc:'药师专用·熟练度 +10',jobId:'doctor', stackable:true, tags:['jobbook']},
    {id:'bk_soldier',name:'兵法三十六计',icon:'📜',price:70,effect:{jobProf:10},isJobBook:true,desc:'士兵专用·熟练度 +10',jobId:'soldier',stackable:true,tags:['jobbook']},
    {id:'gift_poem', name:'精装诗集', icon:'📝',price:30, effect:{},isGift:true,giftTrait:['才华横溢','温文尔雅'],favorBonus:15,desc:'赠给有才情的人，好感 +15',stackable:true,tags:['gift']},
    {id:'gift_wine', name:'陈年佳酿', icon:'🍷',price:35, effect:{},isGift:true,giftTrait:['豪爽仗义','风趣幽默'],favorBonus:15,desc:'赠给豪爽之人，好感 +15',stackable:true,tags:['gift']},
    {id:'gift_flower',name:'鲜花一束',icon:'💐',price:20, effect:{},isGift:true,giftTrait:['温柔体贴','活泼开朗'],favorBonus:15,desc:'赠给温柔之人，好感 +15',stackable:true,tags:['gift']},
    {id:'gift_chess',name:'象棋一副', icon:'♟️',price:40, effect:{},isGift:true,giftTrait:['沉稳内敛','严肃认真'],favorBonus:15,desc:'赠给沉稳之人，好感 +15',stackable:true,tags:['gift']},
    {id:'gift_gen',  name:'精美首饰', icon:'💍',price:55, effect:{},isGift:true,giftTrait:[],favorBonus:10,desc:'通用礼物，赠任何人好感 +10',stackable:true,tags:['gift']},
  ]
};

window.AncientItems = AncientItems;
