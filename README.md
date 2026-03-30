# 摸鱼工作台 - 模块化结构说明

## 📁 文件结构

```
摸鱼游戏/
├── index.html                  # 主页（门户）
├── corp.html                   # 公司运营模拟
├── cafe.html                   # 咖啡门店经营
├── farm.html                   # 农业项目管理
├── doom.html                   # 末日房车囤货
├── ancient.html                # 古代人生模拟
│
├── styles/                     # 共用样式
│   ├── common.css              # 全站共用（主题 + 基础组件）
│   └── modules.css             # 子模块通用组件
│
└── modules/                    # 各模块的 CSS 和 JS
    ├── corp/                   # 公司运营模块（已完全拆分）
    │   ├── corp.css            # 页面专用样式
    │   ├── utils.js            # 工具函数
    │   ├── data/               # 数据模块（已拆分）
    │   │   ├── base.js         # 基础游戏状态
    │   │   ├── employees.js    # 员工数据
    │   │   ├── stocks.js       # 股票数据
    │   │   ├── depts.js        # 部门数据
    │   │   ├── office.js       # 办公室数据
    │   │   ├── upgrades.js     # 升级数据
    │   │   ├── policy.js       # HR 政策数据
    │   │   ├── culture.js      # 企业文化数据
    │   │   ├── projects.js     # 项目数据
    │   │   ├── rivals.js       # 竞争对手数据
    │   │   ├── news.js         # 新闻数据
    │   │   └── milestones.js   # 里程碑数据
    │   ├── systems/            # 系统模块
    │   │   ├── employees.js    # 员工系统（雇用、心情、CPS）
    │   │   ├── stocks.js       # 股票系统（买卖、价格更新、盈亏）
    │   │   ├── depts.js        # 部门系统（建立部门）
    │   │   ├── office.js       # 办公室装修
    │   │   ├── projects.js     # 项目系统（接单、进度）
    │   │   └── news.js         # 新闻系统
    │   ├── features/           # 功能模块
    │   │   ├── click.js        # 点击创收功能
    │   │   └── milestones.js   # 里程碑系统
    │   ├── core/               # 核心模块
    │   │   └── core.js         # 游戏主循环
    │   ├── ui/                 # UI 模块
    │   │   └── ui.js           # UI 渲染
    │   ├── actions.js          # 操作函数
    │   ├── render.js           # 渲染函数（兼容）
    │   ├── save.js             # 存档系统
    │   ├── init.js             # 初始化
    │   └── main.js             # 数据合并和启动
    ├── cafe/                   # 咖啡模块（已完全拆分）
    │   ├── cafe.css            # 页面专用样式
    │   ├── utils.js            # 工具函数
    │   ├── data/               # 数据模块
    │   │   ├── base.js         # 基础游戏状态
    │   │   ├── ingredients.js  # 食材数据
    │   │   ├── equipment.js    # 设备数据
    │   │   ├── staff.js        # 员工数据
    │   │   ├── vip.js          # VIP 数据
    │   │   ├── reviews.js      # 评价数据
    │   │   ├── events.js       # 事件数据
    │   │   └── research.js     # 研发数据
    │   ├── systems/            # 系统模块
    │   │   ├── orders.js       # 订单系统
    │   │   ├── ingredients.js  # 食材系统
    │   │   ├── equipment.js    # 设备系统
    │   │   ├── staff.js        # 员工系统
    │   │   ├── vip.js          # VIP 系统
    │   │   └── reviews.js      # 评价系统
    │   ├── features/           # 功能模块
    │   │   ├── brew.js         # 冲泡功能
    │   │   └── research.js     # 研发功能
    │   ├── core/               # 核心模块
    │   │   └── core.js         # 游戏主循环
    │   ├── ui/                 # UI 模块
    │   │   └── ui.js           # UI 渲染
    │   ├── actions.js          # 操作函数
    │   ├── render.js           # 渲染函数
    │   ├── save.js             # 存档系统
    │   ├── init.js             # 初始化
    │   └── main.js             # 数据合并和启动
    ├── farm/                   # 农场模块（已完全拆分）
    │   ├── farm.css            # 页面专用样式
    │   ├── utils.js            # 工具函数
    │   ├── data/               # 数据模块
    │   │   ├── base.js         # 基础游戏状态
    │   │   ├── fields.js       # 田地数据
    │   │   ├── seeds.js        # 种子数据
    │   │   ├── animals.js      # 动物数据
    │   │   ├── workers.js      # 工人数据
    │   │   ├── tools.js        # 工具数据
    │   │   ├── weather.js      # 天气数据
    │   │   └── achievements.js # 成就数据
    │   ├── system/             # 系统模块
    │   │   ├── fields.js       # 田地系统
    │   │   ├── animals.js      # 动物系统
    │   │   ├── market.js       # 市场系统
    │   │   ├── workers.js      # 工人系统
    │   │   ├── tools.js        # 工具系统
    │   │   ├── research.js     # 研发系统
    │   │   └── weather.js      # 天气系统
    │   ├── features/           # 功能模块
    │   │   └── achievements.js # 成就功能
    │   ├── core/               # 核心模块
    │   │   └── core.js         # 游戏主循环
    │   ├── ui/                 # UI 模块
    │   │   └── ui.js           # UI 渲染
    │   ├── actions.js          # 操作函数
    │   ├── render.js           # 渲染函数
    │   ├── save.js             # 存档系统
    │   ├── init.js             # 初始化
    │   └── main.js             # 数据合并和启动
    ├── doom/                   # 末日模块（已完全拆分）
    │   ├── doom.css            # 页面专用样式
    │   ├── utils.js            # 工具函数
    │   ├── data/               # 数据模块
    │   │   ├── base.js         # 基础游戏状态
    │   │   ├── resources.js    # 资源数据
    │   │   ├── inventory.js    # 物品数据
    │   │   ├── survivors.js    # 幸存者数据
    │   │   ├── van.js          # 房车数据
    │   │   ├── map.js          # 地图数据
    │   │   ├── events.js       # 事件数据
    │   │   └── achievements.js # 成就数据
    │   ├── system/             # 系统模块
    │   │   ├── survivors.js    # 幸存者系统
    │   │   ├── explore.js      # 探索系统
    │   │   ├── van.js          # 房车系统
    │   │   ├── events.js       # 事件系统
    │   │   ├── inventory.js    # 物品系统
    │   │   └── tasks.js        # 任务系统
    │   ├── features/           # 功能模块
    │   │   └── achievements.js # 成就功能
    │   ├── core/               # 核心模块
    │   │   └── core.js         # 游戏主循环
    │   ├── ui/                 # UI 模块
    │   │   └── ui.js           # UI 渲染
    │   ├── actions.js          # 操作函数
    │   ├── render.js           # 渲染函数
    │   ├── save.js             # 存档系统
    │   ├── init.js             # 初始化
    │   └── main.js             # 数据合并和启动
  └── ancient/                # 古代模块（已完全拆分）
        ├── ancient.css         # 页面专用样式
        ├── data/               # 数据模块
        │   ├── names.js        # 名字数据
        │   ├── family.js       # 家族数据
        │   ├── estates.js      # 地产&地点数据
        │   ├── jobs.js         # 职业数据
        │   ├── items.js        # 物品数据
        │   ├── events.js       # 事件数据
        │   ├── diseases.js     # 疾病数据
        │   ├── civil.js        # 科举数据
        │   ├── locations.js    # 地图数据
        │   └── tavern.js       # 酒楼业态数据
        ├── core/               # 核心模块
        │   ├── state.js        # 状态管理
        │   └── loop.js         # 游戏主循环
        ├── features/           # 功能模块
        │   ├── actions.js      # 行动功能
        │   ├── social.js       # 社交功能
        │   ├── estate.js       # 地产功能
        │   ├── marriage.js     # 婚姻功能
        │   ├── family.js       # 家族功能
        │   ├── health.js       # 健康功能
        │   └── inherit.js      # 继承功能
        ├── systems/            # 系统模块
        │   ├── shop.js         # 商店系统
        │   ├── venue.js        # 场所系统
        │   ├── disease.js      # 疾病系统
        │   ├── career.js       # 职业系统
        │   ├── school.js       # 学校系统
        │   ├── jobplay.js      # 职业玩法系统
        │   └── tavernplay.js   # 酒楼经营玩法系统
        ├── ui/                 # UI 模块
        │   ├── modal.js        # 模态框
        │   ├── render.js       # UI 渲染
        │   └── tabs.js         # 标签页切换
        ├── save.js             # 存档系统
        └── main.js             # 数据合并和启动
```

## 🎯 拆分原则

### HTML 文件（根目录）
- **只保留纯 HTML 结构**
- 主题变量内联（确保立即生效）
- 引用外部 CSS 和 JS

### CSS 文件
- **common.css** - 全站共用（主题定义、Header、Ticker 等）
- **modules.css** - 通用组件（topbar、tabs、cards、buttons 等）
- **modules/xxx/xxx.css** - 页面独有样式（每个模块独立 CSS 文件，不依赖 common.css 和 modules.css）

### JS 文件（按功能拆分）
- **utils.js** - 工具函数（选择器、格式化、日志等）
- **data/** - 数据模块文件夹（拆分为多个独立数据文件）
- **systems/** - 系统模块（业务逻辑和操作系统）
- **features/** - 功能模块（玩家交互功能）
- **core/** - 核心模块（游戏主循环）
- **ui/** - UI 模块（界面渲染）
- **actions.js** - 核心操作函数
- **render.js** - UI 渲染逻辑（兼容旧版）
- **save.js** - 存档系统
- **init.js** - 初始化
- **main.js** - 数据合并和启动入口

### 数据模块拆分原则（data/）
每个数据类别独立文件，包含：
- 基础游戏状态（base.js）
- 各系统数据定义（employees.js, stocks.js, depts.js 等）
- 动态数据（rivals.js, news.js, milestones.js 等）

### 模块依赖关系
```
utils.js → data/* → systems/* → features/* → core/* → ui/* → actions.js → render.js → save.js → init.js → main.js
```

## 📦 corp 模块详解

### utils.js - 工具函数
```javascript
$()          // ID 选择器
ts()         // 时间格式化
fmt()        // 金额格式化
addLog()     // 日志添加
sw()         // 标签页切换
mood()       // 心情表情
```

### data/ - 数据模块（已拆分）

#### base.js - 基础游戏状态
```javascript
G = {
  cash: 1000, total: 0, cps: 0, clickVal: 10,
  xp: 0, xpMax: 100, level: 1,
  staffCounts: {}, employees: [],
  shares: {}, stockHist: {}, avgBasis: {},
  projects: [], activeProjects: [], news: [],
  projDone: 0, projMult: 1, effMult: 1, happyB: 0
}
```

#### employees.js - 员工数据
```javascript
employees = {
  list: [
    { id: 'intern', name: '实习生', baseCost: 50, cps: 1 },
    { id: 'programmer', name: '程序员', baseCost: 200, cps: 5 },
    // ... 更多员工类型
  ]
}
```

#### stocks.js - 股票数据
```javascript
stocks = {
  list: [
    { id: 'own', name: '本公司', price: 100 },
    { id: 'tech1', name: '创新科技', price: 150 },
    // ... 更多股票
  ]
}
```

#### depts.js - 部门数据
```javascript
depts = {
  list: [
    { id: 'dev', name: '研发部', cost: 5000, bonus: 0.1 },
    { id: 'marketing', name: '市场部', cost: 3000, bonus: 0.05 },
    // ... 更多部门
  ]
}
```

#### office.js - 办公室数据
```javascript
office = {
  list: [
    { id: 'desk1', name: '基础办公桌', cost: 1000, effect: 'cps+5%' },
    { id: 'chair1', name: '人体工学椅', cost: 500, effect: 'mood+10%' },
    // ... 更多装修
  ]
}
```

#### upgrades.js - 升级数据
```javascript
upgrades = {
  list: [
    { id: 'click1', name: '点击强化', cost: 500, effect: 'click+50%' },
    { id: 'cps1', name: '效率提升', cost: 1000, effect: 'cps+20%' },
    // ... 更多升级
  ]
}
```

#### policy.js - HR 政策数据
```javascript
hrPolicy = {
  overtime: false,    // 加班制度
  remote: false,      // 远程办公
  bonus: false,       // 奖金制度
  // ... 更多政策
}
```

#### culture.js - 企业文化数据
```javascript
culture = {
  innovation: 0,      // 创新文化
  teamwork: 0,        // 团队文化
  quality: 0,         // 质量文化
  // ... 更多文化
}
```

#### projects.js - 项目数据
```javascript
projects = {
  pool: [
    { name: '企业官网', reward: 500, time: 60 },
    { name: '电商平台', reward: 2000, time: 180 },
    // ... 更多项目
  ],
  activeProjects: []  // 进行中项目
}
```

#### rivals.js - 竞争对手数据
```javascript
rivals = {
  list: [
    { name: '创新科技', lv: 1, cash: 1500, threat: '低' },
    { name: '星联集团', lv: 2, cash: 8000, threat: '中' },
    { name: '宇宙企业', lv: 5, cash: 500000, threat: '高' }
  ]
}
```

#### news.js - 新闻数据
```javascript
news = {
  pool: [
    { text: '科技行业迎来新机遇', effect: 'cps+10%' },
    { text: '市场竞争加剧', effect: 'cps-5%' },
    // ... 更多新闻
  ],
  current: []  // 当前新闻
}
```

#### milestones.js - 里程碑数据
```javascript
milestones = {
  list: [
    { name: '第一桶金', desc: '营收¥10,000', done: false, icon: '💰' },
    { name: '初具规模', desc: '员工 10 人', done: false, icon: '👥' },
    { name: '行业新星', desc: '完成 10 个项目', done: false, icon: '🏆' },
    // ... 更多里程碑
  ]
}
```

### main.js - 数据合并
```javascript
(function() {
  window.G = {};
  
  // 合并所有数据模块
  if (window.CorpBaseData) Object.assign(window.G, window.CorpBaseData);
  if (window.CorpEmployeesData) Object.assign(window.G, window.CorpEmployeesData);
  if (window.CorpStocksData) Object.assign(window.G, window.CorpStocksData);
  if (window.CorpDeptsData) Object.assign(window.G, window.CorpDeptsData);
  if (window.CorpOfficeData) Object.assign(window.G, window.CorpOfficeData);
  if (window.CorpUpgradesData) Object.assign(window.G, window.CorpUpgradesData);
  if (window.CorpPolicyData) Object.assign(window.G, window.CorpPolicyData);
  if (window.CorpCultureData) Object.assign(window.G, window.CorpCultureData);
  if (window.CorpProjectsData) Object.assign(window.G, window.CorpProjectsData);
  if (window.CorpRivalsData) Object.assign(window.G, window.CorpRivalsData);
  if (window.CorpNewsData) Object.assign(window.G, window.CorpNewsData);
  if (window.CorpMilestonesData) Object.assign(window.G, window.CorpMilestonesData);
  
  // 添加方法
  G.recalc = function() { /* ... */ };
  G.totalStaff = function() { /* ... */ };
  G.hcost = function(h) { /* ... */ };
})();
```

### 系统模块 (systems/)

#### employees.js - 员工系统
```javascript
employees = {
  list: [],           // 员工列表
  counts: {},         // 各类型员工数量
  hires: [...],       // 可雇用类型
  total(),            // 总员工数
  cost(h),            // 计算雇用成本
  hire(id),           // 雇用员工
  calcCPS(),          // 计算总 CPS
  updateMood(),       // 更新心情
  avgMood()           // 平均心情
}
```

#### stocks.js - 股票系统
```javascript
stocks = {
  list: [...],        // 股票列表
  shares: {},         // 持有数量
  history: {},        // 价格历史
  avgBasis: {},       // 平均成本
  update(),           // 更新价格
  buy(id),            // 买入
  sell(id),           // 卖出
  totalValue(),       // 总市值
  totalProfit()       // 总盈亏
}
```

#### depts.js - 部门系统
```javascript
depts = {
  list: [...],        // 部门列表
  build(id),          // 建立部门
  has(id),            // 检查是否已建立
  getBonus()          // 获取加成
}
```

#### office.js - 办公室装修
```javascript
office = {
  list: [...],        // 装修列表
  buy(id),            // 购买装修
  has(id),            // 检查是否已购买
  getEffects()        // 获取效果
}
```

#### projects.js - 项目系统
```javascript
projects = {
  pool: [...],        // 项目池
  available: [],      // 可接项目
  active: [],         // 进行中
  done: 0,            // 完成数
  refresh(),          // 刷新项目
  start(index),       // 开始项目
  update()            // 更新进度
}
```

#### news.js - 新闻系统
```javascript
news = {
  pool: [...],        // 新闻池
  current: [],        // 当前新闻
  generate(),         // 生成新闻
  applyEffect(),      // 应用效果
  render()            // 渲染新闻
}
```

### 功能模块 (features/)

#### click.js - 点击创收
```javascript
click = {
  base: 10,           // 基础点击收益
  mult: 1,            // 倍率
  doClick(),          // 执行点击
  getXp(),            // 获取经验
  checkLevelUp()      // 检查升级
}
```

#### milestones.js - 里程碑系统
```javascript
milestones = {
  list: [...],        // 里程碑列表
  check(),            // 检查达成
  render(),           // 渲染列表
  getRewards()        // 获取奖励
}
```

### core/ - 核心模块

#### core.js - 游戏主循环
```javascript
let tick = 0;
setInterval(() => {
  tick++;
  
  // CPS 收益
  if (G.cps > 0) { G.cash += G.cps / 10; G.total += G.cps / 10; }
  
  // 项目进度
  G.activeProjects.forEach((p, i) => {
    p.progress += 1 / (p.time * 10);
    if (p.progress >= 1) { /* 完成项目 */ }
  });
  
  // 竞争对手更新
  if (tick % 50 === 0) {
    G.rivals.forEach(r => { r.cash *= 1.02; /* 更新 */ });
  }
  
  // 新闻生成
  if (tick % 600 === 0) { window.CorpNews?.gen(); }
  
  // 渲染
  if (tick % 5 === 0) { if (window.CorpRender) window.CorpRender.render(); }
}, 100);
```

### ui/ - UI 模块

#### ui.js - UI 渲染
```javascript
ui = {
  render(),           // 完整 UI 渲染
  updateCash(),       // 更新现金显示
  updateEmployees(),  // 更新员工显示
  updateStocks(),     // 更新股票显示
  updateProjects(),   // 更新项目显示
  updateRivals(),     // 更新竞争对手显示
  updateNews(),       // 更新新闻显示
  updateMilestones()  // 更新里程碑显示
}
```

### 核心功能

#### save.js - 存档系统
```javascript
save()        // 保存游戏
load()        // 加载游戏
saveBack()    // 保存并返回
resetGame()   // 重置游戏
```

#### init.js - 初始化
```javascript
init()        // 初始化函数
```

## 🔗 HTML 引用示例

### corp.html 引用顺序

```html
<head>
  <!-- 主题变量（内联） -->
  <style id="theme-vars">...</style>
  <script>(function(){...})();</script>
  
  <!-- 共用样式 -->
  <link href="styles/common.css">
  <link href="styles/modules.css">
  
  <!-- 页面专用样式 -->
  <link href="modules/corp/corp.css">
</head>
<body>
  <!-- HTML 结构 -->
  
  <!-- 核心工具 -->
  <script src="modules/corp/utils.js"></script>
  
  <!-- 数据模块（拆分） -->
  <script src="modules/corp/data/base.js"></script>
  <script src="modules/corp/data/employees.js"></script>
  <script src="modules/corp/data/stocks.js"></script>
  <script src="modules/corp/data/depts.js"></script>
  <script src="modules/corp/data/office.js"></script>
  <script src="modules/corp/data/upgrades.js"></script>
  <script src="modules/corp/data/policy.js"></script>
  <script src="modules/corp/data/culture.js"></script>
  <script src="modules/corp/data/projects.js"></script>
  <script src="modules/corp/data/rivals.js"></script>
  <script src="modules/corp/data/news.js"></script>
  <script src="modules/corp/data/milestones.js"></script>
  
  <!-- 系统模块 -->
  <script src="modules/corp/systems/employees.js"></script>
  <script src="modules/corp/systems/stocks.js"></script>
  <script src="modules/corp/systems/depts.js"></script>
  <script src="modules/corp/systems/office.js"></script>
  <script src="modules/corp/systems/projects.js"></script>
  <script src="modules/corp/systems/news.js"></script>
  
  <!-- 功能模块 -->
  <script src="modules/corp/features/click.js"></script>
  <script src="modules/corp/features/milestones.js"></script>
  
  <!-- 核心和 UI -->
  <script src="modules/corp/core/core.js"></script>
  <script src="modules/corp/ui/ui.js"></script>
  
  <!-- 操作和渲染 -->
  <script src="modules/corp/actions.js"></script>
  <script src="modules/corp/render.js"></script>
  
  <!-- 核心功能 -->
  <script src="modules/corp/save.js"></script>
  <script src="modules/corp/init.js"></script>
  
  <!-- 数据合并和启动 -->
  <script src="modules/corp/main.js"></script>
  
  <!-- 页面内联脚本（主题切换等） -->
  <script>
    function st(t){...}
    function resetGame(){...}
  </script>
</body>
```

## 📊 拆分效果

### 拆分前
```
corp.html: 600 行（HTML+CSS+JS 混合）
```

### 拆分后（v7.0 - 完全模块化 + 数据拆分）

#### corp 模块
```
corp.html:                    ~200 行（纯 HTML 结构）
modules/corp/corp.css:        ~200 行（页面专用样式）
modules/corp/
  ├── utils.js:               ~50 行（工具函数）
  ├── main.js:                ~30 行（数据合并和启动）
  ├── data/
  │   ├── base.js:            ~20 行（基础游戏状态）
  │   ├── employees.js:       ~30 行（员工数据）
  │   ├── stocks.js:          ~30 行（股票数据）
  │   ├── depts.js:           ~20 行（部门数据）
  │   ├── office.js:          ~20 行（办公室数据）
  │   ├── upgrades.js:        ~20 行（升级数据）
  │   ├── policy.js:          ~15 行（HR 政策数据）
  │   ├── culture.js:         ~15 行（企业文化数据）
  │   ├── projects.js:        ~30 行（项目数据）
  │   ├── rivals.js:          ~20 行（竞争对手数据）
  │   ├── news.js:            ~20 行（新闻数据）
  │   └── milestones.js:      ~25 行（里程碑数据）
  ├── systems/
  │   ├── employees.js:      ~100 行（员工系统）
  │   ├── stocks.js:         ~120 行（股票系统）
  │   ├── depts.js:           ~40 行（部门系统）
  │   ├── office.js:          ~40 行（办公室装修）
  │   ├── projects.js:        ~80 行（项目系统）
  │   └── news.js:            ~60 行（新闻系统）
  ├── features/
  │   ├── click.js:           ~40 行（点击创收）
  │   └── milestones.js:      ~40 行（里程碑系统）
  ├── core/
  │   └── core.js:            ~60 行（游戏主循环）
  ├── ui/
  │   └── ui.js:             ~150 行（UI 渲染）
  ├── actions.js:             ~80 行（操作函数）
  ├── render.js:             ~300 行（渲染函数，兼容）
  ├── save.js:                ~60 行（存档系统）
  └── init.js:                ~30 行（初始化）
```

#### cafe 模块
```
cafe.html:                    ~180 行（纯 HTML 结构）
modules/cafe/cafe.css:        ~180 行（页面专用样式）
modules/cafe/
  ├── utils.js:               ~50 行（工具函数）
  ├── main.js:                ~30 行（数据合并和启动）
  ├── data/
  │   ├── base.js:            ~20 行（基础游戏状态）
  │   ├── ingredients.js:     ~40 行（食材数据）
  │   ├── equipment.js:       ~30 行（设备数据）
  │   ├── staff.js:           ~30 行（员工数据）
  │   ├── vip.js:             ~25 行（VIP 数据）
  │   ├── reviews.js:         ~25 行（评价数据）
  │   ├── events.js:          ~25 行（事件数据）
  │   └── research.js:        ~30 行（研发数据）
  ├── systems/
  │   ├── orders.js:          ~80 行（订单系统）
  │   ├── ingredients.js:     ~60 行（食材系统）
  │   ├── equipment.js:       ~50 行（设备系统）
  │   ├── staff.js:           ~60 行（员工系统）
  │   ├── vip.js:             ~50 行（VIP 系统）
  │   └── reviews.js:         ~50 行（评价系统）
  ├── features/
  │   ├── brew.js:            ~40 行（冲泡功能）
  │   └── research.js:        ~40 行（研发功能）
  ├── core/
  │   └── core.js:            ~60 行（游戏主循环）
  ├── ui/
  │   └── ui.js:             ~150 行（UI 渲染）
  ├── actions.js:             ~80 行（操作函数）
  ├── render.js:             ~250 行（渲染函数）
  ├── save.js:                ~60 行（存档系统）
  └── init.js:                ~30 行（初始化）
```

**优势：**
- ✅ **极致模块化**：每个功能独立文件，职责单一
- ✅ **清晰目录结构**：data/ systems/ features/ core/ ui/ 分类明确
- ✅ **数据与逻辑分离**：data/ 存放纯数据，systems/ 存放业务逻辑
- ✅ **易于维护和调试**：问题定位快速，修改影响范围小
- ✅ **可复用性高**：模块间低耦合，可跨项目复用
- ✅ **便于多人协作**：多人可同时开发不同模块
- ✅ **代码可读性强**：每个文件功能明确，易于理解
- ✅ **存档兼容性好**：字段遍历方式确保新旧存档都能加载

## 🚀 开发指南

### 添加新功能

#### 1. 数据定义
- 基础数据 → `data/base.js`
- 员工数据 → `data/employees.js`
- 股票数据 → `data/stocks.js`
- 其他数据 → `data/xxx.js`（新建文件）

#### 2. 系统逻辑
- 员工系统 → `systems/employees.js`
- 股票系统 → `systems/stocks.js`
- 新系统 → `systems/xxx.js`（新建文件）

#### 3. 功能实现
- 点击功能 → `features/click.js`
- 里程碑 → `features/milestones.js`
- 新功能 → `features/xxx.js`（新建文件）

#### 4. UI 渲染
- 核心渲染 → `core/core.js`（游戏主循环）
- UI 渲染 → `ui/ui.js`（界面更新）
- 兼容渲染 → `render.js`（旧版兼容）

#### 5. 其他
- 工具函数 → `utils.js`
- 操作函数 → `actions.js`
- 存档相关 → `save.js`

### 数据合并（main.js）

添加新数据模块后，需要在 `main.js` 中合并：

```javascript
// 在 main.js 中添加
if (window.CorpNewData) Object.assign(window.G, window.CorpNewData);
```

### 调试
```javascript
// 控制台访问
CorpUtils.$('cash')              // 工具函数
CorpBaseData.G.cash              // 基础数据
CorpEmployeesData.employees      // 员工数据
CorpStocksData.stocks            // 股票数据
CorpEmployees.hire('intern')     // 雇用员工
Stocks.buy('own')                // 买入股票
Projects.start(0)                // 开始项目
CorpCore.core                    // 游戏主循环
CorpUi.ui.render()               // UI 渲染
CorpRender.render()              // 重新渲染（兼容）
CorpSave.save()                  // 手动保存
```

### 模块导出模式

所有模块都导出到 `window` 对象：

```javascript
// data/base.js
const CorpBaseData = { cash: 1000, ... };

// systems/employees.js
const CorpEmployees = { hire() {...}, ... };

// features/click.js
const CorpClick = { doClick() {...}, ... };
```

---

**最后更新**: 2026-03-29  
**版本**: v8.0 (完全模块化 + 末日/古代模块完成版)

## 📋 完整文件清单

### corp.html 引用的所有模块

**核心工具**
- `modules/corp/utils.js` - 工具函数（选择器、格式化、日志等）

**数据模块（data/）**
- `modules/corp/data/base.js` - 基础游戏状态（cash、total、cps、xp 等）
- `modules/corp/data/employees.js` - 员工数据（员工列表、雇用成本等）
- `modules/corp/data/stocks.js` - 股票数据（股票列表、价格等）
- `modules/corp/data/depts.js` - 部门数据（部门列表、加成等）
- `modules/corp/data/office.js` - 办公室数据（装修列表、效果等）
- `modules/corp/data/upgrades.js` - 升级数据（升级列表、效果等）
- `modules/corp/data/policy.js` - HR 政策数据（加班、远程、奖金等）
- `modules/corp/data/culture.js` - 企业文化数据（创新、团队、质量等）
- `modules/corp/data/projects.js` - 项目数据（项目池、进行中项目等）
- `modules/corp/data/rivals.js` - 竞争对手数据（竞争对手列表、威胁等）
- `modules/corp/data/news.js` - 新闻数据（新闻池、当前新闻等）
- `modules/corp/data/milestones.js` - 里程碑数据（里程碑列表、达成状态等）

**系统模块（systems/）**
- `modules/corp/systems/employees.js` - 员工系统（雇用、心情、CPS 计算）
- `modules/corp/systems/stocks.js` - 股票系统（买卖、价格更新、盈亏）
- `modules/corp/systems/depts.js` - 部门系统（建立部门）
- `modules/corp/systems/office.js` - 办公室装修
- `modules/corp/systems/projects.js` - 项目系统（接单、进度）
- `modules/corp/systems/news.js` - 新闻系统

**功能模块（features/）**
- `modules/corp/features/click.js` - 点击创收功能
- `modules/corp/features/milestones.js` - 里程碑系统

**核心和 UI 模块**
- `modules/corp/core/core.js` - 游戏主循环
- `modules/corp/ui/ui.js` - UI 渲染

**操作和渲染**
- `modules/corp/actions.js` - 操作函数
- `modules/corp/render.js` - 渲染函数（兼容旧版）

**核心功能**
- `modules/corp/save.js` - 存档系统
- `modules/corp/init.js` - 初始化
- `modules/corp/main.js` - 数据合并和启动入口

### farm.html 引用的所有模块

**核心工具**
- `modules/farm/utils.js` - 工具函数（选择器、格式化、日志等）

**数据模块（data/）**
- `modules/farm/data/base.js` - 基础游戏状态（gold、harvested、season 等）
- `modules/farm/data/fields.js` - 田地数据（地块列表、作物状态等）
- `modules/farm/data/seeds.js` - 种子数据（种子列表、价格等）
- `modules/farm/data/animals.js` - 动物数据（动物类型、产品等）
- `modules/farm/data/workers.js` - 工人数据（工人类型、技能等）
- `modules/farm/data/tools.js` - 工具数据（工具列表、升级等）
- `modules/farm/data/weather.js` - 天气数据（天气类型、季节等）
- `modules/farm/data/achievements.js` - 成就数据（成就列表、条件等）

**系统模块（system/）**
- `modules/farm/system/fields.js` - 田地系统（种植、收获、病虫害等）
- `modules/farm/system/animals.js` - 动物系统（购买、喂养、收获产品等）
- `modules/farm/system/market.js` - 市场系统（价格刷新、交易等）
- `modules/farm/system/workers.js` - 工人系统（雇用、工资等）
- `modules/farm/system/tools.js` - 工具系统（购买工具、升级等）
- `modules/farm/system/research.js` - 研发系统（杂交研发等）
- `modules/farm/system/weather.js` - 天气系统（天气变化、季节变换等）

**功能模块（features/）**
- `modules/farm/features/achievements.js` - 成就功能

**核心和 UI 模块**
- `modules/farm/core/core.js` - 游戏主循环
- `modules/farm/ui/ui.js` - UI 渲染

**操作和渲染**
- `modules/farm/actions.js` - 操作函数
- `modules/farm/render.js` - 渲染函数

**核心功能**
- `modules/farm/save.js` - 存档系统
- `modules/farm/init.js` - 初始化
- `modules/farm/main.js` - 数据合并和启动入口

### doom.html 引用的所有模块

**核心工具**
- `modules/doom/utils.js` - 工具函数（选择器、格式化、日志等）

**数据模块（data/）**
- `modules/doom/data/base.js` - 基础游戏状态（day、vanHp、radiation 等）
- `modules/doom/data/resources.js` - 资源数据（食物、水、弹药等）
- `modules/doom/data/inventory.js` - 物品数据（物品列表、效果等）
- `modules/doom/data/survivors.js` - 幸存者数据（属性、技能等）
- `modules/doom/data/van.js` - 房车数据（升级、装备等）
- `modules/doom/data/map.js` - 地图数据（地点、掉落等）
- `modules/doom/data/events.js` - 事件数据（随机事件、选项等）
- `modules/doom/data/achievements.js` - 成就数据（成就列表、条件等）

**系统模块（system/）**
- `modules/doom/system/survivors.js` - 幸存者系统（创建、更新、消耗等）
- `modules/doom/system/explore.js` - 探索系统（移动、搜刮等）
- `modules/doom/system/van.js` - 房车系统（维修、升级等）
- `modules/doom/system/events.js` - 事件系统（触发、选择等）
- `modules/doom/system/inventory.js` - 物品系统（使用、合成等）
- `modules/doom/system/tasks.js` - 任务系统（生成、检查等）

**功能模块（features/）**
- `modules/doom/features/achievements.js` - 成就功能

**核心和 UI 模块**
- `modules/doom/core/core.js` - 游戏主循环
- `modules/doom/ui/ui.js` - UI 渲染

**操作和渲染**
- `modules/doom/actions.js` - 操作函数
- `modules/doom/render.js` - 渲染函数

**核心功能**
- `modules/doom/save.js` - 存档系统
- `modules/doom/init.js` - 初始化
- `modules/doom/main.js` - 数据合并和启动入口

### cafe.html 引用的所有模块

**核心工具**
- `modules/cafe/utils.js` - 工具函数（选择器、格式化、日志等）

**数据模块（data/）**
- `modules/cafe/data/base.js` - 基础游戏状态（cash、total、cps 等）
- `modules/cafe/data/ingredients.js` - 食材数据（食材列表、价格等）
- `modules/cafe/data/equipment.js` - 设备数据（设备列表、效果等）
- `modules/cafe/data/staff.js` - 员工数据（员工类型、技能等）
- `modules/cafe/data/vip.js` - VIP 数据（VIP 等级、特权等）
- `modules/cafe/data/reviews.js` - 评价数据（评价等级、效果等）
- `modules/cafe/data/events.js` - 事件数据（随机事件列表等）
- `modules/cafe/data/research.js` - 研发数据（研发项目、效果等）

**系统模块（systems/）**
- `modules/cafe/systems/orders.js` - 订单系统（订单生成、完成等）
- `modules/cafe/systems/ingredients.js` - 食材系统（购买、使用等）
- `modules/cafe/systems/equipment.js` - 设备系统（购买、升级等）
- `modules/cafe/systems/staff.js` - 员工系统（雇用、培训等）
- `modules/cafe/systems/vip.js` - VIP 系统（VIP 服务、特权等）
- `modules/cafe/systems/reviews.js` - 评价系统（评价生成、效果等）

**功能模块（features/）**
- `modules/cafe/features/brew.js` - 冲泡功能
- `modules/cafe/features/research.js` - 研发功能

**核心和 UI 模块**
- `modules/cafe/core/core.js` - 游戏主循环
- `modules/cafe/ui/ui.js` - UI 渲染

**操作和渲染**
- `modules/cafe/actions.js` - 操作函数
- `modules/cafe/render.js` - 渲染函数

**核心功能**
- `modules/cafe/save.js` - 存档系统
- `modules/cafe/init.js` - 初始化
- `modules/cafe/main.js` - 数据合并和启动入口

### ancient.html 引用的所有模块

**数据模块（data/）**
- `modules/ancient/data/names.js` - 名字数据（姓氏、名字列表）
- `modules/ancient/data/family.js` - 家族数据（家族成员、关系）
- `modules/ancient/data/estates.js` - 地产&地点数据（地产列表、场所列表）
- `modules/ancient/data/jobs.js` - 职业数据（职业列表、收入）
- `modules/ancient/data/items.js` - 物品数据（物品列表、效果）
- `modules/ancient/data/events.js` - 事件数据（随机事件列表）
- `modules/ancient/data/diseases.js` - 疾病数据（疾病列表、效果）
- `modules/ancient/data/civil.js` - 科举数据（考试关卡、题目）
- `modules/ancient/data/locations.js` - 地图数据（地点列表）
- `modules/ancient/data/tavern.js` - 酒楼业态数据（菜谱、厨子、坐堂事件）

**核心模块（core/）**
- `modules/ancient/core/state.js` - 状态管理（游戏状态、属性）
- `modules/ancient/core/loop.js` - 游戏主循环

**功能模块（features/）**
- `modules/ancient/features/actions.js` - 行动功能
- `modules/ancient/features/social.js` - 社交功能
- `modules/ancient/features/estate.js` - 地产功能
- `modules/ancient/features/marriage.js` - 婚姻功能
- `modules/ancient/features/family.js` - 家族功能
- `modules/ancient/features/health.js` - 健康功能
- `modules/ancient/features/inherit.js` - 继承功能

**系统模块（systems/）**
- `modules/ancient/systems/shop.js` - 商店系统
- `modules/ancient/systems/venue.js` - 场所系统
- `modules/ancient/systems/disease.js` - 疾病系统
- `modules/ancient/systems/career.js` - 职业系统
- `modules/ancient/systems/school.js` - 学校系统
- `modules/ancient/systems/jobplay.js` - 职业玩法系统（药师/行商/官员）
- `modules/ancient/systems/tavernplay.js` - 酒楼经营玩法（采购/研发/开业/结算）

**UI 模块（ui/）**
- `modules/ancient/ui/modal.js` - 模态框
- `modules/ancient/ui/render.js` - UI 渲染
- `modules/ancient/ui/tabs.js` - 标签页切换

**核心功能**
- `modules/ancient/save.js` - 存档系统
- `modules/ancient/main.js` - 数据合并和启动入口

### 功能映射表

#### corp 模块

| 功能 | 文件位置 |
|------|---------|
| 基础游戏状态 | `data/base.js` |
| 雇用员工 | `data/employees.js` + `systems/employees.js` |
| 股票买卖 | `data/stocks.js` + `systems/stocks.js` |
| 建立部门 | `data/depts.js` + `systems/depts.js` |
| 办公室装修 | `data/office.js` + `systems/office.js` |
| 项目系统 | `data/projects.js` + `systems/projects.js` |
| 新闻事件 | `data/news.js` + `systems/news.js` |
| 点击赚钱 | `features/click.js` |
| 里程碑 | `data/milestones.js` + `features/milestones.js` |
| 竞争对手 | `data/rivals.js` |
| HR 政策 | `data/policy.js` |
| 企业文化 | `data/culture.js` |
| UI 渲染 | `ui/ui.js` + `render.js` |
| 游戏主循环 | `core/core.js` |
| 存档读档 | `save.js` |

#### doom 模块

| 功能 | 文件位置 |
|------|---------|
| 基础游戏状态 | `data/base.js` |
| 资源管理 | `data/resources.js` |
| 物品管理 | `data/inventory.js` + `system/inventory.js` |
| 幸存者管理 | `data/survivors.js` + `system/survivors.js` |
| 房车升级 | `data/van.js` + `system/van.js` |
| 地图探索 | `data/map.js` + `system/explore.js` |
| 随机事件 | `data/events.js` + `system/events.js` |
| 任务系统 | `system/tasks.js` |
| 成就系统 | `data/achievements.js` + `features/achievements.js` |
| UI 渲染 | `ui/ui.js` + `render.js` |
| 游戏主循环 | `core/core.js` |
| 存档读档 | `save.js` |

#### farm 模块

| 功能 | 文件位置 |
|------|---------|
| 基础游戏状态 | `data/base.js` |
| 农田种植 | `data/fields.js` + `system/fields.js` |
| 种子管理 | `data/seeds.js` |
| 牲畜养殖 | `data/animals.js` + `system/animals.js` |
| 工人管理 | `data/workers.js` + `system/workers.js` |
| 工具升级 | `data/tools.js` + `system/tools.js` |
| 天气系统 | `data/weather.js` + `system/weather.js` |
| 市场交易 | `system/market.js` |
| 杂交研发 | `system/research.js` |
| 成就系统 | `data/achievements.js` + `features/achievements.js` |
| UI 渲染 | `ui/ui.js` + `render.js` |
| 游戏主循环 | `core/core.js` |
| 存档读档 | `save.js` |

#### cafe 模块

| 功能 | 文件位置 |
|------|---------|
| 基础游戏状态 | `data/base.js` |
| 食材管理 | `data/ingredients.js` + `systems/ingredients.js` |
| 设备管理 | `data/equipment.js` + `systems/equipment.js` |
| 员工管理 | `data/staff.js` + `systems/staff.js` |
| VIP 服务 | `data/vip.js` + `systems/vip.js` |
| 评价系统 | `data/reviews.js` + `systems/reviews.js` |
| 随机事件 | `data/events.js` |
| 研发系统 | `data/research.js` + `features/research.js` |
| 冲泡咖啡 | `features/brew.js` |
| UI 渲染 | `ui/ui.js` + `render.js` |
| 游戏主循环 | `core/core.js` |
| 存档读档 | `save.js` |

#### ancient 模块

| 功能 | 文件位置 |
|------|---------|
| 基础游戏状态 | `core/state.js` |
| 名字生成 | `data/names.js` |
| 家族系统 | `data/family.js` + `features/family.js` |
| 地产系统 | `data/estates.js` + `features/estate.js` |
| 职业系统 | `data/jobs.js` + `systems/career.js` |
| 物品系统 | `data/items.js` |
| 随机事件 | `data/events.js` |
| 疾病系统 | `data/diseases.js` + `systems/disease.js` |
| 科举系统 | `data/civil.js` + `systems/school.js` |
| 地图数据 | `data/locations.js` |
| 社交功能 | `features/social.js` |
| 婚姻功能 | `features/marriage.js` |
| 健康功能 | `features/health.js` |
| 继承功能 | `features/inherit.js` |
| 商店系统 | `systems/shop.js` |
| 场所系统 | `systems/venue.js` |
| 学校/武馆 | `systems/school.js` |
| 职业玩法 | `systems/jobplay.js` |
| 酒楼经营 | `data/tavern.js` + `systems/tavernplay.js` |
| UI 渲染 | `ui/render.js` + `ui/modal.js` |
| 游戏主循环 | `core/loop.js` |
| 存档读档 | `save.js` |
