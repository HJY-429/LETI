// 智能分支逻辑 - 根据用户答案动态调整追问题
export const branchingRules = {
  // S01: 入睡时间 -> 若晚于 23 点，追问晚睡原因（多选版）
  'S01': {
    followups: ['S02'],
    condition: (answer) => ['0_1', 'after1'].includes(answer)
  },
  // S02 已作为 S01 的追问题存在，不再有独立规则

  // S03: 睡醒状态 -> 若疲惫，询问失眠情况
  'S03': {
    followups: ['S03a'],
    condition: (answer) => ['groggy', 'exhausted'].includes(answer)
  },
  // S05: 睡前行为 -> 若用屏过度，追问时长
  'S05': {
    followups: ['S05a'],
    condition: (answer) => ['social_media', 'heavy_screen'].includes(answer)
  },
  // S08: 打鼾 -> 若严重，建议关注
  'S08': {
    followups: ['S08a'],
    condition: (answer) => ['frequent', 'diagnosed_apnea'].includes(answer)
  },

  // F01: 早餐 -> 若不吃，询问原因（多选）
  'F01': {
    followups: ['F01b'],
    condition: (answer) => ['occasional', 'rarely'].includes(answer)
  },
  // F06: 糖分摄入 -> 若过多，深入询问
  'F06': {
    followups: ['F06a'],
    condition: (answer) => ['daily_moderate', 'frequent'].includes(answer)
  },

  // E01: 运动频率 -> 若从不运动，追问原因
  'E01': {
    followups: ['E01a'],
    condition: (answer) => answer === 'never'
  },

  // M01: 压力水平 -> 若压力大，深入询问
  'M01': {
    followups: ['M01a'],
    condition: (answer) => ['often', 'always'].includes(answer)
  },
  // M03: 焦虑症状 -> 若有焦虑
  'M03': {
    followups: ['M03a'],
    condition: (answer) => ['sometimes', 'often_always'].includes(answer)
  },

  // L01: 吸烟 -> 若吸烟，追问详情
  'L01': {
    followups: ['L01a'],
    condition: (answer) => ['occasional', 'regular_few', 'regular_many'].includes(answer)
  },
  // L02: 饮酒 -> 若酗酒，警告提示
  'L02': {
    followups: ['L02a'],
    condition: (answer) => ['frequent_heavy'].includes(answer)
  }
}

// 追问题定义（二级问题）
export const followupQuestions = {
  // 睡眠相关追问题

  // S02: 晚睡主要原因（多选版，作为 S01 的追问题）
  'S02': {
    id: 'S02',
    dimension: 'sleep',
    question: { zh: '🌙 你经常晚睡，主要原因是哪些？（可多选）', en: '🌙 What are your main reasons for staying up late? (Select all that apply)' },
    type: 'multiple',
    scoringType: 'negative',
    options: [
      { value: 'work_overtime', score: 4, text: { zh: '工作/学习加班', en: 'Work/study overtime' } },
      { value: 'phone_entertainment', score: 2, text: { zh: '刷手机/追剧/打游戏（娱乐）', en: 'Phone/TV/Gaming (Entertainment)' } },
      { value: 'insomnia', score: 3, text: { zh: '失眠/入睡困难', en: 'Insomnia / Trouble falling asleep' } },
      { value: 'social', score: 5, text: { zh: '社交活动/聚会', en: 'Social activities / Gatherings' } },
      { value: 'family_care', score: 6, text: { zh: '照顾家人/小孩', en: 'Caring for family / Children' } },
      { value: 'no_late_night', score: 10, text: { zh: '我不怎么晚睡', en: "I don't stay up late" } }
    ]
  },

  'S03a': {
    id: 'S03a',
    dimension: 'sleep',
    question: { zh: '💭 你觉得醒来疲惫的主要原因是什么？', en: '💭 What do you think causes your morning fatigue?' },
    type: 'single',
    options: [
      { value: 'poor_sleep_quality', score: 2, text: { zh: '睡眠质量差，多梦易醒', en: 'Poor sleep quality, vivid dreams' } },
      { value: 'not_enough_hours', score: 3, text: { zh: '睡觉时间不够', en: 'Not enough sleep hours' } },
      { value: 'irregular_schedule', score: 4, text: { zh: '作息不规律', en: 'Irregular schedule' } },
      { value: 'health_issue', score: 1, text: { zh: '可能有健康问题（如呼吸暂停）', en: 'Possible health issue (e.g., sleep apnea)' } }
    ]
  },
  'S05a': {
    id: 'S05a',
    dimension: 'sleep',
    question: { zh: '📱 睡前你平均使用手机/电脑大概多长时间？', en: '📱 How long do you use screens before bed on average?' },
    type: 'single',
    options: [
      { value: 'under30min', score: 6, text: { zh: '不到30分钟', en: 'Under 30 min' } },
      { value: '30_60min', score: 4, text: { zh: '30分钟到1小时', en: '30 min to 1 hour' } },
      { value: '1_2hours', score: 2, text: { zh: '1到2小时', en: '1 to 2 hours' } },
      { value: 'over2h', score: 1, text: { zh: '超过2小时', en: 'Over 2 hours' } }
    ]
  },
  'S08a': {
    id: 'S08a',
    dimension: 'sleep',
    question: { zh: '🏥 关于打鼾/呼吸暂停，以下哪种情况最符合你？', en: '🏥 Which best describes your snoring situation?' },
    type: 'single',
    options: [
      { value: 'self_noticed', score: 4, text: { zh: '自己知道打鼾但没太在意', en: 'Know I snore but haven\'t addressed it' } },
      { value: 'partner_complains', score: 3, text: { zh: '家人/伴侣抱怨我打鼾很大声', en: 'Partner/family complains about loud snoring' } },
      { value: 'diagnosed_treating', score: 6, text: { zh: '已被诊断并正在治疗中', en: 'Diagnosed and in treatment' } },
      { value: 'suspect_apnea', score: 2, text: { zh: '怀疑有呼吸暂停但未就医', en: 'Suspect sleep apnea but haven\'t seen a doctor' } }
    ]
  },

  // 饮食相关追问题
  'F01b': {
    id: 'F01b',
    dimension: 'diet',
    question: { zh: '🥐 来不及吃早餐的主要原因是什么？（可多选）', en: '🥐 What are your main reasons for skipping breakfast? (Select all that apply)' },
    type: 'multiple',
    scoringType: 'negative',
    options: [
      { value: 'sleep_late', score: 2, text: { zh: '起太晚，没时间吃', en: 'Wake up too late, no time' } },
      { value: 'busy_work', score: 3, text: { zh: '工作/上学匆忙', en: 'Busy with work/school' } },
      { value: 'no_appetite', score: 4, text: { zh: '早上没有胃口', en: 'No appetite in the morning' } },
      { value: 'dieting', score: 5, text: { zh: '正在减肥/控制饮食', en: 'Dieting / Controlling intake' } },
      { value: 'lazy_cook', score: 3, text: { zh: '懒得准备', en: 'Too lazy to prepare' } },
      { value: 'always_eat', score: 10, text: { zh: '我基本都吃早餐', en: "I usually eat breakfast" } }
    ]
  },
  'F06a': {
    id: 'F06a',
    dimension: 'diet',
    question: { zh: '🍰 你最喜欢哪种甜食？(诚实作答~)', en: '🍰 What\'s your favorite sweet treat? (Be honest!)' },
    type: 'single',
    options: [
      { value: 'soda', score: 1, text: { zh: '含糖饮料（可乐、奶茶等）', en: 'Sugary drinks (soda, bubble tea)' } },
      { value: 'desserts', score: 2, text: { zh: '蛋糕、冰淇淋、甜点', en: 'Cakes, ice cream, desserts' } },
      { value: 'candy_snacks', score: 2, text: { zh: '糖果、巧克力、零食', en: 'Candy, chocolate, snacks' } },
      { value: 'fruity', score: 7, text: { zh: '其实我更喜欢吃水果', en: 'Actually prefer fruit' } }
    ]
  },

  // 运动相关追问题
  'E01a': {
    id: 'E01a',
    dimension: 'exercise',
    question: { zh: '🤔 不运动的最主要原因是？（选一个最符合的）', en: '🤦 What\'s the #1 reason you don\'t exercise?' },
    type: 'single',
    options: [
      { value: 'no_time', score: 3, text: { zh: '太忙了，真的没时间', en: 'Too busy, no time at all' } },
      { value: 'too_tired', score: 2, text: { zh: '工作太累，下班只想躺着', en: 'Exhausted after work, just want to rest' } },
      { value: 'no_motivation', score: 3, text: { zh: '缺乏动力和兴趣', en: 'No motivation or interest' } },
      { value: 'no_facility', score: 3, text: { zh: '没有合适的场所或条件', en: 'No suitable facility or equipment' } },
      { value: 'health_limitation', score: 4, text: { zh: '身体有不适或疾病限制', en: 'Health issues or physical limitations' } },
      { value: 'plan_to_start', score: 6, text: { zh: '其实打算开始运动的...', en: 'Actually planning to start...' } }
    ]
  },

  // 心理相关追问题
  'M01a': {
    id: 'M01a',
    dimension: 'mental',
    question: { zh: '😰 高压状态下，你会有以下哪些表现？（可多选最主要的一个）', en: '😰 Which symptoms do you experience under high stress?' },
    type: 'single',
    options: [
      { value: 'sleep_problem', score: 2, text: { zh: '失眠或睡眠质量下降', en: 'Sleep problems / Poor sleep quality' } },
      { value: 'anxiety', score: 2, text: { zh: '焦虑不安，心跳加速', en: 'Anxiety, racing heart' } },
      { value: 'irritability', score: 3, text: { zh: '容易烦躁发怒', en: 'Irritability, anger' } },
      { value: 'appetite_change', score: 3, text: { zh: '食欲变化（暴饮或厌食）', en: 'Appetite changes (overeating or loss)' } },
      { value: 'manage_well', score: 8, text: { zh: '虽然压力但能自我调节', en: 'Stressed but can self-regulate' } }
    ]
  },
  'M03a': {
    id: 'M03a',
    dimension: 'mental',
    question: { zh: '💭 你的焦虑感主要来自什么方面？', en: '💭 What\'s the main source of your anxiety?' },
    type: 'single',
    options: [
      { value: 'future_uncertainty', score: 3, text: { zh: '对未来的不确定和担忧', en: 'Uncertainty and worry about future' } },
      { value: 'social_anxiety', score: 3, text: { zh: '社交场合的紧张', en: 'Social situations anxiety' } },
      { value: 'health_worry', score: 3, text: { zh: '对自己健康的担心', en: 'Worry about own health' } },
      { value: 'performance', score: 3, text: { zh: '工作/学习表现压力', en: 'Work/school performance pressure' } },
      { value: 'general', score: 4, text: { zh: '说不清楚，就是莫名紧张', en: 'Can\'t explain, just nervous' } }
    ]
  },

  // 生活方式追问题
  'L01a': {
    id: 'L01a',
    dimension: 'lifestyle',
    question: { zh: '🚬 如果吸烟，你每天大约吸多少支？或者已经吸了多少年？', en: '🚬 If you smoke, how many per day? Or how many years?' },
    type: 'single',
    options: [
      { value: 'occasional_few', score: 4, text: { zh: '偶尔社交性吸烟，每月几次', en: 'Occasional social smoking, few times/month' } },
      { value: 'daily_under10', score: 2, text: { zh: '每天<10支，不超过5年', en: '<10/day, under 5 years' } },
      { value: 'daily_under10_long', score: 1, text: { zh: '每天<10支，超过10年', en: '<10/day, over 10 years' } },
      { value: 'daily_10plus', score: 1, text: { zh: '每天≥10支', en: '≥10 cigarettes/day' } },
      { value: 'heavy_longterm', score: 0, text: { zh: '大量吸烟（>20支/天）且超过15年', en: 'Heavy smoker (>20/day), 15+ years' } }
    ]
  },
  'L02a': {
    id: 'L02a',
    dimension: 'lifestyle',
    question: { zh: '🍷 关于饮酒，你属于哪种情况？', en: '🍷 Which describes your drinking pattern?' },
    type: 'single',
    options: [
      { value: 'binge_weekly', score: 1, text: { zh: '每周都有一次以上大量饮酒', en: 'Binge drinking weekly+' } },
      { value: 'daily_heavy', score: 1, text: { zh: '每天都喝而且量不小', en: 'Daily heavy drinker' } },
      { value: 'cant_stop', score: 0, text: { zh: '想停但停不下来', en: 'Want to stop but can\'t' } },
      { value: 'concerned', score: 3, text: { zh: '我也担心自己的饮酒量', en: 'I\'m worried about my drinking too' } },
      { value: 'not_that_bad', score: 4, text: { zh: '可能被高估了，没那么夸张', en: 'Probably overestimated, not that bad' } }
    ]
  }
}

// 检查某个问题的答案是否会触发追问题
export function checkBranching(questionId, answer) {
  const rule = branchingRules[questionId]
  if (!rule) return []
  
  if (rule.condition && rule.condition(answer)) {
    return rule.followups.map(id => followupQuestions[id]).filter(Boolean)
  }
  return []
}

// 获取所有追问题
export function getFollowupQuestion(id) {
  return followupQuestions[id] || null
}
