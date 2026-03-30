// ============================================================
// systems/shopplay.js — 通用商铺经营引擎
// 依赖：AncientState, AncientModal, AncientSave, AncientRender
// 业态数据由各 data/shops/*.js 注入，通过 ShopPlay.register() 注册
// ============================================================

const AncientShopPlay = (() => {

  // ── 已注册的业态配置 ──────────────────────────────────────
  const _configs = {};

  // ── 工具函数 ──────────────────────────────────────────────
  const _clamp = (v, min=0, max=100) => Math.max(min, Math.min(max, v));

  // 随机从数组取一个
  const _pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // 随机生成员工姓名（简易）
  const SURNAMES = ['王','李','张','刘','陈','赵','孙','周','吴','郑','冯','蒋','沈','韩','杨'];
  const WORKER_NAMES = ['大','二','三','四','福','贵','顺','发','兴','旺','财','禄'];
  const _genWorkerName = () => _pick(SURNAMES) + _pick(WORKER_NAMES) + (Math.random()<0.5?'哥':'');

  // ── 初始化某个商铺的经营数据 ──────────────────────────────
  const _initShopData = (estate, config) => {
    if (estate.shopData) return; // 已初始化过
    estate.shopData = {
      type: config.type,
      reputation: 20,
      workerLevel: 1,           // 1-5
      workerName: _genWorkerName(),
      supplyTier: 1,            // 1-3
      unlockedRecipes: [],      // 已解锁配方id列表
      footfall: 15,             // 客流量 0-100
      managed: false,           // 是否托管
      managerName: null,
      // 每年操作记录（年末清空）
      _yearResearched: false,   // 本年是否已研发
      _yearOperated: false,     // 本年是否已坐堂
    };
  };

  // ── 获取某地产的config ────────────────────────────────────
  const _getConfig = (estate) => {
    const shopType = estate.shopSubtype || estate.id;
    return _configs[shopType] || null;
  };

  // ── 计算客流量（由声誉推算） ──────────────────────────────
  const _calcFootfall = (shopData) => {
    return _clamp(Math.floor(shopData.reputation * 0.8 + Math.random() * 20));
  };

  // ── 计算本年基础收益 ──────────────────────────────────────
  const _calcIncome = (shopData, config) => {
    const workerMult   = 0.6 + shopData.workerLevel * 0.2;    // 1级=0.8x … 5级=1.6x
    const supplyMult   = 0.7 + shopData.supplyTier  * 0.25;   // 1级=0.95x … 3级=1.45x
    const recipeMult   = 1 + shopData.unlockedRecipes.length * (config.recipeBonus || 0.05);
    const footfallMult = shopData.footfall / 100;
    const base         = config.baseIncome || 200;
    return Math.floor(base * workerMult * supplyMult * recipeMult * footfallMult);
  };

  // ── 自营：坐堂经营（一次性跑完所有单子） ─────────────────
  const _runOperate = (estateIdx, config, onDone) => {
    const estate   = AncientState.G.estates[estateIdx];
    const shopData = estate.shopData;
    const events   = config.operateEvents || [];
    const totalOrders = config.ordersPerYear || 5;

    let orderIdx    = 0;
    let totalGain   = 0;
    let totalRepDelta = 0;

    const runNext = () => {
      if (orderIdx >= totalOrders) {
        // 全部跑完
        shopData.footfall = _calcFootfall(shopData);
        const income = _calcIncome(shopData, config);
        if (!AncientState.G.pendingShopIncome) AncientState.G.pendingShopIncome = 0;
        AncientState.G.pendingShopIncome += income;
        shopData._yearOperated = true;
        AncientSave.save();
        AncientModal.showModal(
          `🎉 今日打烊`,
          `【${estate.name}】坐堂经营结束。<br><br>` +
          `声誉变化：<b>${totalRepDelta >= 0 ? '+' : ''}${totalRepDelta}</b><br>` +
          `预计年末收益：<b style="color:var(--amber)">${income} 文</b>`,
          [{label:'收摊回家', sub:'', cost:'', id:'ok'}],
          () => { AncientModal.closeModal(); AncientRender.render(); if (onDone) onDone(); }
        );
        return;
      }

      // 随机取一个事件
      const pool = events.filter(e => {
        if (e.minSupplyTier && shopData.supplyTier < e.minSupplyTier) return false;
        if (e.minWorkerLevel && shopData.workerLevel < e.minWorkerLevel) return false;
        return true;
      });
      const ev = pool.length ? _pick(pool) : null;

      let repDelta  = 0;
      let moneyDelta = 0;
      let body      = '';

      if (ev) {
        repDelta   = ev.rep   || 0;
        moneyDelta = ev.money || 0;
        body       = ev.text;
        // 根据结果随机波动
        if (ev.type === 'good')    repDelta += Math.floor(Math.random() * 3);
        if (ev.type === 'bad')     repDelta -= Math.floor(Math.random() * 3);
      } else {
        repDelta = Math.floor(Math.random() * 5) - 2;
        body     = '今日平平无奇，客来客往，无甚波澜。';
      }

      shopData.reputation = _clamp(shopData.reputation + repDelta);
      totalRepDelta += repDelta;
      totalGain     += moneyDelta;
      orderIdx++;

      AncientModal.showModal(
        `📋 第 ${orderIdx}/${totalOrders} 单`,
        body + (repDelta !== 0 ? `<br><br>声誉 <b>${repDelta >= 0 ? '+' : ''}${repDelta}</b>` : ''),
        [{label:`下一单 →`, sub:`${orderIdx}/${totalOrders}`, cost:'', id:'next'}],
        () => { AncientModal.closeModal(); setTimeout(runNext, 120); }
      );
    };

    runNext();
  };

  // ── 主管理弹窗 ────────────────────────────────────────────
  const openManageModal = (estateIdx) => {
    const estate = AncientState.G.estates[estateIdx];
    if (!estate) return;

    const config = _getConfig(estate);
    if (!config) {
      AncientModal.showToast('此商铺尚无经营系统，敬请期待！');
      return;
    }

    _initShopData(estate, config);
    const s = estate.shopData;

    const workerLabel  = config.workerRole  || '伙计';
    const supplyLabel  = config.supplyName  || '货源';
    const supplyTiers  = config.supplyTiers || ['寻常','中等','上等'];
    const workerTiers  = config.workerTiers || ['学徒','普通','熟练','老手','名匠'];

    const modeText = s.managed
      ? `托管中（掌柜：${s.managerName}，抽成 ${Math.round((config.managerCut||0.3)*100)}%）`
      : '自营';

    const opts = [];

    if (!s.managed) {
      // ── 自营选项 ──
      opts.push({
        label: `👨‍🍳 更换${workerLabel}`,
        sub: `当前：${s.workerName}（${workerTiers[s.workerLevel-1]}·Lv${s.workerLevel}）`,
        cost: `${config.workerCost?.[s.workerLevel] || 100} 文`,
        id: 'hire'
      });
      opts.push({
        label: `🛒 采购${supplyLabel}`,
        sub: `当前档次：${supplyTiers[s.supplyTier-1]}`,
        cost: `${config.supplyCost?.[s.supplyTier] || 80} 文`,
        id: 'supply'
      });
      opts.push({
        label: `📜 研发${config.recipeName || '配方'}`,
        sub: s._yearResearched ? '本年已研发过' : `已解锁 ${s.unlockedRecipes.length}/${config.recipes?.length||0} 种`,
        cost: `${config.researchCost || 60} 文`,
        id: 'research'
      });
      opts.push({
        label: `🏮 坐堂经营`,
        sub: s._yearOperated ? '本年已坐堂' : `今日备好货，开门迎客`,
        cost: '',
        id: 'operate'
      });
      opts.push({
        label: `🗂 委托掌柜托管`,
        sub: `抽成 ${Math.round((config.managerCut||0.3)*100)}%，无需操心`,
        cost: '',
        id: 'managed_on'
      });
    } else {
      // ── 托管选项 ──
      opts.push({
        label: `🔓 解除托管，亲自经营`,
        sub: '下年起自营',
        cost: '',
        id: 'managed_off'
      });
    }

    opts.push({
      label: `📊 查看经营状况`,
      sub: `声誉 ${s.reputation} · 客流 ${s.footfall}`,
      cost: '',
      id: 'status'
    });
    opts.push({
      label: `🏠 立契出售`,
      sub: `得 ${Math.floor(estate.price * 0.6)} 文`,
      cost: '',
      id: 'sell',
      style: 'red'
    });

    AncientModal.showModal(
      `${estate.icon} 【${estate.name}】经营`,
      `${config.desc || ''}<br>当前模式：<b>${modeText}</b>`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if      (id === 'hire')       _doHire(estateIdx, config);
        else if (id === 'supply')     _doSupply(estateIdx, config);
        else if (id === 'research')   _doResearch(estateIdx, config);
        else if (id === 'operate')    _doOperate(estateIdx, config);
        else if (id === 'managed_on') _doManagedOn(estateIdx, config);
        else if (id === 'managed_off')_doManagedOff(estateIdx, config);
        else if (id === 'status')     _doStatus(estateIdx, config);
        else if (id === 'sell')       AncientEstate.sellEstate(estateIdx);
      }
    );
  };

  // ── 更换员工 ──────────────────────────────────────────────
  const _doHire = (estateIdx, config) => {
    const estate   = AncientState.G.estates[estateIdx];
    const s        = estate.shopData;
    const workerRole  = config.workerRole || '伙计';
    const workerTiers = config.workerTiers || ['学徒','普通','熟练','老手','名匠'];
    const maxLevel    = workerTiers.length;

    const opts = [];
    for (let lv = 1; lv <= maxLevel; lv++) {
      const cost = config.workerCost?.[lv] || lv * 80;
      opts.push({
        label: `${workerTiers[lv-1]}${workerRole}（Lv${lv}）`,
        sub: lv === s.workerLevel ? '当前等级' : '',
        cost: `${cost} 文/年`,
        id: `lv_${lv}`
      });
    }

    AncientModal.showModal(
      `👨‍🍳 雇佣${workerRole}`,
      `选择${workerRole}等级，等级越高收益越佳，月俸也越高。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (!id.startsWith('lv_')) return;
        const lv   = parseInt(id.replace('lv_', ''));
        const cost = config.workerCost?.[lv] || lv * 80;
        if (AncientState.G.money < cost) { AncientModal.showToast('囊中羞涩，雇不起！'); return; }
        AncientModal.confirmSpend(cost, `雇佣${workerTiers[lv-1]}${workerRole}`, () => {
          AncientState.G.money -= cost;
          s.workerLevel = lv;
          s.workerName  = _genWorkerName();
          AncientSave.addLog(`👨‍🍳 【${estate.name}】换了新${workerRole}：${s.workerName}（${workerTiers[lv-1]}）`, 'info');
          AncientSave.save();
          setTimeout(() => openManageModal(estateIdx), 200);
        });
      }
    );
  };

  // ── 采购货源 ──────────────────────────────────────────────
  const _doSupply = (estateIdx, config) => {
    const estate      = AncientState.G.estates[estateIdx];
    const s           = estate.shopData;
    const supplyLabel = config.supplyName  || '货源';
    const supplyTiers = config.supplyTiers || ['寻常','中等','上等'];

    const opts = supplyTiers.map((tier, i) => {
      const lv   = i + 1;
      const cost = config.supplyCost?.[lv] || lv * 60;
      return {
        label: `${tier}${supplyLabel}（档次 ${lv}）`,
        sub: lv === s.supplyTier ? '当前档次' : '',
        cost: `${cost} 文`,
        id: `tier_${lv}`
      };
    });

    AncientModal.showModal(
      `🛒 采购${supplyLabel}`,
      `档次越高，出品越佳，售价也越高。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (!id.startsWith('tier_')) return;
        const lv   = parseInt(id.replace('tier_', ''));
        const cost = config.supplyCost?.[lv] || lv * 60;
        if (AncientState.G.money < cost) { AncientModal.showToast('囊中羞涩，买不起！'); return; }
        AncientModal.confirmSpend(cost, `采购${supplyTiers[lv-1]}${supplyLabel}`, () => {
          AncientState.G.money -= cost;
          s.supplyTier = lv;
          AncientSave.addLog(`🛒 【${estate.name}】采购${supplyTiers[lv-1]}${supplyLabel}，花费 ${cost} 文。`, 'info');
          AncientSave.save();
          setTimeout(() => openManageModal(estateIdx), 200);
        });
      }
    );
  };

  // ── 研发配方 ──────────────────────────────────────────────
  const _doResearch = (estateIdx, config) => {
    const estate   = AncientState.G.estates[estateIdx];
    const s        = estate.shopData;

    if (s._yearResearched) {
      AncientModal.showToast('本年已研发过，明年再来！');
      return;
    }

    const allRecipes     = config.recipes || [];
    const lockedRecipes  = allRecipes.filter(r => !s.unlockedRecipes.includes(r.id));

    if (lockedRecipes.length === 0) {
      AncientModal.showToast('所有配方均已解锁！');
      return;
    }

    const cost = config.researchCost || 60;
    if (AncientState.G.money < cost) { AncientModal.showToast('囊中羞涩，无力研发！'); return; }

    // 按菜系分组展示
    const byCuisine = {};
    lockedRecipes.forEach(r => {
      if (!byCuisine[r.cuisine]) byCuisine[r.cuisine] = [];
      byCuisine[r.cuisine].push(r);
    });

    const opts = [];
    Object.entries(byCuisine).forEach(([cuisine, recipes]) => {
      recipes.forEach(r => {
        opts.push({
          label: `${r.icon} ${r.name}（${cuisine}）`,
          sub: r.desc || '',
          cost: `${cost} 文`,
          id: r.id
        });
      });
    });

    AncientModal.showModal(
      `📜 研发${config.recipeName || '配方'}`,
      `每年只能研发一次，选择一项潜心钻研。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        const recipe = allRecipes.find(r => r.id === id);
        if (!recipe) return;
        AncientModal.confirmSpend(cost, `研发【${recipe.name}】`, () => {
          AncientState.G.money -= cost;
          s.unlockedRecipes.push(recipe.id);
          s._yearResearched = true;
          AncientSave.addLog(`📜 【${estate.name}】研发出新${config.recipeName||'配方'}：${recipe.icon}${recipe.name}，食客称赞！`, 'good');
          AncientSave.save();
          AncientModal.showModal(
            `🎉 研发成功`,
            `${recipe.icon} <b>${recipe.name}</b> 已加入菜单，声誉 <b style="color:var(--green)">+3</b>`,
            [{label:'好！', sub:'', cost:'', id:'ok'}],
            () => { AncientModal.closeModal(); s.reputation = _clamp(s.reputation + 3); AncientRender.render(); }
          );
        });
      }
    );
  };

  // ── 坐堂经营 ──────────────────────────────────────────────
  const _doOperate = (estateIdx, config) => {
    const estate = AncientState.G.estates[estateIdx];
    const s      = estate.shopData;

    if (s._yearOperated) {
      AncientModal.showToast('今年已坐堂过，明年再来！');
      return;
    }

    AncientModal.showModal(
      `🏮 坐堂经营`,
      `开门迎客，今日共 <b>${config.ordersPerYear||5}</b> 单。<br>` +
      `一旦开始便无法中途退出，请确认已备好货源与厨力。<br><br>` +
      `当前食材：<b>${(config.supplyTiers||['寻常','中等','上等'])[s.supplyTier-1]}</b> ` +
      `当前${config.workerRole||'伙计'}：<b>Lv${s.workerLevel}</b>`,
      [
        {label:'🏮 开门迎客', sub:'', cost:'', id:'start'},
        {label:'↩ 再准备准备', sub:'', cost:'', id:'cancel'}
      ],
      (id) => {
        AncientModal.closeModal();
        if (id === 'start') {
          setTimeout(() => _runOperate(estateIdx, config, () => openManageModal(estateIdx)), 200);
        }
      }
    );
  };

  // ── 开启托管 ──────────────────────────────────────────────
  const _doManagedOn = (estateIdx, config) => {
    const estate = AncientState.G.estates[estateIdx];
    const s      = estate.shopData;
    const cut    = Math.round((config.managerCut || 0.3) * 100);
    const name   = _genWorkerName() + '掌柜';

    AncientModal.showModal(
      `🗂 委托托管`,
      `将【${estate.name}】委托给掌柜打理，每年收益扣除 <b>${cut}%</b> 作为管理费。<br>` +
      `托管期间无需坐堂，年末自动结算。<br>` +
      `解除托管需提前申请，下一年生效。`,
      [{label:`✅ 委托 ${name}`, sub:`抽成 ${cut}%`, cost:'', id:'yes'}],
      (id) => {
        AncientModal.closeModal();
        if (id === 'yes') {
          s.managed     = true;
          s.managerName = name;
          AncientSave.addLog(`🗂 【${estate.name}】已委托 ${name} 托管经营。`, 'info');
          AncientSave.save();
          AncientRender.render();
        }
      }
    );
  };

  // ── 解除托管 ──────────────────────────────────────────────
  const _doManagedOff = (estateIdx, config) => {
    const estate = AncientState.G.estates[estateIdx];
    const s      = estate.shopData;

    AncientModal.showModal(
      `🔓 解除托管`,
      `解除与 ${s.managerName} 的托管协议，<b>下一年</b>起改为自营。`,
      [{label:'✅ 确认解除', sub:'', cost:'', id:'yes'}],
      (id) => {
        AncientModal.closeModal();
        if (id === 'yes') {
          s.managed     = false;
          s.managerName = null;
          AncientSave.addLog(`🔓 【${estate.name}】已解除托管，明年起亲自经营。`, 'info');
          AncientSave.save();
          AncientRender.render();
        }
      }
    );
  };

  // ── 经营状况 ──────────────────────────────────────────────
  const _doStatus = (estateIdx, config) => {
    const estate = AncientState.G.estates[estateIdx];
    const s      = estate.shopData;
    const supplyTiers  = config.supplyTiers  || ['寻常','中等','上等'];
    const workerTiers  = config.workerTiers  || ['学徒','普通','熟练','老手','名匠'];
    const estIncome    = _calcIncome(s, config);
    const managedIncome = s.managed ? Math.floor(estIncome * (1 - (config.managerCut||0.3))) : estIncome;

    AncientModal.showModal(
      `📊 经营状况`,
      `<b>【${estate.name}】</b><br><br>` +
      `🌟 声誉：${s.reputation}<br>` +
      `👥 客流：${s.footfall}<br>` +
      `👨‍🍳 ${config.workerRole||'伙计'}：${s.workerName}（${workerTiers[s.workerLevel-1]}）<br>` +
      `🛒 ${config.supplyName||'货源'}：${supplyTiers[s.supplyTier-1]}<br>` +
      `📜 已解锁配方：${s.unlockedRecipes.length} 种<br><br>` +
      `预计年末收益：<b style="color:var(--amber)">${managedIncome} 文</b>${s.managed?`（扣除托管费后）`:''}`,
      [{label:'知道了', sub:'', cost:'', id:'ok'}],
      () => AncientModal.closeModal()
    );
  };

  // ── 年末结算（由 loop.js 调用，返回 yearEvents 数组） ────
  const yearEnd = () => {
    const events = [];
    if (!AncientState.G.estates) return events;

    AncientState.G.estates.forEach((estate) => {
      if (estate.type !== 'shop') return;
      const config = _getConfig(estate);
      if (!config) return;
      _initShopData(estate, config);

      const s = estate.shopData;
      let income = _calcIncome(s, config);

      if (s.managed) {
        income = Math.floor(income * (1 - (config.managerCut || 0.3)));
      }

      // 加上坐堂经营期间累计的额外收益
      if (AncientState.G.pendingShopIncome) {
        income += AncientState.G.pendingShopIncome;
        AncientState.G.pendingShopIncome = 0;
      }

      AncientState.G.money      += income;
      AncientState.G.totalMoney += income;

      AncientSave.addLog(
        `🏪 【${estate.name}】年末结算，${s.managed?'托管':'自营'}收益 <b>${income}</b> 文入账。`,
        'good'
      );

      events.push({
        icon: estate.icon || '🏪',
        title: `【${estate.name}】年末结算`,
        body: `${s.managed ? '掌柜' + s.managerName + '打理' : '亲自经营'}一年，` +
              `声誉 <b>${s.reputation}</b>，客流 <b>${s.footfall}</b>。<br><br>` +
              `年末收益：<b style="color:var(--amber)">${income} 文</b>`,
        type: 'good'
      });

      // 重置年度操作记录
      s._yearResearched = false;
      s._yearOperated   = false;
      // 自然声誉微衰退（不打理会慢慢降）
      if (!s._yearOperated && !s.managed) {
        s.reputation = _clamp(s.reputation - 3);
      }
      // 更新客流
      s.footfall = _calcFootfall(s);
    });

    return events;
  };

  // ── 对外注册接口 ──────────────────────────────────────────
  const register = (config) => {
    _configs[config.type] = config;
  };

  return {
    register,
    openManageModal,
    yearEnd,
  };
})();

window.AncientShopPlay = AncientShopPlay;
