/**
 * ═══════════════════════════════════════════════════════════
 * 办公室数据模块
 * ═══════════════════════════════════════════════════════════
 */

const CorpOfficeData = {
  office: [
    { id: 'chairs', name: '人体工学椅', desc: '效率 +10%', cost: 1000, bought: false, icon: '🪑' },
    { id: 'plants', name: '绿植装饰', desc: '幸福度 +15%', cost: 500, bought: false, icon: '🌿' },
    { id: 'coffee', name: '咖啡机', desc: '效率 +5% 幸福 +10%', cost: 800, bought: false, icon: '☕' },
    { id: 'gym', name: '健身房', desc: '离职率 -30%', cost: 5000, bought: false, icon: '💪' },
    { id: 'lounge', name: '休闲区', desc: '幸福 +20% 效率 +8%', cost: 8000, bought: false, icon: '🛋️' },
    { id: 'roof', name: '屋顶花园', desc: '全面 +15%', cost: 20000, bought: false, icon: '🌇' }
  ]
};

// 导出
window.CorpOfficeData = CorpOfficeData;
