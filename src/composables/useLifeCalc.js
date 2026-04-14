// 寿命计算公式 - 基于 WHO 数据和 Framingham 心脏研究
import { calculateAllDimensionScores, calculateTotalScore } from './useScoring.js'
import { getLifeType, getPercentileRank } from '../data/lifeTypes.js'

/**
 * 计算预期寿命和完整结果
 * @param {Object} answers - 用户答案
 * @param {Object} followupAnswers - 追问题答案
 * @returns {Object} 完整的结果数据
 */
export function calculateLifeExpectancy(answers, followupAnswers = {}) {
  // 构建上下文（用于BMI等需要多题组合计算的指标）
  const context = {
    age: parseInt(answers['B01']) || 25,
    gender: answers['B02'] || 'prefer_not_say',
    height: parseFloat(answers['B03']) || 170,
    weight: parseFloat(answers['B04']) || 65
  }
  
  // 计算各维度得分
  const dimensionScores = calculateAllDimensionScores(answers, followupAnswers, context)
  
  // 计算加权总分
  const totalScore = calculateTotalScore(dimensionScores)
  
  // 获取生命类型
  const lifeType = getLifeType(totalScore)
  
  // 计算BMI
  const bmi = context.weight / ((context.height / 100) ** 2)
  
  // 基础寿命（参考 WHO 2023 数据）
  const BASE_LIFESPAN = {
    male: 76,
    female: 81,
    prefer_not_say: 78.5
  }
  
  const base = BASE_LIFESPAN[context.gender] || BASE_LIFESPAN.prefer_not_say
  
  // 1. 生活习惯修正因子（-10 到 +10 岁）
  const scoreFactor = (totalScore - 50) * 0.4
  
  // 2. BMI 修正
  let bmiFactor = 0
  if (bmi < 18.5) bmiFactor = -2           // 过瘦
  else if (bmi >= 18.5 && bmi < 24) bmiFactor = 0  // 正常
  else if (bmi >= 24 && bmi < 28) bmiFactor = -3   // 超重
  else if (bmi >= 28) bmiFactor = -6               // 肥胖
  
  // 3. 不良习惯惩罚
  let penalty = 0
  const smokingAnswer = answers['L01']
  if (['regular_few', 'regular_many'].includes(smokingAnswer)) penalty += 8
  else if (smokingAnswer === 'occasional') penalty += 3
  else if (smokingAnswer === 'former') penalty += 2
  
  const drinkingAnswer = answers['L02']
  if (drinkingAnswer === 'frequent_heavy') penalty += 4
  else if (drinkingAnswer === 'moderate') penalty += 1
  
  const bpAnswer = answers['B05']
  if (bpAnswer === 'high_stage1' || bpAnswer === 'high_stage2') penalty += 4
  else if (bpAnswer === 'elevated') penalty += 1
  
  if (dimensionScores.exercise < 40) penalty += 3
  else if (dimensionScores.exercise < 60) penalty += 1
  
  // 4. 保护因素奖励
  let bonus = 0
  if (dimensionScores.sleep >= 80) bonus += 2
  if (dimensionScores.diet >= 80) bonus += 2
  if (dimensionScores.mental >= 75) bonus += 1
  if (answers['L05'] === 'annual') bonus += 1
  if (dimensionScores.exercise >= 80) bonus += 1
  
  // 5. 家族病史影响
  const familyHistory = answers['L06']
  if (familyHistory === 'early_death') penalty += 3
  else if (familyHistory === 'cardiovascular') penalty += 1
  else if (familyHistory === 'cancer') penalty += 1
  
  // 当前预测寿命（确保在合理范围内）
  let predictedAge = base + scoreFactor + bmiFactor - penalty + bonus
  predictedAge = Math.round(Math.max(context.age + 10, Math.min(100, predictedAge)))
  
  // 理想状态下的寿命（假设所有习惯都优化到最佳）
  const idealScore = 100
  const idealFactor = (idealScore - 50) * 0.4
  const idealPenalty = Math.max(0, penalty - bonus * 2) // 减去已获得的好处
  let idealAge = base + idealFactor + bmiFactor - 0 + (bonus + 3) // 理想状态下奖励更多
  idealAge = Math.round(Math.max(predictedAge + 3, Math.min(105, idealAge)))
  
  // 提升空间
  const potentialGain = Math.max(0, idealAge - predictedAge)
  
  // 获取风险因素和保护因素
  const riskFactors = getRiskFactors(answers, dimensionScores)
  const protectiveFactors = getProtectiveFactors(answers, dimensionScores)
  
  // 排名百分比
  const percentileRank = getPercentileRank(totalScore)

  return {
    totalScore,
    dimensionScores,
    lifeType,
    predictedAge,
    idealAge,
    potentialGain,
    bmi: parseFloat(bmi.toFixed(1)),
    riskFactors,
    protectiveFactors,
    percentileRank,
    breakdown: {
      base,
      scoreFactor: Math.round(scoreFactor * 10) / 10,
      bmiFactor,
      penalty,
      bonus,
      context
    }
  }
}

// 获取风险因素列表
function getRiskFactors(answers, scores) {
  const risks = []
  const riskMap = {
    smoking_current: { zh: '吸烟', en: 'Smoking', icon: '🚬' },
    high_blood_pressure: { zh: '高血压', en: 'High Blood Pressure', icon: '🩺' },
    lack_exercise: { zh: '缺乏运动', en: 'Lack of Exercise', icon: '🛋️' },
    poor_diet: { zh: '饮食不健康', en: 'Unhealthy Diet', icon: '🍔' },
    poor_sleep: { zh: '睡眠不足/质量差', en: 'Poor Sleep', icon: '😴' },
    high_stress: { zh: '心理压力过大', en: 'High Stress', icon: '😰' },
    obesity: { zh: '超重/肥胖', en: 'Overweight/Obesity', icon: '⚖️' },
    heavy_drinking: { zh: '过量饮酒', en: 'Heavy Drinking', icon: '🍷' },
    no_checkup: { zh: '不做体检', en: 'No Health Checkups', icon: '📋' },
    family_history_risk: { zh: '家族健康风险', en: 'Family Health Risk', icon: '🧬' }
  }

  if (['occasional', 'regular_few', 'regular_many'].includes(answers['L01'])) 
    risks.push(riskMap.smoking_current)
  if (['high_stage1', 'high_stage2'].includes(answers['B05'])) 
    risks.push(riskMap.high_blood_pressure)
  if (scores.exercise < 40) risks.push(riskMap.lack_exercise)
  else if (scores.exercise < 55) risks.push({ ...riskMap.lack_exercise, level: 'moderate' })
  if (scores.diet < 45) risks.push(riskMap.poor_diet)
  else if (scores.diet < 60) risks.push({ ...riskMap.poor_diet, level: 'moderate' })
  if (scores.sleep < 45) risks.push(riskMap.poor_sleep)
  else if (scores.sleep < 60) risks.push({ ...riskMap.poor_sleep, level: 'moderate' })
  if (scores.mental < 45) risks.push(riskMap.high_stress)
  else if (scores.mental < 60) risks.push({ ...riskMap.high_stress, level: 'moderate' })
  
  const height = parseFloat(answers['B03']) || 170
  const weight = parseFloat(answers['B04']) || 65
  const bmi = weight / ((height / 100) ** 2)
  if (bmi >= 28) risks.push(riskMap.obesity)
  else if (bmi >= 24) risks.push({ ...riskMap.obesity, level: 'moderate' })
  
  if (answers['L02'] === 'frequent_heavy') risks.push(riskMap.heavy_drinking)
  if (['occasional', 'never'].includes(answers['L05'])) risks.push(riskMap.no_checkup)
  if (['cardiovascular', 'cancer', 'early_death'].includes(answers['L06'])) 
    risks.push(riskMap.family_history_risk)

  return risks
}

// 获取保护因素列表
function getProtectiveFactors(answers, scores) {
  const protects = []
  const protectMap = {
    never_smoked: { zh: '从不吸烟', en: 'Never Smoked', icon: '✅' },
    normal_blood_pressure: { zh: '血压正常', en: 'Normal BP', icon: '✅' },
    regular_exercise: { zh: '规律运动', en: 'Regular Exercise', icon: '💪' },
    healthy_diet: { zh: '饮食健康', en: 'Healthy Diet', icon: '🥗' },
    quality_sleep: { zh: '睡眠良好', en: 'Quality Sleep', icon: '😴' },
    good_mental: { zh: '心态积极', en: 'Positive Mindset', icon: '😊' },
    healthy_weight: { zh: '体重正常', en: 'Healthy Weight', icon: '⚖️' },
    annual_checkup: { zh: '定期体检', en: 'Annual Checkups', icon: '📋' },
    no_family_risk: { zh: '无重大家族病史', en: 'No Major Family History', icon: '🧬' }
  }

  if (answers['L01'] === 'never') protects.push(protectMap.never_smoked)
  if (answers['B05'] === 'normal' || answers['B05'] === 'unknown') 
    protects.push(protectMap.normal_blood_pressure)
  if (scores.exercise >= 70) protects.push(protectMap.regular_exercise)
  if (scores.diet >= 70) protects.push(protectMap.healthy_diet)
  if (scores.sleep >= 70) protects.push(protectMap.quality_sleep)
  if (scores.mental >= 70) protects.push(protectMap.good_mental)
  
  const height = parseFloat(answers['B03']) || 170
  const weight = parseFloat(answers['B04']) || 65
  const bmi = weight / ((height / 100) ** 2)
  if (bmi >= 18.5 && bmi < 24) protects.push(protectMap.healthy_weight)
  
  if (answers['L05'] === 'annual') protects.push(protectMap.annual_checkup)
  if (answers['L06'] === 'none_known') protects.push(protectMap.no_family_risk)

  return protects
}
