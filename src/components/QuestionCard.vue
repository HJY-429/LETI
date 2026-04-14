<template>
  <div class="question-card animate-scale-up">
    <!-- 题目头部 -->
    <div class="mb-6">
      <!-- 维度标签 -->
      <div class="flex items-center justify-between mb-4">
        <span class="dimension-badge" :class="`dimension-badge-${question.dimension}`">
          {{ dimensionEmoji }} {{ dimensionName }}
        </span>
        <span class="text-sm text-gray-400">
          <template v-if="isFollowupIndex">
            F{{ currentIndex }}/{{ totalQuestions }}
          </template>
          <template v-else>
            {{ currentIndex }} / {{ totalQuestions }}
          </template>
        </span>
      </div>
      
      <!-- 问题文本 -->
      <h2 class="text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
        {{ questionText }}
      </h2>
    </div>
    
    <!-- 选项列表 -->
    <div class="space-y-3">
      <!-- 选择题 -->
      <template v-if="question.type !== 'number'">
        <!-- 多选题 -->
        <template v-if="question.type === 'multiple'">
          <button
            v-for="(option, index) in question.options"
            :key="option.value"
            @click="toggleMultipleOption(option.value)"
            class="answer-btn group w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                   hover:shadow-md active:scale-[0.98] flex items-center gap-3"
            :class="(multipleValues || []).includes(option.value)
              ? 'selected border-primary bg-green-50 shadow-md ring-2 ring-primary/20'
              : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-gray-50'"
          >
            <!-- 多选复选框 -->
            <span 
              class="flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold
                     transition-all duration-200"
              :class="(multipleValues || []).includes(option.value)
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-transparent border-gray-300 group-hover:border-gray-400'"
            >
              ✓
            </span>
            
            <span class="flex-1 text-base" :class="(multipleValues || []).includes(option.value) ? 'text-gray-800 font-medium' : 'text-gray-600'">
              {{ optionText(option) }}
            </span>
          </button>
        </template>

        <!-- 单选题 -->
        <template v-else>
        <button
          v-for="(option, index) in question.options"
          :key="option.value"
          @click="selectOption(option.value)"
          class="answer-btn group w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                 hover:shadow-md active:scale-[0.98] flex items-center gap-3"
          :class="[
            modelValue === option.value 
              ? 'selected border-primary bg-green-50 shadow-md ring-2 ring-primary/20' 
              : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          <!-- 选项标识 -->
          <span 
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                   transition-all duration-200"
            :class="modelValue === option.value
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'"
          >
            {{ String.fromCharCode(65 + index) }}
          </span>
          
          <!-- 选项文本 -->
          <span class="flex-1 text-base" :class="modelValue === option.value ? 'text-gray-800 font-medium' : 'text-gray-600'">
            {{ optionText(option) }}
          </span>
          
          <!-- 已选标记 -->
          <span v-if="modelValue === option.value" class="text-primary text-xl flex-shrink-0">✓</span>
        </button>
        </template>
      </template>

      <!-- 数字输入题 -->
      <div v-else class="space-y-4">
        <div class="relative">
          <input
            ref="numberInput"
            type="text"
            inputmode="decimal"
            :min="inputConfig.min"
            :max="inputConfig.max"
            v-model="numericValue"
            @input="handleNumericInput"
            @blur="handleNumericBlur"
            @keydown.enter="$emit('enter-pressed')"
            class="w-full px-6 py-5 text-center text-2xl md:text-3xl font-bold text-gray-800
                   border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 
                   focus:ring-primary/20 outline-none transition-all duration-200
                   [type=number]::-webkit-inner-spin-button,
                   [type=number]::-webkit-outer-spin-button {
                     -webkit-appearance: none;
                     margin: 0;
                   }"
            :placeholder="'请输入...'"
          />
          <span class="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-gray-400">
            {{ unitLabel }}
          </span>
        </div>
        
        <!-- 快捷选择 -->
        <div class="flex flex-wrap gap-2 justify-center mt-3">
          <button
            v-for="quick in quickOptions"
            :key="quick"
            @click="selectQuickValue(quick)"
            class="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 
                   hover:border-primary hover:text-primary hover:bg-green-50 transition-colors"
          >
            {{ quick }}{{ inputConfig.unit?.zh || '' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 提示信息 -->
    <div v-if="tipText && showTip" class="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <p class="text-sm text-blue-700 flex items-start gap-2">
        <span>💡</span>
        <span>{{ tipText }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { DIMENSION_INFO } from '../data/questions.js'

const props = defineProps({
  question: { type: Object, required: true },
  modelValue: { type: [String, Number], default: null },
  currentIndex: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 48 },
  isFollowup: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const { locale, t } = useI18n()
const numberInput = ref(null)
const numericValue = ref('')
const showTip = ref(true)

// 多选题选中的值数组
const multipleValues = computed(() => {
  const val = props.modelValue
  if (Array.isArray(val)) return val
  if (typeof val === 'string' && val.length > 0) return val.split(',')
  return []
})

function toggleMultipleOption(value) {
  let current = [...multipleValues.value]
  // 互斥逻辑："无/不晚睡/都吃早餐" 类选项与普通选项不能同时选中
  const isExclusiveOption = (val) => ['none', 'none_known', 'minimal', 'no_late_night', 'always_eat'].includes(val)
  
  if (isExclusiveOption(value)) {
    // 选择了"无"类选项，清空其他，只保留这个
    if (current.includes(value)) {
      current = [] // 取消选择 → 全空
    } else {
      current = [value] // 选择"无" → 清空其他
    }
  } else {
    // 选择普通选项时，移除"无"类选项
    if (current.includes(value)) {
      current = current.filter(v => v !== value)
    } else {
      current = current.filter(v => !isExclusiveOption(v))
      current.push(value)
    }
  }
  
  emit('update:modelValue', current.length > 0 ? current.join(',') : null)
}

const isZh = computed(() => locale.value === 'zh-CN')
const isFollowupIndex = computed(() => props.isFollowup)

// 维度信息
const dimensionInfo = computed(() => DIMENSION_INFO[props.question.dimension] || {})
const dimensionEmoji = computed(() => dimensionInfo.value.icon || '')
const dimensionName = computed(() => {
  return isZh.value ? (dimensionInfo.value.name || '') : props.question.dimension.charAt(0).toUpperCase() + props.question.dimension.slice(1)
})

// 问题文本
const questionText = computed(() => {
  const q = props.question.question
  return isZh.value ? (q.zh || q.en) : (q.en || q.zh)
})

// 选项文本
function optionText(option) {
  const t = option.text
  return isZh.value ? (t.zh || t.en) : (t.en || t.zh)
}

// 提示文本
const tipText = computed(() => {
  const tip = props.question.tip
  if (!tip) return ''
  return isZh.value ? (tip.zh || tip.en) : (tip.en || tip.zh)
})

// 数字输入配置
const inputConfig = computed(() => props.question.inputConfig || { min: 0, max: 100, unit: {} })
const unitLabel = computed(() => {
  const unit = inputConfig.value.unit || {}
  return isZh.value ? (unit.zh || '') : (unit.en || '')
})
const quickOptions = computed(() => {
  const config = inputConfig.value
  if (!config.quickValues) {
    // 根据题目类型生成快捷选项
    if (props.question.id === 'B01') return [20, 25, 30, 40, 50, 60]
    if (props.question.id === 'B03') return [155, 165, 175, 185, 195]
    if (props.question.id === 'B04') return [45, 55, 65, 75, 85, 95]
    return []
  }
  return config.quickValues
})

// 选择选项
function selectOption(value) {
  emit('update:modelValue', value)
}

// 选择快捷数值
function selectQuickValue(quick) {
  numericValue.value = quick
  emit('update:modelValue', quick)
  console.log('[QuestionCard] Quick value selected:', quick)
}

// 处理数字输入（实时：只校验格式，不钳制范围）
function handleNumericInput() {
  let val = numericValue.value
  
  console.log('[QuestionCard] Numeric input raw:', JSON.stringify(val))
  
  if (val === '') {
    emit('update:modelValue', null)
    return
  }
  
  // 只保留数字、小数点、负号（防止粘贴非法字符）
  const cleaned = val.replace(/[^0-9.\-]/g, '')
  if (cleaned !== val) {
    val = cleaned
    numericValue.value = val
  }
  
  // 实时预览值：不钳制，只让用户自由输入
  // 发出原始字符串值或解析后的数值（用于即时反馈但不强制提交）
  const parsed = parseFloat(val)
  if (!isNaN(parsed)) {
    emit('update:modelValue', parsed)
  }
}

// 失焦时验证并钳制范围（最终确认值）
function handleNumericBlur() {
  let val = parseFloat(numericValue.value)
  
  console.log('[QuestionCard] Blur - raw:', numericValue.value, 'parsed:', val)
  
  if (isNaN(val) || numericValue.value === '' || numericValue.value === null) {
    numericValue.value = ''
    emit('update:modelValue', null)
    return
  }
  
  // 钳制到合法范围
  val = Math.max(inputConfig.value.min, Math.min(inputConfig.value.max, val))
  numericValue.value = val
  emit('update:modelValue', val)
}

// 监听外部值变化（用于恢复答案）
watch(() => props.modelValue, (newVal) => {
  if (props.question.type === 'number' && newVal !== numericValue.value) {
    numericValue.value = newVal || ''
  }
}, { immediate: true })

// 聚焦数字输入框
watch(() => props.question, async () => {
  if (props.question.type === 'number') {
    await nextTick()
    numberInput.value?.focus()
    showTip.value = true
  } else {
    showTip.value = true
  }
})
</script>
