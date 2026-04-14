<template>
  <div class="min-h-screen py-6 px-4 pb-12">
    <!-- 加载中 / 无数据状态 -->
    <div v-if="!hasValidResult" class="min-h-screen flex items-center justify-center -mt-6">
      <div class="text-center py-12">
        <div class="text-5xl mb-4">⏳</div>
        <p class="text-gray-500 text-lg">{{ isZh ? '正在计算您的生命长度...' : 'Calculating your life expectancy...' }}</p>
        <p v-if="debugInfo" class="text-xs text-gray-400 mt-2 max-w-md mx-auto break-all">{{ debugInfo }}</p>
        <button
          @click="recalculate"
          class="mt-6 btn-primary px-6 py-2"
        >
          {{ isZh ? '重新计算' : 'Recalculate' }}
        </button>
      </div>
    </div>

    <!-- 有结果时显示完整内容 -->
    <template v-else>
      <div class="w-full max-w-2xl mx-auto space-y-5">
        <!-- 顶部祝贺 -->
        <div class="text-center py-4 animate-fade-in">
          <p class="text-lg text-gray-600 font-medium">{{ t('result.title') }}</p>
        </div>

        <!-- 生命类型卡片 -->
        <transition name="fade" appear>
          <div 
            class="result-card overflow-hidden animate-scale-up"
            :style="{ background: safeLifeType.bgColor || '#f0f0f0' }"
          >
            <div class="p-6 md:p-8 text-center">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 rounded-full mb-4">
                <span class="text-xs font-bold" :style="{ color: safeLifeType.color || '#666' }">
                  {{ t('result.yourType') }}
                </span>
              </div>

              <h1 class="text-3xl md:text-4xl font-bold mb-3 animate-count-up"
                  :style="{ color: safeLifeType.color || '#333' }">
                {{ lifeTypeName }} {{ safeLifeType.emoji || '' }}
              </h1>

              <p class="text-sm md:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
                {{ lifeTypeDesc }}
              </p>

              <div class="inline-flex items-baseline gap-1">
                <span class="text-5xl md:text-7xl font-bold text-gray-800 animate-count-up">
                  {{ displayScore }}
                </span>
                <span class="text-xl text-gray-500">/100</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- 预期寿命卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="result-card p-5 text-center animate-scale-up" style="animation-delay: 0.1s">
            <div class="text-sm text-gray-500 mb-1">{{ t('result.predictedAge') }}</div>
            <div class="text-3xl md:text-4xl font-bold text-primary animate-count-up">
              {{ displayCurrentAge }}
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ t('result.yearsUnit') }}</div>
          </div>
          
          <div class="result-card p-5 text-center animate-scale-up" style="animation-delay: 0.2s">
            <div class="text-sm text-gray-500 mb-1">{{ t('result.idealAge') }}</div>
            <div class="text-3xl md:text-4xl font-bold text-secondary animate-count-up">
              {{ displayIdealAge }}
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ t('result.yearsUnit') }}</div>
          </div>
          
          <div class="result-card p-5 text-center animate-scale-up" style="animation-delay: 0.3s">
            <div class="text-sm text-gray-500 mb-1">{{ t('result.potentialGain') }}</div>
            <div class="text-3xl md:text-4xl font-bold text-accent animate-count-up">
              +{{ displayPotential }}
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ t('result.yearsUnit') }}</div>
          </div>
        </div>

        <!-- 超越百分比 -->
        <div class="result-card p-5 text-center animate-scale-up" style="animation-delay: 0.15s">
          <p class="text-lg text-gray-700" v-html="comparisonText"></p>
        </div>

        <!-- 图表区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="result-card p-5 animate-scale-up" style="animation-delay: 0.25s">
            <h3 class="text-sm font-bold text-gray-700 mb-4 text-center">📊 {{ isZh ? '六维度分析' : 'Six-Dimension Analysis' }}</h3>
            <div style="height: 280px;">
              <RadarChart :config="radarConfig" />
            </div>
          </div>
          
          <div class="result-card p-5 animate-scale-up" style="animation-delay: 0.35s">
            <h3 class="text-sm font-bold text-gray-700 mb-4 text-center">📈 {{ isZh ? '各维度得分' : 'Dimension Scores' }}</h3>
            <div style="height: 280px;">
              <BarChart :config="barConfig" />
            </div>
          </div>
        </div>

        <!-- 风险与保护因素 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="riskFactors.length > 0" 
               class="result-card p-5 animate-scale-up" style="animation-delay: 0.4s">
            <h3 class="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
              ⚠️ {{ isZh ? '风险因素' : 'Risk Factors' }}
            </h3>
            <ul class="space-y-2">
              <li v-for="(risk, idx) in riskFactors" :key="'r'+idx"
                  class="flex items-center gap-2 text-sm text-gray-600">
                <span>{{ risk.icon || '⚠️' }}</span>
                <span>{{ getDisplayText(risk) }}</span>
              </li>
            </ul>
          </div>

          <div v-if="protectiveFactors.length > 0"
               class="result-card p-5 animate-scale-up" style="animation-delay: 0.45s">
            <h3 class="text-sm font-bold text-green-600 mb-3 flex items-center gap-2">
              🛡️ {{ isZh ? '保护因素' : 'Protective Factors' }}
            </h3>
            <ul class="space-y-2">
              <li v-for="(pf, idx) in protectiveFactors.slice(0, 6)" :key="'p'+idx"
                  class="flex items-center gap-2 text-sm text-gray-600">
                <span>{{ pf.icon || '✅' }}</span>
                <span>{{ getDisplayText(pf) }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-col items-center gap-3 pt-4 animate-fade-in">
          <!-- 第一行：查看详细建议（独占） -->
          <button @click="goToSuggestions" class="btn-primary w-full sm:w-auto px-8 py-4">
            {{ t('result.viewSuggestions') }}
          </button>
          <!-- 第二行：计算方式、分享、重新测试、返回主页 -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button @click="showCalcDetail = true" class="btn-secondary flex-1 sm:flex-initial px-6 py-3">
              {{ isZh ? '🧮 查看计算方式' : '🧮 Calculation Details' }}
            </button>
            <button @click="showShare = true" class="btn-secondary flex-1 sm:flex-initial px-6 py-3">
              {{ t('result.shareResult') }}
            </button>
            <button @click="retest" class="btn-secondary flex-1 sm:flex-initial px-6 py-3">
              {{ t('result.retest') }}
            </button>
            <button @click="goHome" class="btn-secondary flex-1 sm:flex-initial px-6 py-3">
              {{ isZh ? '🏠 返回主页' : '🏠 Home' }}
            </button>
          </div>
        </div>

        <!-- 底部提示 -->
        <p class="text-center text-xs text-gray-400 mt-4">
          * {{ t('share.disclaimer') }}
        </p>
      </div>

      <!-- 分享弹窗 -->
      <ShareModal
        :visible="showShare"
        :result-data="safeData"
        @close="showShare = false"
      />

      <!-- 计算方式详情弹窗 -->
      <CalculationDetail
        v-if="showCalcDetail"
        :result-data="safeData"
        :is-dev-mode="appStore.mode === 'developer'"
        @close="showCalcDetail = false"
      />

      <!-- 触发 Confetti -->
      <Confetti v-if="showConfetti" @complete="showConfetti = false" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app.js'
import { useResultStore } from '../stores/result.js'
import RadarChart from '../components/RadarChart.vue'
import BarChart from '../components/BarChart.vue'
import ShareModal from '../components/ShareModal.vue'
import Confetti from '../components/Confetti.vue'
import CalculationDetail from '../components/CalculationDetail.vue'
import { getRadarChartConfig, getBarChartConfig } from '../composables/useChart.js'

const router = useRouter()
const { locale, t } = useI18n()
const resultStore = useResultStore()
const appStore = useAppStore()
const triggerConfetti = inject('triggerConfetti')

const showShare = ref(false)
const showConfetti = ref(false)
const showCalcDetail = ref(false)
const debugInfo = ref('')

const isZh = computed(() => locale.value === 'zh-CN')

// ====== 数据读取（三重保障）======

// 从 Pinia 获取
const piniaResult = computed(() => resultStore.resultData)

// 从 localStorage 兜底获取
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('lifeIndicator_result')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.totalScore === 'number') {
        console.log('[Result] Loaded from localStorage')
        return parsed
      }
    }
  } catch (e) {
    console.warn('[Result] localStorage read failed:', e)
  }
  return null
}

// 实际可用的结果数据
const effectiveResultData = computed(() => {
  // 优先 Pinia
  const pinia = piniaResult.value
  if (pinia && typeof pinia.totalScore === 'number') return pinia
  
  // 其次 localStorage
  const local = loadFromLocalStorage()
  if (local) return local
  
  return null
})

// 是否有有效结果
const hasValidResult = computed(() => {
  const d = effectiveResultData.value
  return !!(d && typeof d.totalScore === 'number' && d.lifeType)
})

// 安全的数据对象（永远不会是 undefined）
const safeData = computed(() => effectiveResultData.value || {})

// 安全的 lifeType（永远不会是 undefined）
const safeLifeType = computed(() => safeData.value.lifeType || {})

// ====== 生命周期信息 ======

const lifeTypeName = computed(() => {
  const lt = safeLifeType.value
  if (!lt.name) return isZh.value ? '未知类型' : 'Unknown Type'
  return isZh.value ? (lt.name.zh || lt.name.en || '') : (lt.name.en || lt.name.zh || '')
})
const lifeTypeDesc = computed(() => {
  const lt = safeLifeType.value
  if (!lt.description) return ''
  return isZh.value ? (lt.description.zh || lt.description.en || '') : (lt.description.en || lt.description.zh || '')
})

// ====== 数字动画 ======
const displayScore = ref(0)
const displayCurrentAge = ref(0)
const displayIdealAge = ref(0)
const displayPotential = ref(0)

// ====== 图表配置 ======

const radarConfig = computed(() => {
  const dims = safeData.value.dimensionScores
  if (!dims) return {}
  return getRadarChartConfig(dims, locale.value)
})
const barConfig = computed(() => {
  const dims = safeData.value.dimensionScores
  if (!dims) return {}
  return getBarChartConfig(dims, locale.value)
})

// ====== 风险和保护因素（安全访问）=====

const riskFactors = computed(() => safeData.value.riskFactors || [])
const protectiveFactors = computed(() => safeData.value.protectiveFactors || [])

const comparisonText = computed(() => {
  const pct = safeData.value.percentileRank ?? 50
  // 直接拼接，避免 i18n {{}} 嵌套占位符解析报错
  if (isZh.value) return `已超越全国 ${pct}% 的人群`
  return `Better than ${pct}% of people nationwide`
})

// 安全显示文本（防止 undefined）
function getDisplayText(item) {
  if (!item) return ''
  if (isZh.value) return item.zh || item.en || String(item)
  return item.en || item.zh || String(item)
}

// ====== 方法 ======

function goToSuggestions() { router.push('/suggestions') }
function retest() { router.push('/') }
function goHome() { router.push('/') }

function recalculate() {
  resultStore.clearResult()
  try { localStorage.removeItem('lifeIndicator_result') } catch (_) {}
  router.push('/loading')
}

// 数字动画
function animateNumber(targetRef, targetValue, duration = 1500) {
  const start = targetRef.value
  const startTime = Date.now()
  
  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    targetRef.value = Math.round(start + (targetValue - start) * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  
  requestAnimationFrame(update)
}

onMounted(() => {
  const data = effectiveResultData.value
  
  if (!data) {
    debugInfo.value = `[Debug] pinia=${!!piniaResult.value}, localStorage=${!!loadFromLocalStorage()}`
    console.warn('[Result] No valid result data', { 
      pinia: !!piniaResult.value,
      localStorage: !!loadFromLocalStorage(),
      piniaKeys: piniaResult.value ? Object.keys(piniaResult.value).join(',') : 'none'
    })
    return
  }
  
  console.log('[Result] Data loaded OK:', {
    totalScore: data.totalScore,
    type: data.lifeType?.id,
    age: data.predictedAge,
    dims: Object.keys(data.dimensionScores || {}).join(',')
  })
  
  // 启动数字动画
  setTimeout(() => animateNumber(displayScore, data.totalScore, 1500), 300)
  setTimeout(() => animateNumber(displayCurrentAge, data.predictedAge || 75, 1200), 500)
  setTimeout(() => animateNumber(displayIdealAge, data.idealAge || 82, 1200), 650)
  setTimeout(() => animateNumber(displayPotential, data.potentialGain || 7, 1000), 800)
  
  // 庆祝特效
  setTimeout(() => {
    showConfetti.value = true
    if (triggerConfetti) triggerConfetti()
  }, 1000)
})
</script>
