<template>
  <div class="w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { useI18n } from 'vue-i18n'

// 注册 Chart.js 组件
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  config: { type: Object, required: true }
})

const canvasRef = ref(null)
let chartInstance = null

const { locale } = useI18n()

function createChart() {
  if (!canvasRef.value || !props.config) return
  
  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // 创建新图表
  const ctx = canvasRef.value.getContext('2d')
  
  // 深拷贝配置避免引用问题
  const config = JSON.parse(JSON.stringify(props.config))
  
  // 更新语言相关文本
  if (config.data?.datasets) {
    config.data.datasets.forEach(dataset => {
      if (locale.value === 'en-US') {
        if (dataset.label === '你的得分') dataset.label = 'Your Score'
        else if (dataset.label === '平均水平 (60)') dataset.label = 'Average (60)'
      }
      if (locale.value === 'zh-CN') {
        if (dataset.label === 'Your Score') dataset.label = '你的得分'
        else if (dataset.label === 'Average (60)') dataset.label = '平均水平 (60)'
      }
      
      // tooltip 回调
      if (!config.options?.plugins?.tooltip?.callbacks?.label) {
        if (!config.options.plugins) config.options.plugins = {}
        if (!config.options.plugins.tooltip) config.options.plugins.tooltip = {}
        if (!config.options.plugins.tooltip.callbacks) config.options.plugins.tooltip.callbacks = {}
        
        config.options.plugins.tooltip.callbacks.label = function(context) {
          return `${context.dataset.label}: ${context.raw} 分`
        }
      }
    })
  }

  chartInstance = new Chart(ctx, config)
}

// 监听配置变化
watch(() => props.config, () => {
  createChart()
}, { deep: true })

onMounted(createChart)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
