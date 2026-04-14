// 48道科学测试题 - 六大维度
// 每题包含: id, dimension(维度), question(问题), options(选项), tip(提示), type(类型)

// 维度信息（供 ProgressBar、Chart 等组件使用）
export const DIMENSION_INFO = {
  sleep: { icon: '🛌', name: '睡眠习惯', color: '#5C6BC0', order: 1 },
  diet: { icon: '🥗', name: '饮食习惯', color: '#FF9800', order: 2 },
  exercise: { icon: '🏃', name: '运动习惯', color: '#4CAF50', order: 3 },
  mental: { icon: '🧠', name: '心理健康', color: '#9C27B0', order: 4 },
  body: { icon: '🏥', name: '身体指标', color: '#F44336', order: 5 },
  lifestyle: { icon: '🏡', name: '生活方式', color: '#2196F3', order: 6 }
}

export const questions = [
  // ==================== 第一部分：睡眠习惯（10题）S01-S10 ====================
  {
    id: 'S01',
    dimension: 'sleep',
    question: {
      zh: '😴 你通常几点睡觉？',
      en: '😴 What time do you usually go to bed?'
    },
    options: [
      { value: 'before22', score: 10, text: { zh: '< 22 点（早睡达人）', en: 'Before 10 PM (Early bird)' } },
      { value: '22_23', score: 8, text: { zh: '22-23 点', en: '10-11 PM' } },
      { value: '23_24', score: 6, text: { zh: '23-24 点', en: '11 PM - Midnight' } },
      { value: '0_1', score: 4, text: { zh: '0-1 点', en: '12 AM - 1 AM' } },
      { value: 'after1', score: 2, text: { zh: '> 1 点（夜猫子）', en: 'After 1 AM (Night owl)' } }
    ],
    // tip 已移至 Result 页面的建议区域，避免影响答题判断
    branchTrigger: true,
    branchCondition: (answer) => ['0_1', 'after1'].includes(answer)
  },
  // S02 已移至 branchingLogic.js 的 followupQuestions 中作为 S01 的追问题（多选版晚睡原因）

  {
    id: 'S03',
    dimension: 'sleep',
    question: {
      zh: '💤 早上醒来时，你通常感觉怎么样？',
      en: '💤 How do you usually feel when you wake up?'
    },
    options: [
      { value: 'energized', score: 10, text: { zh: '精神饱满，充满活力', en: 'Energized and refreshed' } },
      { value: 'okay', score: 7, text: { zh: '还行，还算清醒', en: 'Okay, fairly alert' } },
      { value: 'groggy', score: 4, text: { zh: '有点困倦，需要缓一会儿', en: 'A bit groggy, need time to wake up' } },
      { value: 'exhausted', score: 2, text: { zh: '非常疲惫，像没睡一样', en: 'Exhausted, like I didn\'t sleep' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['groggy', 'exhausted'].includes(answer)
  },
  {
    id: 'S04',
    dimension: 'sleep',
    question: {
      zh: '☕ 你有午睡的习惯吗？',
      en: '☕ Do you take naps during the day?'
    },
    options: [
      { value: 'daily_regular', score: 9, text: { zh: '每天都有规律午睡（15-30分钟）', en: 'Daily regular nap (15-30 min)' } },
      { value: 'occasional', score: 7, text: { zh: '偶尔午睡', en: 'Occasionally' } },
      { value: 'weekend_only', score: 6, text: { zh: '只有周末才午睡', en: 'Only on weekends' } },
      { value: 'never', score: 7, text: { zh: '从不午睡', en: 'Never' } }
    ]
  },
  {
    id: 'S05',
    dimension: 'sleep',
    question: {
      zh: '📱 睡前 1 小时内，你通常会做什么？',
      en: '📱 What do you typically do within 1 hour before bed?'
    },
    options: [
      { value: 'relaxing', score: 10, text: { zh: '阅读/冥想/听轻音乐（放松活动）', en: 'Reading/Meditation/Soft music (Relaxing)' } },
      { value: 'minimal_screen', score: 7, text: { zh: '偶尔看手机，但不超过20分钟', en: 'Occasionally check phone (< 20 min)' } },
      { value: 'social_media', score: 4, text: { zh: '刷社交媒体/看视频', en: 'Scroll social media / Watch videos' } },
      { value: 'heavy_screen', score: 2, text: { zh: '打游戏/追剧/高强度用屏', en: 'Gaming / Binge-watching / Heavy screen use' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['social_media', 'heavy_screen'].includes(answer)
  },
  {
    id: 'S06',
    dimension: 'sleep',
    question: {
      zh: '🌑 你的睡眠环境如何？',
      en: '🌑 What\'s your sleeping environment like?'
    },
    options: [
      { value: 'excellent', score: 10, text: { zh: '安静、黑暗、舒适（完美环境）', en: 'Quiet, dark, comfortable (Perfect)' } },
      { value: 'good', score: 8, text: { zh: '比较安静，光线适中', en: 'Fairly quiet, moderate lighting' } },
      { value: 'noisy', score: 4, text: { zh: '有些噪音或光线干扰', en: 'Some noise or light disturbance' } },
      { value: 'poor', score: 2, text: { zh: '很吵或很亮，影响睡眠', en: 'Very noisy or bright, affects sleep' } }
    ]
  },
  {
    id: 'S07',
    dimension: 'sleep',
    question: {
      zh: '⏰ 工作日和周末的起床时间相差多少？',
      en: '⏰ What\'s the time difference between weekday and weekend wake-up times?'
    },
    options: [
      { value: 'same', score: 10, text: { zh: '基本一致（差不到30分钟）', en: 'About the same (< 30 min difference)' } },
      { value: '1hour', score: 7, text: { zh: '相差约1小时', en: 'About 1 hour difference' } },
      { value: '2hours', score: 4, text: { zh: '相差约2小时', en: 'About 2 hours difference' } },
      { value: 'more', score: 2, text: { zh: '相差2小时以上（严重作息不规律）', en: 'More than 2 hours (Irregular schedule)' } }
    ]
  },
  {
    id: 'S08',
    dimension: 'sleep',
    question: {
      zh: '😴 你是否有打鼾的情况？',
      en: '😴 Do you snore?'
    },
    options: [
      { value: 'none', score: 10, text: { zh: '从不打鼾', en: 'Never' } },
      { value: 'rare_mild', score: 8, text: { zh: '偶尔轻微打鼾', en: 'Rarely, mild snoring' } },
      { value: 'frequent', score: 4, text: { zh: '经常打鼾', en: 'Frequently snore' } },
      { value: 'diagnosed_apnea', score: 2, text: { zh: '被医生诊断为呼吸暂停综合征', en: 'Diagnosed with sleep apnea' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['frequent', 'diagnosed_apnea'].includes(answer)
  },
  {
    id: 'S09',
    dimension: 'sleep',
    question: {
      zh: '☕ 下午 3 点后你会喝含咖啡因的饮料吗？（咖啡、茶、可乐等）',
      en: '☕ Do you drink caffeinated drinks after 3 PM? (coffee, tea, cola, etc.)'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '从不喝', en: 'Never' } },
      { value: 'rarely', score: 7, text: { zh: '偶尔喝', en: 'Rarely' } },
      { value: 'sometimes', score: 5, text: { zh: '有时会喝', en: 'Sometimes' } },
      { value: 'daily', score: 2, text: { zh: '几乎每天下午都喝', en: 'Almost every afternoon' } }
    ]
  },
  {
    id: 'S10',
    dimension: 'sleep',
    question: {
      zh: '💭 你平均每晚睡多少小时？',
      en: '💭 How many hours do you sleep per night on average?'
    },
    options: [
      { value: '7_9', score: 10, text: { zh: '7-9 小时（理想时长）', en: '7-9 hours (Ideal)' } },
      { value: '6_7', score: 7, text: { zh: '6-7 小时', en: '6-7 hours' } },
      { value: '5_6', score: 4, text: { zh: '5-6 小时（偏少）', en: '5-6 hours (Below recommended)' } },
      { value: 'less5_or_more9', score: 5, text: { zh: '<5小时 或 >9小时', en: 'Less than 5h or more than 9h' } }
    ]
  },

  // ==================== 第二部分：饮食习惯（10题）F01-F10 ====================
  {
    id: 'F01',
    dimension: 'diet',
    question: {
      zh: '🍳 你是否每天吃早餐？',
      en: '🍳 Do you eat breakfast every day?'
    },
    options: [
      { value: 'everyday', score: 10, text: { zh: '每天都吃', en: 'Every day' } },
      { value: 'often', score: 7, text: { zh: '经常吃（每周5-6天）', en: 'Often (5-6 days/week)' } },
      { value: 'occasional', score: 4, text: { zh: '偶尔吃（每周2-4天）', en: 'Occasionally (2-4 days/week)' } },
      { value: 'rarely', score: 2, text: { zh: '几乎不吃', en: 'Rarely or never' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['occasional', 'rarely'].includes(answer)
  },

  {
    id: 'F02',
    dimension: 'diet',
    question: {
      zh: '🥦 你每天吃蔬菜的量大概是多少？',
      en: '🥦 How many servings of vegetables do you eat per day?'
    },
    options: [
      { value: '4plus', score: 10, text: { zh: '4份以上（蔬菜达人）', en: '4+ servings (Veggie lover)' } },
      { value: '3_4', score: 8, text: { zh: '3-4份', en: '3-4 servings' } },
      { value: '1_2', score: 5, text: { zh: '1-2份', en: '1-2 servings' } },
      { value: 'less1', score: 2, text: { zh: '少于1份或不吃', en: 'Less than 1 serving or none' } }
    ]
  },
  {
    id: 'F03',
    dimension: 'diet',
    question: {
      zh: '🍎 你每天吃水果的频率是？',
      en: '🍍 How often do you eat fruit?'
    },
    options: [
      { value: 'multiple', score: 10, text: { zh: '每天2份以上', en: '2+ servings daily' } },
      { value: 'one_daily', score: 8, text: { zh: '每天1份', en: '1 serving daily' } },
      { value: 'few_per_week', score: 5, text: { zh: '每周几次', en: 'A few times per week' } },
      { value: 'rarely_never', score: 2, text: { zh: '很少或不吃', en: 'Rarely or never' } }
    ]
  },
  {
    id: 'F04',
    dimension: 'diet',
    question: {
      zh: '🥩 你每周吃红肉（猪牛羊）多少次？',
      en: '🥩 How many times per week do you eat red meat (pork, beef, lamb)?'
    },
    options: [
      { value: 'never', score: 9, text: { zh: '不吃或几乎不吃', en: 'Never or rarely' } },
      { value: '1_2', score: 8, text: { zh: '1-2 次', en: '1-2 times' } },
      { value: '3_5', score: 5, text: { zh: '3-5 次', en: '3-5 times' } },
      { value: 'more5', score: 2, text: { zh: '5次以上（每天吃红肉）', en: '5+ times (Daily red meat)' } }
    ]
  },
  {
    id: 'F05',
    dimension: 'diet',
    question: {
      zh: '🌭 你是否常吃加工肉类？（香肠、培根、火腿等）',
      en: '🌭 How often do you eat processed meats? (sausage, bacon, ham, etc.)'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '从来不吃', en: 'Never' } },
      { value: 'monthly', score: 7, text: { zh: '每月几次', en: 'A few times per month' } },
      { value: 'weekly', score: 4, text: { zh: '每周几次', en: 'A few times per week' } },
      { value: 'daily', score: 1, text: { zh: '几乎每天', en: 'Almost daily' } }
    ]
  },
  {
    id: 'F06',
    dimension: 'diet',
    question: {
      zh: '🍰 含糖饮料和甜点的摄入频率？',
      en: '🍰 How often do you consume sugary drinks and desserts?'
    },
    options: [
      { value: 'never_rare', score: 10, text: { zh: '从不或每月1-2次', en: 'Never or 1-2x/month' } },
      { value: 'weekly_1_2', score: 7, text: { zh: '每周1-2次', en: '1-2x per week' } },
      { value: 'daily_moderate', score: 4, text: { zh: '每天适量（1份）', en: 'Daily moderate (1 serving)' } },
      { value: 'frequent', score: 1, text: { zh: '频繁摄入（每天多份）', en: 'Frequent (multiple servings/day)' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['daily_moderate', 'frequent'].includes(answer)
  },
  {
    id: 'F07',
    dimension: 'diet',
    question: {
      zh: '💧 你每天的饮水量大概多少？',
      en: '💧 How much water do you drink daily?'
    },
    options: [
      { value: 'more3L', score: 10, text: { zh: '超过3升', en: 'More than 3 liters' } },
      { value: '2_3L', score: 9, text: { zh: '2-3 升', en: '2-3 liters' } },
      { value: '1_2L', score: 6, text: { zh: '1-2 升', en: '1-2 liters' } },
      { value: 'less1L', score: 3, text: { zh: '不足 1 升', en: 'Less than 1 liter' } }
    ]
  },
  {
    id: 'F08',
    dimension: 'diet',
    question: {
      zh: '👨‍🍳 你最常用的烹饪方式是？',
      en: '👨‍🍳 What\'s your most common cooking method?'
    },
    options: [
      { value: 'steam_boil', score: 10, text: { zh: '蒸、煮、炖为主', en: 'Steaming, boiling, stewing' } },
      { value: 'mix', score: 7, text: { zh: '炒炖混合，偶尔煎炸', en: 'Mix of stir-fry/stew, occasional frying' } },
      { value: 'mostly_fry', score: 4, text: { zh: '油炸烧烤为主', en: 'Mainly frying/grilling' } },
      { value: 'processed', score: 2, text: { zh: '主要吃半成品和外卖', en: 'Mostly processed/takeout food' } }
    ]
  },
  {
    id: 'F09',
    dimension: 'diet',
    question: {
      zh: '🍽️ 你每周外食或叫外卖的次数？',
      en: '🍽️ How many times per week do you eat out or order delivery?'
    },
    options: [
      { value: 'never_rare', score: 9, text: { zh: '几乎不在外就餐', en: 'Rarely or never' } },
      { value: '1_2', score: 7, text: { zh: '1-2 次', en: '1-2 times' } },
      { value: '3_5', score: 4, text: { zh: '3-5 次', en: '3-5 times' } },
      { value: 'more7', score: 2, text: { zh: '7次以上（几乎每顿都在外面吃）', en: '7+ times (Almost all meals out)' } }
    ]
  },
  {
    id: 'F10',
    dimension: 'diet',
    question: {
      zh: '🐟 你每周吃鱼或海鲜的频率是？',
      en: '🐟 How often do you eat fish or seafood per week?'
    },
    options: [
      { value: '2plus', score: 10, text: { zh: '2次以上', en: '2+ times per week' } },
      { value: 'once', score: 8, text: { zh: '每周1次', en: 'Once per week' } },
      { value: 'monthly', score: 5, text: { zh: '每月几次', en: 'A few times per month' } },
      { value: 'rarely', score: 3, text: { zh: '很少或不吃', en: 'Rarely or never' } }
    ]
  },

  // ==================== 第三部分：运动习惯（8题）E01-E08 ====================
  {
    id: 'E01',
    dimension: 'exercise',
    question: {
      zh: '🏋️ 你每周有几天会主动进行体育锻炼？',
      en: '🏋️ How many days per week do you exercise?'
    },
    options: [
      { value: '5plus', score: 10, text: { zh: '5 天以上（健身达人）', en: '5+ days (Fitness enthusiast)' } },
      { value: '3_4', score: 8, text: { zh: '3-4 天', en: '3-4 days' } },
      { value: '1_2', score: 5, text: { zh: '1-2 天', en: '1-2 days' } },
      { value: 'never', score: 2, text: { zh: '从不主动运动', en: 'Never exercise' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => answer === 'never'
  },
  {
    id: 'E02',
    dimension: 'exercise',
    question: {
      zh: '⏱️ 每次运动持续多长时间？',
      en: '⏱️ How long does each exercise session last?'
    },
    options: [
      { value: 'more60', score: 10, text: { zh: '60 分钟以上', en: 'More than 60 min' } },
      { value: '30_60', score: 8, text: { zh: '30-60 分钟', en: '30-60 min' } },
      { value: '15_30', score: 5, text: { zh: '15-30 分钟', en: '15-30 min' } },
      { value: 'less15', score: 2, text: { zh: '不足 15 分钟', en: 'Less than 15 min' } }
    ]
  },
  {
    id: 'E03',
    dimension: 'exercise',
    question: {
      zh: '🏃 你通常进行哪些类型的运动？（可多选）',
      en: '🏃 What types of exercise do you do? (Select all that apply)'
    },
    type: 'multiple',
    scoringType: 'positive',
    options: [
      { value: 'cardio_running', score: 9, text: { zh: '跑步/游泳/骑行（有氧运动）', en: 'Running/Swimming/Cycling (Cardio)' } },
      { value: 'strength', score: 9, text: { zh: '力量训练/举重', en: 'Strength training / Weightlifting' } },
      { value: 'sports', score: 8, text: { zh: '球类运动（篮球、羽毛球等）', en: 'Sports (basketball, badminton, etc.)' } },
      { value: 'yoga_stretch', score: 8, text: { zh: '瑜伽/拉伸/太极', en: 'Yoga / Stretching / Tai Chi' } },
      { value: 'walking_only', score: 5, text: { zh: '散步/步行', en: 'Walking' } },
      { value: 'none', score: 2, text: { zh: '我不怎么运动', en: "I don't really exercise" } }
    ]
  },
  {
    id: 'E04',
    dimension: 'exercise',
    question: {
      zh: '👣 你平均每天大概走多少步？',
      en: '👣 What\'s your average daily step count?'
    },
    options: [
      { value: '15000plus', score: 10, text: { zh: '15000 步以上（活力满满）', en: '15,000+ steps (Very active)' } },
      { value: '10000_15000', score: 8, text: { zh: '10000-15000 步', en: '10,000-15,000 steps' } },
      { value: '5000_10000', score: 6, text: { zh: '5000-10000 步', en: '5,000-10,000 steps' } },
      { value: 'less5000', score: 3, text: { zh: '不足 5000 步', en: 'Under 5,000 steps' } }
    ]
  },
  {
    id: 'E05',
    dimension: 'exercise',
    question: {
      zh: '🪑 你通常连续坐着工作/娱乐的最长时间是多少？',
      en: '🪑 What\'s your longest continuous sitting time for work/entertainment?'
    },
    options: [
      { value: 'under1h', score: 10, text: { zh: '不到1小时（经常起来活动）', en: 'Under 1 hour (move frequently)' } },
      { value: '1_2h', score: 7, text: { zh: '1-2 小时', en: '1-2 hours' } },
      { value: '2_4h', score: 4, text: { zh: '2-4 小时', en: '2-4 hours' } },
      { value: 'over4h', score: 1, text: { zh: '超过4小时（重度久坐族）', en: 'Over 4 hours (Heavy sitting)' } }
    ]
  },
  {
    id: 'E06',
    dimension: 'exercise',
    question: {
      zh: '🧗 爬楼梯时，爬几层楼会让你开始气喘？',
      en: '🧗 After climbing how many flights of stairs do you start getting winded?'
    },
    options: [
      { value: '15plus', score: 10, text: { zh: '15层以上都不喘（心肺功能强）', en: '15+ floors (Excellent cardio)' } },
      { value: '10_15', score: 8, text: { zh: '10-15 层', en: '10-15 floors' } },
      { value: '5_10', score: 5, text: { zh: '5-10 层', en: '5-10 floors' } },
      { value: 'under5', score: 2, text: { zh: '不到5层就喘（需加强锻炼）', en: 'Under 5 floors (Need exercise)' } }
    ]
  },
  {
    id: 'E07',
    dimension: 'exercise',
    question: {
      zh: '📅 你保持当前的运动习惯已经多久了？',
      en: '📅 How long have you maintained your current exercise habits?'
    },
    options: [
      { value: '6months_plus', score: 10, text: { zh: '6个月以上（已养成习惯）', en: '6+ months (Habit formed)' } },
      { value: '3_6months', score: 7, text: { zh: '3-6 个月', en: '3-6 months' } },
      { value: '1_3months', score: 5, text: { zh: '1-3 个月', en: '1-3 months' } },
      { value: 'under1month', score: 3, text: { zh: '不到1个月（刚开始）', en: 'Under 1 month (Just started)' } }
    ]
  },
  {
    id: 'E08',
    dimension: 'exercise',
    question: {
      zh: '🚶 你的日常工作/生活方式以什么为主？',
      en: '🚶 What best describes your daily work/lifestyle activity level?'
    },
    options: [
      { value: 'very_active', score: 10, text: { zh: '体力劳动者/户外工作者（非常活跃）', en: 'Physical labor/Outdoor work (Very active)' } },
      { value: 'moderately_active', score: 8, text: { zh: '经常走动的工作者（教师、护士等）', en: 'Job involves regular movement' } },
      { value: 'mostly_sitting_exercise', score: 5, text: { zh: '久坐但定期运动', en: 'Mostly sedentary but exercise regularly' } },
      { value: 'sedentary_no_exercise', score: 2, text: { zh: '长期久坐且不运动', en: 'Long-term sedentary, no exercise' } }
    ]
  },

  // ==================== 第四部分：心理健康（8题）M01-M08 ====================
  {
    id: 'M01',
    dimension: 'mental',
    question: {
      zh: '😰 近一个月来，你感到压力的频率如何？',
      en: '😰 In the past month, how often have you felt stressed?'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '几乎没有', en: 'Almost never' } },
      { value: 'occasional', score: 7, text: { zh: '偶尔感到压力', en: 'Occasionally' } },
      { value: 'often', score: 4, text: { zh: '经常感到压力', en: 'Often' } },
      { value: 'always', score: 2, text: { zh: '总是处于高压状态', en: 'Always under high stress' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['often', 'always'].includes(answer)
  },
  {
    id: 'M02',
    dimension: 'mental',
    question: {
      zh: '🎯 如果你有压力，主要的来源是哪些？（可多选）',
      en: '🎯 What are your main sources of stress? (Select all that apply)'
    },
    type: 'multiple',
    options: [
      { value: 'work_study', score: 5, text: { zh: '工作或学习压力', en: 'Work or study pressure' } },
      { value: 'family', score: 5, text: { zh: '家庭关系', en: 'Family relationships' } },
      { value: 'financial', score: 6, text: { zh: '经济状况', en: 'Financial situation' } },
      { value: 'health', score: 7, text: { zh: '健康问题', en: 'Health concerns' } },
      { value: 'relationship', score: 4, text: { zh: '感情/社交', en: 'Relationship / Social' } },
      { value: 'minimal', score: 10, text: { zh: '没什么特别压力', en: 'No particular stress' } }
    ]
  },
  {
    id: 'M03',
    dimension: 'mental',
    question: {
      zh: '😟 你是否经常感到紧张不安或焦虑？',
      en: '😟 Do you often feel nervous or anxious?'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '从不', en: 'Never' } },
      { value: 'rarely', score: 7, text: { zh: '偶尔', en: 'Rarely' } },
      { value: 'sometimes', score: 5, text: { zh: '有时', en: 'Sometimes' } },
      { value: 'often_always', score: 2, text: { zh: '经常或总是', en: 'Often or always' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['sometimes', 'often_always'].includes(answer)
  },
  {
    id: 'M04',
    dimension: 'mental',
    question: {
      zh: '🧘 遇到负面情绪时，你能多快恢复过来？',
      en: '🧘 How quickly can you recover from negative emotions?'
    },
    options: [
      { value: 'quickly', score: 10, text: { zh: '很快就能调整好心态', en: 'Recover quickly' } },
      { value: 'reasonable', score: 7, text: { zh: '需要几个小时到一天', en: 'Take a few hours to a day' } },
      { value: 'slow', score: 4, text: { zh: '要好几天才能恢复', en: 'Take several days' } },
      { value: 'very_slow', score: 2, text: { zh: '很难从负面情绪中走出来', en: 'Hard to shake off negativity' } }
    ]
  },
  {
    id: 'M05',
    dimension: 'mental',
    question: {
      zh: '🤝 当遇到困难或烦恼时，有人可以倾诉吗？',
      en: '🤝 When facing difficulties, do you have someone to talk to?'
    },
    options: [
      { value: 'strong_support', score: 10, text: { zh: '总有几个知心朋友/家人可以倾诉', en: 'Always have close friends/family to confide in' } },
      { value: 'some_support', score: 7, text: { zh: '有几个可以说说话的人', en: 'Have a few people to talk to' } },
      { value: 'limited', score: 4, text: { zh: '很少有人可以倾诉', en: 'Few people to talk to' } },
      { value: 'alone', score: 2, text: { zh: '基本上只能自己扛', en: 'Basically handle it alone' } }
    ]
  },
  {
    id: 'M06',
    dimension: 'mental',
    question: {
      zh: '😊 最近两周你的整体情绪状态如何？',
      en: '😊 How has your overall mood been in the past two weeks?'
    },
    options: [
      { value: 'positive', score: 10, text: { zh: '积极向上，心情不错', en: 'Positive, feeling good' } },
      { value: 'stable', score: 7, text: { zh: '平稳正常', en: 'Stable and normal' } },
      { value: 'somewhat_low', score: 4, text: { zh: '有些低落', en: 'Somewhat down' } },
      { value: 'quite_low', score: 2, text: { zh: '情绪很低落，难以开心起来', en: 'Quite low, hard to feel happy' } }
    ]
  },
  {
    id: 'M07',
    dimension: 'mental',
    question: {
      zh: '🎨 你是否有持续投入的爱好或兴趣？',
      en: '🎨 Do you have any hobbies or interests you\'re actively engaged in?'
    },
    options: [
      { value: 'multiple', score: 10, text: { zh: '有多个爱好，经常参与', en: 'Multiple hobbies, participate often' } },
      { value: 'one_active', score: 8, text: { zh: '有一个坚持做的爱好', en: 'One hobby I stick with' } },
      { value: 'casual', score: 5, text: { zh: '有兴趣但不太常做', en: 'Have interests but rarely engage' } },
      { value: 'none', score: 2, text: { zh: '没有什么特别的爱好', en: 'No particular hobbies' } }
    ]
  },
  {
    id: 'M08',
    dimension: 'mental',
    question: {
      zh: '🌿 你平时会用什么方式放松身心？（选最常用的）',
      en: '🌿 What\'s your main way to relax?'
    },
    options: [
      { value: 'healthy_methods', score: 10, text: { zh: '运动/冥想/亲近大自然', en: 'Exercise/Meditation/Nature' } },
      { value: 'creative', score: 8, text: { zh: '阅读/音乐/艺术创作', en: 'Reading/Music/Creative arts' } },
      { value: 'social', score: 7, text: { zh: '与朋友聚会聊天', en: 'Socializing with friends' } },
      { value: 'screen_entertainment', score: 4, text: { zh: '刷手机/追剧/打游戏', en: 'Phone/Binge-watch/Gaming' } },
      { value: 'unhealthy', score: 2, text: { zh: '抽烟喝酒/暴饮暴食', en: 'Smoking/Drinking/Overeating' } }
    ]
  },

  // ==================== 第五部分：身体指标（6题）B01-B06 ====================
  {
    id: 'B01',
    dimension: 'body',
    question: {
      zh: '🎂 您的实际年龄是？',
      en: '🎂 What is your actual age?'
    },
    type: 'number',
    options: [],
    inputConfig: { min: 0, max: 120, unit: { zh: '岁', en: 'years old' }, defaultValue: 25 },
    scoringRule: (value) => {
      // 年龄本身不是评分项，而是用于计算基础寿命
      return 5 // 中性分
    }
  },
  {
    id: 'B02',
    dimension: 'body',
    question: {
      zh: '👫 您的生理性别？',
      en: '👫 What is your biological sex?'
    },
    options: [
      { value: 'male', score: 5, text: { zh: '男', en: 'Male' } },
      { value: 'female', score: 5, text: { zh: '女', en: 'Female' } },
      { value: 'prefer_not_say', score: 5, text: { zh: '不愿透露', en: 'Prefer not to say' } }
    ]
  },
  {
    id: 'B03',
    dimension: 'body',
    question: {
      zh: '📏 您的身高是多少？',
      en: '📏 What is your height?'
    },
    type: 'number',
    options: [],
    inputConfig: { min: 100, max: 250, unit: { zh: 'cm', en: 'cm' }, defaultValue: 170 }
  },
  {
    id: 'B04',
    dimension: 'body',
    question: {
      zh: '⚖️ 您的体重是多少？',
      en: '⚖️ What is your weight?'
    },
    type: 'number',
    options: [],
    inputConfig: { min: 30, max: 200, unit: { zh: 'kg', en: 'kg' }, defaultValue: 65 },
    scoringRule: (value, context) => {
      // BMI 评分将在综合计算中处理
      if (!context.height) return 5
      const bmi = value / ((context.height / 100) ** 2)
      if (bmi >= 18.5 && bmi < 24) return 10
      else if (bmi >= 24 && bmi < 28) return 6
      else if (bmi >= 17 && bmi < 30) return 4
      return 2
    }
  },
  {
    id: 'B05',
    dimension: 'body',
    question: {
      zh: '🩺 您的血压状况如何？（不知道可跳过此题）',
      en: '🩺 What\'s your blood pressure status? (Skip if unknown)'
    },
    options: [
      { value: 'normal', score: 10, text: { zh: '正常（<120/80 mmHg）', en: 'Normal (<120/80 mmHg)' } },
      { value: 'elevated', score: 7, text: { zh: '偏高（120-139/80-89）', en: 'Elevated (120-139/80-89)' } },
      { value: 'high_stage1', score: 4, text: { zh: '高血压一期（140-159/90-99）', en: 'High BP Stage 1 (140-159/90-99)' } },
      { value: 'high_stage2', score: 2, text: { zh: '高血压二期（≥160/100）', en: 'High BP Stage 2 (≥160/100)' } },
      { value: 'unknown', score: 5, text: { zh: '不清楚', en: 'Unknown' } }
    ]
  },
  {
    id: 'B06',
    dimension: 'body',
    question: {
      zh: '❤️ 安静状态下的心率大概是多少？（不知道可跳过）',
      en: '❤️ What\'s your resting heart rate? (Skip if unknown)'
    },
    options: [
      { value: 'bradycardia', score: 6, text: { zh: '< 60 bpm（运动员常见）', en: '< 60 bpm (Common in athletes)' } },
      { value: 'normal_60_80', score: 10, text: { zh: '60-80 bpm（正常）', en: '60-80 bpm (Normal)' } },
      { value: 'elevated_80_100', score: 6, text: { zh: '80-100 bpm', en: '80-100 bpm' } },
      { value: 'high_over100', score: 3, text: { zh: '> 100 bpm', en: '> 100 bpm' } },
      { value: 'unknown', score: 5, text: { zh: '不清楚', en: 'Unknown' } }
    ]
  },

  // ==================== 第六部分：生活方式与环境（6题）L01-L06 ====================
  {
    id: 'L01',
    dimension: 'lifestyle',
    question: {
      zh: '🚬 您的吸烟情况？',
      en: '🚬 What\'s your smoking status?'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '从不吸烟', en: 'Never smoked' } },
      { value: 'former', score: 7, text: { zh: '已经戒烟', en: 'Former smoker (quit)' } },
      { value: 'occasional', score: 4, text: { zh: '偶尔吸烟（社交性）', en: 'Occasional (social)' } },
      { value: 'regular_few', score: 2, text: { zh: '经常吸，每天<10支', en: 'Regular (<10 cigarettes/day)' } },
      { value: 'regular_many', score: 1, text: { zh: '烟民，每天≥10支', en: 'Regular smoker (≥10/day)' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['occasional', 'regular_few', 'regular_many'].includes(answer)
  },
  {
    id: 'L02',
    dimension: 'lifestyle',
    question: {
      zh: '🍷 您的饮酒习惯是怎样的？',
      en: '🍷 What are your drinking habits?'
    },
    options: [
      { value: 'never', score: 10, text: { zh: '滴酒不沾', en: 'Never drink' } },
      { value: 'rarely_light', score: 8, text: { zh: '偶尔少量饮酒（每月<4次，每次<2杯）', en: 'Rarely light drinking' } },
      { value: 'moderate', score: 6, text: { zh: '适度饮酒（每周1-3次）', en: 'Moderate (1-3x/week)' } },
      { value: 'frequent_heavy', score: 2, text: { zh: '频繁或大量饮酒（几乎每天或每次>3杯）', en: 'Frequent/heavy drinking' } }
    ],
    branchTrigger: true,
    branchCondition: (answer) => ['frequent_heavy'].includes(answer)
  },
  {
    id: 'L03',
    dimension: 'lifestyle',
    question: {
      zh: '🌆 你居住的城市空气质量大致怎样？',
      en: '🌆 How is the air quality in the city where you live?'
    },
    options: [
      { value: 'excellent', score: 10, text: { zh: '优秀（蓝天白云是常态）', en: 'Excellent (Clear skies most days)' } },
      { value: 'good', score: 8, text: { zh: '良好', en: 'Good' } },
      { value: 'moderate', score: 5, text: { zh: '一般（偶有雾霾）', en: 'Moderate (Occasional smog)' } },
      { value: 'poor', score: 3, text: { zh: '较差（雾霾较常见）', en: 'Poor (Frequent smog/pollution)' } },
      { value: 'dont_know', score: 6, text: { zh: '不太清楚', en: 'Not sure' } }
    ]
  },
  {
    id: 'L04',
    dimension: 'lifestyle',
    question: {
      zh: '💼 你的工作环境中是否存在以下风险因素？（可多选）',
      en: '💼 Are there risk factors in your work environment? (Select all that apply)'
    },
    type: 'multiple',
    options: [
      { value: 'none', score: 10, text: { zh: '无明显风险因素', en: 'No significant risks' } },
      { value: 'sedentary', score: 6, text: { zh: '长期久坐', en: 'Long-term sedentary work' } },
      { value: 'pressure', score: 5, text: { zh: '高强度精神压力', en: 'High mental pressure' } },
      { value: 'radiation_chemical', score: 4, text: { zh: '辐射或化学暴露', en: 'Radiation or chemical exposure' } },
      { value: 'noise', score: 5, text: { zh: '持续噪音环境', en: 'Persistent noise' } },
      { value: 'heavy_labor', score: 3, text: { zh: '高强度体力劳动', en: 'Heavy physical labor' } }
    ]
  },
  {
    id: 'L05',
    dimension: 'lifestyle',
    question: {
      zh: '📋 你每年会进行全面体检吗？',
      en: '📋 Do you get an annual comprehensive health checkup?'
    },
    options: [
      { value: 'annual', score: 10, text: { zh: '每年都做全面体检', en: 'Yes, annual comprehensive checkup' } },
      { value: 'biennial', score: 7, text: { zh: '隔年做一次', en: 'Every other year' } },
      { value: 'occasional', score: 4, text: { zh: '偶尔做，不固定', en: 'Occasionally, irregular' } },
      { value: 'never', score: 2, text: { zh: '从未做过全面体检', en: 'Never had one' } }
    ]
  },
  {
    id: 'L06',
    dimension: 'lifestyle',
    question: {
      zh: '🧬 直系亲属中是否有以下健康情况？（可多选）',
      en: '🧬 Any of these health conditions among your immediate family? (Select all that apply)'
    },
    type: 'multiple',
    options: [
      { value: 'none_known', score: 10, text: { zh: '没有已知的重大疾病史', en: 'No known major diseases' } },
      { value: 'cardiovascular', score: 4, text: { zh: '有心血管疾病史', en: 'Cardiovascular disease history' } },
      { value: 'cancer', score: 3, text: { zh: '有癌症病史', en: 'Cancer history' } },
      { value: 'diabetes', score: 4, text: { zh: '有糖尿病史', en: 'Diabetes history' } },
      { value: 'early_death', score: 2, text: { zh: '有直系亲属早逝（<60岁）', en: 'Early death of immediate family (<60)' } },
      { value: 'uncertain', score: 6, text: { zh: '不确定/不太了解', en: 'Not sure / Don\'t know' } }
    ]
  },
  {
    id: 'L07',
    dimension: 'lifestyle',
    question: {
      zh: '🤝 你的社交连接情况如何？',
      en: '🤝 How is your social connectedness?'
    },
    options: [
      { value: 'rich', score: 10, text: { zh: '经常与家人朋友聚会，有紧密的社交圈', en: 'Frequent gatherings with family/friends, tight social circle' } },
      { value: 'moderate', score: 7, text: { zh: '每周会和朋友或家人联系，但不太频繁', en: 'Weekly contact with friends/family, but not very often' } },
      { value: 'limited', score: 4, text: { zh: '偶尔联系，大部分时间独处', en: 'Occasional contact, mostly alone' } },
      { value: 'isolated', score: 2, text: { zh: '基本没有社交活动，长期独处', en: 'Almost no social activity, long-term isolation' } }
    ]
  }
]

// 获取维度顺序（供 Suggestions.vue 等组件使用）
export function getOrderedDimensions() {
  return ['sleep', 'diet', 'exercise', 'mental', 'body', 'lifestyle']
}

