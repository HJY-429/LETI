# 🧬 生命密码测试 (Life Code Test)

> 类似 MBTI/SBTI 的生命活力评估工具 —— 通过科学的生活习惯问卷，预测预期寿命，提供个性化健康建议。

**在线体验**: [https://life-indicator.pages.dev](https://life-indicator.pages.dev)

---

## 📖 项目简介

「生命密码测试」是一款基于 Vue 3 的单页应用（SPA），用户通过回答 **48 道测试题**，覆盖 **6 大生命维度**，获得：

- 🎯 **预期寿命预测** — 基于性别、年龄、BMI、生活习惯综合计算
- 📊 **六维雷达图** — 睡眠 / 饮食 / 运动 / 心理 / 身体指标 / 生活方式
- 🔤 **生命等级评定** — S / A / B / C / D 五档分级 + 专属称号
- 💡 **个性化改善建议** — 根据薄弱维度定向推荐
- 🎉 **分享功能** — 生成海报图片 + canvas-confetti 庆祝特效

### 核心特色

| 特色 | 说明 |
|------|------|
| 🧠 **智能分支逻辑** | 根据答案动态触发追加问题（如选了"不吃早餐"→追问原因） |
| 🌍 **中英双语** | vue-i18n 驱动，首次访问自动询问语言偏好 |
| 📱 **响应式设计** | Tailwind CSS 构建，PC 与移动端自适应 |
| 💾 **本地历史记录** | Dexie.js (IndexedDB) 持久化保存测试结果 |
| 📈 **Chart.js 图表** | 雷达图 + 柱状图双维度可视化 |
| ⚡ **Vite 构建** | 开箱即用的热更新与优化打包 |

---

## 🛠️ 技术栈

| 类别 | 技术方案 | 版本 |
|------|----------|------|
| 前端框架 | Vue 3 (Composition API `<script setup>`) | ^3.4.21 |
| 路由 | Vue Router | ^4.3.0 |
| 状态管理 | Pinia | ^2.1.7 |
| 国际化 | vue-i18n | ^9.10.2 |
| CSS 框架 | Tailwind CSS | ^3.4.3 |
| 图表库 | Chart.js + vue-chartjs | ^4.4.2 / ^5.3.0 |
| 本地数据库 | Dexie.js (IndexedDB) | ^3.2.7 |
| 截图分享 | html2canvas | ^1.4.1 |
| 庆祝动效 | canvas-confetti | ^1.9.3 |
| 构建工具 | Vite | ^5.2.8 |
| 部署平台 | Cloudflare Pages (Wrangler) | — |

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本 → 输出到 dist/
npm run build

# 预览构建结果
npm run preview
```

### 部署到 Cloudflare Pages

```bash
CLOUDFLARE_API_TOKEN="你的Token" \
CLOUDFLARE_ACCOUNT_ID="你的AccountID" \
npx wrangler pages deploy dist --project-name=life-indicator --branch=main
```

部署配置文件：`wrangler.toml`（项目名 `life-indicator`，构建输出目录 `dist`）

---

## 📁 项目结构

```
Life Indicator/
├── index.html                  # 入口 HTML
├── package.json / lock.json    # 依赖与脚本
├── vite.config.js              # Vite 配置（路径别名、代码分割）
├── tailwind.config.js          # Tailwind 配置（主题色、动画）
├── postcss.config.js           # PostCSS 配置
├── wrangler.toml               # Cloudflare Pages 部署配置
├── design-plan.md              # 设计文档（历史参考）
│
├── public/
│   └── favicon.svg             # 网站图标
│
├── dist/                       # 构建输出目录
│
└── src/                        # 源代码根目录
    ├── main.js                 # 应用入口，挂载 Vue 实例
    ├── App.vue                 # 根组件（RouterView + LanguageSwitcher）
    │
    ├── router/index.js         # 路由定义（6 个页面路由）
    │
    ├── locales/                # 国际化语言包（运行时使用）
    │   ├── zh-CN.json          # 中文翻译
    │   └── en-US.json          # 英文翻译
    │
    ├── stores/                 # Pinia 状态管理
    │   ├── app.js              # 全局状态（语言、主题）
    │   ├── quiz.js             # 测试状态（答案、进度、分支逻辑）
    │   └── result.js           # 结果历史记录（IndexedDB）
    │
    ├── views/                  # 页面组件（6 个路由页面）
    │   ├── Home.vue            # 首页
    │   ├── Welcome.vue         # 欢迎页（填写性别/年龄/身高体重）
    │   ├── Quiz.vue            # 答题页
    │   ├── Loading.vue         # 计算动画页
    │   ├── Result.vue          # 结果页（寿命预测 + 图表 + 分享）
    │   └── Suggestions.vue     # 改善建议页
    │
    ├── components/             # 可复用组件
    │   ├── QuestionCard.vue    # 问题卡片（单选/多选/数字输入）
    │   ├── ProgressBar.vue     # 进度条
    │   ├── RadarChart.vue      # 六维雷达图
    │   ├── BarChart.vue        # 得分柱状图
    │   ├── CalculationDetail.vue # 评分计算明细
    │   ├── Confetti.vue        # 庆祝烟花
    │   ├── ShareModal.vue      # 分享弹窗（海报生成）
    │   └── LanguageSwitcher.vue # 语言切换按钮
    │
    ├── composables/            # 核心业务逻辑
    │   ├── useScoring.js       # 评分引擎（多选正负分、选项加权）
    │   ├── useLifeCalc.js      # 寿命计算（基础寿命 ± BMI ± 惩罚 ± 奖励）
    │   ├── useChart.js         # 图表数据组装
    │   └── useShare.js         # 分享功能（html2canvas 海报生成）
    │
    ├── data/                   # 数据层
    │   ├── questions.js        # 48 道测试题 + 维度元信息
    │   ├── branchingLogic.js   # 分支规则 + 追加问题定义
    │   └── lifeTypes.js        # 生命等级分类（S/A/B/C/D）
    │
    ├── utils/
    │   └── i18n.js             # vue-i18n 实例创建
    │
    └── assets/                 # 静态资源
```

---

## 🧠 核心架构

### 路由流程

```
Home（首页）
  ↓ "开始测试"
Welcome（填写基本信息: 性别/年龄/身高/体重）
  ↓ "进入测试"
Quiz（48 题 + 动态追加题）
  ↓ "提交"
Loading（数字滚动动画）
  ↓
Result（寿命预测 + 等级 + 图表）
  ↓ "查看建议"
Suggestions（各维度改善建议）
```

### 六大评估维度

| 维度代号 | 名称 | 题目数量 | 关键指标示例 |
|----------|------|----------|-------------|
| **S** | Sleep 睡眠 | 8 题 | 睡眠时长、入睡时间、睡眠质量 |
| **D** | Diet 饮食 | 9 题 | 蔬果摄入、红肉、糖分、饮水 |
| **E** | Exercise 运动 | 7 题 | 有氧运动、力量训练、久坐时长 |
| **M** | Mental 心理 | 8 题 | 压力感、社交、情绪管理 |
| **B** | Body 身体指标 | 7 题 | BMI、慢性病、家族病史 |
| **L** | Lifestyle 生活方式 | 9 题 | 吸烟、饮酒、体检、社交连接 |

### 生命等级体系

| 等级 | 分数区间 | 称号（中文） | Title (EN) |
|------|---------|-------------|------------|
| **S** | 85–100 | 🏆 生命力传奇 | Life Legend |
| **A** | 75–84 | 🌟 生命力精英 | Life Elite |
| **B** | 63–74 | 👍 生命力达标 | Life Healthy |
| **C** | 50–62 | ⚠️ 生命力预警 | Life Warning |
| **D** | 0–49 | 🚨 生命力危机 | Life Crisis |

### 智能分支机制

部分问题的答案会触发追加追问，例如：

- **F01**（早餐习惯）→ 选择"经常不吃" → 触发 **F01b**（不吃早餐的原因，多选）
- **S02**（就寝时间）→ 选择凌晨后 → 触发 **S02**（熬夜原因）
- **D04**（水果摄入）→ 选择很少吃 → 触发 **D04b**（替代方案）

分支规则定义在 `src/data/branchingLogic.js`，由 `src/stores/quiz.js` 在答题过程中动态匹配和插入。

---

## 🧪 开发注意事项

- **路径别名**: `@` → `src/`（在 vite.config.js 中配置）
- **状态持久化**: 测试答案通过 `localStorage` 持久化（quiz store），测试结果通过 Dexie.js 存入 IndexedDB（result store）
- **代码分割**: Chart.js 相关打包为 `chart.chunk-vendor.js`，Vue/Router/Pinia 打包为 `default.vendor.js`
- **i18n key 命名**: 按 `页面.元素` 格式组织（如 `home.title`、`quiz.next`、`result.share`）

---

## 📋 版本历史

| 日期 | 内容 |
|------|------|
| 2026-04-13 | 项目创建并完成开发；48 题上线；部署至 Cloudflare Pages |

---

## 部署

```
cd "./Life Indicator"
npm run build
CLOUDFLARE_API_TOKEN="cfut_6..." CLOUDFLARE_ACCOUNT_ID="4907..." \
  npx wrangler pages deploy dist --project-name=life-indicator --branch=main
```


## 📜 License

本项目为个人学习项目。
