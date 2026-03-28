/**
 * ═══════════════════════════════════════════════════════════
 * UI 渲染辅助模块
 * ═══════════════════════════════════════════════════════════
 */

// 绘制图表
function drawChart(id, hist, col) {
  const cv = document.getElementById(id);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (hist.length < 2) return;
  
  const mn = Math.min(...hist), mx = Math.max(...hist), range = mx - mn || 1;
  ctx.beginPath();
  hist.forEach((v, i) => {
    const x = i / (hist.length - 1) * cv.width;
    const y = cv.height - (v - mn) / range * (cv.height - 6) - 3;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = col || '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineTo(cv.width, cv.height);
  ctx.lineTo(0, cv.height);
  ctx.closePath();
  ctx.fillStyle = (col || '#fbbf24') + '22';
  ctx.fill();
}

// 心情表情
function mood(m) {
  return m >= 90 ? '🤩' : m >= 70 ? '😊' : m >= 50 ? '😐' : m >= 30 ? '😞' : '😡';
}

// 导出
window.CorpUI = { drawChart, mood };
