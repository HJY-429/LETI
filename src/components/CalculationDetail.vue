<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- 弹窗内容 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-scale-up">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-800">
            🧮 {{ isDevMode ? (isZh ? '计算详情（开发者）' : 'Calculation Details (Dev)') : (isZh ? '计算方式' : 'How It Works') }}
          </h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400">
            ✕
          </button>
        </div>

        <!-- 内容区 -->
        <div class="p-5 overflow-y-auto" style="max-height: calc(85vh - 64px);">
          
          <!-- 用户模式：宽泛版本 -->
          <template v-if="!isDevMode">
            <div class="space-y-6">
              <!-- 总分计算说明 -->
              <section class="p-4 rounded-xl bg-green-50 border border-green-200">
                <h3 class="font-bold text-green-800 mb-2">📊 {{ isZh ? '总分是如何计算的？' : 'How is the total score calculated?' }}</h3>
                <p class="text-sm text-green-700 leading-relaxed">
                  {{ isZh 
                    ? '你的总分基于六大维度的加权平均。每个维度根据你的答题情况独立评分，然后按权重合并成最终得分（满分100）。'
                    : 'Your total score is a weighted average across six dimensions. Each dimension is scored independently based on your answers, then combined into a final score (out of 100).' }}
                </p>
              </section>

              <!-- 维度权重表 -->
              <section>
                <h3 class="font-bold text-gray-800 mb-3">{{ isZh ? '维度权重' : 'Dimension Weights' }}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div v-for="(w, dim) in dimensionWeights" :key="dim"
                       class="p-3 rounded-lg bg-gray-50 text-sm">
                    <span class="font-medium">{{ getDimName(dim) }}</span>
                    <span class="float-right font-bold" :style="{ color: getDimColor(dim) }">{{ Math.round(w * 100) }}%</span>
                  </div>
                </div>
              </section>

              <!-- 生命类型判定 -->
              <section>
                <h3 class="font-bold text-gray-800 mb-3">{{ isZh ? '生命类型判定标准' : 'Life Type Criteria' }}</h3>
                <div class="space-y-2">
                  <div v-for="lt in lifeTypeList" :key="lt.id"
                       class="flex items-center gap-3 p-3 rounded-lg border"
                       :style="{ borderColor: lt.color + '40', backgroundColor: lt.color + '10' }">
                    <span class="text-xl">{{ lt.emoji }}</span>
                    <span class="font-bold text-sm" :style="{ color: lt.color }">{{ lt.name }}</span>
                    <span class="text-xs text-gray-500 ml-auto">{{ lt.range[0] }} - {{ lt.range[1] }} 分</span>
                  </div>
                </div>
              </section>

              <!-- 寿命预测说明 -->
              <section class="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h3 class="font-bold text-blue-800 mb-2">⏳ {{ isZh ? '预期寿命如何得出？' : 'How is life expectancy predicted?' }}</h3>
                <p class="text-sm text-blue-700 leading-relaxed">
                  {{ isZh
                    ? '预期寿命基于总分、生命类型、年龄、性别等多因素综合推算，参考 WHO 和各国人口统计数据给出估算范围。结果仅供参考娱乐，不作为医学诊断依据。'
                    : 'Life expectancy is estimated from total score, life type, age, gender and other factors, referencing WHO and national demographic statistics. For entertainment only.' }}
                </p>
              </section>
            </div>
          </template>

          <!-- 开发者模式：详细技术版 -->
          <template v-else>
            <div class="space-y-5">
              
              <!-- 数据快照 -->
              <section class="p-4 rounded-xl bg-gray-900 text-green-400">
                <h3 class="font-bold mb-2 text-yellow-300">📋 Data Snapshot</h3>
                <pre class="text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono">{{ JSON.stringify(resultData, null, 2) }}</pre>
              </section>

              <!-- 评分算法详解 -->
              <section>
                <h3 class="font-bold text-gray-800 mb-3">🧮 Scoring Algorithm</h3>
                <div class="space-y-3 text-sm text-gray-600">
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">calculateDimensionScore(dimension, answers, followups, context)</code>
                    <p class="mt-1 text-xs">{{ isZh ? '→ 对每个维度遍历题目，累加选项分值 → 归一化到 0-100' : '→ Iterate questions per dimension, sum option scores → normalize to 0-100' }}</p>
                  </div>
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">calculateTotalScore(dimensionScores)</code>
                    <p class="mt-1 text-xs">{{ isZh ? '→ 加权求和: Σ(score_i × weight_i)' : '→ Weighted sum: Σ(score_i × weight_i)' }}</p>
                  </div>
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">getLifeType(totalScore)</code>
                    <pre class="mt-1 text-xs font-mono text-purple-700">if (score >= 85) return S
if (score >= 75) return A
if (score >= 63) return B
if (score >= 50) return C
return D</pre>
                  </div>
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">calculateLifeExpectancy(answers, followupsAnswers)</code>
                    <p class="mt-1 text-xs">{{ isZh ? '→ 综合评分 + 年龄 + 性别 + BMI + 各维度风险因子 → 推算预期寿命和理想寿命' : '→ Score + age + gender + BMI + risk factors → predicted & ideal age' }}</p>
                  </div>
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">BMI scoringRule (B04)</code>
                    <pre class="mt-1 text-xs font-mono text-purple-700">bmi = weight / (height/100)²
if (18.5 ≤ bmi < 24) score = 10
else if (24 ≤ bmi < 28) score = 6
else if (17 ≤ bmi < 30) score = 4
else score = 2</pre>
                  </div>
                  <div class="p-3 rounded-lg bg-gray-50">
                    <code class="text-red-600 font-mono">getPercentileRank(score)</code>
                    <p class="mt-1 text-xs">{{ isZh ? '→ 基于正态分布模拟 (μ=65, σ=15)，返回全国排名百分比' : '→ Normal distribution simulation (μ=65, σ=15), returns percentile rank' }}</p>
                  </div>
                </div>
              </section>

              <!-- 权重常量 -->
              <section>
                <h3 class="font-bold text-gray-800 mb-3">⚙️ WEIGHTS Constants</h3>
                <table class="w-full text-sm border-collapse">
                  <thead><tr class="bg-gray-100"><th class="p-2 text-left border">Dimension</th><th class="p-2 text-right border">Weight</th></tr></thead>
                  <tbody>
                    <tr v-for="(w, dim) in dimensionWeights" :key="dim"><td class="p-2 border font-mono">{{ dim }}</td><td class="p-2 text-right border font-mono">{{ w }}</td></tr>
                  </tbody>
                </table>
              </section>

            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { WEIGHTS } from '../composables/useScoring.js'
import { LIFE_TYPES, getPercentileRank } from '../data/lifeTypes.js'

const props = defineProps({
  resultData: { type: Object, default: () => ({}) },
  isDevMode: { type: Boolean, default: false }
})

defineEmits(['close'])

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

// 维度权重
const dimensionWeights = computed(() => WEIGHTS)

// 生命类型列表
const lifeTypeList = computed(() =>
  Object.values(LIFE_TYPES).map(lt => ({
    id: lt.id,
    emoji: lt.emoji,
    name: isZh.value ? lt.name.zh : lt.name.en,
    color: lt.color,
    range: lt.scoreRange
  }))
)

function getDimName(dim) {
  const map = {
    sleep: isZh.value ? '睡眠' : 'Sleep',
    diet: isZh.value ? '饮食' : 'Diet',
    exercise: isZh.value ? '运动' : 'Exercise',
    mental: isZh.value ? '心理' : 'Mental',
    body: isZh.value ? '身体' : 'Body',
    lifestyle: isZh.value ? '生活' : 'Lifestyle'
  }
  return map[dim] || dim
}

function getDimColor(dim) {
  const map = {
    sleep: '#8B5CF6',
    diet: '#F59E0B',
    exercise: '#10B981',
    mental: '#EC4899',
    body: '#3B82F6',
    lifestyle: '#6366F1'
  }
  return map[dim] || '#666'
}
</script>
