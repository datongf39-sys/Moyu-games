let _currentVenue = null;
let _venueSpotPeople = {};

const AncientVenue = {
  openVenue: (venueId) => {
    const loc = AncientEstates.LOCATIONS.find(l => l.id === venueId); if (!loc) return;
    _currentVenue = venueId;
    const key = 'venue_'+venueId+'_'+AncientState.G.age;
    if (!AncientState.G._venueData) AncientState.G._venueData = {};
    if (!AncientState.G._venueData[key]){
      const spotData = {};
      loc.spots.forEach(s => { spotData[s.id] = Math.max(0, Math.min(5, s.basePeople+Math.floor((Math.random()-0.5)*3))); });
      AncientState.G._venueData[key] = spotData;
    }
    _venueSpotPeople = AncientState.G._venueData[key];
    if (!AncientState.G.venueStamina || AncientState.G.venueStamina <= 0) AncientState.G.venueStamina = 100;
    document.getElementById('venue-title').textContent = loc.icon+' '+loc.name;
    document.getElementById('venue-desc').textContent  = loc.desc;
    AncientVenue.refreshVenueBody(loc);
    document.getElementById('venue-overlay').classList.add('show');
    AncientVenue.updateStaminaBar();
  },

  closeVenue: () => {
    document.getElementById('venue-overlay').classList.remove('show');
    _currentVenue = null;
    AncientSave.save(); AncientRender.render();
  },

  refreshVenueBody: (loc) => {
    if (!loc) loc = AncientEstates.LOCATIONS.find(l => l.id === _currentVenue); if (!loc) return;
    let html = '';

    if (loc.id === 'clinic'){
      html += `<div class="venue-spot" onclick="openClinicTreatment()">
        <div class="venue-spot-name">⚕️ 延医问诊</div>
        <div class="venue-spot-desc">延请坐堂大夫，诊金高低影响成效，大夫医术各有高下。</div>
        <div class="venue-spot-people" style="color:var(--red)">${AncientState.G.diseases&&AncientState.G.diseases.length>0?'🤒 目下染恙：'+AncientState.G.diseases.map(d=>d.name).join('、'):'身体康泰，无需劳烦大夫'}</div>
      </div>`;
      
      // 三个新入口
      html += `<div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        <div class="venue-spot" onclick="openBodyConditioning()" style="padding:12px">
          <div class="venue-spot-name" style="font-size:13px">🍵 调理身子</div>
          <div class="venue-spot-desc" style="font-size:9px">延请大夫，强健体魄</div>
        </div>
        <div class="venue-spot" onclick="openPregnancyPrep()" style="padding:12px">
          <div class="venue-spot-name" style="font-size:13px">🌿 备孕调养</div>
          <div class="venue-spot-desc" style="font-size:9px">请大夫开方，助子嗣之事</div>
        </div>
        <div class="venue-spot" onclick="openHerbShop()" style="padding:12px">
          <div class="venue-spot-name" style="font-size:13px">🛒 购置药材</div>
          <div class="venue-spot-desc" style="font-size:9px">自行调养，效缓而持久</div>
        </div>
      </div>`;
      
      html += `<div style="font-size:10px;color:var(--muted);margin-top:12px;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">
        <div style="font-weight:600;margin-bottom:6px">坐堂大夫一览</div>
        ${AncientDiseasesData.DOCTORS.map(d=>`<div style="padding:4px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between">
          <span>${d.icon} ${d.name} <span style="color:var(--faint)">${d.desc}</span></span>
          <span style="color:var(--amber)">🪙${d.cost}文</span>
        </div>`).join('')}
      </div>`;
    } else if (loc.id === 'shopst'){
      const items = AncientShop.genYearShop();
      html += `<div class="ct" style="margin-top:0">集市杂铺 — 今岁在售商品（行囊 ${AncientState.G.inventory.length}/${AncientState.G.bagLimit} · 余钱 🪙${AncientState.G.money} 文）</div>`;
      html += `<div class="shop-grid">`;
      items.forEach(item => {
        const tooFull  = AncientState.G.inventory.length >= AncientState.G.bagLimit && !item.isGift;
        const cantAfford = AncientState.G.money < item.price;
        const canBuy = !tooFull && !cantAfford;
        html += `<div class="shop-item${canBuy?'':' sold-out'}" onclick="${canBuy?`buyItemVenue('${item.id}')`:''}" title="${tooFull?'行囊已满':cantAfford?'囊中不足':''}">
          <div class="si-icon">${item.icon}${item.isJobBook?'<span style="font-size:8px;vertical-align:top;color:var(--amber)">书</span>':item.isGift?'<span style="font-size:8px;vertical-align:top;color:var(--purple)">礼</span>':''}</div>
          <div class="si-name">${item.name}</div>
          <div class="si-desc">${item.desc}</div>
          <div class="si-price">🪙 ${item.price}文${cantAfford?' · 银钱不足':''}</div>
        </div>`;
      });
      html += `</div>`;
    } else if (loc.id === 'school') {
      const G = AncientState.G;
      const level = G.civilExamLevel || 0;
      const levelNames = ['白丁','县试','府试','院试·秀才','乡试·举人','会试·贡士','殿试·进士'];
      const nextExam   = ['县试','府试','院试','乡试','会试','殿试','——'][level];
      const intelReq   = level < 6 ? 20 + level * 10 : 0;
      const alreadyStudied = AncientActions.actionDone('studySchool');
      const alreadyExamed  = AncientActions.actionDone('civilExam');

      html += `<div style="font-size:11px;color:var(--muted);margin-bottom:12px;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">
        <div>📜 文试进度：<b>${levelNames[level]}</b>${level>=6?' 🏆 金榜题名':''}</div>
        ${level<6?`<div style="margin-top:4px">下一关：${nextExam} · 需智识 ${intelReq}（当前 ${G.intel}）</div>`:''}
        <div style="margin-top:4px">就读状态：${G.inSchool?'📖 在读':'未入学'}</div>
      </div>`;

      // 入退学按钮
      html += `<div class="venue-spot" onclick="toggleSchool(event)" style="margin-bottom:10px">
        <div class="venue-spot-name">${G.inSchool?'📚 退出学堂':'📖 叩门入学'}</div>
        <div class="venue-spot-desc">${G.inSchool?'退学后仍可保留文试进度':'束脩20文，入学后可每年备考'}</div>
      </div>`;

      // 备考按钮
      if (G.inSchool) {
        html += `<div class="venue-spot${alreadyStudied?' sold-out':''}" onclick="${alreadyStudied?'':('studyAtSchool(event)')}" style="margin-bottom:10px">
          <div class="venue-spot-name">📖 今岁备考</div>
          <div class="venue-spot-desc">${alreadyStudied?'今岁已备考，来年再读':'苦读一载，提升智识'}</div>
        </div>`;
      }

      // 下场应试按钮
      if (G.inSchool && level < 6) {
        html += `<div class="venue-spot${alreadyExamed?' sold-out':''}" onclick="${alreadyExamed?'':'openCivilExam()'}">
          <div class="venue-spot-name">✍️ 下场应试（${nextExam}）</div>
          <div class="venue-spot-desc">${alreadyExamed?'今岁已应试，来年再考':`智识需达 ${intelReq}，当前 ${G.intel}`}</div>
        </div>`;
      }

    } else if (loc.id === 'wuguan') {
      const G = AncientState.G;
      const mlevel = G.militaryExamLevel || 0;
      const mlevelNames = ['未入武试','武童试','武乡试','武会试','武殿试·授职'];
      const nextMExam   = ['武童试','武乡试','武会试','武殿试','——'][mlevel];
      const healthReq   = mlevel < 4 ? 20 + mlevel * 12 : 0;
      const alreadyTrained = AncientActions.actionDone('trainWuguan');
      const alreadyMExamed = AncientActions.actionDone('militaryExam');

      html += `<div style="font-size:11px;color:var(--muted);margin-bottom:12px;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">
        <div>⚔️ 武试进度：<b>${mlevelNames[mlevel]}</b>${mlevel>=4?' 🏆 授职入伍':''}</div>
        ${mlevel<4?`<div style="margin-top:4px">下一关：${nextMExam} · 需体魄 ${healthReq}（当前 ${G.health}）</div>`:''}
        <div style="margin-top:4px">就读状态：${G.inWuguan?'🥋 在馆':'未入馆'}</div>
      </div>`;

      // 入退馆按钮
      html += `<div class="venue-spot" onclick="toggleWuguan(event)" style="margin-bottom:10px">
        <div class="venue-spot-name">${G.inWuguan?'🥋 退出武馆':'🥋 叩门入馆'}</div>
        <div class="venue-spot-desc">${G.inWuguan?'退馆后仍可保留武试进度':'束脩20文，入馆后可每年操练'}</div>
      </div>`;

      // 操练按钮
      if (G.inWuguan) {
        html += `<div class="venue-spot${alreadyTrained?' sold-out':''}" onclick="${alreadyTrained?'':'trainAtWuguan(event)'}" style="margin-bottom:10px">
          <div class="venue-spot-name">🥋 今岁操练</div>
          <div class="venue-spot-desc">${alreadyTrained?'今岁已操练，来年再练':'挥汗如雨，强健体魄'}</div>
        </div>`;
      }

      // 下场武试按钮
      if (G.inWuguan && mlevel < 4) {
        html += `<div class="venue-spot${alreadyMExamed?' sold-out':''}" onclick="${alreadyMExamed?'':'openMilitaryExam()'}">
          <div class="venue-spot-name">⚔️ 下场武试（${nextMExam}）</div>
          <div class="venue-spot-desc">${alreadyMExamed?'今岁已应试，来年再战':`体魄需达 ${healthReq}，当前 ${G.health}`}</div>
        </div>`;
      }

    } else {
      loc.spots.forEach(spot => {
        const count = _venueSpotPeople[spot.id] || 0;
        html += `<div class="venue-spot" onclick="enterSpot('${loc.id}','${spot.id}')">
          <div class="venue-spot-name">${spot.name}</div>
          <div class="venue-spot-desc">${spot.desc}</div>
          <div class="venue-spot-people">👥 此处约有 <b>${count}</b> 人${count===0?' · 冷冷清清':count>=4?' · 热闹非凡':''}</div>
        </div>`;
      });
    }

    document.getElementById('venue-body').innerHTML = html;
    document.getElementById('venue-year-status').textContent = `⚡ 体力：${Math.round(AncientState.G.venueStamina||0)}`;
  },

  updateStaminaBar: () => {
    const st = Math.round(AncientState.G.venueStamina||0);
    const fill = document.getElementById('stamina-fill');
    const val  = document.getElementById('stamina-val');
    if (fill) fill.style.width = st+'%';
    if (val)  val.textContent  = st+'/100';
  },

  staminaCost: () => {
    return Math.round(8 + Math.max(0,(100-AncientState.G.health)/100*12));
  },

  restStamina: () => {
    const gain = 15+Math.floor(Math.random()*10);
    AncientState.G.venueStamina = Math.min(100, (AncientState.G.venueStamina||0)+gain);
    AncientState.G.mood = AncientState.clamp(AncientState.G.mood+1);
    AncientModal.showToast(`歇息片刻，养精蓄锐，精力+${gain}`);
    AncientVenue.updateStaminaBar();
    document.getElementById('venue-year-status').textContent = `⚡ 体力：${Math.round(AncientState.G.venueStamina)}`;
    AncientSave.save();
  },

  enterSpot: (venueId, spotId) => {
    const loc  = AncientEstates.LOCATIONS.find(l => l.id === venueId);
    const spot = loc && loc.spots.find(s => s.id === spotId); if (!spot) return;
    const cost = AncientVenue.staminaCost();
    if ((AncientState.G.venueStamina||0) < cost){ AncientModal.showToast(`精力不济（需${cost}），请先歇息片刻！`); return; }
    AncientState.G.venueStamina = Math.max(0, (AncientState.G.venueStamina||0)-cost);
    AncientVenue.updateStaminaBar();
    const count = _venueSpotPeople[spotId] || 0;
    if (count === 0){
      AncientModal.showToast('此处空空如也，无人可交谈，悻悻离去。');
      _venueSpotPeople[spotId] = Math.floor(Math.random()*2);
      AncientSave.save(); AncientVenue.refreshVenueBody(); return;
    }
    const person = AncientSocial.genNPC(AncientState.G.gender);
    const initFavor = 5+Math.floor(Math.random()*15);
    person.favor = initFavor; person.venue = venueId;
    AncientModal.showModal(`${spot.name} — 邂逅陌生人`,
      `${person.emoji} <b>${person.name}</b>（${person.age}岁 · ${person.gender==='male'?'男':'女'}）\n职业：${person.job} · 家境：${person.bg}\n性格：${person.trait}\n\n初见印象：${initFavor}/100`,
      [{label:'💬 主动搭话', sub:'情谊达 20 方可结交', cost:`⚡${cost}`, id:'chat'},
       {label:'🚶 擦肩而过', sub:'不互动，四处看看', cost:'', id:'skip'}],
      (id) => {
        AncientModal.closeModal();
        if (id === 'chat'){
          if (AncientSave.roll(0.35+(AncientState.G.charm/100)*0.4+(AncientState.G.intel/100)*0.2)){
            const gain = 8+Math.floor(Math.random()*12);
            person.favor = Math.min(100, initFavor+gain); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+3);
            if (person.favor >= 20){
              AncientModal.showModal(`🤝 与 ${person.name} 聊得甚欢`,
                `${person.emoji} ${person.name} 与你甚为投缘（${person.favor}/100），是否结交，纳入社交圈？`,
                [{label:'✅ 引为相识',sub:'纳入社交圈',cost:'',id:'yes'},{label:'↩ 颔首告别',sub:'',cost:'',id:'no'}],
                (id2) => {
                  AncientModal.closeModal();
                  if (id2 === 'yes'){
                    if (!AncientState.G.npcs) AncientState.G.npcs = []; if (AncientState.G.npcs.length >= 12) AncientState.G.npcs.shift();
                    AncientState.G.npcs.push(person);
                    AncientSave.addLog(`${loc.icon} 于${loc.name}·${spot.name} 邂逅 ${person.name}，相谈投机，引为相识（好感${person.favor}）。`, 'event');
                  }
                  _venueSpotPeople[spotId] = Math.max(0, count-1+Math.floor(Math.random()*2));
                  AncientSave.save(); AncientVenue.refreshVenueBody();
                });
            } else {
              AncientModal.showToast(`言谈尚佳，然情谊尚浅（${person.favor}/100），未至结交之时。`);
              _venueSpotPeople[spotId] = Math.max(0, count-1+Math.floor(Math.random()*2));
              AncientSave.save(); AncientVenue.refreshVenueBody();
            }
          } else {
            AncientState.G.mood = AncientState.clamp(AncientState.G.mood-2); AncientModal.showToast('言语不合，双方皆觉尴尬，悻悻而散。');
            _venueSpotPeople[spotId] = Math.max(0, count-1);
            AncientSave.save(); AncientVenue.refreshVenueBody();
          }
        } else {
          _venueSpotPeople[spotId] = Math.max(0, count+Math.floor((Math.random()-0.5)*2));
          AncientSave.save(); AncientVenue.refreshVenueBody();
        }
      });
  }
};

// Clinic treatment functions
window.openClinicTreatment = () => {
  const G = AncientState.G;
  if (!G.diseases || G.diseases.length === 0) {
    AncientModal.showModal('⚕️ 身体康泰', '身体康泰，并无染恙，无需延医。',
      [{ label: '甚好', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
    return;
  }
  AncientModal.showModal('⚕️ 择疾问诊', '目下身患数症，请择一诊治：',
    G.diseases.map((d, i) => ({
      label: `${d.icon} ${d.name}（${['', '轻恙', '中症', '重症', '危症'][d.level]}）`,
      sub: d.desc,
      cost: '',
      id: String(i)
    })),
    (id) => {
      AncientModal.closeModal();
      AncientVenue.openDoctorSelect(parseInt(id));
    });
};

AncientVenue.openDoctorSelect = (diseaseIdx) => {
  const G = AncientState.G;
  const d = G.diseases[diseaseIdx];
  if (!d) return;
  AncientModal.showModal(`⚕️ 延医治【${d.name}】`,
    `${d.desc}<br><br>延请坐堂大夫，诊金越丰则成效越高，然有术无术，天命尚在：`,
    AncientDiseasesData.DOCTORS.filter(doc => G.money >= doc.cost).map(doc => ({
      label: `${doc.icon} ${doc.name}`,
      sub: '约有'+Math.round(Math.min(99, Math.max(1, (d.cureBase + doc.successBonus) * 100)))+'% 把握',
      cost: `🪙${doc.cost}文`,
      id: doc.id
    })).concat(
      AncientDiseasesData.DOCTORS.filter(doc => G.money < doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}（诊金不足）`,
        sub: '',
        cost: `🪙${doc.cost}文`,
        id: '_skip_' + doc.id
      }))
    ),
    (id) => {
      AncientModal.closeModal();
      if (id.startsWith('_skip_')) return;
      AncientVenue.doTreatment(diseaseIdx, id);
    });
};

AncientVenue.doTreatment = (diseaseIdx, doctorId) => {
  const G = AncientState.G;
  const d = G.diseases[diseaseIdx];
  if (!d) return;
  const doc = AncientDiseasesData.DOCTORS.find(doc => doc.id === doctorId);
  if (!doc) return;
  if (G.money < doc.cost) {
    AncientModal.showToast('诊金不足，无法延请此大夫！');
    return;
  }
  G.money -= doc.cost;
  const successRate = d.cureBase + doc.successBonus;
  const success = AncientState.roll(successRate);
  if (success) {
    G.diseases.splice(diseaseIdx, 1);
    G.mood = AncientState.clamp(G.mood + 10);
    AncientSave.addLog(`✅ 【${doc.name}】妙手回春，【${d.name}】已愈！健康复增 +${Math.round(5 + doc.successBonus * 20)}。`, 'good');
    AncientModal.showModal('🎉 妙手回春！', `${doc.name}妙手回春！<br><br>已全然痊愈，身轻如燕。`,
      [{ label: '大夫圣手，感激不尽', sub: '', cost: '', id: 'ok' }], () => {
        AncientModal.closeModal();
        AncientSave.save();
        AncientModal.refreshVenueBody();
        AncientRender.render();
      });
  } else {
    const dmg = 3 + d.level;
    G.health = AncientState.clamp(G.health - dmg);
    G.mood = AncientState.clamp(G.mood - 5);
    AncientSave.addLog(`❌ 【${doc.name}】诊治无效，【${d.name}】未见起色，健康损耗 -${dmg}。`, 'bad');
    AncientModal.showModal('😞 药石无效', `${doc.name}尽力了，但已尽全力，然未见好转。<br><br>仍萦绕不去，令人忧虑。健康 -${dmg}`,
      [{ label: '再寻良医', sub: '', cost: '', id: 'ok' }], () => {
        AncientModal.closeModal();
        AncientSave.save();
        AncientModal.refreshVenueBody();
        AncientRender.render();
      });
  }
};

// ========== 调理身子 ==========
window.openBodyConditioning = () => {
  const G = AncientState.G;
  const key = 'bodyConditioning';
  const done = AncientActions.actionDone(key);
  
  // 入口拦截：每年仅限一次
  if (done) {
    AncientModal.showModal('🍵 延请大夫调理',
      '今岁已延请大夫调理过，来年方可再诊。',
      [{label:'知晓', sub:'', cost:'', id:'ok'}],
      () => AncientModal.closeModal()
    );
    return;
  }
  
  // 随机大夫（调理身子专用）
  const doctors = [
    {emoji:'👨‍⚕️', name:'王大夫', desc:'老夫行医三十载，固本培元，手到擒来。'},
    {emoji:'👴', name:'陈郎中', desc:'食补药补，双管齐下，包你强健。'},
    {emoji:'👨', name:'李大夫', desc:'温补为主，循序渐进，切勿操之过急。'},
    {emoji:'👩‍⚕️', name:'吴大夫', desc:'药膳同补，以柔克刚，徐徐图之。'},
    {emoji:'👴', name:'胡郎中', desc:'调和气血为要，此事急不得，慢慢来。'}
  ];
  const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
  const cost = 30;
  const healthGain = Math.floor(Math.random() * 8) + 10; // 10-17
  
  AncientModal.showModal('🍵 延请大夫调理',
    `大夫为你望闻问切，细细诊察，<br>开具调理方子，以药膳食补固本培元。<br><br>今岁已可调理一次，来年方可再诊。<br><br>${randomDoc.emoji} ${randomDoc.name}：「${randomDoc.desc}」`,
    [
      {label:'✅ 延请调理', sub:'强健体魄', cost:`${cost}文`, id:'yes'},
      {label:'↩ 改日再说', sub:'', cost:'', id:'no'}
    ],
    (id) => {
      AncientModal.closeModal();
      if (id === 'yes') {
        if (G.money < cost) {
          AncientModal.showToast('银钱不足！');
          return;
        }
        G.money -= cost;
        G.health = AncientState.clamp(G.health + healthGain);
        AncientActions.markAction(key);
        AncientSave.addLog(`🍵 延医调理身子，花费${cost}文，健康 +${healthGain}。`, 'good');
        AncientModal.showModal('🍵 调理有成',
          `${randomDoc.emoji} ${randomDoc.name} 为你把脉开方，<br>药膳调理数日，身子骨果然硬朗了许多。<br><br>健康 +${healthGain}`,
          [{label:'多谢大夫', sub:'', cost:'', id:'ok'}],
          () => {
            AncientModal.closeModal();
            AncientSave.save();
            AncientRender.render();
          }
        );
      }
    }
  );
};

// ========== 备孕调养 ==========
window.openPregnancyPrep = () => {
  const G = AncientState.G;
  const key = 'pregnancyPrep';
  const done = AncientActions.actionDone(key);
  
  // 入口拦截：每年仅限一次
  if (done) {
    AncientModal.showModal('🌿 备孕调养',
      '今岁已延请大夫调养过，来年方可再诊。',
      [{label:'知晓', sub:'', cost:'', id:'ok'}],
      () => AncientModal.closeModal()
    );
    return;
  }
  
  // 第一步：选择对象（配偶、妾室、外室）
  const targets = [];
  
  // 配偶
  if (G.married && G.spouseName) {
    targets.push({
      name: G.spouseName,
      relation: '配偶',
      isSpouse: true
    });
  }
  
  // 妾室
  if (G.concubines && G.concubines.length > 0) {
    G.concubines.forEach(c => {
      targets.push({
        name: c.name,
        relation: '妾室',
        isSpouse: false
      });
    });
  }
  
  // 外室
  if (G.lovers && G.lovers.length > 0) {
    G.lovers.forEach(l => {
      targets.push({
        name: l.name,
        relation: '外室',
        isSpouse: false
      });
    });
  }
  
  // 无对象拦截
  if (targets.length === 0) {
    AncientModal.showModal('🌿 大夫环顾四周',
      '大夫环顾一圈，迟疑开口：<br><br>「敢问……府中可有妻妾？<br>无人备孕，老朽怕是帮不上忙了。」',
      [{label:'↩ 讪讪离去', sub:'', cost:'', id:'ok'}],
      () => AncientModal.closeModal()
    );
    return;
  }
  
  // 显示选择对象弹窗
  AncientModal.showModal('🌿 备孕调养',
    '请问此番调养，是为何人？',
    targets.map((t, i) => ({
      label: `${t.name}（${t.relation}）`,
      sub: '',
      cost: '',
      id: String(i)
    })),
    (id) => {
      AncientModal.closeModal();
      const selected = targets[parseInt(id)];
      
      // 第二步：年龄拦截（≥50 岁）
      // 模拟年龄：玩家年龄 ± 随机波动
      const targetAge = G.age + Math.floor(Math.random() * 5) - 2;
      
      if (targetAge >= 50) {
        AncientModal.showModal('🌿 大夫摇头叹息',
          `大夫为 ${selected.name} 把脉良久，<br>缓缓放下手，叹了口气。<br><br>「${selected.name}已年过半百，天癸已竭，<br>此事……非药石所能及为力也。<br><br>老朽也爱莫能助，还请宽心。」`,
          [{label:'↩ 怅然离去', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      // 第三步：同性婚姻拦截
      if (selected.isSpouse && G.spouseGender === G.gender) {
        AncientModal.showModal('🌿 大夫欲言又止',
          '大夫斟酌再三，欲言又止，<br>最终只是轻轻摇了摇头。<br><br>「二位……恕老朽无能为力。」',
          [{label:'↩ 默默离去', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      // 第四步：主弹窗（通过所有拦截后）
      const doctors = [
        {emoji:'👩‍⚕️', name:'稳婆张氏', desc:'老身见过的生育之事，没有一千也有八百。'},
        {emoji:'👴', name:'胡郎中', desc:'调和气血为要，此事急不得，慢慢来。'},
        {emoji:'👨‍⚕️', name:'孙大夫', desc:'男女双补，阴阳调和，自然水到渠成。'},
        {emoji:'👩', name:'林大夫', desc:'气血为本，补足根基，缘分自会到来。'},
        {emoji:'👨', name:'钱郎中', desc:'老朽祖传秘方，十人用过九人有喜，且安心。'}
      ];
      const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
      const cost = 50;
      
      AncientModal.showModal('🌿 请大夫调养备孕',
        `大夫细细问诊，为 ${selected.name} 开具方子，<br>以药补气血、调阴阳，以助子嗣缘分。<br><br>今岁已可调养一次，来年方可再诊。<br>效验如何，尚需天命眷顾。<br><br>${randomDoc.emoji} ${randomDoc.name}：「${randomDoc.desc}」`,
        [
          {label:'✅ 延请调养', sub:'助子嗣之事', cost:`${cost}文`, id:'yes'},
          {label:'↩ 时机未到', sub:'', cost:'', id:'no'}
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'yes') {
            if (G.money < cost) {
              AncientModal.showToast('银钱不足！');
              return;
            }
            G.money -= cost;
            AncientActions.markAction(key);
            // 设置备孕状态（本年生育概率提升 15%）
            G._pregnancyBoostDoctor = true;
            AncientSave.addLog(`🌿 延医调养备孕（${selected.name}），花费${cost}文，本年生育概率提升。`, 'good');
            AncientModal.showModal('🌿 调养有方',
              `${randomDoc.emoji} ${randomDoc.name} 望闻问切，<br>细细开具了一份调养方子。<br><br>「气血调和，自有缘分，切勿心急。」<br><br>${selected.name} 本年生育概率提升，效验一年。`,
              [{label:'承蒙大夫吉言', sub:'', cost:'', id:'ok'}],
              () => {
                AncientModal.closeModal();
                AncientSave.save();
                AncientRender.render();
              }
            );
          }
        }
      );
    }
  );
};

// ========== 购置药材 ==========
window.openHerbShop = () => {
  const G = AncientState.G;
  
  // 从 items.js 获取商品
  const herbPack = AncientItems.SHOP_ITEMS_POOL.find(i => i.id === 'herb_pack');
  const fertilitySachet = AncientItems.SHOP_ITEMS_POOL.find(i => i.id === 'fertility_sachet');
  
  const items = [herbPack, fertilitySachet];
  
  let html = `<div class="ct" style="margin-top:0">医馆药材铺 — 药材与奇物（行囊 ${G.inventory.length}/${G.bagLimit} · 余钱 🪙${G.money} 文）</div>`;
  html += `<div class="shop-grid">`;
  
  items.forEach(item => {
    const tooFull  = G.inventory.length >= G.bagLimit;
    const cantAfford = G.money < item.price;
    const canBuy = !tooFull && !cantAfford;
    
    html += `<div class="shop-item${canBuy?'':' sold-out'}" onclick="${canBuy?`buyVenueItem('${item.id}')`:''}" title="${tooFull?'行囊已满':cantAfford?'囊中不足':''}">
      <div class="si-icon">${item.icon}</div>
      <div class="si-name">${item.name}</div>
      <div class="si-desc">${item.desc}</div>
      <div class="si-price">🪙 ${item.price}文${cantAfford?' · 银钱不足':''}</div>
    </div>`;
  });
  
  html += `</div>`;
  
  AncientModal.showModal('🛒 购置药材', html,
    [{label:'↩ 离去', sub:'', cost:'', id:'close'}],
    () => AncientModal.closeModal()
  );
};

// 购买医馆物品
window.buyVenueItem = (itemId) => {
  const G = AncientState.G;
  
  // 从 items.js 获取商品数据
  const itemData = AncientItems.SHOP_ITEMS_POOL.find(i => i.id === itemId);
  if (!itemData) return;
  
  if (G.money < itemData.price) {
    AncientModal.showToast('银钱不足！');
    return;
  }
  
  G.money -= itemData.price;
  
  // 创建可使用的物品
  const item = {
    id: itemData.id,
    name: itemData.name,
    icon: itemData.icon,
    desc: itemData.desc,
    isUseable: true
  };
  
  G.inventory.push(item);
  AncientSave.addLog(`🛒 购置${itemData.name}，花费${itemData.price}文。`, 'event');
  AncientModal.showToast('购置成功！');
  AncientVenue.refreshVenueBody('clinic');
  AncientSave.save();
};

// 使用催子香囊
window.useFertilitySachet = (idx) => {
  const G = AncientState.G;
  const item = G.inventory[idx];
  
  // 第一步：选择对象（配偶、妾室、外室）
  const targets = [];
  
  // 配偶
  if (G.married && G.spouseName) {
    targets.push({
      name: G.spouseName,
      relation: '配偶',
      isSpouse: true
    });
  }
  
  // 妾室
  if (G.concubines && G.concubines.length > 0) {
    G.concubines.forEach(c => {
      targets.push({
        name: c.name,
        relation: '妾室',
        isSpouse: false
      });
    });
  }
  
  // 外室
  if (G.lovers && G.lovers.length > 0) {
    G.lovers.forEach(l => {
      targets.push({
        name: l.name,
        relation: '外室',
        isSpouse: false
      });
    });
  }
  
  // 无对象拦截
  if (targets.length === 0) {
    AncientModal.showModal('🌸 取出催子香囊',
      '拿着香囊想了想，<br>府中竟无一人可赠……<br><br>「孤家寡人，要这香囊何用？」<br><br>默默收回行囊。',
      [{label:'↩ 收回行囊', sub:'', cost:'', id:'ok'}],
      () => AncientModal.closeModal()
    );
    return;
  }
  
  // 显示选择对象弹窗
  AncientModal.showModal('🌸 取出催子香囊',
    '此香囊欲赠何人？',
    targets.map((t, i) => ({
      label: `${t.name}（${t.relation}）`,
      sub: '',
      cost: '',
      id: String(i)
    })),
    (id) => {
      AncientModal.closeModal();
      const selected = targets[parseInt(id)];
      
      // 第二步：年龄拦截（≥50 岁）
      const targetAge = G.age + Math.floor(Math.random() * 5) - 2;
      
      if (targetAge >= 50) {
        AncientModal.showModal('🌸 时机已过',
          `拿着香囊想了想，<br>${selected.name} 已年过半百……<br><br>这香囊怕是派不上用场了。`,
          [{label:'↩ 收回行囊', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      // 第三步：同性婚姻拦截
      if (selected.isSpouse && G.spouseGender === G.gender) {
        AncientModal.showModal('🌸 香囊悬在手中',
          `拿着香囊端详半晌，<br>又看了看 ${selected.name}……<br><br>忽然觉得有些多余。<br><br>默默收回行囊。`,
          [{label:'↩ 收回行囊', sub:'', cost:'', id:'ok'}],
          () => AncientModal.closeModal()
        );
        return;
      }
      
      // 通过所有拦截，显示使用弹窗
      AncientModal.showModal('🌸 取出催子香囊',
        `将香囊悬于 ${selected.name} 床头，药香幽幽，<br>据说如此这般，子嗣缘分便会近上几分。<br><br>至于灵验与否……<br>世人皆说有用，信则有，不信则无。`,
        [
          {label:'✅ 悬于床头', sub:'使用', cost:'', id:'use'},
          {label:'↩ 放回行囊', sub:'', cost:'', id:'cancel'}
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'use') {
            G.inventory.splice(idx, 1);
            G._pregnancyBoostSachetCount = (G._pregnancyBoostSachetCount || 0) + 1;  // 香囊使用数量 +1
            AncientSave.addLog(`🌸 悬催子香囊于 ${selected.name} 床头，愿老天开眼。`, 'event');
            AncientModal.showToast('香囊已悬好，愿老天开眼。');
            AncientSave.save();
            AncientRender.render();
          }
        }
      );
    }
  );
};

window.AncientVenue = AncientVenue;
window.openVenue = AncientVenue.openVenue;
window.closeVenue = AncientVenue.closeVenue;
window.refreshVenueBody = AncientVenue.refreshVenueBody;
window.updateStaminaBar = AncientVenue.updateStaminaBar;
window.staminaCost = AncientVenue.staminaCost;
window.restStamina = AncientVenue.restStamina;
window.enterSpot = AncientVenue.enterSpot;
