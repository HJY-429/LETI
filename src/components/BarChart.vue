<template>
  <div class="w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  config: { type: Object, required: true }
})

const canvasRef = ref(null)
let chartInstance = null

function createChart() {
  if (!canvasRef.value || !props.config) return
  
  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = canvasRef.value.getContext('2d')
  
  // 深拷贝配置
  const config = JSON.parse(JSON.stringify(props.config))
  
  chartInstance = new Chart(ctx, config)
}

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
