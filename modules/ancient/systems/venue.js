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
        <div class="venue-spot-name">⚕️ 就诊问诊</div>
        <div class="venue-spot-desc">请大夫诊治疾病，选择不同级别大夫影响成功率。</div>
        <div class="venue-spot-people" style="color:var(--red)">${AncientState.G.diseases&&AncientState.G.diseases.length>0?'🤒 当前患病：'+AncientState.G.diseases.map(d=>d.name).join('、'):'身体无恙，无需就诊'}</div>
      </div>`;
      html += `<div style="font-size:10px;color:var(--muted);margin-top:12px;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">
        <div style="font-weight:600;margin-bottom:6px">大夫一览</div>
        ${AncientDiseasesData.DOCTORS.map(d=>`<div style="padding:4px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between">
          <span>${d.icon} ${d.name} <span style="color:var(--faint)">${d.desc}</span></span>
          <span style="color:var(--amber)">🪙${d.cost}文</span>
        </div>`).join('')}
      </div>`;
    } else if (loc.id === 'shopst'){
      const items = AncientShop.genYearShop();
      html += `<div class="ct" style="margin-top:0">杂货铺 — 今年在售商品（包裹 ${AncientState.G.inventory.length}/${AncientState.G.bagLimit} · 余钱 🪙${AncientState.G.money}文）</div>`;
      html += `<div class="shop-grid">`;
      items.forEach(item => {
        const tooFull  = AncientState.G.inventory.length >= AncientState.G.bagLimit && !item.isGift;
        const cantAfford = AncientState.G.money < item.price;
        const canBuy = !tooFull && !cantAfford;
        html += `<div class="shop-item${canBuy?'':' sold-out'}" onclick="${canBuy?`buyItemVenue('${item.id}')`:''}" title="${tooFull?'包裹已满':cantAfford?'钱不够':''}">
          <div class="si-icon">${item.icon}${item.isJobBook?'<span style="font-size:8px;vertical-align:top;color:var(--amber)">书</span>':item.isGift?'<span style="font-size:8px;vertical-align:top;color:var(--purple)">礼</span>':''}</div>
          <div class="si-name">${item.name}</div>
          <div class="si-desc">${item.desc}</div>
          <div class="si-price">🪙 ${item.price}文${cantAfford?' · 钱不够':''}</div>
        </div>`;
      });
      html += `</div>`;
    } else {
      loc.spots.forEach(spot => {
        const count = _venueSpotPeople[spot.id] || 0;
        html += `<div class="venue-spot" onclick="enterSpot('${loc.id}','${spot.id}')">
          <div class="venue-spot-name">${spot.name}</div>
          <div class="venue-spot-desc">${spot.desc}</div>
          <div class="venue-spot-people">👥 当前有 <b>${count}</b> 人${count===0?' · 空无一人':count>=4?' · 人气鼎盛':''}</div>
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
    AncientModal.showToast(`歇息片刻，体力+${gain}`);
    AncientVenue.updateStaminaBar();
    document.getElementById('venue-year-status').textContent = `⚡ 体力：${Math.round(AncientState.G.venueStamina)}`;
    AncientSave.save();
  },

  enterSpot: (venueId, spotId) => {
    const loc  = AncientEstates.LOCATIONS.find(l => l.id === venueId);
    const spot = loc && loc.spots.find(s => s.id === spotId); if (!spot) return;
    const cost = AncientVenue.staminaCost();
    if ((AncientState.G.venueStamina||0) < cost){ AncientModal.showToast(`体力不足（需${cost}），请先休息！`); return; }
    AncientState.G.venueStamina = Math.max(0, (AncientState.G.venueStamina||0)-cost);
    AncientVenue.updateStaminaBar();
    const count = _venueSpotPeople[spotId] || 0;
    if (count === 0){
      AncientModal.showToast('这里没有人，转身离开。');
      _venueSpotPeople[spotId] = Math.floor(Math.random()*2);
      AncientSave.save(); AncientVenue.refreshVenueBody(); return;
    }
    const person = AncientSocial.genNPC(AncientState.G.gender);
    const initFavor = 5+Math.floor(Math.random()*15);
    person.favor = initFavor; person.venue = venueId;
    AncientModal.showModal(`${spot.name} — 遇到了陌生人`,
      `${person.emoji} <b>${person.name}</b>（${person.age}岁 · ${person.gender==='male'?'男':'女'}）\n职业：${person.job} · 家境：${person.bg}\n性格：${person.trait}\n\n初始好感：${initFavor}/100`,
      [{label:'💬 搭话聊天', sub:'好感达 20 可选择结交', cost:`⚡${cost}`, id:'chat'},
       {label:'🚶 无视继续逛', sub:'不互动，四处看看', cost:'', id:'skip'}],
      (id) => {
        AncientModal.closeModal();
        if (id === 'chat'){
          if (AncientSave.roll(0.35+(AncientState.G.charm/100)*0.4+(AncientState.G.intel/100)*0.2)){
            const gain = 8+Math.floor(Math.random()*12);
            person.favor = Math.min(100, initFavor+gain); AncientState.G.mood = AncientState.clamp(AncientState.G.mood+3);
            if (person.favor >= 20){
              AncientModal.showModal(`🤝 与 ${person.name} 聊得甚欢`,
                `${person.emoji} ${person.name} 对你颇有好感（${person.favor}/100）。\n\n是否结交，加入社交圈？`,
                [{label:'✅ 结交为友',sub:'加入社交圈',cost:'',id:'yes'},{label:'↩ 点头道别',sub:'',cost:'',id:'no'}],
                (id2) => {
                  AncientModal.closeModal();
                  if (id2 === 'yes'){
                    if (!AncientState.G.npcs) AncientState.G.npcs = []; if (AncientState.G.npcs.length >= 12) AncientState.G.npcs.shift();
                    AncientState.G.npcs.push(person);
                    AncientSave.addLog(`${loc.icon} 在${loc.name}·${spot.name} 结识了 ${person.name}（好感${person.favor}）。`, 'event');
                  }
                  _venueSpotPeople[spotId] = Math.max(0, count-1+Math.floor(Math.random()*2));
                  AncientSave.save(); AncientVenue.refreshVenueBody();
                });
            } else {
              AncientModal.showToast(`聊得不错，好感${person.favor}，仍未到结交门槛（20）。`);
              _venueSpotPeople[spotId] = Math.max(0, count-1+Math.floor(Math.random()*2));
              AncientSave.save(); AncientVenue.refreshVenueBody();
            }
          } else {
            AncientState.G.mood = AncientState.clamp(AncientState.G.mood-2); AncientModal.showToast('话不投机，颇为尴尬。');
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
    AncientModal.showModal('⚕️ 身体无恙', '你目前没有任何疾病，无需治疗。',
      [{ label: '好的', sub: '', cost: '', id: 'ok' }], () => AncientModal.closeModal());
    return;
  }
  AncientModal.showModal('⚕️ 选择要治疗的疾病', '你目前患有：',
    G.diseases.map((d, i) => ({
      label: `${d.icon} ${d.name}（${['', '轻症', '中症', '重症', '危症'][d.level]}）`,
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
  AncientModal.showModal(`⚕️ 治疗【${d.name}】`,
    `${d.desc}\n\n选择大夫（越贵成功率越高，最低成功率 1%，最低失败率 1%）：`,
    AncientDiseasesData.DOCTORS.filter(doc => G.money >= doc.cost).map(doc => ({
      label: `${doc.icon} ${doc.name}`,
      sub: '成功率约' + Math.round(Math.min(99, Math.max(1, (d.cureBase + doc.successBonus) * 100))) + '%',
      cost: `🪙${doc.cost}文`,
      id: doc.id
    })).concat(
      AncientDiseasesData.DOCTORS.filter(doc => G.money < doc.cost).map(doc => ({
        label: `${doc.icon} ${doc.name}（钱不够）`,
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
    AncientModal.showToast('钱不够！');
    return;
  }
  G.money -= doc.cost;
  const successRate = d.cureBase + doc.successBonus;
  const success = AncientState.roll(successRate);
  if (success) {
    G.diseases.splice(diseaseIdx, 1);
    G.mood = AncientState.clamp(G.mood + 10);
    AncientSave.addLog(`⚕️ ${doc.name}妙手回春，【${d.name}】痊愈！花费${doc.cost}文。`, 'good');
    AncientModal.showModal('🎉 治疗成功', `${doc.name}妙手回春，【${d.name}】痊愈！\n花费：${doc.cost}文\n心情 +10`,
      [{ label: '感谢大夫', sub: '', cost: '', id: 'ok' }], () => {
        AncientModal.closeModal();
        AncientSave.save();
        AncientModal.refreshVenueBody();
        AncientRender.render();
      });
  } else {
    G.mood = AncientState.clamp(G.mood - 5);
    AncientSave.addLog(`😞 ${doc.name}诊治失败，【${d.name}】未见好转。`, 'bad');
    AncientModal.showModal('😞 治疗失败', `${doc.name}尽力了，但【${d.name}】未见好转。\n花费：${doc.cost}文\n心情 -5`,
      [{ label: '唉', sub: '', cost: '', id: 'ok' }], () => {
        AncientModal.closeModal();
        AncientSave.save();
        AncientModal.refreshVenueBody();
        AncientRender.render();
      });
  }
};

window.AncientVenue = AncientVenue;
window.openVenue = AncientVenue.openVenue;
window.closeVenue = AncientVenue.closeVenue;
window.refreshVenueBody = AncientVenue.refreshVenueBody;
window.updateStaminaBar = AncientVenue.updateStaminaBar;
window.staminaCost = AncientVenue.staminaCost;
window.restStamina = AncientVenue.restStamina;
window.enterSpot = AncientVenue.enterSpot;
