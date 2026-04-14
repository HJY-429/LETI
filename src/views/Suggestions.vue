<template>
  <div class="min-h-screen py-6 px-4 pb-12">
    <div class="w-full max-w-2xl mx-auto space-y-5">
      <!-- 标题 -->
      <div class="text-center py-2 animate-fade-in">
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-1">{{ t('suggestions.title') }}</h1>
        <p class="text-sm text-gray-500">{{ t('suggestions.subtitle') }}</p>
      </div>

      <!-- 各维度建议卡片 -->
      <template v-for="(section, dimKey) in suggestionSections" :key="dimKey">
        <transition name="fade" appear>
          <div 
            class="result-card overflow-hidden animate-scale-up"
            :style="{ animationDelay: `${Object.keys(suggestionSections).indexOf(dimKey) * 0.1}s` }"
          >
            <!-- 维度标题 -->
            <div class="px-6 pt-5 pb-3" :style="getDimensionHeaderStyle(dimKey)">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
                  {{ section.title }}
                </h3>
                <span class="text-sm font-medium px-3 py-1 rounded-full"
                      :class="getScoreBadgeClass(dimScores[dimKey])">
                  {{ dimScores[dimKey] }} 分
                </span>
              </div>
              
              <!-- 维度进度条 -->
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :style="{ width: dimScores[dimKey] + '%', backgroundColor: getScoreColor(dimScores[dimKey]) }"></div>
              </div>
            </div>

            <!-- 建议列表 -->
            <div class="px-6 pb-5 space-y-3 mt-2">
              <div
                v-for="(item, idx) in getSuggestionsForDimension(dimKey)"
                :key="idx"
                class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors group"
              >
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                  {{ idx + 1 }}
                </span>
                
                <div class="flex-1">
                  <p class="text-sm text-gray-700 leading-relaxed">{{ item.text }}</p>
                  
                  <div class="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-full">
                    <span class="text-xs">✅</span>
                    <span class="text-xs font-medium text-green-700">{{ t('suggestions.expectedBenefit', { years: item.benefit }) }}</span>
                  </div>
                </div>
              </div>

              <!-- 综合收益 -->
              <div class="mt-4 p-3 rounded-xl border border-green-200 bg-green-50/50 text-center">
                <span class="text-sm font-medium text-green-800">
                  {{ getSectionExpectedBenefit(dimKey) }}
                </span>
              </div>
            </div>
          </div>
        </transition>
      </template>

      <!-- 综合改善计划 -->
      <div class="result-card overflow-hidden animate-scale-up" style="animation-delay: 0.6s">
        <div class="bg-gradient-to-r from-primary to-secondary px-6 py-5 text-white text-center">
          <h3 class="font-bold text-lg mb-2">{{ t('suggestions.comprehensivePlan') }}</h3>
          
          <div class="my-4">
            <div class="text-4xl md:text-5xl font-bold">
              {{ resultData?.idealAge || '--' }}
              <span class="text-lg opacity-80 ml-1">{{ t('result.yearsUnit') }}</span>
            </div>
            <p class="text-sm opacity-90 mt-1" v-html="ifAllExecutedText"></p>
          </div>

          <div class="inline-flex items-baseline gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
            <span class="text-3xl font-bold">+{{ resultData?.potentialGain || 0 }}</span>
            <span class="text-sm">{{ t('suggestions.extension', { years: resultData?.potentialGain || 0 }) }}</span>
          </div>
        </div>

        <div class="px-6 py-5 text-center">
          <p class="text-base font-medium text-gray-700 mb-4">{{ t('suggestions.startToday') }}</p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button @click="retest" class="btn-primary">
              {{ t('suggestions.retest') }}
            </button>
            <button @click="goBackToResult" class="btn-secondary">
              {{ t('suggestions.backToResult') }}
            </button>
            <button @click="showShare = true" class="btn-secondary">
              {{ t('result.shareResult') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 免责声明 -->
      <p class="text-center text-xs text-gray-400 pb-4">
        * {{ t('share.disclaimer') }}
      </p>
    </div>

    <!-- 分享弹窗 -->
    <ShareModal
      :visible="showShare"
      :result-data="resultData"
      @close="showShare = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useResultStore } from '../stores/result.js'
import ShareModal from '../components/ShareModal.vue'

const router = useRouter()
const { locale, t, tm } = useI18n()
const resultStore = useResultStore()
const showShare = ref(false)

const isZh = computed(() => locale.value === 'zh-CN')
const resultData = computed(() => resultStore.resultData)
const dimScores = computed(() => resultData.value?.dimensionScores || {})

// 建议章节配置
const suggestionSections = computed(() => ({
  sleep: {
    title: t('suggestions.sections.sleep.title'),
    icon: '🛌',
    color: '#5C6BC0',
    gradient: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)'
  },
  diet: {
    title: t('suggestions.sections.diet.title'),
    icon: '🥗',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)'
  },
  exercise: {
    title: t('suggestions.sections.exercise.title'),
    icon: '🏃',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)'
  },
  mental: {
    title: t('suggestions.sections.mental.title'),
    icon: '🧠',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)'
  },
  lifestyle: {
    title: t('suggestions.sections.lifestyle.title'),
    icon: '🏡',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)'
  }
}))

// 根据维度得分获取对应的建议列表
function getSuggestionsForDimension(dimKey) {
  const score = dimScores.value[dimKey] || 50
  // 用 tm() 获取原始消息对象（数组），避免 t() 对数组的 fallback 查找问题
  const section = tm(`suggestions.sections.${dimKey}.items`)
  
  if (!Array.isArray(section)) return []
  
  // 过滤适用的建议（基于条件）
  let suggestions = []
  
  // 构建上下文用于条件判断
  const context = {
    score,
    answers: {},
    highStress: dimScores.value.mental < 45,
    smoking: false,
    heavyDrinking: false,
    alwaysSkipBreakfast: false,
    poorEnvironment: false,
    noAnnualCheckup: false,
    isolated: false,
    limitedSocial: false
  }
  
  // 从答案中获取生活方式相关数据
  const allAnswers = resultData.value?.answers || {}
  
  // L01 吸烟
  if (['occasional', 'regular_few', 'regular_many'].includes(allAnswers.L01)) {
    context.smoking = true
  }
  // L02 饮酒
  if (allAnswers.L02 === 'frequent_heavy') {
    context.heavyDrinking = true
  }
  // L03 空气质量
  if (['poor'].includes(allAnswers.L03)) {
    context.poorEnvironment = true
  }
  // L05 体检
  if (['occasional', 'never'].includes(allAnswers.L05)) {
    context.noAnnualCheckup = true
  }
  // L07 社交连接（新增）
  if (allAnswers.L07 === 'isolated') {
    context.isolated = true
  } else if (allAnswers.L07 === 'limited') {
    context.limitedSocial = true
  }
  // F01 早餐
  if (['occasional', 'rarely'].includes(allAnswers.F01)) {
    context.alwaysSkipBreakfast = true
  }
  
  for (const item of section) {
    // 简化版：根据分数范围返回建议
    if (score >= 60 && item.condition?.includes('< 60')) continue
    
    // 特殊条件判断
    if (item.condition === 'smoking' && !context.smoking) continue
    if (item.condition === 'heavyDrinking' && !context.heavyDrinking) continue
    if (item.condition === '!annualCheckup' && !context.noAnnualCheckup) continue
    if (item.condition === 'poorEnvironment' && !context.poorEnvironment) continue
    if (item.condition === 'alwaysSkipBreakfast' && !context.alwaysSkipBreakfast) continue
    if (item.condition === 'highStress' && !context.highStress) continue
    if (item.condition === 'isolated' && !context.isolated) continue
    if (item.condition === 'limitedSocial' && !context.limitedSocial) continue
    
    suggestions.push({
      text: typeof item.text === 'string' ? item.text : (isZh.value ? item.text.zh : item.text.en),
      benefit: item.benefit || '+?'
    })
  }
  
  // 如果没有匹配的建议，提供默认建议
  if (suggestions.length === 0) {
    suggestions.push({
      text: getDefaultSuggestion(dimKey, score),
      benefit: getDefaultBenefit(dimKey, score)
    })
  }
  
  return suggestions.slice(0, 4) // 最多显示4条
}

function getDefaultSuggestion(dimKey, score) {
  const defaults = {
    sleep: score < 60 
      ? (isZh.value ? '尝试每晚提前30分钟入睡，保持规律作息' : 'Try going to bed 30 min earlier, maintain a regular schedule')
      : (isZh.value ? '你的睡眠习惯不错，继续保持！' : 'Your sleep habits are good, keep it up!'),
    diet: score < 60
      ? (isZh.value ? '增加蔬菜水果摄入，减少加工食品' : 'Increase fruits & veggies, reduce processed food')
      : (isZh.value ? '饮食习惯良好，注意营养均衡即可' : 'Good eating habits, just ensure balanced nutrition'),
    exercise: score < 55
      ? (isZh.value ? '每周至少进行150分钟中等强度运动' : 'Aim for at least 150 min moderate exercise per week')
      : (isZh.value ? '运动量不错，可以增加力量训练' : 'Good activity level, consider adding strength training'),
    mental: score < 60
      ? (isZh.value ? '学习冥想或深呼吸，与朋友多交流' : 'Practice meditation or deep breathing, stay social')
      : (isZh.value ? '心态很好！继续保持积极乐观' : 'Great mindset! Stay positive and optimistic'),
    lifestyle: score < 60
      ? (isZh.value ? '戒烟限酒，每年做一次全面体检' : 'Quit smoking, limit alcohol, annual checkup')
      : (isZh.value ? '生活方式健康，继续保持好习惯' : 'Healthy lifestyle, keep your good habits')
  }
  return defaults[dimKey] || ''
}

function getDefaultBenefit(dimKey, score) {
  if (score >= 75) return '+0.5 岁'
  if (score >= 55) return '+1.0 岁'
  const benefits = { sleep: '+1.6 岁', diet: '+2.0 岁', exercise: '+2.5 岁', mental: '+1.8 岁', lifestyle: '+3~7 岁' }
  return benefits[dimKey] || '+1.0 岁'
}

function getSectionExpectedBenefit(dimKey) {
  const key = `suggestions.sections.${dimKey}.expectedBenefit`
  try {
    // 用 tm() 直接获取原始值，避免 t() 的 fallback 查找
    const msg = tm(key)
    return typeof msg === 'string' ? msg : (isZh.value ? '持续优化可延长寿命' : 'Continuous optimization extends lifespan')
  } catch {
    return isZh.value ? '持续优化可延长寿命' : 'Continuous optimization extends lifespan'
  }
}

function getDimensionHeaderStyle(dimKey) {
  const section = suggestionSections.value[dimKey]
  if (!section) return {}
  return {}
}

function getScoreBadgeClass(score) {
  if (score >= 80) return 'bg-green-100 text-green-700'
  if (score >= 65) return 'bg-blue-100 text-blue-700'
  if (score >= 50) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

function getScoreColor(score) {
  if (score >= 80) return '#4CAF50'
  if (score >= 65) return '#2196F3'
  if (score >= 50) return '#FF9800'
  return '#F44336'
}

// 综合计划文本
const ifAllExecutedText = computed(() => {
  const age = resultData.value?.idealAge || '--'
  return t('suggestions.ifAllExecuted', { age })
})

function retest() {
  router.push('/')
}

function goBackToResult() {
  router.push('/result')
}
</script>
