<template>
  <div class="fixed inset-0 pointer-events-none z-[9999]" ref="confettiContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const emit = defineEmits(['complete'])
const confettiContainer = ref(null)

onMounted(() => {
  // 基础庆祝效果
  const duration = 3000
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#FFD700', '#F44336', '#9C27B0']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#FFD700', '#F44336', '#9C27B0']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    } else {
      emit('complete')
    }
  })()

  // 中间大爆炸
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#FFD700']
    })
  }, 500)
})
</script>
