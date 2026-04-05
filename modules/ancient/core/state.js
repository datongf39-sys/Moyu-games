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
      luck:   AncientState.clamp(10 + Math.floor(Math.random() * 80)),  // 运气属性
      parentFavor: baseFavor,
      money: startMoney,
      job: 'none', jobRank: 0, jobProf: 0,
      salaryCollectedThisYear: false,
      tasksDoneThisYear: [],
      actionsThisYear: [],
      inSchool: false,
      inWuguan: false,  // 是否在武馆就读

      // ── 文试进度 ──────────────────────────────────────
      civilExamLevel: 0,        // 0=未开始 1=县试 2=府试 3=院试(秀才) 4=乡试(举人) 5=会试 6=殿试(进士/入仕)
      civilExamGrade: 'F',      // 学堂当前成绩，影响备考质量
      civilExamRecommended: false, // 是否获先生推荐可下场
      examPassed: false,        // 最终殿试是否通过（兼容旧字段）

      // ── 武试进度 ──────────────────────────────────────
      militaryExamLevel: 0,     // 0=未开始 1=武童试 2=武乡试 3=武会试 4=武殿试(入伍授职)
      militaryExamGrade: 'F',   // 武馆当前成绩，影响备考质量
      militaryExamRecommended: false, // 是否获教头推荐可下场
      militaryExamPassed: false, // 武殿试是否通过

      // ── 旧字段保留（兼容）────────────────────────────
      schoolGrade: 'F',         // 兼容旧存档，新逻辑读 civilExamGrade
      examRecommended: false,   // 兼容旧存档，新逻辑读 civilExamRecommended
      schoolYears: 0,

      married: false, spouseName: null, spouseEmoji: null,
      children: [],
      siblings: [],
      parents: inheritFrom ? [] : [
        {name: surname+AncientNames.MALE_NAMES[Math.floor(Math.random()*AncientNames.MALE_NAMES.length)], rel:'父亲', emoji:'👨', alive:true, favor:baseFavor, age: 28 + Math.floor(Math.random()*20), job: AncientJobs.JOBS[Math.floor(Math.random()*6)+1].id}, // 随机从 farmer 到 dancer 中选
        {name: AncientNames.SURNAMES[Math.floor(Math.random()*AncientNames.SURNAMES.length)]+AncientNames.FEMALE_NAMES[Math.floor(Math.random()*AncientNames.FEMALE_NAMES.length)], rel:'母亲', emoji:'👩', alive:true, favor:baseFavor, age: 25 + Math.floor(Math.random()*18), job: AncientJobs.JOBS[Math.floor(Math.random()*6)+1].id}, // 随机从 farmer 到 dancer 中选
      ],
      ancestors: inheritFrom ? [{name:inheritFrom.name,emoji:inheritFrom.emoji,age:inheritFrom.age,rel:'先祖'}] : [],
      familyBg: bgKey,
      log: [], yearsLived: 0, totalMoney: 0,
      dead: false, deathCause: '',
      inventory: [], bagLimit: 5,
      estates: [],
      npcs: [],
      spouseGender: null, spouseBg: null, spouseMoney: 0, spouseEstates: [],
      concubines: [],
      lovers: [],
      pendingMarriage: [],
      spouseFavor: 80,
      illegitimateChildren: [],
      will: null,
      diseases: [],
      venueStamina: 100,
      yearLedger: [],  // 年末账单记录
      _yearTasks: null, _yearTasksAge: -1, _yearTasksJob: '', _yearTasksRank: -1,
      _shopSeed: false, _shopYear: -1, _shopPool: [],
      _pregnancyBoostDoctor: false,
      _pregnancyBoostSachetCount: 0,
    });

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
