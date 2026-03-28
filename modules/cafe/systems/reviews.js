/**
 * ═══════════════════════════════════════════════════════════
 * 评价系统模块
 * ═══════════════════════════════════════════════════════════
 */

const reviews = {
  // 添加评价
  add(customerName, customerIcon, score, drinkName) {
    const posRevs = ['☕ 咖啡超好喝！', '下次还来！', '环境很好，咖啡也不错', '制作过程太专业了', '这是我喝过最好的拿铁', '会推荐给朋友'];
    const negRevs = ['等了好久...', '咖啡有点凉', '口感一般般', '有点贵', '没想象中好喝'];
    
    const pos = score >= 85;
    const texts = pos ? posRevs : negRevs;
    const text = texts[Math.floor(Math.random() * texts.length)];
    const ts = new Date().toTimeString().slice(0, 8);
    
    C.reviews.unshift({
      name: customerName,
      icon: customerIcon,
      score: score,
      text: text,
      drink: drinkName,
      time: ts
    });
    
    if (C.reviews.length > 20) C.reviews.pop();
  },

  // 获取好评数
  getPositiveCount() {
    return C.reviews.filter(r => r.score >= 90).length;
  },

  // 获取差评数
  getNegativeCount() {
    return C.reviews.filter(r => r.score < 60).length;
  },

  // 平均评分
  avgScore() {
    if (!C.reviews.length) return 0;
    const recent = C.reviews.slice(0, 10);
    return Math.floor(recent.reduce((a, r) => a + r.score, 0) / recent.length);
  },

  // 清空评价
  clear() {
    C.reviews = [];
  }
};

// 导出
window.CafeReviews = reviews;
