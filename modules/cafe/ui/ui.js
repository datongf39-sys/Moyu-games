/**
 * ═══════════════════════════════════════════════════════════
 * UI 渲染辅助模块
 * ═══════════════════════════════════════════════════════════
 */

// 绘制图表
function drawChart(canvasId, data, color) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (data.length < 2) return;
  
  const mn = Math.min(...data), mx = Math.max(...data), range = mx - mn || 1;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i / (data.length - 1) * cv.width;
    const y = cv.height - (v - mn) / range * (cv.height - 6) - 3;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = color || '#d4a44c';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineTo(cv.width, cv.height);
  ctx.lineTo(0, cv.height);
  ctx.closePath();
  ctx.fillStyle = (color || '#d4a44c') + '22';
  ctx.fill();
}

// 心情表情
function moodIcon(m) {
  return m >= 90 ? '🤩' : m >= 70 ? '😊' : m >= 50 ? '😐' : m >= 30 ? '😞' : '😡';
}

// 导出
window.CafeUI = { drawChart, moodIcon };
