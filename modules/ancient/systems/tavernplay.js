// ============================================================
// systems/tavernplay.js — 酒楼专属经营玩法
// 依赖：AncientTavernData, AncientState, AncientModal,
//       AncientSave, AncientRender
// ============================================================

const AncientTavernPlay = (() => {

  // ── 工具 ──────────────────────────────────────────────────
  const _clamp  = (v,min=0,max=100) => Math.max(min,Math.min(max,v));
  const _pick   = arr => arr[Math.floor(Math.random()*arr.length)];
  const _randInt= (a,b) => a + Math.floor(Math.random()*(b-a+1));

  const SURNAMES = ['王','李','张','刘','陈','赵','孙','周','吴','郑'];
  const GIVENNAMES= ['大','二','三','福','贵','顺','发','兴','旺','财'];
  const _genName = suffix => _pick(SURNAMES)+_pick(GIVENNAMES)+suffix;

  // ── 初始化商铺数据 ────────────────────────────────────────
  const _init = (estate) => {
    if (estate.tavern) return;
    estate.tavern = {
      // 人员
      chef:   null,   // {name, level, cost} 或 null（自己上）
      waiter: null,   // {name, cost} 或 null（自己上）
      // 库存
      inventory: {},  // {食材id: 数量}
      // 菜谱
      knownRecipes: [],   // 已掌握菜谱id
      cookedCount:  {},   // {菜谱id: 累计做菜次数}
      // 声誉
      reputation: 20,
      // 年度状态
      _yearOpened:     false,
      _yearResearched: false,
      // 托管
      managed:     false,
      managerName: null,
    };
  };

  const _get = (estateIdx) => {
    const e = AncientState.G.estates[estateIdx];
    _init(e);
    return { estate:e, t:e.tavern };
  };

  // ── 主管理入口 ────────────────────────────────────────────
  const openManageModal = (estateIdx) => {
    const { estate, t } = _get(estateIdx);

    if (t.managed) {
      _managedMenu(estateIdx);
      return;
    }

    const chefLabel   = t.chef   ? `${t.chef.name}（${AncientTavernData.CHEF_TIERS[t.chef.level-1]}）` : '自己掌厨';
    const waiterLabel = t.waiter ? `${t.waiter.name}` : '自己跑堂';
    const invTotal    = Object.values(t.inventory).reduce((a,b)=>a+b,0);

    AncientModal.showModal(
      `🍶 【${estate.name}】经营`,
      `厨子：<b>${chefLabel}</b>　小二：<b>${waiterLabel}</b><br>` +
      `食材库存：<b>${invTotal}</b> 份　已掌握菜谱：<b>${t.knownRecipes.length}</b> 道<br>` +
      `声誉：<b>${t.reputation}</b>`,
      [
        { label:'📖 菜品图鉴',    sub:'查看所有菜品（不含配方）',      cost:'', id:'book'     },
        { label:'🛒 采购食材',    sub:'备好食材才能开业',         cost:'', id:'buy'      },
        { label:'📜 研发配方',    sub: t._yearResearched?'今年已研发':'尝试配对食材解锁菜谱', cost:'', id:'research'  },
        { label:'👨‍🍳 雇佣厨子',  sub:chefLabel,                  cost:'', id:'chef'     },
        { label:'🧑 雇佣小二',    sub:waiterLabel,                cost:'', id:'waiter'   },
        { label:'🏮 开门营业',    sub: t._yearOpened?'今年已开业':'开业接客', cost:'', id:'open'     },
        { label:'🗂 委托托管',    sub:`抽成 ${Math.round(AncientTavernData.MANAGER_CUT*100)}%`, cost:'', id:'manage'   },
        { label:'📊 经营状况',    sub:'',                         cost:'', id:'status'   },
        { label:'🏠 立契出售',    sub:`得 ${Math.floor(estate.price*0.6)} 文`, cost:'', id:'sell', style:'red' },
      ],
      (id) => {
        AncientModal.closeModal();
        if      (id==='book')     _doRecipeBook(estateIdx);
        else if (id==='buy')      _doBuy(estateIdx);
        else if (id==='research') _doResearch(estateIdx);
        else if (id==='chef')     _doHireChef(estateIdx);
        else if (id==='waiter')   _doHireWaiter(estateIdx);
        else if (id==='open')     _doOpen(estateIdx);
        else if (id==='manage')   _doManagedOn(estateIdx);
        else if (id==='status')   _doStatus(estateIdx);
        else if (id==='sell')     AncientEstate.sellEstate(estateIdx);
      }
    );
  };

  // ── 菜品图鉴 ──────────────────────────────────────────────
  const _doRecipeBook = (estateIdx) => {
    const D = AncientTavernData;
    // 按菜系分组
    const cuisines = [...new Set(D.RECIPES.map(r => r.cuisine))];
    const lines = cuisines.map(c => {
      const dishes = D.RECIPES.filter(r => r.cuisine === c)
        .map(r => `${r.icon}${r.name}（${r.price}文）`)
        .join('　');
      return `<b>${c}</b>：${dishes}`;
    }).join('<br>');

    AncientModal.showModal(
      `📖 菜品图鉴`,
      `共 <b>${D.RECIPES.length}</b> 道菜，通过研发配方解锁。<br><br>${lines}`,
      [{ label:'知道了', sub:'', cost:'', id:'ok' }],
      () => { AncientModal.closeModal(); setTimeout(() => openManageModal(estateIdx), 200); }
    );
  };

  // ── 采购食材 ──────────────────────────────────────────────
  const _doBuy = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    const ings = AncientTavernData.INGREDIENTS;

    const opts = ings.map(ing => {
      const have = t.inventory[ing.id] || 0;
      return {
        label: `${ing.icon} ${ing.name}`,
        sub:   `库存 ${have} 份　${ing.type}`,
        cost:  `${ing.price} 文/份`,
        id:    ing.id,
      };
    });

    AncientModal.showModal(
      `🛒 采购食材`,
      `每次购入1份，可重复购买。余钱：<b>${AncientState.G.money} 文</b>`,
      opts,
      (id) => {
        AncientModal.closeModal();
        const ing = ings.find(i=>i.id===id);
        if (!ing) return;
        if (AncientState.G.money < ing.price) { AncientModal.showToast('囊中羞涩，买不起！'); return; }
        AncientState.G.money -= ing.price;
        t.inventory[ing.id] = (t.inventory[ing.id]||0) + 1;
        AncientSave.addLog(`🛒 采购 ${ing.icon}${ing.name} ×1，花费 ${ing.price} 文。`,'info');
        AncientSave.save();
        // 继续购买
        setTimeout(() => _doBuy(estateIdx), 200);
      },
      // 关闭按钮
      () => setTimeout(() => openManageModal(estateIdx), 200)
    );
  };

  // ── 研发配方 ──────────────────────────────────────────────
  const _doResearch = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    if (t._yearResearched) { AncientModal.showToast('今年已研发过，明年再来！'); return; }

    const locked = AncientTavernData.RECIPES.filter(r => !t.knownRecipes.includes(r.id));
    if (locked.length === 0) { AncientModal.showToast('所有菜谱均已掌握！'); return; }

    // 第一步：选食材1
    _researchStep(estateIdx, [], locked);
  };

  const _researchStep = (estateIdx, chosen, locked) => {
    const { estate, t } = _get(estateIdx);
    const ings = AncientTavernData.INGREDIENTS;
    const maxSteps = 3;

    // 只显示库存>0的食材
    const available = ings.filter(i => (t.inventory[i.id]||0) > 0);
    if (available.length === 0) {
      AncientModal.showToast('库存不足，请先采购食材！');
      return;
    }

    const stepLabel = chosen.length === 0 ? '第一种食材' :
                      chosen.length === 1 ? '第二种食材（或直接尝试）' : '第三种食材（或直接尝试）';

    const opts = available
      .filter(i => !chosen.includes(i.id))
      .map(i => ({
        label: `${i.icon} ${i.name}`,
        sub:   `库存 ${t.inventory[i.id]} 份`,
        cost:  '',
        id:    i.id,
      }));

    if (chosen.length >= 2) {
      opts.unshift({ label:'🍳 就用这些，开始尝试', sub:`已选：${chosen.map(id=>ings.find(i=>i.id===id).name).join('+')}`, cost:'', id:'__try__' });
    }

    AncientModal.showModal(
      `📜 研发配方（${chosen.length+1}/${maxSteps}）`,
      `已选：<b>${chosen.length>0 ? chosen.map(id=>ings.find(i=>i.id===id).name).join(' + ') : '无'}</b><br>` +
      `选择${stepLabel}`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id === '__try__') {
          _researchTry(estateIdx, chosen, locked);
          return;
        }
        const ing = ings.find(i=>i.id===id);
        if (!ing) return;
        // 消耗食材
        t.inventory[ing.id] = Math.max(0, (t.inventory[ing.id]||0) - 1);
        const newChosen = [...chosen, id];
        if (newChosen.length >= maxSteps) {
          _researchTry(estateIdx, newChosen, locked);
        } else {
          setTimeout(() => _researchStep(estateIdx, newChosen, locked), 200);
        }
      }
    );
  };

  const _researchTry = (estateIdx, chosen, locked) => {
    const { estate, t } = _get(estateIdx);
    const ings = AncientTavernData.INGREDIENTS;

    // 消耗最后一种未消耗的（第一步选的已在step里消耗，这里消耗剩余）
    // 实际上每步选择时已扣除，这里只做匹配
    const chosenSet = new Set(chosen);

    // 尝试匹配：找到配方的食材集合是chosen的子集，且做法匹配
    // 先让玩家选做法
    const methods = AncientTavernData.METHODS;
    const methodOpts = methods.map(m => ({
      label: `${m.icon} ${m.name}`,
      sub: '', cost: '', id: m.id,
    }));

    AncientModal.showModal(
      `🍳 选择做法`,
      `已选食材：<b>${chosen.map(id=>ings.find(i=>i.id===id)?.name||id).join(' + ')}</b><br>选择烹饪方式：`,
      methodOpts,
      (methodId) => {
        AncientModal.closeModal();

        // 匹配菜谱：食材全部包含在chosen里，且做法一致
        const matched = locked.find(r => {
          const allIn = r.ingredients.every(i => chosenSet.has(i));
          return allIn && r.method === methodId;
        });

        if (matched) {
          t.knownRecipes.push(matched.id);
          t._yearResearched = true;
          t.reputation = _clamp(t.reputation + matched.repBonus);
          AncientSave.addLog(`📜 【${estate.name}】研发出新菜谱：${matched.icon}${matched.name}！`, 'good');
          AncientSave.save();
          AncientModal.showModal(
            `🎉 研发成功！`,
            `${matched.icon} <b>${matched.name}</b>（${matched.cuisine}）已加入菜单！<br><br>` +
            `${matched.desc}<br><br>声誉 <b style="color:var(--green)">+${matched.repBonus}</b>`,
            [{ label:'大展厨艺！', sub:'', cost:'', id:'ok' }],
            () => { AncientModal.closeModal(); AncientRender.render(); }
          );
        } else {
          t._yearResearched = true;
          AncientSave.addLog(`📜 【${estate.name}】研发失败，食材与做法配对有误，白费了一番功夫。`, 'bad');
          AncientSave.save();
          AncientModal.showModal(
            `❌ 研发失败`,
            `食材与做法配对有误，做出来的东西难以下咽。<br>食材已消耗，今年不可再研发。`,
            [{ label:'下次再试', sub:'', cost:'', id:'ok' }],
            () => { AncientModal.closeModal(); AncientRender.render(); }
          );
        }
      }
    );
  };

  // ── 雇佣厨子 ──────────────────────────────────────────────
  const _doHireChef = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    const tiers = AncientTavernData.CHEF_TIERS;
    const costs = AncientTavernData.CHEF_COST;

    const opts = tiers.map((tier,i) => {
      const lv = i+1;
      return {
        label: `${tier}（Lv${lv}）`,
        sub:   t.chef && t.chef.level===lv ? '当前等级' : '',
        cost:  `${costs[lv]} 文/年`,
        id:    `lv_${lv}`,
      };
    });
    opts.unshift({ label:'🚫 解雇厨子（自己掌厨）', sub:'', cost:'', id:'fire' });

    AncientModal.showModal(
      `👨‍🍳 雇佣厨子`,
      `厨子等级越高，做菜效率越高，一键出菜所需次数越少。<br>工钱年末从收益中扣除。`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id === 'fire') {
          t.chef = null;
          AncientModal.showToast('已解雇厨子，今后自己掌厨。');
          AncientSave.save();
          return;
        }
        const lv = parseInt(id.replace('lv_',''));
        t.chef = { name: _genName('师傅'), level: lv, cost: costs[lv] };
        AncientSave.addLog(`👨‍🍳 【${estate.name}】雇佣${tiers[lv-1]} ${t.chef.name}，年俸 ${costs[lv]} 文。`,'info');
        AncientSave.save();
        setTimeout(() => openManageModal(estateIdx), 200);
      }
    );
  };

  // ── 雇佣小二 ──────────────────────────────────────────────
  const _doHireWaiter = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    const cost = AncientTavernData.WAITER_COST;

    AncientModal.showModal(
      `🧑 雇佣小二`,
      `有小二则顾客自动点单，无需亲自跑堂。<br>年俸 <b>${cost} 文</b>，年末从收益中扣除。`,
      [
        { label: t.waiter ? `更换小二（现：${t.waiter.name}）` : '✅ 雇一个小二', sub:`${cost} 文/年`, cost:'', id:'hire' },
        { label: '🚫 解雇小二（自己跑堂）', sub:'', cost:'', id:'fire' },
      ],
      (id) => {
        AncientModal.closeModal();
        if (id==='hire') {
          t.waiter = { name: _genName('小二'), cost };
          AncientSave.addLog(`🧑 【${estate.name}】雇佣小二 ${t.waiter.name}，年俸 ${cost} 文。`,'info');
          AncientSave.save();
          AncientModal.showToast(`已雇佣 ${t.waiter.name}！`);
        } else {
          t.waiter = null;
          AncientModal.showToast('已解雇小二，今后自己跑堂。');
          AncientSave.save();
        }
      }
    );
  };

  // ── 开门营业 ──────────────────────────────────────────────
  const _doOpen = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    if (t._yearOpened) { AncientModal.showToast('今年已开业过，明年再来！'); return; }

    const invTotal = Object.values(t.inventory).reduce((a,b)=>a+b,0);
    if (invTotal === 0) { AncientModal.showToast('食材库存为零，请先采购！'); return; }
    if (t.knownRecipes.length === 0) { AncientModal.showToast('尚无菜谱，请先研发！'); return; }

    AncientModal.showModal(
      `🏮 开门营业`,
      `今日食材库存：<b>${invTotal} 份</b>　菜谱：<b>${t.knownRecipes.length} 道</b><br>` +
      `厨子：<b>${t.chef ? t.chef.name : '自己'}</b>　小二：<b>${t.waiter ? t.waiter.name : '自己'}</b><br><br>` +
      `一旦开业便无法中途退出，请确认准备就绪。`,
      [
        { label:'🏮 开门迎客', sub:'', cost:'', id:'start' },
        { label:'↩ 再准备准备', sub:'', cost:'', id:'cancel' },
      ],
      (id) => {
        AncientModal.closeModal();
        if (id==='start') setTimeout(() => _runDay(estateIdx), 200);
      }
    );
  };

  // ── 营业主流程 ────────────────────────────────────────────
  const _runDay = (estateIdx) => {
    const { estate, t } = _get(estateIdx);

    // 生成今日顾客（随机3-6桌）
    const customerCount = _randInt(3,6);
    const customers = [];
    const types = AncientTavernData.CUSTOMER_TYPES;
    for (let i=0; i<customerCount; i++) {
      const type = _pick(types);
      customers.push({
        idx: i,
        type: type.id,
        name: type.name,
        icon: type.icon,
        orderCount: type.orderCount,
        budget: type.budget,
        orders: [],       // 已下单菜谱id列表
        served: [],       // 已上菜菜谱id列表
        done: false,
      });
    }

    // 随机触发一个场景事件
    const ev = _pick(AncientTavernData.OPERATE_EVENTS);
    t.reputation = _clamp(t.reputation + (ev.rep||0));

    let totalIncome = 0;
    let totalRepDelta = ev.rep || 0;

    _dayLoop(estateIdx, customers, 0, totalIncome, totalRepDelta, ev);
  };

  // 顾客轮流处理
  const _dayLoop = (estateIdx, customers, idx, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);

    // 找下一个未完成的顾客
    const pending = customers.filter(c => !c.done);
    if (pending.length === 0) {
      _dayEnd(estateIdx, totalIncome, totalRepDelta, openEv);
      return;
    }

    const c = pending[0];
    _handleCustomer(estateIdx, c, customers, totalIncome, totalRepDelta, openEv);
  };

  // 处理单个顾客
  const _handleCustomer = (estateIdx, c, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const hasWaiter = !!t.waiter;
    const knownRecipes = AncientTavernData.RECIPES.filter(r => t.knownRecipes.includes(r.id));

    // 顾客进门
    const pendingOrders = c.orders.filter(oid => !c.served.includes(oid));
    const allServed = c.orders.length > 0 && pendingOrders.length === 0;

    if (allServed) {
      // 顾客已吃完，结账
      const income = c.orders.reduce((sum,oid) => {
        const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
        return sum + (r ? r.price : 0);
      }, 0);
      totalIncome += income;
      c.done = true;
      AncientModal.showModal(
        `${c.icon} ${c.name} 结账`,
        `满意用餐，结账离席。<br>本桌收入：<b style="color:var(--amber)">${income} 文</b>`,
        [{ label:'下一位 →', sub:`还有 ${customers.filter(cx=>!cx.done).length-1} 桌`, cost:'', id:'next' }],
        () => {
          AncientModal.closeModal();
          setTimeout(() => _dayLoop(estateIdx, customers, 0, totalIncome, totalRepDelta, openEv), 120);
        }
      );
      return;
    }

    if (c.orders.length === 0) {
      // 还没点单
      if (hasWaiter) {
        // 小二自动点单
        const autoOrders = [];
        for (let i=0; i<c.orderCount && i<knownRecipes.length; i++) {
          const r = _pick(knownRecipes.filter(r=>!autoOrders.includes(r.id)));
          if (r) autoOrders.push(r.id);
        }
        c.orders = autoOrders;
        AncientModal.showModal(
          `${c.icon} ${c.name} 入座`,
          `小二 ${t.waiter.name} 前去招呼，顾客点了：<br><b>${autoOrders.map(id=>{const r=AncientTavernData.RECIPES.find(r=>r.id===id); return r?r.icon+r.name:id;}).join('、')}</b>`,
          [{ label:'去厨房备菜 →', sub:'', cost:'', id:'kitchen' }],
          () => {
            AncientModal.closeModal();
            setTimeout(() => _goKitchen(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
          }
        );
      } else {
        // 自己点单：让玩家选菜
        const menuOpts = knownRecipes.map(r => ({
          label: `${r.icon} ${r.name}`,
          sub:   `${r.cuisine} · ${r.price}文`,
          cost:  '',
          id:    r.id,
        }));
        AncientModal.showModal(
          `${c.icon} ${c.name} 入座`,
          `顾客在等候点单，请上前招呼。（可点 ${c.orderCount} 道菜）`,
          menuOpts,
          (id) => {
            AncientModal.closeModal();
            c.orders.push(id);
            if (c.orders.length < c.orderCount && knownRecipes.filter(r=>!c.orders.includes(r.id)).length > 0) {
              setTimeout(() => _handleCustomer(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
            } else {
              setTimeout(() => _goKitchen(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
            }
          }
        );
      }
    } else {
      // 有待上菜的单子，去厨房
      setTimeout(() => _goKitchen(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
    }
  };

  // ── 厨房做菜 ──────────────────────────────────────────────
  const _goKitchen = (estateIdx, c, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const pendingOrders = c.orders.filter(oid => !c.served.includes(oid));
    if (pendingOrders.length === 0) {
      setTimeout(() => _handleCustomer(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
      return;
    }

    const orderOpts = pendingOrders.map(oid => {
      const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
      const count = t.cookedCount[oid]||0;
      const canQuick = count >= 3;
      return {
        label: `${r.icon} ${r.name}`,
        sub:   canQuick ? `🔥 熟练（已做${count}次，可一键出菜）` : `已做 ${count} 次`,
        cost:  '',
        id:    oid,
      };
    });

    AncientModal.showModal(
      `👨‍🍳 厨房`,
      `${c.icon} ${c.name} 点了以下菜，选一道来做：`,
      orderOpts,
      (oid) => {
        AncientModal.closeModal();
        const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
        const count = t.cookedCount[oid]||0;

        if (count >= 3) {
          // 一键出菜
          _cookDone(estateIdx, c, oid, true, customers, totalIncome, totalRepDelta, openEv);
        } else {
          // 手动做菜：选食材+做法
          setTimeout(() => _cookManual(estateIdx, c, oid, customers, totalIncome, totalRepDelta, openEv), 200);
        }
      }
    );
  };

  // 手动做菜（选食材+做法）
  const _cookManual = (estateIdx, c, oid, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
    const ings = AncientTavernData.INGREDIENTS;

    // 第一步：选食材
    _cookPickIngredients(estateIdx, c, oid, [], customers, totalIncome, totalRepDelta, openEv);
  };

  const _cookPickIngredients = (estateIdx, c, oid, chosen, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
    const ings = AncientTavernData.INGREDIENTS;
    const available = ings.filter(i=>(t.inventory[i.id]||0)>0 && !chosen.includes(i.id));

    if (available.length === 0 && chosen.length < 2) {
      AncientModal.showToast('食材不足，无法做菜！');
      return;
    }

    const opts = available.map(i=>({
      label:`${i.icon} ${i.name}`, sub:`库存${t.inventory[i.id]}份`, cost:'', id:i.id,
    }));
    if (chosen.length >= 2) {
      opts.unshift({ label:'🍳 食材选好了，选做法', sub:`已选：${chosen.map(id=>ings.find(i=>i.id===id).name).join('+')}`, cost:'', id:'__method__' });
    }

    AncientModal.showModal(
      `🥘 做【${r.icon}${r.name}】（${chosen.length+1}/3）`,
      `已选食材：<b>${chosen.length>0?chosen.map(id=>ings.find(i=>i.id===id).name).join(' + '):'无'}</b>`,
      opts,
      (id) => {
        AncientModal.closeModal();
        if (id==='__method__') {
          setTimeout(() => _cookPickMethod(estateIdx, c, oid, chosen, customers, totalIncome, totalRepDelta, openEv), 200);
          return;
        }
        // 消耗食材
        t.inventory[id] = Math.max(0,(t.inventory[id]||0)-1);
        const newChosen = [...chosen, id];
        if (newChosen.length >= 3) {
          setTimeout(() => _cookPickMethod(estateIdx, c, oid, newChosen, customers, totalIncome, totalRepDelta, openEv), 200);
        } else {
          setTimeout(() => _cookPickIngredients(estateIdx, c, oid, newChosen, customers, totalIncome, totalRepDelta, openEv), 200);
        }
      }
    );
  };

  const _cookPickMethod = (estateIdx, c, oid, chosen, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const r = AncientTavernData.RECIPES.find(r=>r.id===oid);
    const ings = AncientTavernData.INGREDIENTS;
    const methods = AncientTavernData.METHODS;

    const opts = methods.map(m=>({ label:`${m.icon} ${m.name}`, sub:'', cost:'', id:m.id }));

    AncientModal.showModal(
      `🍳 做【${r.icon}${r.name}】— 选做法`,
      `食材：<b>${chosen.map(id=>ings.find(i=>i.id===id)?.name||id).join(' + ')}</b>`,
      opts,
      (methodId) => {
        AncientModal.closeModal();
        const chosenSet = new Set(chosen);
        const correct = r.ingredients.every(i=>chosenSet.has(i)) && r.method===methodId;
        _cookDone(estateIdx, c, oid, correct, customers, totalIncome, totalRepDelta, openEv);
      }
    );
  };

  const _cookDone = (estateIdx, c, oid, success, customers, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    const r = AncientTavernData.RECIPES.find(r=>r.id===oid);

    if (success) {
      t.cookedCount[oid] = (t.cookedCount[oid]||0) + 1;
      c.served.push(oid);
      AncientModal.showModal(
        `✅ 出菜成功`,
        `${r.icon} <b>${r.name}</b> 做好了，端给客人！`,
        [{ label:'上菜 →', sub:'', cost:'', id:'ok' }],
        () => {
          AncientModal.closeModal();
          setTimeout(() => _handleCustomer(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
        }
      );
    } else {
      // 做错了，食材已消耗，换一道或重试
      t.reputation = _clamp(t.reputation - 2);
      totalRepDelta -= 2;
      AncientModal.showModal(
        `❌ 做砸了`,
        `${r.icon} <b>${r.name}</b> 做出来不对劲，食材白费了。<br>声誉 <b style="color:var(--red)">-2</b>`,
        [
          { label:'重新尝试', sub:'再消耗一次食材', cost:'', id:'retry' },
          { label:'上个凑合的', sub:'顾客会不满意', cost:'', id:'skip'  },
        ],
        (id) => {
          AncientModal.closeModal();
          if (id==='retry') {
            setTimeout(() => _cookManual(estateIdx, c, oid, customers, totalIncome, totalRepDelta, openEv), 200);
          } else {
            c.served.push(oid); // 强行标记上了
            t.reputation = _clamp(t.reputation - 3);
            totalRepDelta -= 3;
            setTimeout(() => _handleCustomer(estateIdx, c, customers, totalIncome, totalRepDelta, openEv), 200);
          }
        }
      );
    }
  };

  // ── 收摊结算 ──────────────────────────────────────────────
  const _dayEnd = (estateIdx, totalIncome, totalRepDelta, openEv) => {
    const { estate, t } = _get(estateIdx);
    t._yearOpened = true;

    // 存入待年末结算
    if (!AncientState.G.pendingTavernIncome) AncientState.G.pendingTavernIncome = 0;
    AncientState.G.pendingTavernIncome += totalIncome;

    AncientSave.addLog(`🏮 【${estate.name}】今日营业结束，流水 ${totalIncome} 文，声誉变化 ${totalRepDelta>=0?'+':''}${totalRepDelta}。`, 'good');
    AncientSave.save();

    AncientModal.showModal(
      `🏮 打烊`,
      `今日营业结束。<br><br>` +
      `📋 场景：${openEv.text}<br><br>` +
      `今日流水：<b style="color:var(--amber)">${totalIncome} 文</b><br>` +
      `声誉变化：<b>${totalRepDelta>=0?'+':''}${totalRepDelta}</b>　当前声誉：<b>${t.reputation}</b>`,
      [{ label:'收摊回家', sub:'', cost:'', id:'ok' }],
      () => { AncientModal.closeModal(); AncientRender.render(); }
    );
  };

  // ── 托管 ──────────────────────────────────────────────────
  const _doManagedOn = (estateIdx) => {
    const { estate, t } = _get(estateIdx);

    // 前置检查：必须有厨子、小二、至少一道菜谱
    if (!t.chef) {
      AncientModal.showToast('没有厨子，无法托管！');
      return;
    }
    if (!t.waiter) {
      AncientModal.showToast('没有小二，无法托管！');
      return;
    }
    if (t.knownRecipes.length === 0) {
      AncientModal.showToast('没有菜品，无法托管！');
      return;
    }

    const cut = Math.round(AncientTavernData.MANAGER_CUT * 100);
    const name = _genName('掌柜');

    AncientModal.showModal(
      `🗂 委托托管`,
      `将【${estate.name}】委托给掌柜打理，每年收益扣除 <b>${cut}%</b> 管理费。<br>` +
      `托管期间无需坐堂，年末自动结算。`,
      [{ label:`✅ 委托 ${name}`, sub:`抽成 ${cut}%`, cost:'', id:'yes' }],
      (id) => {
        AncientModal.closeModal();
        if (id==='yes') {
          t.managed = true;
          t.managerName = name;
          AncientSave.addLog(`🗂 【${estate.name}】已委托 ${name} 托管。`, 'info');
          AncientSave.save();
          AncientRender.render();
        }
      }
    );
  };

  const _managedMenu = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    AncientModal.showModal(
      `🗂 【${estate.name}】托管中`,
      `掌柜 <b>${t.managerName}</b> 打理中，年末自动结算（扣除 ${Math.round(AncientTavernData.MANAGER_CUT*100)}% 管理费）。`,
      [
        { label:'🔓 解除托管，明年自营', sub:'', cost:'', id:'off' },
        { label:'📊 经营状况', sub:'', cost:'', id:'status' },
      ],
      (id) => {
        AncientModal.closeModal();
        if (id==='off') {
          t.managed = false; t.managerName = null;
          AncientSave.addLog(`🔓 【${estate.name}】已解除托管，明年起自营。`,'info');
          AncientSave.save(); AncientRender.render();
        } else if (id==='status') _doStatus(estateIdx);
      }
    );
  };

  // ── 状况查看 ──────────────────────────────────────────────
  const _doStatus = (estateIdx) => {
    const { estate, t } = _get(estateIdx);
    const invLines = AncientTavernData.INGREDIENTS
      .filter(i=>(t.inventory[i.id]||0)>0)
      .map(i=>`${i.icon}${i.name}×${t.inventory[i.id]}`)
      .join('　') || '无';
    const recipeLines = t.knownRecipes.map(id=>{
      const r=AncientTavernData.RECIPES.find(r=>r.id===id);
      return r?`${r.icon}${r.name}`:'';
    }).join('　') || '无';

    AncientModal.showModal(
      `📊 【${estate.name}】经营状况`,
      `🌟 声誉：<b>${t.reputation}</b><br>` +
      `👨‍🍳 厨子：<b>${t.chef?t.chef.name+'（'+AncientTavernData.CHEF_TIERS[t.chef.level-1]+'）':'自己'}</b><br>` +
      `🧑 小二：<b>${t.waiter?t.waiter.name:'自己'}</b><br>` +
      `🛒 库存：${invLines}<br>` +
      `📜 菜谱：${recipeLines}`,
      [{ label:'知道了', sub:'', cost:'', id:'ok' }],
      () => AncientModal.closeModal()
    );
  };

  // ── 年末结算（由 loop.js 调用） ───────────────────────────
  const yearEnd = () => {
    const events = [];
    if (!AncientState.G.estates) return events;

    AncientState.G.estates.forEach((estate) => {
      if (estate.type !== 'shop') return;
      _init(estate);
      const t = estate.tavern;

      let income = 0;

      if (t.managed) {
        // 托管收益计算：
        // 1. 已掌握菜谱的平均菜价
        // 2. 顾客类型的平均点单数
        // 3. 假设每天10桌客人
        // 4. 扣除厨子、小二、食材成本
        // 5. 再扣30%管理费
        const D = AncientTavernData;
        const knownRecipes = t.knownRecipes.map(id => D.RECIPES.find(r => r.id === id)).filter(Boolean);

        if (knownRecipes.length === 0 || !t.chef || !t.waiter) {
          // 不满足托管条件，收益为0
          income = 0;
        } else {
          const avgDishPrice   = knownRecipes.reduce((s, r) => s + r.price, 0) / knownRecipes.length;
          const avgOrderCount  = D.CUSTOMER_TYPES.reduce((s, c) => s + c.orderCount, 0) / D.CUSTOMER_TYPES.length;
          const tablesPerYear  = 10; // 托管每年固定估算桌数
          const grossRevenue   = Math.floor(avgDishPrice * avgOrderCount * tablesPerYear);

          // 食材成本：每道菜平均食材数×食材均价×总出菜数
          const avgIngCount    = knownRecipes.reduce((s, r) => s + r.ingredients.length, 0) / knownRecipes.length;
          const avgIngPrice    = D.INGREDIENTS.reduce((s, i) => s + i.price, 0) / D.INGREDIENTS.length;
          const totalDishes    = Math.floor(avgOrderCount * tablesPerYear);
          const ingredientCost = Math.floor(avgIngCount * avgIngPrice * totalDishes);

          const staffCostManaged = (t.chef ? t.chef.cost : 0) + (t.waiter ? t.waiter.cost : 0);
          const n = Math.max(0, grossRevenue - ingredientCost - staffCostManaged);
          income  = Math.floor(n * (1 - AncientTavernData.MANAGER_CUT));
        }
        t.reputation = Math.max(0, t.reputation - 2);
      } else {
        // 自营：取当日流水
        income = AncientState.G.pendingTavernIncome || 0;
        AncientState.G.pendingTavernIncome = 0;
      }

      // 自营才需单独扣人员工钱（托管已在收益计算中扣除）
      let staffCost = 0;
      if (!t.managed) {
        if (t.chef)   staffCost += t.chef.cost;
        if (t.waiter) staffCost += t.waiter.cost;
      }
      const netIncome = Math.max(0, income - staffCost);

      AncientState.G.money      += netIncome;
      AncientState.G.totalMoney += netIncome;

      const staffNote = staffCost > 0 ? `（扣除人员工钱 ${staffCost} 文）` : '';
      AncientSave.addLog(`🏪 【${estate.name}】年末结算，净收益 <b>${netIncome}</b> 文入账。${staffNote}`, 'good');

      events.push({
        icon: '🍶',
        title: `【${estate.name}】年末结算`,
        body:  `${t.managed?'托管':'自营'}一年，声誉 <b>${t.reputation}</b>。<br>` +
               `营业收入：${income} 文${staffCost>0?`<br>人员工钱：-${staffCost} 文`:''}` +
               `<br><br>净收益：<b style="color:var(--amber)">${netIncome} 文</b>`,
        type: 'good',
      });

      // 重置年度标记
      t._yearOpened     = false;
      t._yearResearched = false;
    });

    return events;
  };

  return { openManageModal, yearEnd };
})();

window.AncientTavernPlay = AncientTavernPlay;
