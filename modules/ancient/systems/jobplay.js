// ══════════════════════════════════════════════════════
//  jobplay.js  —  职业深度玩法：药师 / 行商 / 官员
// ══════════════════════════════════════════════════════

const AncientJobPlay = {

  // ══════════════════════════════════════════════════
  //  入口：根据职业打开对应玩法
  // ══════════════════════════════════════════════════
  open: () => {
    const job = AncientState.G.job;
    if      (job === 'doctor')   AncientJobPlay.Doctor.open();
    else if (job === 'merchant') AncientJobPlay.Merchant.open();
    else if (job === 'officer')  AncientJobPlay.Officer.open();
    else AncientModal.showToast('此职业暂无专属玩法。');
  },

  // ══════════════════════════════════════════════════
  //  药师玩法
  // ══════════════════════════════════════════════════
  Doctor: {
    open: () => {
      const G = AncientState.G;
      if (AncientActions.actionDone('doctorPlay')) {
        AncientModal.showToast('今岁已坐堂行医，来年再诊！');
        return;
      }
      // 随机来一个病人（从疾病库抽一种疾病）
      const diseases = AncientDiseasesData.DISEASES;
      const disease  = diseases[Math.floor(Math.random() * diseases.length)];
      const recipe   = AncientDiseasesData.RECIPES.find(r => r.diseaseId === disease.id);

      if (!recipe) {
        // 无配方的疾病暂时走简单流程
        AncientJobPlay.Doctor._simplePatient(disease);
        return;
      }
      AncientJobPlay.Doctor._showPatient(disease, recipe);
    },

    _simplePatient: (disease) => {
      AncientActions.markAction('doctorPlay');
      const prof = 8 + Math.floor(Math.random() * 8);
      AncientState.G.jobProf += prof;
      AncientCareer.checkPromotion();
      AncientSave.addLog(`⚕️ 今日接诊一名【${disease.name}】患者，望闻问切，尽力施治。熟练 +${prof}`, 'good');
      AncientModal.showModal('⚕️ 接诊患者',
        `病人所患：${disease.icon} ${disease.name}<br>${disease.desc}<br><br>尽力施治，患者感激涕零。<br>医术熟练 +${prof}`,
        [{label:'悬壶济世，义不容辞', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); });
      AncientSave.save();
    },

    _showPatient: (disease, recipe) => {
      AncientModal.showModal(
        '⚕️ 来了病人',
        `${disease.icon} 病人所患：<b>${disease.name}</b><br><i>${disease.desc}</i><br><br>需配制：<b>${recipe.name}</b><br>${recipe.desc}<br><br>请先查阅配方，选取正确药材。`,
        [
          {label:'📋 查阅配方，开始抓药', sub:'', cost:'', id:'start'},
          {label:'↩ 让病人稍候片刻',      sub:'放弃本次接诊', cost:'', id:'skip'},
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'start') setTimeout(() => AncientJobPlay.Doctor._pickHerbs(disease, recipe), 200);
        }
      );
    },

    // ── 第一步：选药材 ──────────────────────────────
    _pickHerbs: (disease, recipe) => {
      // 把正确药材和干扰项混合打乱
      const allHerbs = [...recipe.ingredients, ...recipe.decoys]
        .sort(() => Math.random() - 0.5);
      const selected = [];

      const showPick = () => {
        AncientModal.showModal(
          `📋 ${recipe.name} — 选取药材`,
          `配方需要 <b>${recipe.ingredients.length}</b> 味药材<br>已选：${selected.length > 0 ? selected.join('、') : '（尚未选取）'}<br><br>从药柜中取药：`,
          [
            ...allHerbs.map(h => ({
              label: `${selected.includes(h) ? '✅ ' : ''}${h}`,
              sub:   selected.includes(h) ? '已选' : '',
              cost:  '', id: h,
            })),
            {label:'✅ 确认药材，开始制药', sub:`已选${selected.length}味`, cost:'', id:'confirm'},
          ],
          (id) => {
            AncientModal.closeModal();
            if (id === 'confirm') {
              setTimeout(() => AncientJobPlay.Doctor._checkHerbs(disease, recipe, selected), 200);
            } else {
              if (selected.includes(id)) {
                selected.splice(selected.indexOf(id), 1);
              } else {
                if (selected.length < recipe.ingredients.length + 1) selected.push(id);
                else AncientModal.showToast(`最多选 ${recipe.ingredients.length} 味药材！`);
              }
              setTimeout(showPick, 100);
            }
          }
        );
      };
      showPick();
    },

    // ── 检查药材选择正确性 ──────────────────────────
    _checkHerbs: (disease, recipe, selected) => {
      const correct = recipe.ingredients.slice().sort().join(',');
      const chosen  = selected.slice().sort().join(',');
      const herbScore = correct === chosen ? 100
        : selected.filter(h => recipe.ingredients.includes(h)).length / recipe.ingredients.length * 100;

      AncientModal.showModal(
        herbScore >= 80 ? '✅ 药材选取正确' : '⚠️ 药材有误',
        herbScore >= 80
          ? `选取正确！配方所需：${recipe.ingredients.join('、')}<br><br>现在开始制药。`
          : `选取有误，正确配方：${recipe.ingredients.join('、')}<br>你选了：${selected.join('、')}<br><br>仍可继续制药，但完成度会受影响。`,
        [{label:'开始制药', sub:'', cost:'', id:'ok'}],
        () => {
          AncientModal.closeModal();
          setTimeout(() => AncientJobPlay.Doctor._doSteps(disease, recipe, herbScore, 0, 0), 200);
        }
      );
    },

    // ── 第二步：制药步骤 ────────────────────────────
    _doSteps: (disease, recipe, herbScore, stepIdx, stepProgress) => {
      if (stepIdx >= recipe.steps.length) {
        AncientJobPlay.Doctor._finish(disease, recipe, herbScore);
        return;
      }
      const step = recipe.steps[stepIdx];
      const remaining = step.times - stepProgress;

      AncientModal.showModal(
        `⚗️ 制药 — ${step.type === 'grind' ? '研磨' : '煎煮'}`,
        `${step.desc}<br><br>${step.type === 'grind' ? '🔨 研磨' : '🔥 煎煮'}进度：${stepProgress} / ${step.times}<br>还需操作 <b>${remaining}</b> 次`,
        [
          {label: step.type === 'grind' ? '🔨 研磨一次' : '🔥 再煎一会', sub:'', cost:'', id:'do'},
          {label:'⏭️ 跳过此步',  sub:'完成度-10%', cost:'', id:'skip'},
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'do') {
            const newProgress = stepProgress + 1;
            if (newProgress >= step.times) {
              setTimeout(() => AncientJobPlay.Doctor._doSteps(disease, recipe, herbScore, stepIdx + 1, 0), 200);
            } else {
              setTimeout(() => AncientJobPlay.Doctor._doSteps(disease, recipe, herbScore, stepIdx, newProgress), 200);
            }
          } else {
            // 跳过扣分
            setTimeout(() => AncientJobPlay.Doctor._doSteps(disease, recipe, Math.max(0, herbScore - 10), stepIdx + 1, 0), 200);
          }
        }
      );
    },

    // ── 结算 ────────────────────────────────────────
    _finish: (disease, recipe, herbScore) => {
      AncientActions.markAction('doctorPlay');
      const G = AncientState.G;
      const passed = herbScore >= 80;
      // 熟练度：完成度加权
      const profGain = Math.round((herbScore / 100) * 20 + 5);
      G.jobProf += profGain;
      G.mood = AncientState.clamp(G.mood + (passed ? 5 : -3));
      AncientCareer.checkPromotion();
      AncientSave.addLog(
        passed
          ? `⚕️ 为【${disease.name}】患者配制${recipe.name}，完成度${Math.round(herbScore)}%，熟练 +${profGain}。`
          : `⚕️ 配制${recipe.name}有所失误，完成度${Math.round(herbScore)}%，熟练 +${profGain}。`,
        passed ? 'good' : 'info'
      );
      AncientModal.showModal(
        passed ? '✅ 药成病除' : '⚠️ 药效欠佳',
        `${recipe.name} 制成！<br><br>完成度：<b>${Math.round(herbScore)}%</b>（需80%算成功）<br>医术熟练：+${profGain}<br>${passed ? '😊 病人病情好转，感激不尽！' : '😐 药效欠佳，病人仍需将养。'}`,
        [{label: passed ? '妙手仁心，当仁不让' : '来日再精进', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); }
      );
      AncientSave.save();
    },
  },

  // ══════════════════════════════════════════════════
  //  行商玩法
  // ══════════════════════════════════════════════════
  Merchant: {
    open: () => {
      const G = AncientState.G;
      if (AncientActions.actionDone('merchantPlay')) {
        AncientModal.showToast('今岁已出行跑商，待明年再启程！');
        return;
      }
      // 随机抽两个目的地（不重复，行商可去所有地点）
      const pool = AncientPlacesData.PLACES.slice().sort(() => Math.random() - 0.5);
      const dest1 = pool[0];
      const dest2 = pool[1];

      AncientModal.showModal(
        '🛒 出行跑商',
        `本次商路：<br>京城 → ${dest1.icon}${dest1.name} → ${dest2.icon}${dest2.name} → 京城<br><br>${dest1.name}：${dest1.traits.join('、')}<br>${dest2.name}：${dest2.traits.join('、')}<br><br>共四轮交易，请备好货物。`,
        [
          {label:'🚀 启程出发', sub:'开始跑商', cost:'', id:'start'},
          {label:'↩ 再想想',    sub:'取消',      cost:'', id:'cancel'},
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'start') {
            const tripState = {
              route: [AncientPlacesData.HOME, dest1, dest2, AncientPlacesData.HOME],
              step:  0,       // 当前在第几站（0=京城出发，1=dest1，2=dest2，3=回京）
              cargo: [],      // 持有货物 [{...good, qty, buyPrice}]
              totalProfit: 0, // 本次总利润
              profGain: 0,    // 累计熟练度
            };
            setTimeout(() => AncientJobPlay.Merchant._arriveAt(tripState), 200);
          }
        }
      );
    },

    // ── 到达某站 ────────────────────────────────────
    _arriveAt: (ts) => {
      const place = ts.route[ts.step];
      const isHome = place.id === 'home';
      const isLast = ts.step === ts.route.length - 1;

      if (isLast) {
        // 回到京城，结算
        AncientJobPlay.Merchant._finish(ts);
        return;
      }

      // 触发到达事件
      if (!isHome && place.events && place.events.length > 0) {
        const evt = place.events[Math.floor(Math.random() * place.events.length)];
        AncientJobPlay.Merchant._applyEvent(ts, place, evt);
      } else {
        AncientJobPlay.Merchant._showMarket(ts, place, {});
      }
    },

    // ── 触发随机事件 ────────────────────────────────
    _applyEvent: (ts, place, evt) => {
      const mods = {};
      let evtDesc = evt.text;

      if (evt.effect.cargoLoss && ts.cargo.length > 0) {
        const loss = evt.effect.cargoLoss;
        ts.cargo.forEach(c => { c.qty = Math.max(0, Math.floor(c.qty * (1 - loss))); });
        ts.cargo = ts.cargo.filter(c => c.qty > 0);
      }
      if (evt.effect.goodId)   mods[evt.effect.goodId] = evt.effect.priceMod || 0;
      if (evt.effect.skipRound) {
        AncientModal.showModal(`📮 ${place.icon} 抵达${place.name}`,
          `${evtDesc}<br><br>此轮无法交易，直接前往下一站。`,
          [{label:'继续赶路', sub:'', cost:'', id:'ok'}],
          () => { AncientModal.closeModal(); ts.step++; setTimeout(() => AncientJobPlay.Merchant._arriveAt(ts), 200); }
        );
        return;
      }
      if (evt.effect.bonusGood) {
        const bg = evt.effect.bonusGood;
        const existing = ts.cargo.find(c => c.id === bg.id);
        if (existing) existing.qty += bg.qty;
        else ts.cargo.push({...bg, buyPrice:0});
      }

      AncientModal.showModal(`📮 ${place.icon} 抵达${place.name} — 消息`,
        evtDesc,
        [{label:'知晓', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); setTimeout(() => AncientJobPlay.Merchant._showMarket(ts, place, mods), 200); }
      );
    },

    // ── 集市界面：买卖 ──────────────────────────────
    _showMarket: (ts, place, priceMods) => {
      const G = AncientState.G;
      const isHome = place.id === 'home';

      // 计算实时价格
      const calcPrice = (good, type) => {
        const base = good.basePrice;
        const var_ = good.priceVar;
        const rand = 1 + (Math.random() - 0.5) * var_ * 2;
        const mod  = priceMods[good.id] || 0;
        return Math.max(1, Math.round(base * rand * (1 + mod)));
      };

      // 出售区（卖掉持有货物）
      let sellHtml = '';
      if (ts.cargo.length > 0) {
        sellHtml = '<br><b>📦 出售持有货物：</b><br>';
        ts.cargo.forEach((c, i) => {
          // 在当前地点找卖价
          const sellGood = place.goods && place.goods.sell
            ? place.goods.sell.find(g => g.id === c.id) : null;
          const price = sellGood ? calcPrice(sellGood, 'sell') : Math.round(c.buyPrice * 1.1);
          const profit = (price - c.buyPrice) * c.qty;
          sellHtml += `${c.icon}${c.name} x${c.qty} → 单价${price}文（买入${c.buyPrice}文）利润${profit>=0?'+':''}${profit}文<br>`;
        });
      }

      const buyGoods  = (!isHome && place.goods && place.goods.buy)  ? place.goods.buy  : [];
      const sellGoods = (!isHome && place.goods && place.goods.sell) ? place.goods.sell : [];

      const opts = [];

      // 买货选项
      buyGoods.forEach(g => {
        const price = calcPrice(g, 'buy');
        opts.push({
          label: `🛒 买入 ${g.icon}${g.name}`,
          sub:   `单价 ${price}文 · 余钱 ${G.money}文`,
          cost:  `${price}文/件`,
          id:    `buy_${g.id}_${price}`,
        });
      });

      // 卖货选项
      ts.cargo.forEach((c, i) => {
        const sellGood = sellGoods.find(g => g.id === c.id);
        const price = sellGood ? calcPrice(sellGood, 'sell') : Math.round(c.buyPrice * 1.1);
        opts.push({
          label: `💰 卖出 ${c.icon}${c.name} x${c.qty}`,
          sub:   `单价 ${price}文（买入${c.buyPrice}文）`,
          cost:  `+${price * c.qty}文`,
          id:    `sell_${c.id}_${price}`,
        });
      });

      opts.push({label:'🚶 继续赶路', sub:'前往下一站', cost:'', id:'next'});

      AncientModal.showModal(
        `${place.icon} ${place.name} 集市`,
        `💰 余钱：${G.money}文 · 📦 货物：${ts.cargo.length}种${sellHtml}`,
        opts,
        (id) => {
          AncientModal.closeModal();
          if (id === 'next') {
            ts.step++;
            setTimeout(() => AncientJobPlay.Merchant._arriveAt(ts), 200);
          } else if (id.startsWith('buy_')) {
            const parts = id.split('_');
            const goodId = parts[1];
            const price  = parseInt(parts[2]);
            AncientJobPlay.Merchant._buyGood(ts, place, goodId, price, priceMods);
          } else if (id.startsWith('sell_')) {
            const parts = id.split('_');
            const goodId = parts[1];
            const price  = parseInt(parts[2]);
            AncientJobPlay.Merchant._sellGood(ts, place, goodId, price, priceMods);
          }
        }
      );
    },

    // ── 买货 ────────────────────────────────────────
    _buyGood: (ts, place, goodId, price, priceMods) => {
      const G = AncientState.G;
      const good = place.goods.buy.find(g => g.id === goodId);
      if (!good) return;

      // 选数量：1/3/5件
      AncientModal.showModal(
        `🛒 买入 ${good.icon}${good.name}`,
        `单价：${price}文 · 余钱：${G.money}文`,
        [1,3,5].map(qty => ({
          label: `买 ${qty} 件`,
          sub:   `花费 ${price * qty}文`,
          cost:  G.money < price * qty ? '钱不够' : `${price * qty}文`,
          id:    G.money >= price * qty ? String(qty) : 'broke',
        })).concat([{label:'↩ 不买了', sub:'', cost:'', id:'cancel'}]),
        (id) => {
          AncientModal.closeModal();
          if (id === 'cancel' || id === 'broke') {
            setTimeout(() => AncientJobPlay.Merchant._showMarket(ts, place, priceMods), 200);
            return;
          }
          const qty = parseInt(id);
          G.money -= price * qty;
          G.totalMoney -= price * qty;
          const existing = ts.cargo.find(c => c.id === goodId);
          if (existing) existing.qty += qty;
          else ts.cargo.push({...good, qty, buyPrice:price});
          ts.totalProfit -= price * qty;
          AncientSave.addLog(`🛒 于${place.name}购入${good.name}×${qty}，花费${price*qty}文。`, 'info');
          AncientSave.save();
          setTimeout(() => AncientJobPlay.Merchant._showMarket(ts, place, priceMods), 200);
        }
      );
    },

    // ── 卖货 ────────────────────────────────────────
    _sellGood: (ts, place, goodId, price, priceMods) => {
      const G = AncientState.G;
      const cargoItem = ts.cargo.find(c => c.id === goodId);
      if (!cargoItem) return;

      const totalGet = price * cargoItem.qty;
      const profit   = (price - cargoItem.buyPrice) * cargoItem.qty;
      G.money      += totalGet;
      G.totalMoney += totalGet;
      ts.totalProfit += totalGet;
      ts.cargo = ts.cargo.filter(c => c.id !== goodId);

      // 熟练度按利润计
      const profGain = Math.max(2, Math.round(Math.abs(profit) / 20));
      ts.profGain += profGain;

      AncientSave.addLog(`💰 于${place.name}售出${cargoItem.name}×${cargoItem.qty}，得${totalGet}文，利润${profit>=0?'+':''}${profit}文。`, profit >= 0 ? 'good' : 'bad');
      AncientModal.showToast(`卖出！得 ${totalGet}文，利润 ${profit>=0?'+':''}${profit}文`);
      AncientSave.save();
      setTimeout(() => AncientJobPlay.Merchant._showMarket(ts, place, priceMods), 300);
    },

    // ── 结算 ────────────────────────────────────────
    _finish: (ts) => {
      AncientActions.markAction('merchantPlay');
      const G = AncientState.G;

      // 剩余货物按买入价七折处理（没卖掉的亏损）
      ts.cargo.forEach(c => {
        const refund = Math.floor(c.buyPrice * 0.7) * c.qty;
        G.money += refund;
        ts.totalProfit += refund - c.buyPrice * c.qty;
      });

      const profGain = ts.profGain + Math.max(0, Math.round(ts.cargo.length * 2));
      G.jobProf += profGain;
      AncientCareer.checkPromotion();

      const profitStr = ts.totalProfit >= 0 ? `+${ts.totalProfit}` : `${ts.totalProfit}`;
      AncientSave.addLog(`🛒 本次跑商归来，净利润 ${profitStr}文，商道熟练 +${profGain}。`, ts.totalProfit >= 0 ? 'good' : 'bad');
      AncientModal.showModal(
        '🏠 满载而归',
        `本次商路圆满结束！<br><br>净利润：<b>${profitStr} 文</b><br>商道熟练：+${profGain}<br>${ts.cargo.length > 0 ? `剩余货物按七折处理。` : '货物全部售出，干净利落！'}`,
        [{label: ts.totalProfit >= 0 ? '🎉 不虚此行！' : '😅 下次再稳妥些', sub:'', cost:'', id:'ok'}],
        () => { AncientModal.closeModal(); AncientRender.render(); }
      );
      AncientSave.save();
    },
  },

  // ══════════════════════════════════════════════════
  //  官员玩法
  // ══════════════════════════════════════════════════
  Officer: {
    open: () => {
      const G = AncientState.G;
      // 初始化官员县务数据
      if (!G.countyData) AncientJobPlay.Officer._initCounty();
      AncientJobPlay.Officer._showDashboard();
    },

    _initCounty: () => {
      const G = AncientState.G;
      const postings = AncientCivilData.OFFICIAL_POSTINGS;
      const posting  = postings[Math.min(G.jobRank, postings.length - 1)];
      const placeId  = posting.places[Math.floor(Math.random() * posting.places.length)];
      const place    = AncientPlacesData.PLACES.find(p => p.id === placeId) || AncientPlacesData.PLACES[0];
      const termLen  = 1 + Math.floor(Math.random() * 4);
      const goalPool  = AncientCivilData.TERM_GOALS;
      const goalCount = 2 + Math.floor(Math.random() * 3);
      const goals = goalPool.slice().sort(() => Math.random() - 0.5).slice(0, goalCount).map(g => {
        const goal = {...g};
        if (g.type === 'policy') {
          const policy = AncientCivilData.POLICIES[Math.floor(Math.random() * AncientCivilData.POLICIES.length)];
          goal.targetValue = policy.name; goal.targetPolicyId = policy.id;
          goal.desc = g.desc.replace('{value}', policy.name); goal.done = false;
        } else {
          const [lo, hi] = g.valueRange;
          goal.targetValue = lo + Math.floor(Math.random() * (hi - lo));
          goal.desc = g.desc.replace('{value}', goal.targetValue);
          goal.current = 0; goal.done = false;
        }
        return goal;
      });
      // 随机抽本年公文队列（2-4份）
      const edictPool = AncientCivilData.EDICTS.slice().sort(() => Math.random() - 0.5)
        .slice(0, 2 + Math.floor(Math.random() * 3)).map(e => e.id);

      G.countyData = {
        placeId, placeName: place.name, placeIcon: place.icon,
        termLen, termYear: 0,
        morale: 60, population: 1000,
        taxRate: 25,   // 初始税率25%
        taxTotal: 0, merit: 0, disastersHandled: 0,
        policies: [], goals,
        edictQueue: edictPool,   // 本年待批公文队列
        edictsDone: [],          // 本年已处理公文
      };
      AncientSave.addLog(`🎖️ 奉旨赴任${place.icon}${place.name}，任期${termLen}年，立志造福一方。`, 'event');
    },

    // ── 县务总览 ────────────────────────────────────
    _showDashboard: () => {
      const G  = AncientState.G;
      const cd = G.countyData;
      if (!cd) return;
      const rankInfo  = AncientCivilData.OFFICER_RANKS[Math.min(G.jobRank, AncientCivilData.OFFICER_RANKS.length-1)];
      const yearTax   = Math.round(cd.population * cd.taxRate / 100 * 10);
      const goalsHtml = cd.goals.map(g => `${g.done ? '✅' : '⬜'} ${g.name}：${g.desc}`).join('<br>');
      const edictLeft = (cd.edictQueue || []).filter(id => !cd.edictsDone.includes(id)).length;

      AncientModal.showModal(
        `${cd.placeIcon} ${cd.placeName} 县务总览`,
        `品级：${rankInfo.name} · 任期：第 ${cd.termYear+1} / ${cd.termLen} 年<br>
民心：${cd.morale} · 人口：${cd.population} · 政绩：${cd.merit}<br>
税率：${cd.taxRate}% · 本年预计税收：${yearTax}文 · 累计：${cd.taxTotal}文<br><br>
<b>本任期目标：</b><br>${goalsHtml}`,
        [
          {label:'📜 批阅公文', sub: edictLeft > 0 ? `待批 ${edictLeft} 份` : '今年已批完', cost:'', id:'edict'},
          {label:'📋 颁布政策', sub:'制定县政方针', cost:'', id:'policy'},
          {label:'💰 调整税率', sub:`当前 ${cd.taxRate}%，本年税收 ${yearTax}文`, cost:'', id:'tax'},
          {label:'↩ 稍后再议', sub:'', cost:'', id:'close'},
        ],
        (id) => {
          AncientModal.closeModal();
          if      (id === 'edict')  setTimeout(() => AncientJobPlay.Officer._showNextEdict(), 200);
          else if (id === 'policy') setTimeout(() => AncientJobPlay.Officer._showPolicies(), 200);
          else if (id === 'tax')    setTimeout(() => AncientJobPlay.Officer._showTax(), 200);
        }
      );
    },

    // ── 公文：点一次批一次 ──────────────────────────
    _showNextEdict: () => {
      const G  = AncientState.G;
      const cd = G.countyData;
      const pending = (cd.edictQueue || []).filter(id => !cd.edictsDone.includes(id));
      if (pending.length === 0) {
        AncientModal.showToast('今年公文已批阅完毕，明年再议！');
        return;
      }
      const edictId = pending[0];
      const edict   = AncientCivilData.EDICTS.find(e => e.id === edictId);
      if (!edict) { cd.edictsDone.push(edictId); AncientJobPlay.Officer._showNextEdict(); return; }

      AncientModal.showModal(
        `${edict.icon} 公文：${edict.name}`,
        edict.desc,
        edict.options.map((o, i) => ({label: o.label, sub:'', cost:'', id: String(i)})),
        (id) => {
          AncientModal.closeModal();
          const opt = edict.options[parseInt(id)];
          cd.edictsDone.push(edictId);

          // 判断成功/失败
          const isSuccess = opt.successRate > 0 && Math.random() < opt.successRate;
          const result    = isSuccess ? opt.success : opt.fail;

          // 应用效果
          cd.morale      = AncientState.clamp(cd.morale + (result.moraleMod || 0), 0, 100);
          cd.taxTotal   += result.taxMod || 0;
          cd.population  = Math.max(0, Math.round(cd.population + (result.populationMod || 0)));
          cd.merit      += result.merit || 0;
          if (isSuccess && edict.type === 'disaster') cd.disastersHandled++;
          AncientJobPlay.Officer._updateGoals(cd);

          const profGain = Math.max(0, Math.round((result.merit || 0) * 0.5 + (isSuccess ? 3 : 1)));
          G.jobProf += profGain;
          AncientSave.addLog(
            `📜 【${edict.name}】${opt.label}：${result.text}`,
            isSuccess ? 'good' : 'bad'
          );
          AncientSave.save();

          // 显示结果反馈
          setTimeout(() => {
            AncientModal.showModal(
              isSuccess ? `✅ 处置得当` : `❌ 事与愿违`,
              `<b>${edict.name}</b><br><br>${result.text}<br><br>
民心 ${result.moraleMod >= 0 ? '+' : ''}${result.moraleMod} · 政绩 ${result.merit >= 0 ? '+' : ''}${result.merit}`,
              [{label: isSuccess ? '甚好，继续' : '唉，下次留意', sub:'', cost:'', id:'ok'}],
              () => { AncientModal.closeModal(); AncientSave.save(); setTimeout(() => AncientJobPlay.Officer._showDashboard(), 200); }
            );
          }, 200);
        }
      );
    },

    // ── 颁布政策 ────────────────────────────────────
    _showPolicies: () => {
      const G  = AncientState.G;
      const cd = G.countyData;
      if (AncientActions.actionDone('officerPolicy')) {
        AncientModal.showToast('今年已颁布政策，明年再议！');
        return;
      }
      const available = AncientCivilData.POLICIES.filter(p => !cd.policies.includes(p.id));
      if (available.length === 0) { AncientModal.showToast('所有政策均已颁布，无需重复。'); return; }

      AncientModal.showModal(
        '📋 颁布政策',
        '择一政策颁行，效果持续整个任期：',
        available.map(p => ({
          label: p.name, sub: p.desc,
          cost: `民心${p.effect.moraleMod>=0?'+':''}${p.effect.moraleMod} 税${p.effect.taxMod>=0?'+':''}${Math.round(p.effect.taxMod*100)}%`,
          id: p.id,
        })).concat([{label:'↩ 暂不颁布', sub:'', cost:'', id:'cancel'}]),
        (id) => {
          AncientModal.closeModal();
          if (id === 'cancel') return;
          const policy = AncientCivilData.POLICIES.find(p => p.id === id);
          if (!policy) return;
          cd.policies.push(id);
          cd.morale     = AncientState.clamp(cd.morale + (policy.effect.moraleMod || 0), 0, 100);
          cd.population = Math.round(cd.population * (1 + (policy.effect.populationMod || 0)));
          cd.merit     += 10;
          AncientActions.markAction('officerPolicy');
          AncientJobPlay.Officer._updateGoals(cd);
          G.jobProf += 8;
          AncientSave.addLog(`📋 颁布【${policy.name}】政策，${policy.desc}。政绩 +10。`, 'good');
          AncientSave.save();
          AncientModal.showToast(`已颁布【${policy.name}】`);
        }
      );
    },

    // ── 调整税率 ────────────────────────────────────
    _showTax: () => {
      const G  = AncientState.G;
      const cd = G.countyData;
      if (AncientActions.actionDone('officerTax')) {
        AncientModal.showToast('今年税率已调整，明年再议！');
        return;
      }
      const calcTax = (rate) => Math.round(cd.population * rate / 100 * 10);

      AncientModal.showModal(
        '💰 调整税率',
        `当前税率：<b>${cd.taxRate}%</b> · 本年税收：<b>${calcTax(cd.taxRate)}文</b><br>
25%为基准：高于25%增加税收但降低民心，低于25%提升民心但减少税收。<br><br>
民心：${cd.morale}`,
        [
          {label:'⬆️ 提高5%', sub:`→ ${cd.taxRate+5}%，税收 ${calcTax(cd.taxRate+5)}文，民心-5`, cost:'', id:'up'},
          {label:'⬇️ 降低5%', sub:`→ ${Math.max(0,cd.taxRate-5)}%，税收 ${calcTax(Math.max(0,cd.taxRate-5))}文，民心+5`, cost:'', id:'down'},
          {label:'✅ 维持现状', sub:`${cd.taxRate}%，税收 ${calcTax(cd.taxRate)}文`, cost:'', id:'keep'},
        ],
        (id) => {
          AncientModal.closeModal();
          if (id === 'up') {
            cd.taxRate = Math.min(100, cd.taxRate + 5);
            cd.morale  = AncientState.clamp(cd.morale - 5, 0, 100);
          } else if (id === 'down') {
            cd.taxRate = Math.max(0, cd.taxRate - 5);
            cd.morale  = AncientState.clamp(cd.morale + 5, 0, 100);
          }
          AncientActions.markAction('officerTax');
          const yearTax = calcTax(cd.taxRate);
          cd.taxTotal  += yearTax;
          G.money      += Math.floor(yearTax * 0.1);
          G.totalMoney += Math.floor(yearTax * 0.1);
          AncientJobPlay.Officer._updateGoals(cd);
          AncientSave.addLog(`💰 税率定为${cd.taxRate}%，本年税收${yearTax}文。`, 'info');
          AncientSave.save();
          AncientModal.showToast(`税率 ${cd.taxRate}%，本年税收 ${yearTax}文`);
        }
      );
    },

    // ── 更新目标进度 ────────────────────────────────
    _updateGoals: (cd) => {
      cd.goals.forEach(g => {
        if (g.done) return;
        if (g.type === 'min'    && g.id === 'morale')      { if (cd.morale >= g.targetValue) g.done = true; }
        if (g.type === 'total'  && g.id === 'tax')          { g.current = cd.taxTotal;        if (cd.taxTotal >= g.targetValue) g.done = true; }
        if (g.type === 'total'  && g.id === 'population')   { g.current = cd.population;      if (cd.population >= 1000 + g.targetValue) g.done = true; }
        if (g.type === 'total'  && g.id === 'disaster')     { g.current = cd.disastersHandled;if (cd.disastersHandled >= g.targetValue) g.done = true; }
        if (g.type === 'policy')                             { if (cd.policies.includes(g.targetPolicyId)) g.done = true; }
      });
    },

    // ── 官员晋升：18级逐级，政绩斐然最多跳两级 ────
    checkPromotion: () => {
      const G = AncientState.G;
      const cd = G.countyData;
      if (!cd) return;
      const maxRank = AncientCivilData.OFFICER_RANKS.length - 1; // 17
      if (G.jobRank >= maxRank) return;

      const jumpTwo = cd.merit >= 80;
      const levels  = jumpTwo ? Math.min(2, maxRank - G.jobRank) : 1;
      G.jobRank     = Math.min(maxRank, G.jobRank + levels);

      const newRank  = AncientCivilData.OFFICER_RANKS[G.jobRank];
      const reward   = 80 + G.jobRank * 30;
      G.money       += reward;
      G.totalMoney  += reward;
      G.mood         = AncientState.clamp(G.mood + 15);
      cd.merit       = 0;
      AncientSave.addLog(`🎊 擢升为【${newRank.name}】${jumpTwo?'，政绩斐然，越级擢升！':''}，赐赏 ${reward}文！`, 'event');

      setTimeout(() => AncientModal.showModal('🎊 擢升高位！',
        `恭喜荣膺 <b>【${newRank.name}】</b>！${jumpTwo?'<br>政绩斐然，破格越级！':''}<br><br>🪙 朝廷赐赏：+${reward} 文<br>😊 心情 +15`,
        [{label:'🎉 谢主隆恩！', sub:'', cost:'', id:'ok'}],
        () => AncientModal.closeModal()), 300);
    },

    // ── 年末结算 ─────────────────────────────────────
    yearEnd: () => {
      const G  = AncientState.G;
      const cd = G.countyData;
      if (!cd || G.job !== 'officer') return;

      cd.termYear++;
      // 重新生成下一年公文队列，保留税率
      cd.edictQueue = AncientCivilData.EDICTS.slice().sort(() => Math.random() - 0.5)
        .slice(0, 2 + Math.floor(Math.random() * 3)).map(e => e.id);
      cd.edictsDone = [];

      const allDone = cd.goals.every(g => g.done);

      if (allDone || cd.termYear >= cd.termLen) {
        const meritBonus = Math.round(cd.merit * 0.5);
        G.money      += meritBonus * 2;
        G.totalMoney += meritBonus * 2;
        G.mood        = AncientState.clamp(G.mood + (allDone ? 20 : 5));
        // 任期结束触发晋升判断
        AncientJobPlay.Officer.checkPromotion();
        AncientSave.addLog(
          allDone
            ? `🏆 任期目标全部完成，政绩卓著！朝廷嘉奖 ${meritBonus*2}文。`
            : `📋 任期届满，政绩 ${cd.merit}，获赏 ${meritBonus*2}文。`,
          allDone ? 'good' : 'info'
        );
        G.countyData = null; // 重置，下次重新派任
      } else {
        AncientSave.addLog(`📋 ${cd.placeName}任期第${cd.termYear}年结束，民心${cd.morale}，政绩${cd.merit}。`, 'info');
      }
      AncientSave.save();
    },
  },
};

window.AncientJobPlay = AncientJobPlay;
window.openJobPlay    = AncientJobPlay.open;
window.officerYearEnd = AncientJobPlay.Officer.yearEnd;
