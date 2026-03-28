// Render system
const AncientRender = {
  render: () => {
    if (AncientState.G.dead) {
      AncientRender.renderObituary();
      return;
    }
    AncientRender.renderMain();
  },

  renderMain: () => {
    const G = AncientState.G;
    const app = document.getElementById('app-main');
    const job = AncientJobs.JOBS.find(j => j.id === G.job);
    const agePhase = G.age<7?'幼年':G.age<15?'少年':G.age<30?'青年':G.age<50?'壮年':G.age<70?'中老年':'暮年';
    const bgInfo = AncientFamilyData.FAMILY_BG[G.familyBg] || AncientFamilyData.FAMILY_BG.normal;
    const rankLabel = job ? job.ranks[Math.min(G.jobRank, job.ranks.length-1)] : '';
    const profNeeded = job && Array.isArray(job.profPerRank) ? (job.profPerRank[Math.min(G.jobRank,job.profPerRank.length-1)]||0) : 0;
    const profPct = profNeeded>0 ? Math.min(100,(G.jobProf/profNeeded)*100) : (G.jobRank>=(job&&job.ranks?job.ranks.length-1:0)?100:0);
    const hasSick = G.diseases && G.diseases.length > 0;

    app.innerHTML = `
    <div class="main">
      <div class="main-grid">
        <div>
          <div class="avatar-card fadeup">
            <div class="avatar-emoji">${G.emoji}</div>
            <div class="avatar-name">${G.name}</div>
            <div class="avatar-meta">${G.gender==='male'?'男':'女'} · ${agePhase} · ${G.age}岁</div>
            <div style="margin-top:6px">
              <span class="avatar-tag tag-age">年龄 ${G.age}</span>
              <span class="avatar-tag tag-job">${job.icon} ${job.name}${rankLabel?` · ${rankLabel}`:''}</span>
              <span class="avatar-tag tag-family">${bgInfo.icon} ${bgInfo.label}</span>
              ${G.married?`<span class="avatar-tag tag-married">💑 已婚</span>`:''}
              ${G.inSchool?`<span class="avatar-tag tag-alive">📖 就读中·${G.schoolGrade||'F'}</span>`:''}
              ${hasSick?G.diseases.map(d=>`<span class="avatar-tag tag-sick">${d.icon} ${d.name}</span>`).join(''):''}
            </div>
            ${job&&job.id!=='none'&&profNeeded>0?`
            <div class="xp-bar-wrap">
              <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--faint);margin-bottom:2px"><span>熟练度·${rankLabel}</span><span>${G.jobProf}/${profNeeded}</span></div>
              <div class="xp-bar"><div class="xp-fill" style="width:${profPct}%"></div></div>
            </div>`:(job&&job.id!=='none'&&G.jobRank>=(job.ranks.length-1)?`<div style="font-size:8px;color:var(--amber);text-align:center;margin-top:4px">🏆 已达最高职级【${rankLabel}】</div>`:'')}
          </div>
          <div class="card fadeup">
            <div class="ct">人物属性</div>
            ${AncientRender.statRow('❤️','健康',G.health,'#ef4444')}
            ${AncientRender.statRow('😊','心情',G.mood,'#f59e0b')}
            ${AncientRender.statRow('🧠','智识',G.intel,'#3b82f6')}
            ${AncientRender.statRow('✨','魅力',G.charm,'#a855f7')}
            <div class="stat-row" style="border-top:1px solid var(--border);margin-top:4px;padding-top:6px">
              <span class="stat-icon">🪙</span>
              <span class="stat-label">余钱</span>
              <span style="font-size:13px;font-weight:700;color:var(--amber);font-family:var(--serif)">${G.money} 文</span>
            </div>
          </div>
          <div class="card fadeup" style="max-height:200px;overflow-y:auto">
            <div class="ct">人生日志</div>
            <div style="font-size:10px;line-height:1.7">
              ${G.log.slice(0,8).map(l=>`<div style="padding:2px 0;border-bottom:1px solid var(--border)"><span style="color:var(--faint);font-size:9px">[${l.age}岁]</span> <span class="log-${l.type}">${l.text}</span></div>`).join('')}
              ${G.log.length===0?'<div style="color:var(--faint);text-align:center;padding:8px">人生才刚开始...</div>':''}
            </div>
          </div>
        </div>
        <div>
          <div class="tabs" id="tabs">
            <button class="tab on" onclick="switchTab('actions')">行动</button>
            <button class="tab" onclick="switchTab('career')">职业</button>
            <button class="tab" onclick="switchTab('places')">地点</button>
            <button class="tab" onclick="switchTab('estate')">地产</button>
            <button class="tab" onclick="switchTab('bag')">包裹</button>
            <button class="tab" onclick="switchTab('log')">日志</button>
            <button class="tab" onclick="switchTab('family')">家族</button>
          </div>
          <div class="panel on card" id="panel-actions" style="border-top:none;border-radius:0 0 6px 6px">
            ${AncientRender.renderActions()}
            <button class="next-btn" onclick="nextYear()">岁月流逝 · 度过一年 →</button>
          </div>
          <div class="panel card" id="panel-career" style="border-top:none;border-radius:0 0 6px 6px">${AncientRender.renderCareer()}</div>
          <div class="panel card" id="panel-places" style="border-top:none;border-radius:0 0 6px 6px">${AncientRender.renderPlaces()}</div>
          <div class="panel card" id="panel-estate" style="border-top:none;border-radius:0 0 6px 6px">${AncientRender.renderEstate()}</div>
          <div class="panel card" id="panel-bag"    style="border-top:none;border-radius:0 0 6px 6px">${AncientRender.renderBag()}</div>
          <div class="panel card" id="panel-log"    style="border-top:none;border-radius:0 0 6px 6px">
            <div class="ct">人生记录</div>
            <div class="log-wrap">
              ${G.log.map(l=>`<div class="log-entry"><span class="log-age">[${l.age}岁]</span><span class="log-${l.type}">${l.text}</span></div>`).join('')}
              ${G.log.length===0?'<div style="color:var(--faint);font-size:10px;text-align:center;padding:20px">人生才刚开始...</div>':''}
            </div>
          </div>
          <div class="panel card" id="panel-family" style="border-top:none;border-radius:0 0 6px 6px">${AncientRender.renderFamilyPanel()}</div>
        </div>
      </div>
    </div>`;
    setTimeout(restoreTab, 0);
  },

  statRow: (icon, label, val, color) => {
    const pct = AncientState.clamp(val);
    const dangerColor = val<=20 ? '#ef4444' : color;
    return `<div class="stat-row">
      <span class="stat-icon">${icon}</span>
      <span class="stat-label">${label}</span>
      <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${dangerColor};border-radius:2px"></div>
      </div>
      <span class="stat-val">${val}</span>
    </div>`;
  },

  renderActions: () => {
    const G = AncientState.G;
    let html = `<div class="ct">今年可做的行动</div><div class="action-grid">`;
    const act = [
      {icon:'💪',name:'锻炼身体',desc:'健康 +3~6',cls:'ab-red',fn:'exercise()'},
      {icon:'🧘',name:'打坐冥想',desc:'心情 +3~6',cls:'ab-purple',fn:'meditate()'},
      {icon:'💊',name:'自我疗愈',desc:'健康 +8~15',cls:'ab-red',fn:'healSelf()',dis:G.health>=80},
      {icon:'👵',name:'拜访邻里',desc:'随机遭遇',cls:'ab-blue',fn:'visitNeighbor()'}
    ];
    act.forEach(a => {
      html += `<button class="action-btn ${a.cls}" ${a.dis?'disabled':''} onclick="${a.fn}">
        <div class="ab-icon">${a.icon}</div><div class="ab-name">${a.name}</div><div class="ab-cost">${a.desc}</div>
      </button>`;
    });
    html += `</div>`;
    if (G.parents && G.parents.some(p => p.alive)){
      html += `<div class="sec-head">父母</div><div class="action-grid">`;
      G.parents.forEach((p,i) => {
        if (!p.alive) return;
        html += `<button class="action-btn ${p.favor!=null&&p.favor<30?'ab-gray':'ab-green'}" onclick="interactParent(${i})">
          <div class="ab-icon">${p.emoji}</div><div class="ab-name">${p.name}</div><div class="ab-cost">${p.rel}</div>
        </button>`;
      });
      html += `</div>`;
    }
    return html;
  },

  renderCareer: () => {
    const G = AncientState.G;
    const job = AncientJobs.JOBS.find(j => j.id === G.job);
    let html = `<div class="ct">职业与生计</div>`;
    html += `<div class="action-grid">`;
    html += `<button class="action-btn ab-amber" onclick="openJobModal()">
      <div class="ab-icon">💼</div><div class="ab-name">转换职业</div><div class="ab-cost">选择工作</div>
    </button>`;
    html += `</div>`;
    if(job && job.id !== 'none'){
      const rankLabel = job.ranks[Math.min(G.jobRank, job.ranks.length-1)];
      const profNeeded = job.profPerRank && Array.isArray(job.profPerRank) ? (job.profPerRank[Math.min(G.jobRank,job.profPerRank.length-1)]||0) : 0;
      const profPct = profNeeded>0 ? Math.min(100,(G.jobProf/profNeeded)*100) : 100;
      html += `<div style="background:var(--amber-l);border:1px solid rgba(217,119,6,.2);border-radius:6px;padding:10px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:22px">${job.icon}</span>
          <div>
            <div style="font-family:var(--serif);font-size:13px;font-weight:600">${job.name} · <span style="color:var(--amber)">${rankLabel}</span></div>
            <div style="font-size:9px;color:var(--muted)">${job.desc}</div>
          </div>
        </div>
        ${profNeeded>0?`<div style="font-size:8px;color:var(--faint);margin-bottom:2px">熟练度 ${G.jobProf}/${profNeeded}</div>
        <div class="xp-bar"><div class="xp-fill" style="width:${profPct}%"></div></div>`:'<div style="font-size:8px;color:var(--amber)">已达最高职级</div>'}
        <div style="font-size:9px;color:var(--muted);margin-top:6px">薪俸区间：${Math.round(job.salaryRange[0])} ～ ${Math.round(job.salaryRange[1]*(1+(job.ranks.length-1)*0.3))} 文/年</div>
        <div style="font-size:9px;color:var(--faint);margin-top:3px">职级路径：${job.ranks.join(' → ')}</div>
      </div>`;
    } else {
      html += `<div style="color:var(--faint);font-size:10px;text-align:center;padding:16px">尚无职业，前往"转换职业"寻找差事。</div>`;
    }
    return html;
  },

  renderPlaces: () => {
    const G = AncientState.G;
    let html = `<div class="ct">地点 — 读万卷书，行万里路</div>`;
    html += `<div class="sec-head">求学问道</div><div class="action-grid">`;
    AncientLocations.LOCATIONS.filter(l=>l.cat==='study'&&G.age>=l.minAge).forEach(loc => {
      html += `<button class="action-btn ab-indigo" onclick="openVenue('${loc.id}')">
        <div class="ab-icon">${loc.icon}</div><div class="ab-name">${loc.name}</div><div class="ab-cost">${loc.desc}</div>
      </button>`;
    });
    html += `</div><div class="sec-head">社交场所</div><div class="action-grid">`;
    AncientLocations.LOCATIONS.filter(l=>l.cat==='social'&&G.age>=l.minAge).forEach(loc => {
      html += `<button class="action-btn ab-blue" onclick="openVenue('${loc.id}')">
        <div class="ab-icon">${loc.icon}</div><div class="ab-name">${loc.name}</div><div class="ab-cost">${loc.desc}</div>
      </button>`;
    });
    html += `</div><div class="sec-head">商铺医馆</div><div class="action-grid">`;
    AncientLocations.LOCATIONS.filter(l=>l.cat==='service'&&G.age>=l.minAge).forEach(loc => {
      const cls = loc.id==='shopst'?'ab-amber':loc.id==='clinic'?'ab-red':'ab-blue';
      html += `<button class="action-btn ${cls}" onclick="openVenue('${loc.id}')">
        <div class="ab-icon">${loc.icon}</div><div class="ab-name">${loc.name}</div><div class="ab-cost">${loc.desc}</div>
      </button>`;
    });
    html += `</div>`;
    if (G.npcs && G.npcs.length > 0){
      html += `<div class="sec-head">社交圈（已结交）</div>`;
      G.npcs.forEach((npc,i) => {
        html += `<div class="family-item">
          <span class="fi-icon">${npc.emoji}</span>
          <div class="fi-info">
            <div class="fi-name">${npc.name} <span style="font-size:9px;color:var(--faint)">${npc.gender==='male'?'男':'女'} · ${npc.age}岁 · ${npc.job}</span></div>
            <div class="fi-rel">${npc.trait} · 好感<span style="color:var(--purple);font-weight:500">${npc.favor}</span>/100</div>
          </div>
          <button class="fi-btn" onclick="openNPCInteract(${i})">互动</button>
        </div>`;
      });
    }
    return html;
  },

  renderEstate: () => {
    const G = AncientState.G;
    if (!G.estates) G.estates = [];
    let html = `<div class="ct">地产 — 安居乐业，广置田产</div>`;
    if (G.estates.length > 0){
      html += `<div class="sec-head">名下地产</div>`;
      G.estates.forEach((e,i) => {
        const residents = e.residents || [];
        const occupied = residents.length;
        const hasMinor = G.children.some(c => c.age<18 && residents.includes(c.name));
        html += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:8px">
          <div style="display:flex;align-items:flex-start;gap:8px">
            <span style="font-size:22px">${e.icon}</span>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:600">${e.name} <span style="font-size:9px;color:var(--amber)">入住${occupied}/${e.capacity}人</span></div>
              <div style="font-size:9px;color:var(--faint)">${e.desc}</div>
              ${e.incomePerYear>0?`<div style="font-size:9px;color:var(--green)">每年收入+${e.incomePerYear}文</div>`:''}
              <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px">
                ${residents.map(r=>`<span class="estate-resident-chip" onclick="removeFromEstate(${i},'${r}')" title="点击移出">${r} ✕</span>`).join('')}
                ${occupied===0?`<span style="font-size:9px;color:var(--faint)">空置</span>`:''}
              </div>
              <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                ${AncientEstate.familyResidents().filter(fr=>!residents.includes(fr.name)&&occupied<e.capacity).map(fr=>`<button class="fi-btn" onclick="addToEstate(${i},'${fr.name}')" style="font-size:8px">${fr.emoji} 安置${fr.label.split('（')[0]}</button>`).join('')}
              </div>
            </div>
            <button class="fi-btn" onclick="sellEstate(${i})" style="color:var(--red)" ${hasMinor?'disabled title="有未成年子女居住，不可售出"':''}>售出</button>
          </div>
        </div>`;
      });
    } else {
      html += `<div style="color:var(--faint);font-size:10px;text-align:center;padding:12px">名下尚无房产田产。</div>`;
    }
    html += `<div class="sec-head">购置地产（当前余钱 🪙${G.money}文）</div><div class="shop-grid">`;
    AncientEstates.ESTATES.forEach(e => {
      const canBuy = G.money >= e.price;
      html += `<div class="shop-item${canBuy?'':' sold-out'}" onclick="${canBuy?`buyEstate('${e.id}')`:''}" >
        <div class="si-icon">${e.icon}</div>
        <div class="si-name">${e.name} <span style="font-size:8px;color:var(--faint)">容${e.capacity}人</span></div>
        <div class="si-desc">${e.desc}</div>
        <div class="si-price">🪙 ${e.price}文${e.incomePerYear>0?' · 年入'+e.incomePerYear+'文':''}${!canBuy?' · 钱不够':''}</div>
      </div>`;
    });
    html += `</div>`;
    return html;
  },

  renderBag: () => {
    const G = AncientState.G;
    const slots = [];
    for (let i=0; i<G.bagLimit; i++){
      const item = G.inventory[i] || null;
      slots.push(item
        ? `<div class="inv-slot" onclick="useItem(${i})" title="点击使用：${item.name}"><span>${item.icon}</span><span class="slot-name">${item.name}</span></div>`
        : `<div class="inv-slot empty"><span style="font-size:10px;color:var(--faint)">空</span></div>`);
    }
    return `<div class="ct">包裹 ${G.inventory.length}/${G.bagLimit}</div>
      <div class="inv-grid">${slots.join('')}</div>
      <div style="font-size:9px;color:var(--faint);margin-top:4px">点击物品即可使用/赠送。可在商店购买大布袋扩展容量（最大 20）。</div>`;
  },

  renderFamilyPanel: () => {
    const G = AncientState.G;
    let html = `<div class="ct">家族 — 血脉相连</div>`;
    if (G.parents && G.parents.length > 0){
      html += `<div class="sec-head">父母</div>`;
      G.parents.forEach((p,i) => {
        if (!p.alive){ html+=`<div class="family-item"><span class="fi-icon">${p.emoji}</span><div class="fi-info"><div class="fi-name">${p.name}</div><div class="fi-rel">${p.rel} · 已故</div></div></div>`; return; }
        const fav = p.favor!=null?p.favor:(G.parentFavor||50);
        html += `<div class="family-item">
          <span class="fi-icon">${p.emoji}</span>
          <div class="fi-info">
            <div class="fi-name">${p.name}</div><div class="fi-rel">${p.rel}</div>
            <div style="display:flex;align-items:center;gap:4px;margin-top:3px">
              <span style="font-size:9px;color:var(--faint)">好感</span>
              <div style="width:60px;height:4px;background:var(--border);border-radius:2px;overflow:hidden"><div style="width:${Math.min(100,fav)}%;height:100%;background:var(--purple);border-radius:2px"></div></div>
              <span style="font-size:9px;color:var(--purple)">${fav}</span>
            </div>
          </div>
          <button class="fi-btn" onclick="interactParent(${i})">互动</button>
        </div>`;
      });
    }
    if (G.married && G.spouseName){
      html += `<div class="sec-head">配偶</div>
      <div class="family-item">
        <span class="fi-icon">${G.spouseEmoji||'👤'}</span>
        <div class="fi-info">
          <div class="fi-name">${G.spouseName}</div>
          <div class="fi-rel">${G.spouseGender==='male'?'夫君':'夫人'}</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:3px">
            <div style="width:60px;height:4px;background:var(--border);border-radius:2px;overflow:hidden"><div style="width:${Math.min(100,G.spouseFavor||50)}%;height:100%;background:var(--purple);border-radius:2px"></div></div>
            <span style="font-size:9px;color:var(--purple)">${G.spouseFavor||50}</span>
          </div>
        </div>
        <button class="fi-btn" onclick="openSpouseInteract()">互动</button>
      </div>`;
      if (G.concubines && G.concubines.length > 0){
        html += `<div class="sec-head">内室成员</div>`;
        G.concubines.forEach((c,i) => {
          html += `<div class="family-item"><span class="fi-icon">${c.emoji}</span><div class="fi-info"><div class="fi-name">${c.name}</div><div class="fi-rel">${c.role==='concubine'?'妾室':'面首'} · 好感${c.favor}</div></div><button class="fi-btn" onclick="openConcubineInteract(${i})">互动</button></div>`;
        });
      }
    }
    if (G.children.length > 0){
      html += `<div class="sec-head">子嗣</div>`;
      G.children.forEach((c,i) => {
        html += `<div class="family-item">
          <span class="fi-icon">${c.emoji}</span>
          <div class="fi-info"><div class="fi-name">${c.name}</div><div class="fi-rel">${c.gender==='male'?'子':'女'} · ${c.age}岁</div></div>
          <div style="display:flex;gap:4px">
            <button class="fi-btn" onclick="openChildInteract(${i})">互动</button>
            ${!G.dead&&c.age>=18?`<button class="fi-btn" style="color:var(--amber)" onclick="inheritChild(${i})">继承</button>`:''}
          </div>
        </div>`;
      });
    }
    if ((!G.parents||G.parents.length===0)&&!G.married&&G.children.length===0)
      html += `<div style="color:var(--faint);font-size:10px;text-align:center;padding:16px">暂无家族成员</div>`;
    if (G.ancestors && G.ancestors.length > 0){
      html += `<div class="sec-head">先祖</div>`;
      G.ancestors.forEach(a => { html+=`<div class="family-item"><span class="fi-icon">${a.emoji}</span><div class="fi-info"><div class="fi-name">${a.name}</div><div class="fi-rel">${a.rel} · 享年${a.age}岁</div></div></div>`; });
    }
    return html;
  },

  renderObituary: () => {
    const G = AncientState.G;
    const app = document.getElementById('app-main');
    const inheritables = G.children.filter(c => c.age>=18);
    app.innerHTML = `
    <div class="main"><div class="card fadeup" style="max-width:520px;margin:20px auto">
      <div class="obituary">
        <div class="obit-icon">${G.emoji}</div>
        <div class="obit-title">${G.name} 已离世</div>
        <div class="obit-sub">${G.deathCause}<br>享年 ${G.age} 岁 · ${G.gender==='male'?'男':'女'} · ${AncientJobs.JOBS.find(j=>j.id===G.job).name}${G.married?`<br>配偶：${G.spouseName}`:''}${G.children.length>0?`<br>子嗣 ${G.children.length} 人`:''}</div>
        <div class="obit-stats">
          <div class="os"><div class="os-val">${G.age}</div><div class="os-lbl">享年</div></div>
          <div class="os"><div class="os-val">${G.totalMoney}</div><div class="os-lbl">一生积财 (文)</div></div>
          <div class="os"><div class="os-val">${G.children.length}</div><div class="os-lbl">子嗣数</div></div>
        </div>
        ${inheritables.length>0?`<div style="font-size:11px;color:var(--muted);margin-bottom:10px;text-align:left">选择继承人：</div>
        <div class="inherit-list">${inheritables.map((c,i)=>`<div class="inherit-item" onclick="inheritChild(${G.children.indexOf(c)})">
          <div class="ii-left"><span class="ii-icon">${c.emoji}</span><div><div class="ii-name">${c.name}</div><div class="ii-rel">${c.gender==='male'?'子':'女'}</div></div></div>
          <span class="ii-age">${c.age}岁 →</span>
        </div>`).join('')}</div>`:`<div style="font-size:10px;color:var(--faint);margin-bottom:16px">无成年子嗣可继承。</div>`}
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="btn ba" onclick="viewLog()">查看日志</button>
          <button class="btn bc" onclick="confirmRestart()">⟳ 重入轮回</button>
        </div>
      </div>
    </div></div>`;
  },

  viewLog: () => {
    const G = AncientState.G;
    const app = document.getElementById('app-main');
    app.innerHTML = `<div class="main"><div class="card fadeup" style="max-width:600px;margin:20px auto">
      <div class="ct">${G.name} · 人生回忆</div>
      <div class="log-wrap" style="height:400px">
        ${G.log.map(l=>`<div class="log-entry"><span class="log-age">[${l.age}岁]</span><span class="log-${l.type}">${l.text}</span></div>`).join('')}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn ba" onclick="render()">返回墓志铭</button>
        <button class="btn bc" onclick="confirmRestart()">⟳ 重入轮回</button>
      </div>
    </div></div>`;
  }
};

window.AncientRender = AncientRender;
window.render = AncientRender.render;
window.renderObituary = AncientRender.renderObituary;
window.viewLog = AncientRender.viewLog;
