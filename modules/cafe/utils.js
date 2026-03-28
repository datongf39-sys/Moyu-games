/**
 * ═══════════════════════════════════════════════════════════
 * 工具函数模块
 * ═══════════════════════════════════════════════════════════
 */

// ID 选择器
const $ = id => document.getElementById(id);

// 时间格式化
const ts = () => new Date().toTimeString().slice(0, 8);

// 金额格式化
const fmt = n => n >= 1000 ? '¥' + (n / 1000).toFixed(1) + 'K' : '¥' + Math.floor(n);

// 日志添加
function addLog(box, msg, type) {
  const b = $(box), d = document.createElement('div');
  d.className = 'll ' + type;
  d.innerHTML = `<span class="lts">[${ts()}]</span> <span class="lm">${msg}</span>`;
  b.prepend(d);
  while (b.children.length > 60) b.removeChild(b.lastChild);
}

// 标签页切换
function sw(i) {
  document.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('on', i === j));
  document.querySelectorAll('.panel').forEach((p, j) => p.classList.toggle('on', i === j));
  if (typeof render === 'function') render();
}

// 导出
window.CafeUtils = { $, ts, fmt, addLog, sw };
