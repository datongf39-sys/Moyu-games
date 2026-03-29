// Core state management
const AncientState = {
  G: {},
  
  clamp: (v, lo=0, hi=100) => Math.max(lo, Math.min(hi, v)),
  
  initGame: inheritFrom => {
    const isMale = Math.random() > 0.5;
    const surname = AncientNames.SURNAMES[Math.floor(Math.random() * AncientNames.SURNAMES.length)];
    const given = (isMale ? AncientNames.MALE_NAMES : AncientNames.FEMALE_NAMES)[Math.floor(Math.random() * (isMale ? AncientNames.MALE_NAMES.length : AncientNames.FEMALE_NAMES.length))];
    const bgKeys = ['poor','normal','normal','rich'];
    const bgKey = inheritFrom ? 'normal' : bgKeys[Math.floor(Math.random() * bgKeys.length)];
    const bg = AncientFamilyData.FAMILY_BG[bgKey];
    const startMoney = inheritFrom ? Math.floor(inheritFrom.money * 0.4) : 0;
    const baseFavor = bgKey === 'rich' ? 70 : bgKey === 'normal' ? 50 : 30;

    Object.assign(AncientState.G, {
      name: surname+given, surname, given,
      gender: isMale ? 'male' : 'female',
      emoji: (isMale ? AncientNames.MALE_EMOJI : AncientNames.FEMALE_EMOJI)[Math.floor(Math.random() * 3)],
      age: 0,
      maxAge: 60 + Math.floor(Math.random() * 41),
      health: AncientState.clamp(70 + Math.floor(Math.random() * 30)),
      mood:   AncientState.clamp(60 + Math.floor(Math.random() * 30)),
      intel:  AncientState.clamp(15 + Math.floor(Math.random() * 35)),
      charm:  AncientState.clamp(20 + Math.floor(Math.random() * 40)),
      parentFavor: baseFavor,
      money: startMoney,
      job: 'none', jobRank: 0, jobProf: 0,
      salaryCollectedThisYear: false,
      parentMoneyAskedThisYear: false,
      tasksDoneThisYear: [],
      actionsThisYear: [],
      inSchool: false,
      married: false, spouseName: null, spouseEmoji: null,
      children: [],
      siblings: [],  // 兄弟姐妹列表
      parents: inheritFrom ? [] : [
        {name: surname+AncientNames.MALE_NAMES[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)], rel:'父亲', emoji:'👨', alive:true, favor:baseFavor},
        {name: AncientNames.SURNAMES[Math.floor(Math.random()*AncientNames.SURNAMES.length)]+AncientNames.FEMALE_NAMES[Math.floor(Math.random()*AncientNames.FEMALE_NAMES.length)], rel:'母亲', emoji:'👩', alive:true, favor:baseFavor},
      ],
      ancestors: inheritFrom ? [{name:inheritFrom.name,emoji:inheritFrom.emoji,age:inheritFrom.age,rel:'先祖'}] : [],
      familyBg: bgKey,
      log: [], yearsLived: 0, totalMoney: 0,
      dead: false, deathCause: '',
      examPassed: false, examRecommended: false,
      schoolYears: 0, schoolGrade: 'F',
      inventory: [], bagLimit: 5,
      estates: [],
      npcs: [],
      spouseGender: null, spouseBg: null, spouseMoney: 0, spouseEstates: [],
      concubines: [],
      lovers: [],  // 外室列表
      pendingMarriage: [],  // 待成亲对象列表
      spouseFavor: 80,
      illegitimateChildren: [],  // 私生子列表（外室所生）
      will: null,  // 遗嘱：{heirName, heirType, heirGender}
      diseases: [],
      venueStamina: 100,
      _yearTasks: null, _yearTasksAge: -1, _yearTasksJob: '', _yearTasksRank: -1,
      _shopSeed: false, _shopYear: -1, _shopPool: [],
    });

    // 默认给初始房子
    const defEstate = AncientEstates.ESTATES.find(e => e.id === bg.defaultEstate) || AncientEstates.ESTATES[0];
    AncientState.G.estates = [{...defEstate, eid:'e_init', residents:[AncientState.G.name]}];

    if (inheritFrom) {
      AncientSave.addLog(`🌅 承继先祖 ${inheritFrom.name} 的遗志，开始新的人生。`, 'event');
    } else {
      AncientSave.addLog(`🎋 ${AncientState.G.name} 降生于世，${AncientState.G.gender==='male'?'男':'女'}，出身${bg.label}。`, 'event');
    }
    AncientSave.save(); AncientRender.render();
  }
};

window.AncientState = AncientState;
