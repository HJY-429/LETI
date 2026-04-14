<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="result-card p-8 md:p-10 text-center animate-fade-in">
        <!-- 动画图标 -->
        <div class="relative mb-8">
          <div class="text-6xl animate-bounce-gentle">⏳</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- 标题 -->
        <h1 class="text-xl font-bold text-gray-800 mb-3">
          {{ t('loading.title') }}
        </h1>
        
        <p class="text-gray-500 mb-6">{{ t('loading.subtitle') }}</p>

        <!-- 步骤列表 -->
        <div class="space-y-3 text-left mb-6">
          <div 
            v-for="(step, index) in stepsList" 
            :key="'step-' + index"
            class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
            :class="getStepClass(index)"
          >
            <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="getIconClass(index)">
              <span v-if="index < currentStep">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </span>
            
            <span class="text-sm flex-1" :class="getLabelClass(index)">
              {{ step.text }}
            </span>
            
            <!-- 错误提示 -->
            <span v-if="step.error" class="text-xs text-red-500 ml-2">⚠ {{ step.errorShort }}</span>
            
            <!-- 进度条 -->
            <div v-if="index === currentStep && currentStep < 4" class="ml-auto w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all duration-100"
                   :style="{ width: progressPercent + '%' }"></div>
            </div>
            
            <!-- 完成标记 -->
            <span v-if="index < currentStep && !stepsList[index].error" class="text-green-500 ml-1">✅</span>
          </div>
        </div>

        <!-- 总进度 -->
        <div class="text-3xl font-bold text-primary mb-1">{{ totalProgress }}%</div>
        <p class="text-xs text-gray-400">{{ statusMsg }}</p>

        <!-- 调试面板（开发者模式始终显示，用户模式仅出错时显示） -->
        <template v-if="isDevMode || hasError">
          <div class="mt-4 rounded-lg text-left border"
               :class="hasError ? 'bg-red-950 border-red-800 max-h-80' : 'bg-gray-900 border-gray-700 max-h-60'"
               style="overflow-y: auto;">
            <!-- 面板标题 -->
            <div class="sticky top-0 px-3 py-1.5 text-xs font-bold flex items-center gap-2 z-10"
                 :class="hasError ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-400'">
              <span>🔍 Debug Console</span>
              <span class="ml-auto opacity-60">{{ debugLogs.length }} logs</span>
              <span v-if="hasError" class="animate-pulse text-red-400">● ERROR</span>
            </div>
            <div class="px-3 pb-3 space-y-0.5">
              <div v-for="(log, idx) in debugLogs" :key="idx" 
                   class="font-mono leading-relaxed py-0.5"
                   :class="log.type === 'error' ? 'text-red-400 font-medium bg-red-900/30 -mx-3 px-3 rounded' : log.type === 'warn' ? 'text-yellow-400' : 'text-emerald-400'">
                {{ log.msg }}
              </div>
            </div>
          </div>
        </template>

        <!-- 开发者模式：手动跳转按钮（始终可用） -->
        <!-- 用户模式 + 出错时：显示继续按钮（无 30s 限制，由开发者控制） -->
        <button v-if="(isDevMode && currentStep >= 3) || (hasError)"
                @click="forceNavigate"
                class="mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all"
                :class="hasError
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg active:scale-[0.98]'
                  : 'bg-primary text-white hover:shadow-lg active:scale-[0.98]'">
          {{ isDevMode
             ? (isZh ? '✅ 跳转到结果页 →' : '✅ Go to Result →')
             : (isZh ? '⚠️ 检测到错误，点击查看结果 →' : '⚠️ Error detected, click to view result →')
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz.js'
import { useResultStore } from '../stores/result.js'
import { useAppStore } from '../stores/app.js'

const router = useRouter()
const { locale, t } = useI18n()
const quizStore = useQuizStore()
const resultStore = useResultStore()
const appStore = useAppStore()

const isZh = computed(() => locale.value === 'zh-CN')
const isDevMode = computed(() => appStore.mode === 'developer')

// ====== 状态 ======
const currentStep = ref(0)
const progressPercent = ref(0)
const statusMsg = ref(isZh.value ? '正在初始化...' : 'Initializing...')
const debugLogs = ref([])  // 页面内调试日志
const hasError = ref(false)       // 是否有错误（用于控制面板样式和跳转行为）
const autoJumpCancelled = ref(false)  // 是否取消了自动跳转
let autoJumpTimer = null  // 自动跳转定时器引用

// 调试日志函数：同时输出到 console 和页面
function debugLog(msg, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  const entry = `[${timestamp}] ${msg}`
  debugLogs.value.push({ msg: entry, type })
  // 错误时标记状态
  if (type === 'error') hasError.value = true
  // 同时保留 console 输出（浏览器 F12 可见）
  if (type === 'error') console.error(entry)
  else if (type === 'warn') console.warn(entry)
  else console.log(entry)
}

// 强制跳转到结果页（用户手动触发或自动定时器触发）
async function forceNavigate() {
  autoJumpCancelled.value = true
  if (autoJumpTimer) { clearTimeout(autoJumpTimer); autoJumpTimer = null }
  statusMsg.value = isZh.value ? '正在跳转...' : 'Navigating...'
  try {
    await nextTick()
    router.replace('/result')
  } catch (_) {
    window.location.href = '/result'
  }
}

// 步骤状态列表（无重复键）
const stepsList = ref([
  { id: 0, text: '', status: 'pending', error: null, errorShort: '' },
  { id: 1, text: '', status: 'pending', error: null, errorShort: '' },
  { id: 2, text: '', status: 'pending', error: null, errorShort: '' },
  { id: 3, text: '', status: 'pending', error: null, errorShort: '' }
])

// 初始化步骤文本
function initStepsText() {
  const s = [
    t('loading.steps.s1'),
    t('loading.steps.s2'),
    t('loading.steps.s3'),
    t('loading.steps.s4')
  ]
  stepsList.value = s.map((text, i) => ({
    id: i,
    text,
    status: i === 0 ? 'active' : 'pending',
    error: null,
    errorShort: ''
  }))
}

// 计算总进度（0-100）
const totalProgress = computed(() => {
  return Math.min(100, Math.round(currentStep.value * 25 + progressPercent.value * 0.25))
})

// 样式计算
function getStepClass(idx) {
  const s = stepsList.value[idx]
  if (!s) return ''
  if (s.error) return 'bg-red-50 ring-1 ring-red-200'
  if (idx === currentStep.value) return 'bg-primary/5 ring-2 ring-primary/30'
  if (idx < currentStep.value) return 'bg-green-50'
  return 'opacity-40'
}

function getIconClass(idx) {
  const s = stepsList.value[idx]
  if (!s) return 'bg-gray-200 text-gray-400'
  if (s.error) return 'bg-red-100 text-red-600'
  if (idx < currentStep.value) return 'bg-primary text-white'
  if (idx === currentStep.value) return 'bg-primary/20 text-primary'
  return 'bg-gray-200 text-gray-400'
}

function getLabelClass(idx) {
  const s = stepsList.value[idx]
  if (s?.error) return 'text-red-600 font-medium'
  if (idx <= currentStep.value) return 'text-gray-700 font-medium'
  return 'text-gray-400'
}

// ====== 工具函数 ======
function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function runStepAnim(stepIdx, msg) {
  currentStep.value = stepIdx
  progressPercent.value = 0
  statusMsg.value = msg || ''
  
  // 更新步骤状态
  if (stepsList.value[stepIdx]) {
    stepsList.value[stepIdx].status = 'active'
    stepsList.value[stepIdx].error = null
    stepsList.value[stepIdx].errorShort = ''
  }
  
  for (let p = 0; p <= 100; p += 10) {
    progressPercent.value = p
    await delay(50)
  }
}

function markStepError(stepIdx, err) {
  const errMsg = String(err?.message || err || 'unknown')
  if (stepsList.value[stepIdx]) {
    stepsList.value[stepIdx].status = 'error'
    stepsList.value[stepIdx].error = errMsg
    stepsList.value[stepIdx].errorShort = errMsg.length > 30 ? errMsg.slice(0, 28) + '..' : errMsg
  }
  console.error(`[Loading] Step ${stepIdx} failed:`, err)
}

function markStepDone(stepIdx) {
  if (stepsList.value[stepIdx]) {
    stepsList.value[stepIdx].status = 'done'
  }
}

// ====== 跳转 ======
async function goToResult(reason) {
  console.log(`[Loading] Navigating to /result (${reason})`)
  try {
    await nextTick()
    router.replace('/result')
  } catch (e) {
    console.warn('[Loading] router.replace failed:', e)
    window.location.href = '/result'
  }
}

// ====== 核心：onMounted 执行全部计算 ======
onMounted(async () => {
  debugLog('🚀 Loading.vue onMounted START')
  
  try {
    initStepsText()
    debugLog('✅ Step text initialized OK')
  } catch (initErr) {
    debugLog('❌ initStepsText error: ' + initErr.message, 'error')
  }
  
  // 安全获取答案（带默认值兜底）
  const answers = Object(quizStore.answers || {})
  const followupAnswers = Object(quizStore.followupAnswers || {})
  
  debugLog(`📊 Answers count: ${Object.keys(answers).length}, keys: [${Object.keys(answers).join(', ')}]`)
  debugLog(`📊 Followups count: ${Object.keys(followupAnswers).length}, keys: [${Object.keys(followupAnswers).join(', ')}]`)

  let finalResult = null
  
  // ========== Step 1: 收集数据 ==========
  await runStepAnim(0, isZh.value ? '收集答题数据...' : 'Collecting responses...')
  markStepDone(0)
  debugLog('✅ Step 1 (collect data) done')

  // ========== Step 2 & 3: 计算（核心）==========
  try {
    await runStepAnim(1, isZh.value ? '分析并计算得分...' : 'Analyzing & scoring...')
    
    // 动态导入评分模块
    debugLog('⏳ Step2: About to import useScoring.js...')
    let scoringModule
    try {
      scoringModule = await import('../composables/useScoring.js')
      debugLog('✅ useScoring.js imported. Exports: [' + Object.keys(scoringModule).join(', ') + ']')
    } catch (importErr) {
      debugLog('❌ FAILED to import useScoring.js: ' + importErr.message, 'error')
      throw importErr
    }
    
    // 构建上下文——安全获取每个值
    const context = {
      age: parseInt(answers['B01']) || 25,
      gender: answers['B02'] || 'prefer_not_say',
      height: parseFloat(answers['B03']) || 170,
      weight: parseFloat(answers['B04']) || 65
    }
    
    debugLog('📋 Context built: ' + JSON.stringify(context))
    
    // 计算维度得分
    debugLog('⏳ Calling calculateAllDimensionScores...')
    let dimensionScores
    try {
      dimensionScores = scoringModule.calculateAllDimensionScores(
        answers, followupAnswers, context
      )
      debugLog('✅ dimensionScores = ' + JSON.stringify(dimensionScores))
    } catch (scoreErr) {
      debugLog('❌ calculateAllDimensionScores FAILED: ' + scoreErr.message, 'error')
      throw scoreErr
    }

    debugLog('⏳ Calling calculateTotalScore...')
    let totalScore
    try {
      totalScore = scoringModule.calculateTotalScore(dimensionScores)
      debugLog('✅ totalScore = ' + totalScore)
    } catch (totalErr) {
      debugLog('❌ calculateTotalScore FAILED: ' + totalErr.message, 'error')
      throw totalErr
    }
    
    markStepDone(1)
    debugLog('✅ Step 2 done')

    // ========== Step 3: 寿命预测 ==========
    await runStepAnim(2, isZh.value ? '预测预期寿命...' : 'Predicting lifespan...')
    
    debugLog('⏳ Step3: About to import useLifeCalc.js...')
    let lifeModule
    try {
      lifeModule = await import('../composables/useLifeCalc.js')
      debugLog('✅ useLifeCalc.js imported. Exports: [' + Object.keys(lifeModule).join(', ') + ']')
    } catch (lifeImportErr) {
      debugLog('❌ FAILED to import useLifeCalc.js: ' + lifeImportErr.message, 'error')
      throw lifeImportErr
    }
    
    debugLog('⏳ Calling calculateLifeExpectancy...')
    try {
      finalResult = lifeModule.calculateLifeExpectancy(answers, followupAnswers)
      debugLog('calculateLifeExpectancy returned: ' + (finalResult ? ('type=' + finalResult.lifeType?.id + ', age=' + finalResult.predictedAge) : 'NULL!'), finalResult ? 'info' : 'error')
    } catch (calcLifeErr) {
      debugLog('❌ calculateLifeExpectancy FAILED: ' + calcLifeErr.message, 'error')
      throw calcLifeErr
    }
    
    // ★ 验证结果完整性（关键！）
    if (!finalResult) {
      throw new Error('calculateLifeExpectancy returned null/undefined')
    }
    if (typeof finalResult.totalScore !== 'number') {
      debugLog('⚠️ totalScore not number, fixing...', 'warn')
      finalResult.totalScore = totalScore
    }
    if (!finalResult.lifeType) {
      debugLog('❌ result missing lifeType!', 'error')
      throw new Error('result missing lifeType object')
    }
    if (!finalResult.dimensionScores) {
      finalResult.dimensionScores = dimensionScores
    }
    if (typeof finalResult.predictedAge !== 'number') {
      finalResult.predictedAge = 75
    }
    if (typeof finalResult.idealAge !== 'number') {
      finalResult.idealAge = 82
    }
    
    debugLog('✅ Result validated: type=' + finalResult.lifeType?.id + ', age=' + finalResult.predictedAge)
    markStepDone(2)
    debugLog('✅ Step 3 done')

  } catch (calcErr) {
    debugLog('💥 Calculation FAILED: ' + calcErr.message, 'error')
    debugLog('Stack: ' + (calcErr.stack || 'no stack'), 'error')
    markStepError(2, calcErr)
    markStepError(1, calcErr)
    
    // ★ 兜底结果——确保 Result 页有东西显示
    finalResult = buildFallbackResult()
    debugLog('🔄 Using fallback result', 'warn')
  }

  // ========== Step 4: 存储结果 ==========
  try {
    await runStepAnim(3, isZh.value ? '保存结果...' : 'Saving results...')
    
    // 双重存储：Pinia + localStorage
    resultStore.setResult(finalResult)
    debugLog('✅ Pinia store set, resultData exists: ' + !!resultStore.resultData)
    
    try {
      localStorage.setItem('lifeIndicator_result', JSON.stringify(finalResult))
      debugLog('✅ localStorage saved')
    } catch (lsErr) {
      debugLog('⚠️ localStorage save failed: ' + lsErr.message, 'warn')
    }

    // 尝试 IndexedDB 历史记录（非关键）
    try {
      if (typeof resultStore.saveToHistory === 'function') {
        await resultStore.saveToHistory(finalResult)
        debugLog('✅ History saved')
      }
    } catch (historyErr) {
      debugLog('⚠️ History non-critical error: ' + historyErr.message, 'warn')
    }
    
    markStepDone(3)
    statusMsg.value = isZh.value ? '即将跳转...' : 'Redirecting...'
    debugLog('✅ Step 4 done')
    
  } catch (storeErr) {
    debugLog('❌ Step 4 storage error: ' + storeErr.message, 'error')
    markStepError(3, storeErr)
    try { resultStore.setResult(finalResult) } catch (_) {}
    try { localStorage.setItem('lifeIndicator_result', JSON.stringify(finalResult)) } catch (_) {}
  }

  // ========== 最终：跳转逻辑 ==========
  
  if (hasError.value) {
    // ★ 有错误 → 暂停！让用户看调试面板，点击按钮才跳转
    debugLog('🛑 PAUSED — error detected, waiting for user to review logs', 'warn')
    statusMsg.value = isZh.value ? '⚠️ 计算出错，请查看下方调试信息' : '⚠️ Calculation error, check debug info below'
    
    // 用户模式下 30 秒后自动兜底跳转（开发者模式不自动跳，手动点击）
    if (!isDevMode.value) {
      autoJumpTimer = setTimeout(() => {
        debugLog('⏱ Auto-jump after 30s timeout (error mode)', 'warn')
        forceNavigate()
      }, 30000)
    } else {
      debugLog('👨‍💻 Developer mode: no auto-jump, waiting for manual action', 'info')
    }
  } else {
    // ★ 无错误 → 正常快速跳转
    debugLog('✅ All steps passed, navigating to /result ...')
    try {
      await nextTick()
      await delay(300)
      router.replace('/result')
    } catch (navErr) {
      debugLog('⚠ router.replace error: ' + navErr.message, 'warn')
      window.location.href = '/result'
    }
  }
})

// 构造兜底最小可用结果
function buildFallbackResult() {
  return {
    totalScore: 50,
    dimensionScores: { sleep: 50, diet: 50, exercise: 50, mental: 50, body: 50, lifestyle: 50 },
    lifeType: {
      id: 'C',
      level: 'C',
      name: { zh: '平衡稳定型', en: 'Balanced Stable' },
      emoji: '⚖️',
      color: '#FF9800',
      bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      description: { 
        zh: '测试已完成。部分数据使用了默认值以生成结果。建议重新测试获取更准确的分析。',
        en: 'Test complete. Some default values were used. Retest for more accurate results.'
      },
      characteristics: {
        zh: ['测试完成', '建议重新测试'], en: ['Test done', 'Retest recommended']
      },
      avgLifeExpectancy: { male: 76, female: 81 },
      scoreRange: [60, 69],
      borderColor: '#FF9800'
    },
    predictedAge: 75,
    idealAge: 82,
    potentialGain: 7,
    bmi: 22.5,
    riskFactors: [],
    protectiveFactors: [],
    percentileRank: 50,
    breakdown: {}
  }
}
</script>
