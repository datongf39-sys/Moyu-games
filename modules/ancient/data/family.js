const AncientFamilyData = {
  FAMILY_BG:{
    poor:   {label:'贫困之家',icon:'🏚️',startMoney:[10,40], freeSchoolAge:0, parentMoneyLimit:5, parentMoneyBase:[3,8],  desc:'家徒四壁，父母无力供读',defaultEstate:'shack'},
    normal: {label:'寻常人家',icon:'🏠',startMoney:[50,100],freeSchoolAge:12,parentMoneyLimit:30,parentMoneyBase:[8,20], desc:'小康之家，供孩子读书到 12 岁',defaultEstate:'cottage'},
    rich:   {label:'富裕人家',icon:'🏰',startMoney:[200,500],freeSchoolAge:16,parentMoneyLimit:80,parentMoneyBase:[20,60],desc:'衣食无忧，供孩子读书到 16 岁',defaultEstate:'house'},
  }
};

window.AncientFamilyData = AncientFamilyData;
window.FAMILY_BG = AncientFamilyData.FAMILY_BG;
