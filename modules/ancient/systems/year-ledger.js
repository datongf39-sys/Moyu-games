// 年末账单系统
const AncientYearLedger = {
  // 分类配置
  CATEGORIES: [
    { id: 'income', label: '谋生所入', icon: '💰' },
    { id: 'business_in', label: '营生进账', icon: '📈' },
    { id: 'business_out', label: '营生亏耗', icon: '📉' },
    { id: 'estate', label: '置地买宅', icon: '🏠' },
    { id: 'decor', label: '添置陈设', icon: '🏺' },
    { id: 'study', label: '束脩从学', icon: '📚' },
    { id: 'medical', label: '延医问诊', icon: '⚕️' },
    { id: 'daily', label: '走街采买', icon: '🛒' },
    { id: 'penalty', label: '折损赔付', icon: '⚠️' }
  ],

  // 记录一笔账
  record: (label, amount, category) => {
    const G = AncientState.G;
    if (!G.yearLedger) G.yearLedger = [];
    
    G.yearLedger.push({
      label,
      amount,
      category,
      timestamp: Date.now()
    });
  },

  // 清空账单（新年开始）
  clear: () => {
    const G = AncientState.G;
    G.yearLedger = [];
  },

  // 按分类汇总
  summarizeByCategory: () => {
    const G = AncientState.G;
    const summary = {};
    
    AncientYearLedger.CATEGORIES.forEach(cat => {
      summary[cat.id] = 0;
    });
    
    (G.yearLedger || []).forEach(entry => {
      if (summary[entry.category] !== undefined) {
        summary[entry.category] += entry.amount;
      }
    });
    
    return summary;
  },

  // 计算净利润
  calculateNetProfit: () => {
    const summary = AncientYearLedger.summarizeByCategory();
    let total = 0;
    
    Object.values(summary).forEach(amount => {
      total += amount;
    });
    
    return total;
  },

  // 渲染账单弹窗
  showLedgerModal: () => {
    const G = AncientState.G;
    const summary = AncientYearLedger.summarizeByCategory();
    const netProfit = AncientYearLedger.calculateNetProfit();
    
    // 构建 HTML
    let html = '<div style="text-align:left;padding:10px 0">';
    
    // 按分类顺序显示
    let hasPrevious = false;
    
    AncientYearLedger.CATEGORIES.forEach(cat => {
      const amount = summary[cat.id];
      
      // 置地买宅前后空一行
      if (cat.id === 'estate' && hasPrevious) {
        html += '<div style="height:12px"></div>';
      }
      
      if (amount !== 0) {
        const sign = amount >= 0 ? '+' : '';
        const color = amount >= 0 ? 'var(--green)' : 'var(--red)';
        html += `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px">
          <span>${cat.icon} ${cat.label}</span>
          <span style="color:${color};font-weight:600;font-family:var(--mono)">${sign}${amount}</span>
        </div>`;
        hasPrevious = true;
      }
      
      // 置地买宅后空一行
      if (cat.id === 'estate' && amount !== 0) {
        html += '<div style="height:12px"></div>';
      }
    });
    
    // 分隔线
    html += '<div style="border-top:2px solid var(--text);margin:12px 0"></div>';
    
    // 净利润和当前存银
    const netColor = netProfit >= 0 ? 'var(--amber)' : 'var(--red)';
    const netSign = netProfit >= 0 ? '+' : '';
    
    html += `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;font-weight:600">
      <span>净利润</span>
      <span style="color:${netColor};font-family:var(--mono)">${netSign}${netProfit} 文</span>
    </div>`;
    
    html += `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:11px;color:var(--muted)">
      <span>当前存银</span>
      <span style="font-family:var(--mono)">🪙 ${G.money} 文</span>
    </div>`;
    
    html += '</div>';
    
    // 显示弹窗
    AncientModal.showModal('📊 年末账单',
      `岁末年终，清算本年收支。<br><br>${html}`,
      [{ label: '✅ 知晓', sub: '', cost: '', id: 'ok' }],
      () => {
        AncientModal.closeModal();
        // 清空账单，准备下一年
        AncientYearLedger.clear();
      }
    );
  },

  // 显示年末账单（在 nextYear 开始时）
  showYearEndLedger: () => {
    const G = AncientState.G;
    
    // 如果第一年（age=0），不显示账单
    if (G.age === 0 && G.yearLedger && G.yearLedger.length === 0) {
      return;
    }
    
    // 有账单记录才显示
    if (G.yearLedger && G.yearLedger.length > 0) {
      setTimeout(() => {
        AncientYearLedger.showLedgerModal();
      }, 500);
    }
  }
};

window.AncientYearLedger = AncientYearLedger;
window.recordLedger = AncientYearLedger.record;
