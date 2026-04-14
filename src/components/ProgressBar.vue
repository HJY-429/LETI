<template>
  <div class="w-full">
    <!-- 进度条 -->
    <div class="progress-bar mb-2">
      <div
        class="progress-bar-fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    
    <!-- 进度信息 -->
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span v-if="showDimension" class="flex items-center gap-1">
        <span>{{ dimensionEmoji }}</span>
        <span>{{ dimensionName }}</span>
      </span>
      <span v-else></span>
      
      <span class="font-medium" :class="progressColor">
        {{ progress }}%
      </span>
      
      <span>
        {{ current + 1 }} / {{ total }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DIMENSION_INFO, questions } from '../data/questions.js'

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 48 },
  progress: { type: Number, default: 0 },
  showDimension: { type: Boolean, default: true }
})

const { locale } = useI18n()

// 获取当前题目所在维度
const currentQuestion = computed(() => questions[props.current])
const currentDimension = computed(() => {
  if (!currentQuestion.value) return 'sleep'
  return currentQuestion.value.dimension
})

const dimensionInfo = computed(() => DIMENSION_INFO[currentDimension.value] || {})
const dimensionEmoji = computed(() => dimensionInfo.value.icon || '')
const dimensionName = computed(() => {
  const isZh = locale.value === 'zh-CN'
  return isZh ? (dimensionInfo.value.name || '') : (currentDimension.value.charAt(0).toUpperCase() + currentDimension.value.slice(1))
})

const progressColor = computed(() => {
  if (props.progress >= 80) return 'text-green-600'
  if (props.progress >= 50) return 'text-blue-600'
  return 'text-orange-500'
})
</script>
