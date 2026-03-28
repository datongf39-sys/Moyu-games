/**
 * ═══════════════════════════════════════════════════════════
 * 工具函数模块
 * ═══════════════════════════════════════════════════════════
 */

// ID 选择器
const $ = id => document.getElementById(id);

// 时间格式化
const ts = () => new Date().toTimeString().slice(0, 8);

// 等级列表
const LVS = ['初创公司', '小型企业', '中型企业', '大型企业', '跨国集团', '世界 500 强'];

// 金额格式化
function fmt(n) {
  if (n >= 1e9) return '¥' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '¥' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '¥' + (n / 1e3).toFixed(1) + 'K';
  return '¥' + Math.floor(n);
}

// 日志添加
function addLog(box, msg, type) {
  const b = $(box), d = document.createElement('div');
  d.className = 'll ' + type;
  d.innerHTML = `<span class="lts">[${ts()}]</span> <span class="lm">${msg}</span>`;
  b.prepend(d);
  while (b.children.length > 50) b.removeChild(b.lastChild);
}

// 标签页切换
function sw(i) {
  document.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('on', i === j));
  document.querySelectorAll('.panel').forEach((p, j) => p.classList.toggle('on', i === j));
  if (typeof render === 'function') render();
}

// 心情表情
function mood(m) {
  return m >= 90 ? '🤩' : m >= 70 ? '😊' : m >= 50 ? '😐' : m >= 30 ? '😞' : '😡';
}

// 导出
window.CorpUtils = { $, ts, LVS, fmt, addLog, sw, mood };
