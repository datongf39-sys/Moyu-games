// Tabs system
let _currentTab = 'actions';

const AncientTabs = {
  switchTab: (id) => {
    _currentTab = id;
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    document.getElementById('panel-'+id).classList.add('on');
    if (window.event && event.target) event.target.classList.add('on');
  },

  restoreTab: () => {
    const id = _currentTab || 'actions';
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
    const panel = document.getElementById('panel-'+id); if (panel) panel.classList.add('on');
    const map = {actions:'行动',career:'职业',places:'地点',estate:'地产',bag:'包裹',log:'日志',family:'家族'};
    document.querySelectorAll('.tab').forEach(t => { if (t.textContent.trim()===map[id]) t.classList.add('on'); });
  }
};

window.AncientTabs = AncientTabs;
window.switchTab = AncientTabs.switchTab;
window.restoreTab = AncientTabs.restoreTab;
