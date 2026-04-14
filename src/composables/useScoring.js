// 评分算法 - 计算各维度得分
import { questions } from '../data/questions.js'

// 各维度权重
export const WEIGHTS = {
  sleep: 0.20,
  diet: 0.20,
  exercise: 0.20,
  mental: 0.15,
  body: 0.15,
  lifestyle: 0.10
}

// 获取选项分数
function getOptionScore(question, answerValue, context = {}) {
  if (!answerValue) return 0
  
  // 多选题：答案为逗号分隔字符串，计算加权平均分
  if (question.type === 'multiple' && typeof answerValue === 'string') {
    const selectedValues = answerValue.split(',').filter(v => v.trim())
    if (selectedValues.length === 0) return 0
    
    let totalScore = 0
    for (const val of selectedValues) {
      const option = question.options.find(opt => opt.value === val)
      totalScore += option ? option.score : 0
    }
    
    // "无"类选项单独选中时直接返回原始高分（不惩罚）
    const exclusiveOptions = ['none', 'none_known', 'minimal', 'no_late_night', 'always_eat']
    const hasExclusiveOnly = selectedValues.length === 1 && exclusiveOptions.includes(selectedValues[0])
    if (hasExclusiveOnly) {
      const opt = question.options.find(o => o.value === selectedValues[0])
      return opt ? opt.score : 10
    }
    
    const scoringType = question.scoringType
    
    // 消极型多选（如晚睡原因、早餐原因）：选的越多越差
    // 基础分 = 平均分 - 惩罚(每多一个选项扣分)
    if (scoringType === 'negative') {
      const avgScore = totalScore / selectedValues.length
      // 每多选一个消极因素额外惩罚 1 分
      const penalty = Math.max(0, selectedValues.length - 1) * 1.0
      return Math.max(2, Math.round(avgScore - penalty))
    }
    
    // 积极型多选（如运动类型）：选得越多、类型越丰富越好
    // 取最高分 + 多样性加成(每多一个积极选项 +0.5)
    if (scoringType === 'positive') {
      let maxScore = 0
      for (const val of selectedValues) {
        const opt = question.options.find(o => o.value === val)
        if (opt && opt.value !== 'none') maxScore = Math.max(maxScore, opt.score)
      }
      // 如果包含 "不运动"，直接给低分
      if (selectedValues.includes('none')) return 2
      // 多样性加成：每多一个不同运动 +0.5 分（上限 +2）
      const diversityBonus = Math.min(2, Math.max(0, selectedValues.length - 1) * 0.5)
      return Math.min(10, Math.round(maxScore + diversityBonus))
    }
    
    // 默认多选逻辑（中性）：取平均值，轻微惩罚
    const avgScore = totalScore / selectedValues.length
    const penalty = Math.max(0, selectedValues.length - 1) * 0.5
    return Math.max(2, Math.round(avgScore - penalty))
  }
  
  // 数字输入类型题目（传入 context 供评分规则使用，如 BMI 计算）
  if (question.type === 'number' && question.scoringRule) {
    return question.scoringRule(answerValue, context)
  }
  
  // 选择题
  const option = question.options.find(opt => opt.value === answerValue)
  return option ? option.score : 0
}

// 计算单个维度的得分（0-100）
export function calculateDimensionScore(dimension, answers, followupAnswers, context = {}) {
  // 获取该维度的所有基础题
  const dimensionQuestions = questions.filter(q => q.dimension === dimension)
  
  let totalScore = 0
  let maxPossibleScore = 0
  let answeredCount = 0

  for (const q of dimensionQuestions) {
    maxPossibleScore += 10 // 每题满分10分
    
    if (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '') {
      const score = getOptionScore(q, answers[q.id], context)
      totalScore += score
      answeredCount++
    }
  }

  // 如果该维度没有任何回答，返回默认中等分
  if (answeredCount === 0) return 50

  // 计算百分比得分
  const rawScore = (totalScore / maxPossibleScore) * 100
  return Math.round(Math.max(0, Math.min(100, rawScore)))
}

// 计算加权总分
export function calculateTotalScore(dimensionScores) {
  let total = 0
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    total += (dimensionScores[key] || 50) * weight
  }
  return Math.round(total)
}

// 计算所有维度得分
export function calculateAllDimensionScores(answers, followupAnswers, context = {}) {
  const dimensions = ['sleep', 'diet', 'exercise', 'mental', 'body', 'lifestyle']
  const scores = {}
  
  for (const dim of dimensions) {
    scores[dim] = calculateDimensionScore(dim, answers, followupAnswers, context)
  }
  
  return scores
}

// 获取维度详情（用于建议页面）
export function getDimensionDetails(dimension, score) {
  const levels = [
    { min: 80, level: 'excellent', label: { zh: '优秀', en: 'Excellent' }, color: '#4CAF50' },
    { min: 60, level: 'good', label: { zh: '良好', en: 'Good' }, color: '#8BC34A' },
    { min: 40, level: 'moderate', label: { zh: '一般', en: 'Moderate' }, color: '#FF9800' },
    { min: 0, level: 'poor', label: { zh: '需改善', en: 'Needs Work' }, color: '#F44336' }
  ]
  
  for (const l of levels) {
    if (score >= l.min) return l
  }
  return levels[levels.length - 1]
}
