// 生命类型分类定义
export const LIFE_TYPES = {
  S: {
    id: 'S',
    level: 'S',
    name: { zh: '长寿精英型', en: 'Longevity Elite' },
    emoji: '🏆',
    color: '#FFD700',
    bgColor: 'linear-gradient(135deg, #FFF9E6, #FFF3CD)',
    borderColor: '#FFD700',
    scoreRange: [85, 100],
    description: {
      zh: '你的生活习惯极佳！规律作息、均衡饮食、坚持运动、心态平和——你就是朋友圈里的「养生达人」。照这样下去，有望成为传说中的百岁老人！',
      en: 'Your habits are excellent! Regular sleep, balanced diet, consistent exercise, and calm mind — you\'re the health guru in your circle. At this rate, you could become a centenarian!'
    },
    characteristics: {
      zh: ['作息规律，睡眠质量高', '饮食健康均衡', '坚持规律运动', '心态平和乐观', '定期体检', '无不良嗜好'],
      en: ['Regular schedule, quality sleep', 'Healthy balanced diet', 'Consistent exercise routine', 'Calm and optimistic mindset', 'Regular health checkups', 'No bad habits']
    },
    avgLifeExpectancy: { male: 88, female: 92 }
  },
  A: {
    id: 'A',
    level: 'A',
    name: { zh: '健康优化型', en: 'Health Optimizer' },
    emoji: '✨',
    color: '#4CAF50',
    bgColor: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
    borderColor: '#4CAF50',
    scoreRange: [75, 84],
    description: {
      zh: '你的生活习惯整体良好！大部分指标都在健康范围内，只要在一些细节上稍加优化，就能更上一层楼。保持下去，你的人生下半场会很精彩！',
      en: 'Your habits are generally good! Most indicators are within healthy ranges. With minor optimizations in some details, you can level up. Keep it up!'
    },
    characteristics: {
      zh: ['大部分习惯良好', '有1-2个可优化点', '整体生活方式健康', '有改善的潜力空间'],
      en: ['Mostly good habits', '1-2 areas to optimize', 'Overall healthy lifestyle', 'Room for improvement']
    },
    avgLifeExpectancy: { male: 82, female: 86 }
  },
  B: {
    id: 'B',
    level: 'B',
    name: { zh: '平衡稳定型', en: 'Balanced Stabilizer' },
    emoji: '⚖️',
    color: '#2196F3',
    bgColor: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    borderColor: '#2196F3',
    scoreRange: [63, 74],
    description: {
      zh: '你的生活习惯处于中等水平。有好有坏，有优有劣——就像大多数人一样。好消息是：提升空间很大，稍微调整一些习惯就能看到明显改善！',
      en: 'Your habits are average. Some good, some bad — like most people. The good news: huge room for improvement! Small adjustments make a big difference!'
    },
    characteristics: {
      zh: ['好坏参半', '有改善的空间', '需要关注薄弱环节', '改变习惯是关键'],
      en: ['Mixed habits', 'Room for improvement', 'Need to address weak points', 'Habit change is key']
    },
    avgLifeExpectancy: { male: 76, female: 81 }
  },
  C: {
    id: 'C',
    level: 'C',
    name: { zh: '需改善型', en: 'Improvement Needed' },
    emoji: '⚠️',
    color: '#FF9800',
    bgColor: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
    borderColor: '#FF9800',
    scoreRange: [50, 62],
    description: {
      zh: '嗯……有些习惯可能正在悄悄偷走你的寿命。但别担心！现在意识到就是改变的开始。哪怕只改掉一两个坏习惯，也能显著延长你的健康年限。',
      en: 'Hmm... some habits may be quietly stealing your years. But don\'t worry! Realizing this is the first step to change.'
    },
    characteristics: {
      zh: ['存在较明显的不良习惯', '多个维度需改善', '改变刻不容缓', '每一步都有意义'],
      en: ['Some obvious bad habits', 'Multiple dimensions need work', 'Time for change is now', 'Every step matters']
    },
    avgLifeExpectancy: { male: 71, female: 76 }
  },
  D: {
    id: 'D',
    level: 'D',
    name: { zh: '风险警示型', en: 'Risk Alert' },
    emoji: '🚨',
    color: '#F44336',
    bgColor: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)',
    borderColor: '#F44336',
    scoreRange: [0, 49],
    description: {
      zh: '警报拉响！⚠️ 你的一些生活方式可能在加速消耗你的生命值。但请记住——永远不晚！从今天开始做出改变，每一小步都是向长寿迈进的巨大飞跃！',
      en: 'Alert! ⚠️ Some lifestyle choices may be depleting your life reserves. But remember — it\'s never too late! Starting today, every small step is a giant leap toward longevity!'
    },
    characteristics: {
      zh: ['多项高风险因素', '需要立即行动', '建议寻求专业帮助', '改变永远不晚'],
      en: ['Multiple high-risk factors', 'Immediate action needed', 'Consider professional help', 'It\'s never too late']
    },
    avgLifeExpectancy: { male: 65, female: 71 }
  }
}

// 根据分数获取生命类型
export function getLifeType(score) {
  if (score >= 85) return LIFE_TYPES.S
  if (score >= 75) return LIFE_TYPES.A
  if (score >= 63) return LIFE_TYPES.B
  if (score >= 50) return LIFE_TYPES.C
  return LIFE_TYPES.D
}

// 获取排名百分比（模拟）
export function getPercentileRank(score) {
  // 基于正态分布模拟，假设平均分65，标准差15
  // 使用简化的百分比映射
  if (score >= 95) return 99
  if (score >= 90) return 95
  if (score >= 85) return 87
  if (score >= 80) return 75
  if (score >= 75) return 62
  if (score >= 70) return 50
  if (score >= 65) return 38
  if (score >= 60) return 27
  if (score >= 55) return 18
  if (score >= 50) return 12
  if (score >= 40) return 6
  return 3
}
