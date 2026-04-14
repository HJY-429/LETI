<template>
  <div class="min-h-screen py-6 px-4">
    <div class="w-full max-w-2xl mx-auto">
      <!-- 恢复进度提示 -->
      <div 
        v-if="showRestoreHint && !hasRestored" 
        class="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between animate-fade-in"
      >
        <span class="text-sm text-blue-700 flex items-center gap-2">
          💾 {{ t('quiz.tips.encouragement') }}
          <button @click="restoreProgress" class="text-primary font-medium hover:underline">
            {{ isZh ? '恢复答题' : 'Resume' }}
          </button>
        </span>
        <button @click="showRestoreHint = false" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <!-- 进度条区域 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 shadow-md">
        <ProgressBar
          :current="currentQuestionIndex"
          :total="totalQuestionsCount"
          :progress="currentProgress"
          :show-dimension="true"
        />
        
        <!-- 鼓励语 -->
        <div v-if="encouragementText" class="mt-3 text-center text-sm text-primary font-medium animate-fade-in">
          {{ encouragementText }}
        </div>
      </div>

      <!-- 返回主页按钮（右上角浮动） -->
      <button
        @click="goHome"
        class="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center gap-1 px-3 py-1.5 
               rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-xs text-gray-500
               hover:text-gray-700 hover:bg-white hover:shadow transition-all duration-200"
        :title="isZh ? '返回主页' : 'Back to Home'"
      >
        🏠 {{ isZh ? '主页' : 'Home' }}
      </button>

      <!-- 题目卡片 -->
      <transition :name="slideDirection" mode="out-in">
        <!-- 维度过渡提示 -->
        <div 
          v-if="showDimensionTransition" 
          key="transition"
          class="question-card py-12 text-center"
        >
          <div class="text-4xl mb-4">{{ nextDimensionEmoji }}</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ nextDimensionName }}</h3>
          <p class="text-gray-500 text-sm">{{ isZh ? '接下来进入这个维度' : "Let's move to this dimension" }}</p>
        </div>

        <!-- 追问题卡片（优先显示） -->
        <QuestionCard
          v-else-if="currentFollowup"
          :key="'f-' + currentFollowup.id"
          :question="currentFollowup"
          v-model="currentFollowupAnswer"
          :current-index="currentFollowupIndex + 1"
          :total-questions="currentQFollowups.length"
          :is-followup="true"
          class="ring-2 ring-orange-200 bg-orange-50/30"
        />
        
        <!-- 主题目卡片 -->
        <QuestionCard
          v-else-if="currentQ"
          :key="'q-' + currentQuestionIndex"
          :question="currentQ"
          v-model="currentAnswer"
          :current-index="currentQuestionIndex + 1"
          :total-questions="totalQuestionsCount"
        />
      </transition>

      <!-- 导航按钮 -->
      <div class="flex justify-between items-center mt-4 gap-4">
        <button
          @click="goPrev"
          :disabled="currentQuestionIndex <= 0 && !showingFollowup"
          class="btn-secondary flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← {{ t('quiz.prevButton') }}
        </button>
        
        <!-- 追问题导航（仅当当前题有未回答的追问题时显示） -->
        <template v-if="shouldShowFollowupNav">
          <!-- 不在追问题模式：显示"回答追问题"按钮 -->
          <button
            v-if="!showingFollowup"
            @click="startFollowup"
            class="btn-primary text-sm px-4 py-2"
          >
            {{ isZh ? '📝 回答追问题' : '📝 Follow-up' }} ({{ currentQActiveFollowups.length }})
          </button>
          <!-- 在追问题模式：显示进度和下一步/完成按钮 -->
          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-orange-500 font-medium">
              {{ isZh ? '追问' : 'F' }} {{ currentFollowupIndex + 1 }}/{{ currentQFollowups.length }}
            </span>
            <button
              v-if="currentFollowupIndex < currentQFollowups.length - 1"
              @click="nextFollowup"
              class="btn-primary text-sm px-4 py-2"
            >
              →
            </button>
            <button
              v-else
              @click="handleFinishFollowup"
              class="btn-primary text-sm px-4 py-2"
            >
              ✓ {{ isZh ? '完成' : 'Done' }}
            </button>
          </div>
        </template>
        
        <!-- 正常的下一步/提交按钮（无追问题 或 所有追问已答） -->
        <button
          v-else
          @click="goNext"
          :disabled="!canProceed || showingFollowup"
          class="btn-primary flex-shrink-0 disabled:opacity-50"
        >
          {{ isLastQuestion ? t('quiz.submitButton') : t('quiz.nextButton') }}
        </button>
      </div>

      <!-- 题目导航点 -->
      <div class="mt-6 flex justify-center">
        <div class="flex gap-1.5 flex-wrap max-w-lg justify-center">
          <button
            v-for="(dim, idx) in dimensionDots"
            :key="dim.key"
            @click="goToDimensionStart(idx)"
            class="w-8 h-2 rounded-full transition-all duration-300"
            :class="[
              dim.isCurrent ? 'scale-x-125' : '',
              dim.isCompleted ? 'bg-primary' : dim.isCurrent ? 'bg-primary/50' : 'bg-gray-200'
            ]"
            :title="dim.name"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz.js'
import ProgressBar from '../components/ProgressBar.vue'
import QuestionCard from '../components/QuestionCard.vue'
import { questions, DIMENSION_INFO, getOrderedDimensions } from '../data/questions.js'
import { checkBranching } from '../data/branchingLogic.js'

const router = useRouter()
const { locale, t } = useI18n()
const quizStore = useQuizStore()

const isZh = computed(() => locale.value === 'zh-CN')

// 状态
const slideDirection = ref('slide-right')
const showDimensionTransition = ref(false)
const showRestoreHint = ref(false)
const hasRestored = ref(false)
const showingFollowup = ref(false)
const currentFollowupIndex = ref(0)

// 当前题目索引
const currentQuestionIndex = computed({
  get: () => quizStore.currentQuestionIndex,
  set: (val) => quizStore.goToQuestion(val)
})

// 总基础题数
const totalQuestionsCount = computed(() => questions.length)

// 当前进度
const currentProgress = computed(() => {
  const answered = Object.keys(quizStore.answers).length
  const followupAnswered = Object.keys(quizStore.followupAnswers).length
  // 计算总追问题数（所有分组中实际存在的追问题）
  let totalFollowups = 0
  for (const list of Object.values(quizStore.groupedFollowups)) {
    totalFollowups += list.length
  }
  const total = totalQuestionsCount.value + totalFollowups
  return Math.round(((answered + followupAnswered) / Math.max(1, total)) * 100)
})

// 当前主题目（始终返回当前索引的题目，不要因追问题模式而置空）
const currentQ = computed(() => {
  return questions[currentQuestionIndex.value] || null
})

// 当前题目的答案
const currentAnswer = computed({
  get: () => quizStore.answers[currentQ.value?.id],
  set: (val) => {
    if (!currentQ.value) return
    // 设置答案并检查分支逻辑
    quizStore.setAnswer(currentQ.value.id, val)
    
    // 检查是否需要添加追问题
    if (currentQ.value.branchTrigger && val) {
      const followups = checkBranching(currentQ.value.id, val)
      if (followups.length > 0) {
        quizStore.addFollowups(currentQ.value.id, followups)
      }
    }
  }
})

// 是否最后一道主题目
const isLastQuestion = computed(() => currentQuestionIndex.value >= questions.length - 1)

// 能否继续（主题目是否已作答）
const canProceed = computed(() => {
  const val = currentAnswer.value
  // 多选题允许空数组（用户取消全选），但需要至少选中一个
  if (currentQ.value?.type === 'multiple') {
    return Array.isArray(val) ? val.length > 0 : (val !== undefined && val !== null && val !== '')
  }
  return val !== undefined && val !== null && val !== ''
})

// 鼓励文本
const encouragementText = computed(() => {
  const progress = currentProgress.value
  if (progress >= 90) return t('quiz.tips.almost')
  if (progress >= 50) return t('quiz.tips.halfway')
  if (progress > 10) return t('quiz.tips.encouragement')
  return ''
})

// ========== 追问题系统（按题目分组）==========

// 当前题目的所有追问题列表（含已答）
const currentQFollowups = computed(() => {
  if (!currentQ.value) return []
  return quizStore.getAllFollowupsForQuestion(currentQ.value.id)
})

// 当前题目的未回答追问题列表
const currentQActiveFollowups = computed(() => {
  if (!currentQ.value) return []
  return quizStore.getActiveFollowupsForQuestion(currentQ.value.id)
})

// 是否有未回答的追问题
const hasUnansweredFollowups = computed(() => currentQActiveFollowups.value.length > 0)

// 是否显示追问题导航区（仅在非最后一题时显示）
const shouldShowFollowupNav = computed(() => {
  // ★ 最后一题始终不显示追问题导航 → 确保提交按钮始终可见
  if (isLastQuestion.value) return false
  // 正在处理追问题时始终显示
  if (showingFollowup.value) return true
  // 不在追问题模式时，只有当前题有未回答的追问题才显示按钮
  return hasUnansweredFollowups.value
})

// 当前正在显示的追问题对象
const currentFollowup = computed(() => {
  if (!showingFollowup.value || !currentQ.value) return null
  // 从当前题目的全部追问列表中取，用 currentFollowupIndex 索引
  return currentQFollowups.value[currentFollowupIndex.value] || null
})

// 当前追问题的答案
const currentFollowupAnswer = computed({
  get: () => {
    if (!currentFollowup.value) return undefined
    return quizStore.followupAnswers[currentFollowup.value.id]
  },
  set: (val) => {
    if (currentFollowup.value) {
      quizStore.setFollowupAnswer(currentFollowup.value.id, val)
    }
  }
})

// ========== 维度导航点 ==========
const dimensionDots = computed(() => {
  const dims = getOrderedDimensions()
  let qIdx = 0
  return dims.map(dim => {
    const count = questions.filter(q => q.dimension === dim).length
    const info = DIMENSION_INFO[dim]
    const startIdx = qIdx
    const endIdx = qIdx + count - 1
    qIdx += count
    
    return {
      key: dim,
      name: isZh.value ? info.name : dim.charAt(0).toUpperCase() + dim.slice(1),
      isCurrent: currentQuestionIndex.value >= startIdx && currentQuestionIndex.value <= endIdx,
      isCompleted: questions
        .filter((q, i) => q.dimension === dim && i <= endIdx)
        .every((_, i) => quizStore.answers[questions[startIdx + i]?.id])
    }
  })
})

// 下一个维度的信息
const nextDimensionEmoji = computed(() => {
  if (!currentQ.value) return ''
  const dims = getOrderedDimensions()
  const currDim = currentQ.value.dimension
  const currIdx = dims.indexOf(currDim)
  if (currIdx < dims.length - 1) {
    return DIMENSION_INFO[dims[currIdx + 1]]?.icon || ''
  }
  return '🎉'
})
const nextDimensionName = computed(() => {
  if (!currentQ.value) return ''
  const dims = getOrderedDimensions()
  const currDim = currentQ.value.dimension
  const currIdx = dims.indexOf(currDim)
  if (currIdx < dims.length - 1) {
    const nextDim = dims[currIdx + 1]
    return isZh.value ? (DIMENSION_INFO[nextDim]?.name || '') : nextDim
  }
  return isZh.value ? '完成！' : 'Complete!'
})

// ========== 方法 ==========

function goHome() {
  if (confirm(isZh.value ? '确定返回主页？当前答题进度将保留。' : 'Go back to home? Your progress will be saved.')) {
    router.push('/')
  }
}

function goNext() {
  if (isLastQuestion.value) {
    submitQuiz()
  } else {
    const currentDim = questions[currentQuestionIndex.value]?.dimension
    const nextDim = questions[currentQuestionIndex.value + 1]?.dimension
    
    if (currentDim !== nextDim) {
      showDimensionTransition.value = true
      setTimeout(() => {
        showDimensionTransition.value = false
        slideDirection.value = 'slide-right'
        quizStore.nextQuestion()
      }, 800)
    } else {
      slideDirection.value = 'slide-right'
      quizStore.nextQuestion()
    }
  }
}

function goPrev() {
  // 如果在追问题模式，返回上一道追问或退出到主题目
  if (showingFollowup.value) {
    if (currentFollowupIndex.value > 0) {
      currentFollowupIndex.value--
    } else {
      // 退出追问题模式，回到当前主题目
      showingFollowup.value = false
      currentFollowupIndex.value = 0
    }
    return
  }
  
  slideDirection.value = 'slide-left'
  
  const currentDim = questions[currentQuestionIndex.value]?.dimension
  const prevDim = questions[currentQuestionIndex.value - 1]?.dimension
  
  if (currentDim !== prevDim) {
    showDimensionTransition.value = true
    setTimeout(() => {
      showDimensionTransition.value = false
      quizStore.prevQuestion()
    }, 400)
  } else {
    quizStore.prevQuestion()
  }
}

function goToDimensionStart(dimIndex) {
  const dims = getOrderedDimensions()
  let targetIndex = 0
  for (let i = 0; i < dimIndex; i++) {
    targetIndex += questions.filter(q => q.dimension === dims[i]).length
  }
  
  if (targetIndex < currentQuestionIndex.value) {
    slideDirection.value = 'slide-left'
  } else {
    slideDirection.value = 'slide-right'
  }
  
  currentQuestionIndex.value = targetIndex
}

function startFollowup() {
  showingFollowup.value = true
  // 找到第一个未回答的追问题索引
  const firstUnanswered = currentQFollowups.value.findIndex(
    f => !quizStore.followupAnswers[f.id]
  )
  currentFollowupIndex.value = firstUnanswered >= 0 ? firstUnanswered : 0
}

function nextFollowup() {
  if (currentFollowupIndex.value < currentQFollowups.value.length - 1) {
    currentFollowupIndex.value++
  }
}

function handleFinishFollowup() {
  // 确保最后一题答案已保存
  if (currentFollowup.value && currentFollowupAnswer.value !== undefined) {
    quizStore.setFollowupAnswer(currentFollowup.value.id, currentFollowupAnswer.value)
  }
  // 退出追问题模式
  showingFollowup.value = false
  currentFollowupIndex.value = 0
  
  // ★ 完成追问题后自动进入下一题（而不是返回当前主题目）
  if (!isLastQuestion.value) {
    // 使用 setTimeout 确保先退出追问题模式再切换
    nextTick(() => {
      goNext()
    })
  }
}

async function submitQuiz() {
  quizStore.completeQuiz()
  await nextTick()
  router.push('/loading')
}

function restoreProgress() {
  quizStore.restoreProgress()
  hasRestored.value = true
  showRestoreHint.value = false
}

onMounted(() => {
  if (!quizStore.hasSavedProgress()) {
    quizStore.startQuiz()
  } else {
    showRestoreHint.value = true
  }
})
</script>
