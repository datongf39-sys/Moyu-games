// ============================================================
// systems/innplay.js — 客栈专属经营玩法
// 依赖：AncientInnData, AncientState, AncientModal,
//       AncientSave, AncientRender
// ============================================================

const AncientInnPlay = (() => {

  // ── 工具 ──────────────────────────────────────────────────
  const _clamp   = (v, min=0, max=100) => Math.max(min, Math.min(max, v));
  const _pick    = arr => arr[Math.floor(Math.random() * arr.length)];
  const _randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  // ── 客栈数据初始化 ────────────────────────────────────────
  const _init = (estate) => {
    if (estate.inn) return;
    estate.inn = {
      reputation:    20,    // 声誉（影响客流与收费）
      complaints:    0,     // 本年投诉次数
      shutdown:      false, // 本年是否被关店调查
      _yearOpened:   false, // 本年是否已安排入住

      managed:       false,
      managerName:   null,

      // 楼层解锁状态
      floors: { 1: true, 2: false, 3: false },

      // 已购置房间列表：[{ roomId, type, decor:[], roomLabel }]
      rooms: [
        { roomId: 'r1', type: 'ren', decor: [], roomLabel: '人字壹号' },
      ],

      // 已解锁公共设施 id 列表
      facilities: [],

      // 待年末结算收入
      _pendingIncome: 0,
    };
  };

  const _get = (estateIdx) => {
    const e = AncientState.G.estates[estateIdx];
    _init(e);
    return { estate: e, inn: e.inn };
  };

  // ── 可住人房间总数 ────────────────────────────────────────
  const _totalRooms = (inn) => inn.rooms.length;

  // ── 计算某房间的满意度基础分 ─────────────────────────────
  // 房间本身分（由装饰决定）+ 公共设施加成
  const _roomSatisfy = (room, inn) => {
    const D = AncientInnData;
    const roomType = D.ROOM_TYPES.find(r => r.id === room.type);
    if (!roomType) return 50;

    // 装饰加成：找对应等级的装饰数据
    const decorPool = D['DECOR_' + room.type.toUpperCase()];
    let decorBonus = 0;
    if (decorPool) {
      room.decor.forEach(did => {
        const d = decorPool.find(x => x.id === did);
        if (d) decorBonus += d.satisfyBonus;
      });
    }

    // 公共设施加成
    let facBonus = 0;
    inn.facilities.forEach(fid => {
      const f = D.FACILITIES.find(x => x.id === fid);
      if (f) facBonus += f.satisfyBonus;
    });

    // 基础满意度：房间等级 * 15 + 装饰 + 设施
    const base = roomType.tier * 15 + decorBonus + facBonus;
    return _clamp(base, 0, 120);
  };

  // ── 主管理入口 ────────────────────────────────────────────
  const openManageModal = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);

    if (inn.managed) {
      _managedMenu(estateIdx);
      return;
    }

    const totalRooms = _totalRooms(inn);
    const unlockedFloors = Object.entries(inn.floors)
      .filter(([, v]) => v).map(([k]) => `${k}楼`).join('、');

    AncientModal.showModal(
      `🏯 【${estate.name}】客栈管理`,
      `声誉：<b>${inn.reputation}</b>　已解锁楼层：<b>${unlockedFloors}</b><br>` +
      `房间共 <b>${totalRooms}</b> 间　公共设施：<b>${inn.facilities.length}</b> 处<br>` +
      `本年投诉：<b style="color:${inn.complaints>=2?'var(--red)':'inherit'}">${inn.complaints}</b> 次` +
      (inn.shutdown ? '　<b style="color:var(--red)">⚠️ 本年停业整顿中</b>' : ''),
      [
        { label:'🛖 购置新房间',   sub:'扩建客房，增加容客量',          cost:'', id:'buy_room'   },
        { label:'🏗 解锁新楼层',   sub:'开放二楼天字、三楼豪间',        cost:'', id:'unlock_floor'},
        { label:'🎨 装修布置',     sub:'为房间添置装饰，提升满意度',     cost:'', id:'decor'      },
        { label:'🏛 建设公共设施', sub:'澡堂、花园等提升整体口碑',       cost:'', id:'facility'   },
        { label:'🏮 开门迎客',     sub: inn._yearOpened?'今年已安排入住':'安排本年旅客入住', cost:'', id:'open' },
        { label:'🗂 委托托管',     sub:'掌柜代营，抽成30%',              cost:'', id:'manage'   },
        { label:'📊 客栈状况',     sub:'查看声誉、设施与房间详情',        cost:'', id:'status'    },
        { label:'🏠 立契出售',     sub:`得 ${Math.floor(estate.price*0.6)} 文`, cost:'', id:'sell', style:'red' },
      ],
      (id) => {
        AncientModal.closeModal();
        if      (id==='buy_room')    _doBuyRoom(estateIdx);
        else if (id==='unlock_floor')_doUnlockFloor(estateIdx);
        else if (id==='decor')       _doDecor(estateIdx);
        else if (id==='facility')    _doFacility(estateIdx);
        else if (id==='open')        _doOpen(estateIdx);
        else if (id==='manage')      _doManagedOn(estateIdx);
        else if (id==='status')      _doStatus(estateIdx);
        else if (id==='sell')        AncientEstate.sellEstate(estateIdx);
      }
    );
  };

  // ── 购置新房间 ────────────────────────────────────────────
  const _doBuyRoom = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;

    const opts = D.ROOM_TYPES
      .filter(rt => inn.floors[rt.floor])  // 该楼层已解锁才可购置
      .map(rt => {
        const count = inn.rooms.filter(r => r.type === rt.id).length;
        return {
          label: `${rt.icon} ${rt.name}`,
          sub:   `${rt.desc}　当前 ${count} 间　每晚 ${rt.pricePerNight} 文`,
          cost:  `${rt.unlockCost} 文`,
          id:    rt.id,
        };
      });

    if (opts.length === 0) {
      AncientModal.showToast('请先解锁更高楼层！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    AncientModal.showModal(
      '🛖 购置新房间',
      `余钱：<b>${AncientState.G.money} 文</b>。购置房间可增加每年接待旅客数量上限。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        const rt = D.ROOM_TYPES.find(r => r.id === id);
        if (!rt) return;
        if (AncientState.G.money < rt.unlockCost) {
          AncientModal.showToast('囊中羞涩，购置不起！');
          return;
        }
        AncientState.G.money -= rt.unlockCost;
        // 生成房间编号
        const existCount = inn.rooms.filter(r => r.type === id).length + 1;
        const labelMap = { ren:'人字', di:'地字', tian:'天字' };
        const numChinese = ['壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
        const label = `${labelMap[id]}${numChinese[existCount-1]||existCount}号`;
        inn.rooms.push({ roomId: `r_${Date.now()}`, type: id, decor: [], roomLabel: label });
        AncientSave.addLog(`🛖 购置 ${rt.icon}${rt.name}「${label}」，花费 ${rt.unlockCost} 文。`, 'info');
        AncientSave.save();
        AncientModal.showToast(`「${label}」已建好！`);
        setTimeout(() => openManageModal(estateIdx), 200);
      },
      () => setTimeout(() => openManageModal(estateIdx), 200)
    );
  };

  // ── 解锁楼层 ──────────────────────────────────────────────
  const _doUnlockFloor = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;

    const locked = D.FLOORS.filter(f => !inn.floors[f.id] && f.unlockCost > 0);

    if (locked.length === 0) {
      AncientModal.showToast('所有楼层均已解锁！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    // 按顺序只允许解锁下一层（需先解锁二楼才能解锁三楼）
    const nextFloor = locked.sort((a,b)=>a.id-b.id)[0];
    const prevFloorUnlocked = inn.floors[nextFloor.id - 1];
    if (!prevFloorUnlocked) {
      AncientModal.showToast('须先解锁上一层楼！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    AncientModal.showModal(
      `🏗 解锁${nextFloor.name}`,
      `解锁${nextFloor.name}后，可购置该层新房型及设施。<br>余钱：<b>${AncientState.G.money} 文</b>`,
      [{ label:`✅ 花费 ${nextFloor.unlockCost} 文，解锁${nextFloor.name}`, sub:'', cost:`${nextFloor.unlockCost} 文`, id:'yes' }],
      (id) => {
        AncientModal.closeModal();
        if (id !== 'yes') return;
        if (AncientState.G.money < nextFloor.unlockCost) {
          AncientModal.showToast('钱财不足，无法解锁！');
          return;
        }
        AncientState.G.money -= nextFloor.unlockCost;
        inn.floors[nextFloor.id] = true;
        AncientSave.addLog(`🏗 解锁${nextFloor.name}，花费 ${nextFloor.unlockCost} 文。`, 'good');
        AncientSave.save();
        AncientModal.showToast(`${nextFloor.name}已解锁！`);
        setTimeout(() => openManageModal(estateIdx), 200);
      },
      () => setTimeout(() => openManageModal(estateIdx), 200)
    );
  };

  // ── 装修布置 ──────────────────────────────────────────────
  const _doDecor = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);

    // 先选房间
    const roomOpts = inn.rooms.map(r => {
      const D = AncientInnData;
      const rt = D.ROOM_TYPES.find(x => x.id === r.type);
      const decorPool = D['DECOR_' + r.type.toUpperCase()] || [];
      const maxSlots = rt ? rt.maxDecorSlots : 3;
      return {
        label: `${rt ? rt.icon : '🏮'} ${r.roomLabel}`,
        sub:   `已有装饰 ${r.decor.length}/${maxSlots} 件　满意度基础 ${_roomSatisfy(r, inn)}`,
        cost:  '',
        id:    r.roomId,
      };
    });

    AncientModal.showModal(
      '🎨 装修布置 — 选择房间',
      '选择要布置装饰的房间：',
      roomOpts,
      (rid) => {
        AncientModal.closeModal();
        const room = inn.rooms.find(r => r.roomId === rid);
        if (!room) return;
        setTimeout(() => _doDecorRoom(estateIdx, room), 200);
      },
      () => setTimeout(() => openManageModal(estateIdx), 200)
    );
  };

  const _doDecorRoom = (estateIdx, room) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;
    const rt = D.ROOM_TYPES.find(x => x.id === room.type);
    const decorPool = D['DECOR_' + room.type.toUpperCase()] || [];
    const maxSlots = rt ? rt.maxDecorSlots : 3;

    const available = decorPool.filter(d => !room.decor.includes(d.id));

    if (available.length === 0) {
      AncientModal.showToast('此房间的装饰已全部置办齐全！');
      setTimeout(() => _doDecor(estateIdx), 200);
      return;
    }

    if (room.decor.length >= maxSlots) {
      AncientModal.showToast(`「${room.roomLabel}」装饰槽位已满（${maxSlots}件），无法再添置。`);
      setTimeout(() => _doDecor(estateIdx), 200);
      return;
    }

    const opts = available.map(d => ({
      label: `${d.icon} ${d.name}`,
      sub:   `${d.desc}　满意度 +${d.satisfyBonus}`,
      cost:  `${d.cost} 文`,
      id:    d.id,
    }));

    AncientModal.showModal(
      `🎨 布置「${room.roomLabel}」`,
      `当前满意度：<b>${_roomSatisfy(room, inn)}</b>　槽位 ${room.decor.length}/${maxSlots}<br>` +
      `余钱：<b>${AncientState.G.money} 文</b>`,
      opts,
      (did) => {
        AncientModal.closeModal();
        const decor = decorPool.find(d => d.id === did);
        if (!decor) return;
        if (AncientState.G.money < decor.cost) {
          AncientModal.showToast('钱财不足，买不起！');
          return;
        }
        AncientState.G.money -= decor.cost;
        room.decor.push(decor.id);
        AncientSave.addLog(
          `🎨 为「${room.roomLabel}」添置 ${decor.icon}${decor.name}，花费 ${decor.cost} 文。满意度 +${decor.satisfyBonus}。`,
          'info'
        );
        AncientSave.save();
        AncientModal.showToast(`${decor.icon}${decor.name} 已置办妥当！`);
        setTimeout(() => _doDecorRoom(estateIdx, room), 200);
      },
      () => setTimeout(() => _doDecor(estateIdx), 200)
    );
  };

  // ── 建设公共设施 ──────────────────────────────────────────
  const _doFacility = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;

    const available = D.FACILITIES.filter(f =>
      inn.floors[f.floor] && !inn.facilities.includes(f.id)
    );

    if (available.length === 0) {
      AncientModal.showToast('目前可建设施均已建成，或尚未解锁对应楼层！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    const opts = available.map(f => ({
      label: `${f.icon} ${f.name}`,
      sub:   `${f.desc}　所有客人满意度 +${f.satisfyBonus}`,
      cost:  `${f.unlockCost} 文`,
      id:    f.id,
    }));

    AncientModal.showModal(
      '🏛 建设公共设施',
      `余钱：<b>${AncientState.G.money} 文</b>。公共设施对所有入住客人均有满意度加成。`,
      opts,
      (fid) => {
        AncientModal.closeModal();
        const fac = D.FACILITIES.find(f => f.id === fid);
        if (!fac) return;
        if (AncientState.G.money < fac.unlockCost) {
          AncientModal.showToast('钱财不足，建不起！');
          return;
        }
        AncientState.G.money -= fac.unlockCost;
        inn.facilities.push(fac.id);
        AncientSave.addLog(
          `🏛 建成 ${fac.icon}${fac.name}，花费 ${fac.unlockCost} 文。所有客房满意度 +${fac.satisfyBonus}。`,
          'good'
        );
        AncientSave.save();
        AncientModal.showToast(`${fac.icon}${fac.name} 已建成！`);
        setTimeout(() => openManageModal(estateIdx), 200);
      },
      () => setTimeout(() => openManageModal(estateIdx), 200)
    );
  };

  // ── 开门迎客（核心玩法） ──────────────────────────────────
  const _doOpen = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);

    if (inn._yearOpened) {
      AncientModal.showToast('今年已安排过旅客入住，明年再来！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    if (inn.shutdown) {
      AncientModal.showToast('本年停业整顿中，无法接客！');
      setTimeout(() => openManageModal(estateIdx), 200);
      return;
    }

    // 随机年度事件
    const ev = _pick(AncientInnData.YEAR_EVENTS);

    // 随机来访人数：1 ~ 总房间数（受事件影响上下浮动）
    const maxGuests = _totalRooms(inn);
    let rawCount = _randInt(1, maxGuests) + (ev.guestBonus || 0);
    const guestCount = _clamp(rawCount, 1, maxGuests + 3);

    // 生成旅客列表
    const guests = [];
    for (let i = 0; i < guestCount; i++) {
      const tier = _pickGuestTier(inn.reputation);
      const g = AncientInnData.GUEST_TIERS.find(x => x.id === tier);
      guests.push({
        idx:  i,
        tier: g,
        look: _pick(g.looks),
        assignedRoom: null,  // 将由玩家分配
      });
    }

    // 展示年度事件后，进入逐客安排流程
    AncientModal.showModal(
      '🏮 旅客来访',
      `${ev.text}<br><br>本年共有 <b>${guestCount}</b> 位旅客叩门求宿。`,
      [{ label:'开始安排入住 →', sub:'', cost:'', id:'start' }],
      () => {
        AncientModal.closeModal();
        inn._pendingIncome = 0;
        setTimeout(() => _handleGuest(estateIdx, guests, 0, 0, 0, ev), 200);
      }
    );
  };

  // ── 根据声誉决定来客等级概率 ─────────────────────────────
  const _pickGuestTier = (reputation) => {
    // 声誉越高，富贵客概率越大
    const r = _clamp(reputation, 0, 100);
    const richChance  = Math.floor(r * 0.4);   // 0~40%
    const midChance   = Math.floor(r * 0.3) + 20; // 20~50%
    const roll = _randInt(1, 100);
    if (roll <= richChance) return 'rich';
    if (roll <= richChance + midChance) return 'middle';
    return 'poor';
  };

  // ── 逐客安排入住 ─────────────────────────────────────────
  const _handleGuest = (estateIdx, guests, idx, totalIncome, totalRepDelta, ev) => {
    const { estate, inn } = _get(estateIdx);

    if (idx >= guests.length) {
      // 所有客人处理完毕 → 结算
      _checkComplaintShutdown(estateIdx, totalIncome, totalRepDelta, ev);
      return;
    }

    const g = guests[idx];
    const D = AncientInnData;

    // 可用房间（同一年每间只能住一位）
    const occupiedIds = guests.slice(0, idx).map(x => x.assignedRoom).filter(Boolean);
    const freeRooms   = inn.rooms.filter(r => !occupiedIds.includes(r.roomId));

    if (freeRooms.length === 0) {
      // 无空房，跳过此客
      AncientModal.showModal(
        `🚪 客满`,
        `${g.look}——走到门口，伙计告知客房已满，只得遗憾离去。`,
        [{ label:'下一位', sub:'', cost:'', id:'next' }],
        () => {
          AncientModal.closeModal();
          setTimeout(() => _handleGuest(estateIdx, guests, idx+1, totalIncome, totalRepDelta, ev), 200);
        }
      );
      return;
    }

    // 展示旅客信息，让玩家选房间
    const roomOpts = freeRooms.map(r => {
      const rt = D.ROOM_TYPES.find(x => x.id === r.type);
      const satisfy = _roomSatisfy(r, inn);
      return {
        label: `${rt ? rt.icon : '🏮'} ${r.roomLabel}（${rt ? rt.name : ''}）`,
        sub:   `每晚 ${rt ? rt.pricePerNight : '?'} 文　满意度 ${satisfy}`,
        cost:  '',
        id:    r.roomId,
      };
    });

    AncientModal.showModal(
      `🧳 来客 ${idx+1}／${guests.length}`,
      `<b>${g.look}</b><br><br>请为此客安排客房：`,
      roomOpts,
      (rid) => {
        AncientModal.closeModal();
        const room = inn.rooms.find(r => r.roomId === rid);
        if (!room) return;
        g.assignedRoom = rid;

        // 计算房间与客人等级差
        const rt        = D.ROOM_TYPES.find(x => x.id === room.type);
        const roomTier  = rt ? rt.tier : 1;
        const guestPref = g.tier.tier;
        const diff      = roomTier - guestPref;     // >0:升级住, 0:合适, <0:降级住
        const diffKey   = String(Math.max(-2, Math.min(2, diff)));
        const rule      = D.ROOM_MATCH_RULES[diffKey] || D.ROOM_MATCH_RULES['0'];

        // 收费计算
        const basePrice = rt ? rt.pricePerNight : 15;
        const priceCap  = D.GUEST_PRICE_CAP[g.tier.tier] || basePrice;
        let income;
        if (rule.compensate) {
          // 升级住：客人觉得被宰，玩家赔出房间原价
          income = -basePrice;
        } else if (rule.halfPrice) {
          // 降级住：给半价，但不超过该客人等级的价格上限
          income = Math.min(Math.floor(basePrice * 0.5), priceCap);
        } else {
          // 正常：原价
          income = basePrice;
        }

        // 声誉变化
        let repDelta = rule.repDelta;
        inn.reputation = _clamp(inn.reputation + repDelta);

        // 投诉计次
        if (rule.complaint) inn.complaints += 1;

        totalIncome    += income;
        totalRepDelta  += repDelta;
        inn._pendingIncome += income;

        // 展示本次结果
        let resultIcon = '✅';
        let resultColor = 'var(--green)';
        if (rule.complaint && !rule.compensate) { resultIcon = '⚠️'; resultColor = 'var(--amber)'; }
        if (rule.compensate)                    { resultIcon = '❌'; resultColor = 'var(--red)'; }

        const incomeText = income >= 0
          ? `收入 <b style="color:var(--amber)">+${income} 文</b>`
          : `赔付 <b style="color:var(--red)">${Math.abs(income)} 文</b>`;
        const repText = repDelta === 0 ? '' :
          `声誉 <b style="color:${repDelta>0?'var(--green)':'var(--red)'}">${repDelta>0?'+':''}${repDelta}</b>　`;

        AncientModal.showModal(
          `${resultIcon} 入住结果`,
          `${g.tier.icon} 安排至「${room.roomLabel}」<br>` +
          `<span style="color:${resultColor}">${rule.desc}</span><br><br>` +
          `${repText}${incomeText}` +
          (rule.complaint ? `<br><small style="color:var(--red)">⚠️ 本年已累计 ${inn.complaints} 次投诉</small>` : ''),
          [{ label: idx+1 < guests.length ? '下一位旅客 →' : '全部安排完毕 →', sub:'', cost:'', id:'next' }],
          () => {
            AncientModal.closeModal();
            AncientSave.save();
            setTimeout(() => _handleGuest(estateIdx, guests, idx+1, totalIncome, totalRepDelta, ev), 200);
          }
        );
      }
    );
  };

  // ── 检查投诉触发关店 ─────────────────────────────────────
  const _checkComplaintShutdown = (estateIdx, totalIncome, totalRepDelta, ev) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;

    if (inn.complaints >= D.COMPLAINT_LIMIT && !inn.shutdown) {
      inn.shutdown = true;
      inn._pendingIncome = 0;  // 收入清零
      inn._yearOpened = true;

      AncientSave.addLog(`⚠️ 【${estate.name}】本年投诉达 ${inn.complaints} 次，官差上门，停业整顿，本年收入全无！`, 'bad');
      AncientSave.save();

      AncientModal.showModal(
        '⚠️ 停业整顿',
        D.SHUTDOWN_PENALTY_TEXT + `<br><br>` +
        `本年营业收入：<b style="color:var(--red)">0 文</b>（全数充公）<br>` +
        `声誉变化：${totalRepDelta>=0?'+':''}${totalRepDelta}`,
        [{ label:'知道了，明年再图', sub:'', cost:'', id:'ok' }],
        () => { AncientModal.closeModal(); AncientRender.render(); }
      );
      return;
    }

    _yearEnd_display(estateIdx, totalIncome, totalRepDelta, ev);
  };

  // ── 年度营业结算展示 ─────────────────────────────────────
  const _yearEnd_display = (estateIdx, totalIncome, totalRepDelta, ev) => {
    const { estate, inn } = _get(estateIdx);
    inn._yearOpened = true;
    AncientSave.addLog(
      `🏯 【${estate.name}】本年迎客结束，流水 ${inn._pendingIncome} 文，声誉变化 ${totalRepDelta>=0?'+':''}${totalRepDelta}。`,
      'good'
    );
    AncientSave.save();

    AncientModal.showModal(
      '🏮 今年迎客结束',
      `${ev.text}<br><br>` +
      `本年流水：<b style="color:var(--amber)">${inn._pendingIncome} 文</b><br>` +
      `声誉变化：<b>${totalRepDelta>=0?'+':''}${totalRepDelta}</b>　当前声誉：<b>${inn.reputation}</b><br>` +
      (inn.complaints > 0 ? `⚠️ 本年共收到 ${inn.complaints} 次投诉。` : '本年无投诉，经营顺遂。'),
      [{ label:'收摊回家', sub:'', cost:'', id:'ok' }],
      () => { AncientModal.closeModal(); AncientRender.render(); }
    );
  };

  // ── 托管 ──────────────────────────────────────────────────
  const _doManagedOn = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    if (inn.rooms.length === 0) {
      AncientModal.showToast('没有客房，无法托管！');
      return;
    }
    const name = ['王','李','张','刘','陈'][Math.floor(Math.random()*5)] +
                 ['掌柜','大娘','先生'][Math.floor(Math.random()*3)];
    AncientModal.showModal(
      `🗂 委托托管`,
      `将【${estate.name}】委托掌柜打理，每年收益扣除 <b>30%</b> 管理费。<br>` +
      `托管期间无需亲自接客，年末自动结算。`,
      [{ label:`✅ 委托 ${name}`, sub:'抽成 30%', cost:'', id:'yes' }],
      (id) => {
        AncientModal.closeModal();
        if (id === 'yes') {
          inn.managed = true;
          inn.managerName = name;
          AncientSave.addLog(`🗂 【${estate.name}】已委托 ${name} 托管。`, 'info');
          AncientSave.save();
          AncientRender.render();
        }
      }
    );
  };

  const _managedMenu = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    AncientModal.showModal(
      `🗂 【${estate.name}】托管中`,
      `掌柜 <b>${inn.managerName}</b> 打理中，年末自动结算（扣除 30% 管理费）。`,
      [
        { label:'🔓 解除托管，明年自营', sub:'', cost:'', id:'off' },
        { label:'📊 客栈状况', sub:'', cost:'', id:'status' },
      ],
      (id) => {
        AncientModal.closeModal();
        if (id === 'off') {
          inn.managed = false;
          inn.managerName = null;
          AncientSave.addLog(`🔓 【${estate.name}】已解除托管，明年起自营。`, 'info');
          AncientSave.save();
          AncientRender.render();
        } else if (id === 'status') {
          _doStatus(estateIdx);
        }
      }
    );
  };

  // ── 状况查看 ──────────────────────────────────────────────
  const _doStatus = (estateIdx) => {
    const { estate, inn } = _get(estateIdx);
    const D = AncientInnData;

    const roomLines = inn.rooms.map(r => {
      const rt = D.ROOM_TYPES.find(x => x.id === r.type);
      return `${rt?rt.icon:'🏮'}${r.roomLabel}（满意度 ${_roomSatisfy(r, inn)}）`;
    }).join('　') || '无';

    const facLines = inn.facilities.map(fid => {
      const f = D.FACILITIES.find(x => x.id === fid);
      return f ? `${f.icon}${f.name}` : '';
    }).join('　') || '无';

    const floorLines = Object.entries(inn.floors)
      .map(([k,v]) => `${k}楼：${v?'✅已解锁':'🔒未解锁'}`).join('　');

    AncientModal.showModal(
      `📊 【${estate.name}】客栈状况`,
      `🌟 声誉：<b>${inn.reputation}</b><br>` +
      `🏗 楼层：${floorLines}<br>` +
      `🛖 客房：${roomLines}<br>` +
      `🏛 设施：${facLines}<br>` +
      `⚠️ 本年投诉：<b>${inn.complaints}</b> 次` +
      (inn.shutdown ? '　<b style="color:var(--red)">（已停业整顿）</b>' : ''),
      [{ label:'知道了', sub:'', cost:'', id:'ok' }],
      () => AncientModal.closeModal()
    );
  };

  // ── 年末结算（由 loop.js 调用） ───────────────────────────
  const yearEnd = () => {
    const events = [];
    if (!AncientState.G.estates) return events;

    AncientState.G.estates.forEach((estate) => {
      if (estate.type !== 'inn') return;
      _init(estate);
      const inn = estate.inn;

      let income = 0;

      if (inn.managed) {
        // 托管收益：平均来客数 × 各房间原价均值 = 理论最大收入 n，实得 n×70%
        const D = AncientInnData;
        const totalRooms = inn.rooms.length;
        if (totalRooms > 0) {
          // 平均来客数 = (1 + totalRooms) / 2
          const avgGuests = (1 + totalRooms) / 2;
          // 各房间每晚均价
          const avgRoomPrice = inn.rooms.reduce((s, r) => {
            const rt = D.ROOM_TYPES.find(x => x.id === r.type);
            return s + (rt ? rt.pricePerNight : 0);
          }, 0) / totalRooms;
          const n = Math.floor(avgGuests * avgRoomPrice);
          income  = Math.floor(n * 0.7);
        }
        inn.reputation = Math.max(0, inn.reputation - 1);
      } else {
        income = Math.max(0, inn._pendingIncome || 0);
      }

      AncientState.G.money      += income;
      AncientState.G.totalMoney += income;

      const shutdownNote = inn.shutdown ? '（本年曾停业整顿）' : '';
      const managedNote  = inn.managed  ? '（托管，扣除30%管理费）' : '';
      AncientSave.addLog(
        `🏯 【${estate.name}】年末结算，净收益 <b>${income}</b> 文入账。${shutdownNote}${managedNote}`,
        income > 0 ? 'good' : 'info'
      );

      events.push({
        icon:  '🏯',
        title: `【${estate.name}】年末结算`,
        body:  `${inn.managed ? '托管' : '自营'}一年，声誉：<b>${inn.reputation}</b><br>` +
               `本年收益：<b style="color:var(--amber)">${income} 文</b>` +
               (inn.shutdown ? `<br><b style="color:var(--red)">（曾停业整顿，收入为零）</b>` : '') +
               (inn.managed  ? `<br><small>理论最大收入已扣除30%管理费</small>` : ''),
        type:  income > 0 ? 'good' : 'info',
      });

      // 重置年度标记
      inn._pendingIncome = 0;
      inn._yearOpened    = false;
      inn.complaints     = 0;
      inn.shutdown       = false;
    });

    return events;
  };

  return { openManageModal, yearEnd };
})();

window.AncientInnPlay = AncientInnPlay;
