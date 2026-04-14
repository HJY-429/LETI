# 🧬 生命长度预测测试网站设计方案

**版本**: v2.0  
**日期**: 2026 年 4 月 13 日  
**状态**: ✅ 设计完成，待开发

---

## 📋 项目概述

### 项目定位
类似 MBTI/SBTI 人格测试的**生命长度预测测试网站**，通过科学的生活习惯评估，预测用户的预期寿命，并提供个性化的健康改善建议。

### 核心特色
- ✨ **48 道科学测试题** - 覆盖睡眠、饮食、运动、心理、身体指标、生活方式六大维度
- 🎯 **智能分支逻辑** - 根据用户答案动态调整后续问题
- 📊 **多维度可视化** - 雷达图、柱状图、进度条等丰富图表展示
- 🌍 **多语言支持** - 中英文一键切换（首次访问询问偏好）
- 📱 **响应式设计** - 支持 PC 和移动端
- 🎮 **轻松有趣** - Emoji 表情 + 幽默文案，让测试不再枯燥
- 🔗 **匿名分享** - 生成海报图片 + 短链接，方便社交传播

---

## 🏗️ 技术架构

### 技术栈选择
| 类别 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | Vue 3 + Composition API | 轻量级、组件化、响应式 |
| **构建工具** | Vite 5.x | 极速启动、热更新 |
| **状态管理** | Pinia | 轻量级 Vuex 替代品 |
| **路由管理** | Vue Router 4.x | SPA 路由 |
| **图表库** | Chart.js 4.x + vue-chartjs | 雷达图、柱状图等 |
| **国际化** | vue-i18n 9.x | 中英文切换 |
| **UI 组件** | Tailwind CSS + Custom | 自定义样式 + 工具类 |
| **海报生成** | html2canvas + jsPDF | 生成分享海报 |
| **数据存储** | localStorage + IndexedDB | 答题过程存储 + 历史记录 |

### 项目结构
```
life-indicator/
├── public/
│   ├── locales/              # 多语言资源文件
│   │   ├── zh-CN.json        # 中文
│   │   └── en-US.json        # 英文
│   └── icons/                # 图标资源
├── src/
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片
│   │   └── styles/           # 全局样式
│   ├── components/           # 公共组件
│   │   ├── ProgressBar.vue   # 进度条组件
│   │   ├── QuestionCard.vue  # 题目卡片组件
│   │   ├── AnswerButton.vue  # 选项按钮组件
│   │   ├── RadarChart.vue    # 雷达图组件
│   │   ├── BarChart.vue      # 柱状图组件
│   │   ├── ResultCard.vue    # 结果卡片组件
│   │   ├── LanguageSwitcher.vue # 语言切换器
│   │   ├── ShareModal.vue    # 分享弹窗
│   │   └── Confetti.vue      # 庆祝特效
│   ├── views/                # 页面组件
│   │   ├── Home.vue          # 首页
│   │   ├── Welcome.vue       # 欢迎页（语言选择）
│   │   ├── Quiz.vue          # 答题页
│   │   ├── Loading.vue       # 计算中页面
│   │   ├── Result.vue        # 结果页
│   │   └── Suggestions.vue   # 建议页
│   ├── composables/          # 组合式函数
│   │   ├── useQuiz.js        # 答题逻辑管理
│   │   ├── useScoring.js     # 评分算法
│   │   ├── useLifeCalc.js    # 寿命计算
│   │   ├── useChart.js       # 图表配置
│   │   ├── useShare.js       # 分享功能
│   │   └── useLocalStorage.js # 本地存储
│   ├── data/                 # 数据文件
│   │   ├── questions.js      # 48 道测试题
│   │   ├── branchingLogic.js # 分支逻辑配置
│   │   └── lifeTypes.js      # 生命类型定义
│   ├── utils/                # 工具函数
│   │   ├── i18n.js           # 国际化配置
│   │   ├── validators.js     # 数据验证
│   │   └── helpers.js        # 通用辅助函数
│   ├── router/               # 路由配置
│   │   └── index.js
│   ├── stores/               # Pinia Store
│   │   ├── quiz.js           # 答题状态
│   │   └── result.js         # 结果状态
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── tests/                    # 测试文件
├── .env                      # 环境变量
├── vite.config.js            # Vite 配置
├── tailwind.config.js        # Tailwind 配置
├── index.html                # HTML 模板
├── package.json              # 依赖配置
└── README.md                 # 项目说明
```

---

## 📝 测试题目设计（共 48 题）

### 题目分布
| 维度 | 题号范围 | 数量 | 权重 | 说明 |
|------|----------|------|------|------|
| **睡眠习惯** | S01-S10 | 10 题 | 20% | 入睡时间、熬夜频率、睡眠质量等 |
| **饮食习惯** | F01-F10 | 10 题 | 20% | 早餐、蔬果、肉类、糖分等 |
| **运动习惯** | E01-E08 | 8 题 | 20% | 频率、时长、类型、日常活动量等 |
| **心理健康** | M01-M08 | 8 题 | 15% | 压力、焦虑、情绪、社交等 |
| **身体指标** | B01-B06 | 6 题 | 15% | 年龄、性别、BMI、血压、心率等 |
| **生活方式** | L01-L06 | 6 题 | 10% | 吸烟、饮酒、环境、体检等 |

---

### 详细题目列表

#### 🛌 第一部分：睡眠习惯（10 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| S01 | 平均入睡时间 | 😴 你通常几点睡觉？ | <22 点 / 22-23 点 / 23-24 点 / 0-1 点 / >1 点 | 若>23 点 → S02a |
| S02 | 熬夜频率 | 🌙 每周有几天会熬夜到凌晨？ | 从不 / 1-2 天 / 3-4 天 / 几乎每天 | 若≥5 次 → 追问原因 |
| S03 | 睡眠质量 | 💤 早上醒来是否感到精神饱满？ | 总是 / 经常 / 偶尔 / 从不 | 否 → 询问失眠情况 |
| S04 | 午睡习惯 | ☕ 是否有规律午睡？ | 每天都有 / 偶尔 / 从不 | - |
| S05 | 睡前行为 | 📱 睡前 1 小时是否使用手机/电脑？ | 从不 / 偶尔 / 经常 / 一直刷 | 是 → 询问使用时长 |
| S06 | 睡眠环境 | 🌑 你的卧室光线和噪音情况？ | 非常安静黑暗 / 一般 / 较吵 / 很亮 | - |
| S07 | 起床规律性 | ⏰ 工作日与周末起床时间差多少？ | 基本一致 / 差 1 小时 / 差 2 小时 / 差更多 | >2 小时 → 扣分项 |
| S08 | 打鼾情况 | 😴 是否有严重打鼾或呼吸暂停？ | 没有 / 偶尔 / 经常 / 被医生诊断过 | 是 → 建议就医 |
| S09 | 咖啡因摄入 | ☕ 下午 3 点后还会喝咖啡/茶吗？ | 从不 / 偶尔 / 经常 / 每天都喝 | 是 → 询问具体时间 |
| S10 | 小计得分 | - | - | 权重系数计算 |

---

#### 🥗 第二部分：饮食习惯（10 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| F01 | 早餐习惯 | 🍳 你是否每天吃早餐？ | 每天都吃 / 经常吃 / 偶尔吃 / 几乎不吃 | 否 → 询问原因 |
| F02 | 蔬菜摄入 | 🥦 每日蔬菜摄入量大概多少？ | <1 份 / 1-2 份 / 3-4 份 / >4 份 | <1 份 → 给出建议 |
| F03 | 水果摄入 | 🍎 每日水果摄入量大概多少？ | 从不 / 1 个 / 1-2 个 / 3 个以上 | - |
| F04 | 红肉消费 | 🥩 每周吃红肉（猪牛羊）几次？ | 从不 / 1-2 次 / 3-5 次 / >5 次 | >5 次/周 → 警告提示 |
| F05 | 加工食品 | 🌭 是否常吃香肠、培根等加工肉类？ | 从不 / 每月几次 / 每周几次 / 几乎每天 | 经常 → 扣分项 |
| F06 | 糖分摄入 | 🍰 含糖饮料/甜点摄入频率？ | 从不 / 每周 1-2 次 / 几乎每天 / 不停嘴 | 每天 → 深入询问 |
| F07 | 饮水习惯 | 💧 每日饮水量大概多少？ | <1L / 1-2L / 2-3L / >3L | <1L → 提醒 |
| F08 | 烹饪方式 | 👨‍🍳 你偏好的烹饪方式是？ | 蒸煮为主 / 炒炖混合 / 油炸烧烤为主 | 油炸>50% → 扣分 |
| F09 | 外食频率 | 🍽️ 每周外食/外卖次数？ | 从不 / 1-2 次 / 3-5 次 / >7 次 | >7 次 → 分析影响 |
| F10 | 小计得分 | - | - | 权重系数计算 |

---

#### 🏃 第三部分：运动习惯（8 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| E01 | 运动频率 | 🏋️ 每周有几天会主动运动？ | 从不 / 1-2 天 / 3-4 天 / 5 天以上 | 0 → 询问原因 |
| E02 | 运动时长 | ⏱️ 每次运动持续多久？ | <30min / 30-60min / 1-2h / >2h | - |
| E03 | 运动类型 | 🏃 你更偏爱哪种运动？ | 有氧跑步 / 力量训练 / 球类运动 / 瑜伽拉伸 | - |
| E04 | 日常活动量 | 👣 日均步数大概多少？ | <5000 / 5000-10000 / 10000-15000 / >15000 | <5000 → 建议 |
| E05 | 久坐时间 | 🪑 连续坐着工作/娱乐最长多久？ | <1h / 1-2h / 2-4h / >4h | >2h → 警告 |
| E06 | 心肺功能 | 🧗 爬几层楼会开始气喘？ | <5 层 / 5-10 层 / 10-15 层 / 15 层以上 | <5 层 → 建议锻炼 |
| E07 | 运动历史 | 📅 保持当前运动习惯多久了？ | <1 月 / 1-3 月 / 3-6 月 / >6 月 | <3 月 → 鼓励坚持 |
| E08 | 小计得分 | - | - | 权重系数计算 |

---

#### 🧠 第四部分：心理健康（8 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| M01 | 压力水平 | 😰 近一个月感到压力的频率？ | 从未 / 偶尔 / 经常 / 总是 | 经常→M02a |
| M02 | 压力源 | 🎯 主要压力来源是什么？ | 工作学习 / 家庭关系 / 经济状况 / 健康问题 / 其他 | 多源 → 深度建议 |
| M03 | 焦虑症状 | 😟 是否经常感到紧张不安？ | 从不 / 偶尔 / 有时 / 经常 | 是 → M04a |
| M04 | 放松能力 | 🧘 能否快速从负面情绪中恢复？ | 很快 / 一般 / 较慢 / 很难 | 不能 → 建议冥想 |
| M05 | 社交支持 | 🤝 遇到困难时有人倾诉吗？ | 总有 / 有几个 / 很少 / 完全没有 | 没有 → 建议拓展社交 |
| M06 | 情绪状态 | 😊 最近两周情绪总体如何？ | 很低落 / 有些低落 / 平稳 / 积极向上 | 低落 → 专业建议 |
| M07 | 兴趣爱好 | 🎨 是否有定期参与的爱好？ | 有多个 / 有一个 / 偶尔 / 没有 | 无 → 建议培养 |
| M08 | 小计得分 | - | - | 权重系数计算 |

---

#### 🏥 第五部分：身体指标（6 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| B01 | 年龄 | 🎂 您的年龄？ | 输入框（18-100 岁） | 自动计算基础分 |
| B02 | 性别 | 👫 生理性别？ | 男 / 女 / 不愿透露 | 调整基准寿命 |
| B03 | 身高 | 📏 您的身高（cm）？ | 输入框（100-250cm） | 自动计算 BMI |
| B04 | 体重 | ⚖️ 您的体重（kg）？ | 输入框（30-200kg） | 自动计算 BMI |
| B05 | 血压状况 | 🩺 您的血压状况如何？ | 正常 (<120/80) / 偏高 (120-139/80-89) / 高血压 (≥140/90) | 异常 → 就医建议 |
| B06 | 静息心率 | ❤️ 安静状态下的心率？ | <60 / 60-80 / 80-100 / >100 bpm | 异常 → 关注心脏健康 |

---

#### 🏡 第六部分：生活方式与环境（6 题）

| 题号 | 主题 | 示例问题 | 选项示例 | 二级分支 |
|------|------|----------|----------|----------|
| L01 | 吸烟史 | 🚬 您的吸烟情况？ | 从不吸烟 / 已戒烟 / 目前吸烟 | 吸烟 → 询问年限和数量 |
| L02 | 饮酒习惯 | 🍷 饮酒频率和量？ | 不喝 / 偶尔（每月<4 次） / 适度（每周 1-3 次） / 频繁（几乎每天） | 频繁 → 肝健康警告 |
| L03 | 居住环境 | 🌆 居住城市空气质量指数 (AQI) 平均水平？ | 优秀 (<50) / 良好 (50-100) / 轻度污染 (100-150) / 较差 (>150) | >100 → 建议防护 |
| L04 | 工作环境 | 💼 工作环境是否存在风险因素？ | 无风险 / 轻微压力 / 辐射/化学暴露 / 高强度体力劳动 | 高风险 → 防护措施 |
| L05 | 体检习惯 | 📋 每年进行全面体检吗？ | 每年都做 / 隔年做一次 / 偶尔 / 从未 | 否 → 强调重要性 |
| L06 | 家族病史 | 🧬 直系亲属是否有早逝或遗传病史？ | 无 / 不确定 / 有心血管疾病 / 有癌症史 | 有 → 风险预警 |

## 🧮 评分算法设计
### 1. 总分计算（0-100 分）
```javascript
// 各维度权重分配
const WEIGHTS = {
  sleep: 0.20,      // 睡眠习惯 20%
  diet: 0.20,       // 饮食习惯 20%
  exercise: 0.20,   // 运动习惯 20%
  mental: 0.15,     // 心理健康 15%
  body: 0.15,       // 身体指标 15%
  lifestyle: 0.10   // 生活方式 10%
};
// 每题分值（每题 0-10 分）
// 根据选项质量赋分，例如：
const SCORE_MAPPING = {
  best: 10,   // 最优选项
  good: 8,    // 较好选项
  average: 6, // 一般选项
  poor: 4,    // 较差选项
  worst: 2    // 最差选项
};
// 计算各维度得分
function calculateDimensionScore(questions, answers, dimension) {
  const dimensionQuestions = questions.filter(q => q.dimension === dimension);
  const totalScore = dimensionQuestions.reduce((sum, q) => {
    return sum + (answers[q.id] ? getScore(q, answers[q.id]) : 0);
  }, 0);
  const maxScore = dimensionQuestions.length * 10;
  return (totalScore / maxScore) * 100;
}
// 计算加权总分
function calculateTotalScore(scores) {
  return Object.keys(WEIGHTS).reduce((total, key) => {
    return total + (scores[key] || 0) * WEIGHTS[key];
  }, 0);
}
### 2. 预期寿命计算公式
```javascript
/**
 * 基于 WHO 数据和 Framingham 心脏研究
 * 综合多种因素计算预期寿命
 */
function calculateLifeExpectancy(userData, dimensionScores) {
  // 基础寿命（参考 WHO 2023 数据）
  const BASE_LIFESPAN = {
    male: 76,  // 男性平均预期寿命
    female: 81 // 女性平均预期寿命
  };
  
  // 1. 生活习惯修正因子（-10 到 +10 岁）
  const scoreFactor = (dimensionScores.total - 50) * 0.4;
  
  // 2. BMI 修正
  let bmiFactor = 0;
  const bmi = userData.weight / ((userData.height / 100) ** 2);
  if (bmi < 18.5) bmiFactor = -2;           // 过瘦
  else if (bmi < 24) bmiFactor = 0;         // 正常
  else if (bmi < 28) bmiFactor = -3;        // 超重
  else bmiFactor = -6;                       // 肥胖
  
  // 3. 年龄修正（年龄越大，剩余寿命越少）
  const ageFactor = Math.max(0, (100 - userData.age) * 0.1);
  
  // 4. 不良习惯惩罚
  let penalty = 0;
  if (userData.smoking === 'current') penalty += 8;
  else if (userData.smoking === 'former') penalty += 3;
  
  if (userData.drinking === 'frequent') penalty += 3;
  
  if (userData.bloodPressure === 'high') penalty += 4;
  
  if (dimensionScores.exercise < 40) penalty += 3;
  
  // 5. 保护因素奖励
  let bonus = 0;
  if (dimensionScores.sleep >= 80) bonus += 2;
  if (dimensionScores.diet >= 80) bonus += 2;
  if (userData.checkup === 'annual') bonus += 1;
  
  // 最终计算
  const base = BASE_LIFESPAN[userData.gender] || BASE_LIFESPAN.female;
  const predictedAge = base + scoreFactor + bmiFactor + ageFactor - penalty + bonus;
  
  // 理想状态下的寿命（假设所有习惯都优化到最佳）
  const idealScore = 100;
  const idealFactor = (idealScore - 50) * 0.4;
  const idealPenalty = 0; // 无不良习惯
  const idealAge = base + idealFactor + bmiFactor + ageFactor - idealPenalty + bonus;
  
  return {
    current: Math.round(Math.max(60, Math.min(100, predictedAge))), // 限制在 60-100 之间
    ideal: Math.round(Math.max(75, Math.min(105, idealAge))),
    potential: Math.round(idealAge - predictedAge),
    bmi: parseFloat(bmi.toFixed(1)),
    riskFactors: getRiskFactors(userData, dimensionScores)
  };
}

// 获取风险因素列表
function getRiskFactors(userData, scores) {
  const risks = [];
  if (userData.smoking === 'current') risks.push('吸烟');
  if (userData.bloodPressure === 'high') risks.push('高血压');
  if (scores.exercise < 40) risks.push('缺乏运动');
  if (scores.diet < 50) risks.push('饮食不健康');
  if (scores.sleep < 50) risks.push('睡眠不足');
  if (scores.mental < 50) risks.push('心理压力过大');
  return risks;
}
```
### 3. 生命类型分类
根据总分划分 5 个等级：
| 等级 | 分数范围 | 类型名称 | 特征描述 | 预期寿命 |
|------|----------|----------|----------|----------|
| **S 级** | 90-100 | 🏆 长寿精英型 | 生活习惯极佳，有望活到 85-90 岁 | 超平均 5-10 年 |
| **A 级** | 80-89 | ✨ 健康优化型 | 生活习惯良好，预期寿命超平均 3-5 年 | 超平均 3-5 年 |
| **B 级** | 70-79 | ⚖️ 平衡稳定型 | 生活习惯中等，预期寿命接近平均 | 与平均持平 |
| **C 级** | 60-69 | ⚠️ 需改善型 | 存在不良习惯，可提升空间大 | 低于平均 2-4 年 |
| **D 级** | 0-59 | 🚨 风险警示型 | 生活习惯较差，需立即调整 | 低于平均 5 年以上 |

## 📱 页面设计与交互流程
### 页面结构图
```
┌─────────────────────────────────────┐
│          首页 (Home.vue)             │
│  ┌───────────────────────────────┐  │
│  │   🧬 生命长度预测测试          │  │
│  │                               │  │
│  │  科学评估你的生活习惯，         │  │
│  │  预测你的预期寿命              │  │
│  │                               │  │
│  │  ⏱️ 预计用时：约 8-10 分钟      │  │
│  │  📝 48 道科学测试题             │  │
│  │  🎯 个性化健康建议             │  │
│  │                               │  │
│  │     [开始测试] 🚀              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│        欢迎页 (Welcome.vue)          │
│  ┌───────────────────────────────┐  │
│  │   👋 欢迎来到生命预测测试！    │  │
│  │                               │  │
│  │   请选择您的偏好语言：         │  │
│  │                               │  │
│  │   🇨🇳 中文                     │  │
│  │   🇺🇸 English                  │  │
│  │                               │  │
│  │   💡 小提示：语言可随时切换    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│         答题页 (Quiz.vue)            │
│  ┌───────────────────────────────┐  │
│  │  进度条                        │  │
│  │  [===    ===    ===    ===] 45%│  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │  第 22 题 / 共 48 题              │  │
│  │                                │  │
│  │  😴 你通常几点睡觉？           │  │
│  │                                │  │
│  │  ◉ <22 点                       │  │
│  │  ○ 22-23 点                     │  │
│  │  ○ 23-24 点                     │  │
│  │  ○ 0-1 点                       │  │
│  │  ○ >1 点                        │  │
│  │                                │  │
│  │  💡 小贴士：23 点前入睡最健康哦！│  │
│  └───────────────────────────────┘  │
│                                      │
│  [上一题]    [下一题] 🚀            │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│       计算中页面 (Loading.vue)       │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │         ⏳ 计算中...           │  │
│  │                               │  │
│  │    📊 分析各项指标            │  │
│  │    🧮 计算预期寿命            │  │
│  │    💡 生成改善建议            │  │
│  │                               │  │
│  │      请稍候，马上就好~        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│        结果页 (Result.vue)           │
│  ┌───────────────────────────────┐  │
│  │   🎯 你的生命类型：A 级         │  │
│  │      ✨ 健康优化型             │  │
│  │                               │  │
│  │   太棒了！你的生活习惯很优秀！│  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   📊 雷达图   │  │   📈 柱状图   │ │
│  │  (六维分析)   │  │ (各维度得分)  │ │
│  └──────────────┘  └──────────────┘ │
│                                      │
│  ┌───────────────────────────────┐  │
│  │   ⏳ 预期寿命：78 岁             │  │
│  │   💡 理想状态：可活到 83 岁      │  │
│  │   ▲ 还有 5 年的提升空间          │  │
│  │                               │  │
│  │   🎉 已超越全国 65% 的人群       │  │
│  └───────────────────────────────┘  │
│                                      │
│  [查看详细建议]  [分享结果] 📤       │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│        建议页 (Suggestions.vue)      │
│  ┌───────────────────────────────┐  │
│  │  🛌 睡眠改善建议               │  │
│  │  • 每晚提前 30 分钟入睡          │  │
│  │  • 睡前 1 小时远离电子屏幕        │  │
│  │  • 保持卧室安静黑暗             │  │
│  │  ✅ 预期收益：+0.8 岁            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🥗 饮食改善建议               │  │
│  │  • 每日增加 2 份蔬菜摄入         │  │
│  │  • 减少含糖饮料至每周 1 次        │  │
│  │  • 多吃全谷物和鱼类             │  │
│  │  ✅ 预期收益：+1.2 岁            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🏃 运动改善建议               │  │
│  │  • 每周增加 2 次有氧运动         │  │
│  │  • 每次运动至少 30 分钟           │  │
│  │  • 减少久坐时间                 │  │
│  │  ✅ 预期收益：+1.5 岁            │  │
│  └───────────────────────────────┘  │
│  ...（其他维度同理）                  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │  🎯 综合改善计划               │  │
│  │                               │  │
│  │  若全部执行，预计可活到：83 岁   │  │
│  │  📈 相比现在延长 5 年            │  │
│  │                               │  │
│  │  [重新测试] ↺  [分享结果] 📤    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
### UI/UX设计风格
#### 配色方案
| 用途 | 颜色值 | 说明 |
|------|--------|------|
| **主色调** | #4CAF50 | 绿色，代表健康、生机 |
| **辅助色 - 成功** | #2196F3 | 蓝色，代表科技、信任 |
| **辅助色 - 活力** | #FF9800 | 橙色，代表活力、温暖 |
| **警告色** | #FF5722 | 橙红，代表警示 |
| **背景渐变** | #E8F5E9 → #C8E6C9 | 浅绿渐变，营造轻松氛围 |
| **文字主色** | #263238 | 深灰，易读性高 |
| **文字副色** | #546E7A | 中灰，用于次要信息 |
#### 字体规范
| 元素 | 字体 | 字号 | 字重 |
|------|------|------|------|
| **标题** | 思源黑体 / Noto Sans SC | 24px | Medium (500) |
| **副标题** | 思源黑体 / Noto Sans SC | 18px | Regular (400) |
| **正文** | 思源黑体 / Noto Sans SC | 16px | Regular (400) |
| **小字提示** | 思源黑体 / Noto Sans SC | 14px | Regular (400) |
| **数字显示** | DIN Alternate | 32px+ | Bold (700) |

#### Emoji 使用规范
- 部分题目开头添加相关 emoji，增加趣味性
- 结果卡片使用大 emoji 作为视觉标识
**示例：**
- 😴 睡眠相关
- 🍳🥗🥦 饮食相关
- 🏃🏋️💪 运动相关
- 🧠😊😰 心理相关
- 🏥❤️🩺 身体指标相关
- 🏡🚬🍷 生活方式相关
#### 动效设计
| 场景 | 动画效果 | 时长 |
|------|----------|------|
| **答题页切换** | 平滑左右滑入/滑出 | 300ms |
| **进度条增长** | 宽度动态增长 + 颜色过渡 | 500ms |
| **结果展示** | 数字滚动动画 + 渐入效果 | 1s |
| **图表加载** | 从 0 逐渐增长 + 曲线绘制 | 800ms |
| **按钮悬停** | 轻微放大 + 阴影加深 | 200ms |
| **庆祝特效** | 彩带飘落动画（完成测试时） | 3s |


## 🎮 智能分支逻辑设计

### 分支逻辑配置示例

```javascript
// branchingLogic.js
export const branchingRules = {
  // S01: 入睡时间 -> 若晚于 23 点，追加追问题
  'S01': {
    conditions: [
      {
        answer: ['late_night', 'very_late'],
        actions: {
          showFollowup: ['S02a', 'S02b'],  // 显示追问题
          skipQuestions: ['S07']            // 跳过无关题目
        }
      }
    ]
  },
  
  // E01: 运动频率 -> 若从不运动，追问原因
  'E01': {
    conditions: [
      {
        answer: 'never',
        actions: {
          showFollowup: ['E01a'],
          highlightTip: true
        }
      }
    ]
  },
  
  // M01: 压力水平 -> 若经常感到压力，深入询问
  'M01': {
    conditions: [
      {
        answer: ['often', 'always'],
        actions: {
          showFollowup: ['M02a', 'M02b', 'M02c'],
          changeTone: 'supportive'  // 改变提示语气为支持性
        }
      }
    ]
  }
};

// 追问题定义
export const followupQuestions = {
  'S02a': {
    question: '😰 熬夜的主要原因是什么？（多选）',
    type: 'multiselect',
    options: [
      { id: 'work', text: '工作或学习压力大' },
      { id: 'entertainment', text: '刷手机/追剧/游戏' },
      { id: 'insomnia', text: '想睡但睡不着' },
      { id: 'family', text: '家庭事务干扰' }
    ]
  },
  'E01a': {
    question: '🤔 不运动的主要原因是？',
    type: 'single',
    options: [
      { id: 'no_time', text: '太忙了，没时间' },
      { id: 'no_energy', text: '工作太累，没精力' },
      { id: 'no_motivation', text: '缺乏动力和兴趣' },
      { id: 'no_facility', text: '没有合适的运动场所' },
      { id: 'health_issue', text: '身体有不适或疾病' }
    ]
  }
};
```

---

## 🌍 多语言支持设计

### 语言资源文件结构

```json
// public/locales/zh-CN.json
{
  "meta": {
    "title": "生命长度预测测试",
    "description": "科学评估你的生活习惯，预测你的预期寿命"
  },
  "home": {
    "title": "🧬 生命长度预测测试",
    "subtitle": "科学评估你的生活习惯，预测你的预期寿命",
    "duration": "⏱️ 预计用时：约 8-10 分钟",
    "questions": "📝 48 道科学测试题",
    "suggestions": "🎯 个性化健康建议",
    "startButton": "开始测试 🚀"
  },
  "quiz": {
    "progress": "进度",
    "questionCount": "第 {{current}} 题 / 共 {{total}} 题",
    "nextButton": "下一题 →",
    "prevButton": "← 上一题",
    "submitButton": "提交 ✓",
    "tips": {
      "hint": "💡 小提示",
      "encouragement": "加油！快完成了！",
      "halfway": " halfway 啦，继续加油！"
    }
  },
  "result": {
    "yourType": "你的生命类型",
    "lifeTypes": {
      "S": {
        name": "长寿精英型 🏆",
        description": "生活习惯极佳，有望活到 85-90 岁"
      },
      "A": {
        name": "健康优化型 ✨",
        description": "生活习惯良好，预期寿命超平均 3-5 年"
      },
      "B": {
        name": "平衡稳定型 ⚖️",
        description": "生活习惯中等，预期寿命接近平均"
      },
      "C": {
        name": "需改善型 ⚠️",
        description": "存在不良习惯，可提升空间大"
      },
      "D": {
        name": "风险警示型 🚨",
        description": "生活习惯较差，需立即调整"
      }
    },
    "predictedAge": "预期寿命：{{age}} 岁",
    "idealAge": "理想状态：可活到 {{age}} 岁",
    "potential": "还有 {{years}} 年的提升空间",
    "comparison": "已超越全国 {{percentage}}% 的人群"
  },
  "suggestions": {
    "title": "个性化改善建议",
    "sections": {
      "sleep": "🛌 睡眠改善建议",
      "diet": "🥗 饮食改善建议",
      "exercise": "🏃 运动改善建议",
      "mental": "🧠 心理健康建议",
      "lifestyle": "🏡 生活方式建议"
    },
    "expectedBenefit": "✅ 预期收益：+{{years}} 岁",
    "comprehensivePlan": "综合改善计划",
    "ifAllExecuted": "若全部执行，预计可活到：{{age}} 岁",
    "extension": "相比现在延长 {{years}} 年"
  },
  "share": {
    "title": "分享测试结果",
    "poster": "生成海报图片",
    "link": "生成分享链接",
    "copied": "已复制到剪贴板！📋",
    "qrCode": "扫描二维码查看结果"
  }
}
```

## 🔗 匿名分享功能设计

### 1. 海报生成

```javascript
// useShare.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function generateSharePoster(resultData) {
  // 创建海报 DOM 结构
  const posterHTML = `
    <div class="poster">
      <div class="header">
        <h1>🧬 我的生命长度预测</h1>
        <p>科学评估 · 精准分析 · 个性建议</p>
      </div>
      
      <div class="result-card">
        <div class="type-badge">{{ result.lifeType }}</div>
        <div class="score">{{ result.score }}分</div>
        <div class="age">
          <div class="current">预期寿命：{{ result.currentAge }}岁</div>
          <div class="ideal">理想状态：{{ result.idealAge }}岁</div>
          <div class="potential">提升空间：{{ result.potential }}岁</div>
        </div>
      </div>
      
      <div class="chart-section">
        <canvas id="radarChart"></canvas>
      </div>
      
      <div class="footer">
        <p>扫码查看完整报告</p>
        <div class="qrcode"></div>
        <p class="disclaimer">*本测试仅供参考，不作为医学诊断依据</p>
      </div>
    </div>
  `;
  
  // 使用 html2canvas 截图
  const canvas = await html2canvas(posterElement, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false
  });
  
  // 转换为图片并下载
  const imageURL = canvas.toDataURL('image/png');
  downloadImage(imageURL, 'life-expectancy-result.png');
}
```

### 2. 短链接生成

```javascript
// 生成加密的 URL 参数
function generateShareURL(resultData) {
  // 加密数据
  const encrypted = encrypt(resultData);
  
  // 生成唯一 ID
  const id = generateUUID();
  
  // 存储到数据库（可选）
  await saveResultToDB({ id, data: encrypted });
  
  // 返回短链接
  return `https://life-indicator.app/share?id=${id}`;
}

// 从 URL 加载历史结果
async function loadSharedResult(id) {
  const result = await getResultFromDB(id);
  if (result) {
    const decrypted = decrypt(result.data);
    showResult(decrypted);
  }
}
```

---

## 💾 数据存储方案

### localStorage - 答题过程存储

```javascript
// 存储答题进度
const QUIZ_STORAGE_KEY = 'life_indicator_quiz_progress';

function saveQuizProgress(currentQuestion, answers) {
  const progress = {
    currentQuestion,
    answers,
    startTime: Date.now(),
    lastUpdate: Date.now()
  };
  
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress));
}

// 恢复答题进度（防止刷新丢失）
function restoreQuizProgress() {
  const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}
```

### IndexedDB - 历史记录存储

```javascript
// 使用 Dexie.js 简化 IndexedDB 操作
import Dexie from 'dexie';

const db = new Dexie('LifeIndicatorDB');

db.version(1).stores({
  results: '++id, createdAt, lifeType, score, predictedAge'
});

// 保存测试结果
async function saveResult(result) {
  await db.results.add({
    ...result,
    createdAt: Date.now()
  });
}

// 获取历史记录
async function getHistory() {
  return await db.results.orderBy('createdAt').reverse().toArray();
}

// 删除历史记录
async function deleteResult(id) {
  await db.results.delete(id);
}
```

---

## 🎯 轻松有趣的文案风格

### 幽默提示语示例

| 场景 | 严肃版本 | 轻松有趣版本 |
|------|----------|--------------|
| **熬夜提醒** | 建议减少熬夜频率 | 😴 再熬下去，熊猫都要羡慕你了！早点睡吧～ |
| **饮水提醒** | 请增加饮水量 | 💧 你的身体快要冒烟啦！快喝杯水降降温～ |
| **运动鼓励** | 建议增加运动量 | 🏃 别躺平啦！起来动一动，活力满满过一生！ |
| **压力提示** | 请注意心理健康 | 😰 压力山大也要学会放松，不然头发要离家出走了！ |
| **饮食建议** | 建议均衡饮食 | 🥦 蔬菜才是真英雄！别让外卖承包你的晚餐哦～ |

### 鼓励性文案

**答题中：**
- "加油！离真相更近一步啦！✨"
- "坚持就是胜利，已经答了一半咯！💪"
- "每道题都在为你更健康的人生铺路！🛣️"

**完成测试：**
- "恭喜你完成了自我探索之旅！🎉"
- "无论结果如何，改变永远不晚！🌟"
- "了解自己的身体，是健康生活的第一步！❤️"

---

## 📊 图表可视化配置

### 雷达图配置（六维度分析）

```javascript
// Radar Chart Configuration
const radarConfig = {
  type: 'radar',
  data: {
    labels: ['睡眠', '饮食', '运动', '心理', '身体', '生活'],
    datasets: [{
      label: '你的得分',
      data: [85, 70, 60, 75, 80, 65],
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: 'rgba(76, 175, 80, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(76, 175, 80, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
    }, {
      label: '平均水平',
      data: [60, 60, 60, 60, 60, 60],
      backgroundColor: 'rgba(158, 158, 158, 0.1)',
      borderColor: 'rgba(158, 158, 158, 1)',
      borderDash: [5, 5],
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        pointLabels: {
          font: {
            size: 14,
            family: 'Noto Sans SC'
          },
          color: '#263238'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  }
};
```

### 柱状图配置（各维度得分对比）

```javascript
// Bar Chart Configuration
const barConfig = {
  type: 'bar',
  data: {
    labels: ['睡眠习惯', '饮食习惯', '运动习惯', '心理健康', '身体指标', '生活方式'],
    datasets: [{
      label: '你的得分',
      data: [85, 70, 60, 75, 80, 65],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 152, 0, 0.8)'
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(255, 152, 0, 1)'
      ],
      borderWidth: 1,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
};
```

---

## 🚀 开发路线图

### Phase 1: 基础框架搭建（1-2 天）
- [ ] 初始化 Vue 3 + Vite 项目
- [ ] 配置 Tailwind CSS
- [ ] 安装依赖（Pinia, Vue Router, Chart.js, vue-i18n 等）
- [ ] 搭建项目目录结构
- [ ] 配置路由系统

### Phase 2: 核心功能开发（3-4 天）
- [ ] 实现 48 道测试题数据结构
- [ ] 开发答题页面组件
- [ ] 实现智能分支逻辑
- [ ] 开发评分算法
- [ ] 实现寿命计算公式

### Phase 3: 结果展示页（2-3 天）
- [ ] 集成 Chart.js 图表
- [ ] 设计生命类型分类
- [ ] 开发结果卡片组件
- [ ] 实现数字滚动动画

### Phase 4: 建议系统和分享功能（2-3 天）
- [ ] 开发个性化建议生成器
- [ ] 实现海报生成功能
- [ ] 实现短链接分享
- [ ] 添加二维码生成

### Phase 5: 国际化与优化（1-2 天）
- [ ] 中英文翻译完善
- [ ] 响应式适配移动端
- [ ] 性能优化
- [ ] Bug 修复

### Phase 6: 测试与部署（1 天）
- [ ] 功能测试
- [ ] 用户体验测试
- [ ] 生产环境构建
- [ ] 部署上线

---

## 📌 附录

### A. 参考数据来源
1. WHO 世界健康组织 - 全球平均预期寿命数据
2. Framingham 心脏研究 - 生活习惯与心血管疾病关联
3. Harvard 医学院 - 健康生活方式研究
4. 中国疾病预防控制中心 - 国民健康状况报告

### B. 免责声明
*本测试仅供娱乐和自我参考，不能作为医学诊断依据。如有健康问题，请咨询专业医生。*

---

**设计完成度**: ✅ 100%  
**待开发**: ⏳ 代码实现阶段  

祝开发顺利！🎉
