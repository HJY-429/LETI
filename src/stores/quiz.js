import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { questions } from '../data/questions.js'

// 动态计算最大题目索引（避免硬编码）
const maxQuestionIndex = computed(() => Math.max(0, questions.length - 1))

export const useQuizStore = defineStore('quiz', () => {
  // 状态
  const currentQuestionIndex = ref(0)
  const answers = ref({})
  const followupAnswers = ref({})
  const startTime = ref(null)
  const isCompleted = ref(false)
  
  // 按题目分组的追问题：{ questionId: [followup1, followup2, ...] }
  // 每道题只显示自己的追问，答完后自动隐藏
  const groupedFollowups = ref({})
  
  // 计算属性
  const totalQuestions = computed(() => {
    return 48 + Object.values(groupedFollowups.value).flat().length
  })
  
  const progress = computed(() => {
    const answered = Object.keys(answers.value).length
    const followupAnswered = Object.keys(followupAnswers.value).length
    return Math.round(((answered + followupAnswered) / totalQuestions.value) * 100)
  })

  // 当前题目关联的未回答追问题列表
  function getActiveFollowupsForQuestion(questionId) {
    const list = groupedFollowups.value[questionId] || []
    return list.filter(f => !followupAnswers.value[f.id])
  }
  
  // 当前题目的所有追问题（包括已回答的）
  function getAllFollowupsForQuestion(questionId) {
    return groupedFollowups.value[questionId] || []
  }

  // 操作方法
  function startQuiz() {
    currentQuestionIndex.value = 0
    answers.value = {}
    followupAnswers.value = {}
    startTime.value = Date.now()
    isCompleted.value = false
    groupedFollowups.value = {}
    
    localStorage.removeItem('life_indicator_quiz_progress')
    saveProgress()
  }

  function setAnswer(questionId, answer) {
    answers.value[questionId] = answer
    saveProgress()
  }

  function setFollowupAnswer(questionId, answer) {
    followupAnswers.value[questionId] = answer
    saveProgress()
  }

  // 添加追问题到指定题目的组中
  function addFollowups(questionId, followups) {
    if (!groupedFollowups.value[questionId]) {
      groupedFollowups.value[questionId] = []
    }
    for (const f of followups) {
      const existing = groupedFollowups.value[questionId].find(ef => ef.id === f.id)
      if (!existing) {
        groupedFollowups.value[questionId].push(f)
      }
    }
    saveProgress()
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < maxQuestionIndex.value) {
      currentQuestionIndex.value++
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  function goToQuestion(index) {
    currentQuestionIndex.value = Math.max(0, Math.min(index, maxQuestionIndex.value))
  }

  function completeQuiz() {
    isCompleted.value = true
    localStorage.removeItem('life_indicator_quiz_progress')
  }

  function saveProgress() {
    try {
      const progress = {
        currentQuestionIndex: currentQuestionIndex.value,
        answers: answers.value,
        followupAnswers: followupAnswers.value,
        groupedFollowups: groupedFollowups.value,
        startTime: startTime.value,
        lastUpdate: Date.now()
      }
      localStorage.setItem('life_indicator_quiz_progress', JSON.stringify(progress))
    } catch (e) {
      console.warn('Failed to save quiz progress:', e)
    }
  }

  function restoreProgress() {
    try {
      const saved = localStorage.getItem('life_indicator_quiz_progress')
      if (saved) {
        const progress = JSON.parse(saved)
        if (Date.now() - progress.lastUpdate < 3600000) {
          currentQuestionIndex.value = progress.currentQuestionIndex || 0
          answers.value = progress.answers || {}
          followupAnswers.value = progress.followupAnswers || {}
          startTime.value = progress.startTime || Date.now()
          groupedFollowups.value = progress.groupedFollowups || {}
          return true
        }
      }
    } catch (e) {
      console.warn('Failed to restore quiz progress:', e)
    }
    return false
  }

  function hasSavedProgress() {
    try {
      const saved = localStorage.getItem('life_indicator_quiz_progress')
      if (saved) {
        const progress = JSON.parse(saved)
        return Date.now() - progress.lastUpdate < 3600000
      }
    } catch (e) {}
    return false
  }

  return {
    currentQuestionIndex,
    answers,
    followupAnswers,
    startTime,
    isCompleted,
    groupedFollowups,
    totalQuestions,
    progress,
    startQuiz,
    setAnswer,
    setFollowupAnswer,
    addFollowups,
    getActiveFollowupsForQuestion,
    getAllFollowupsForQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    completeQuiz,
    saveProgress,
    restoreProgress,
    hasSavedProgress
  }
})
