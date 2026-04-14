<template>
  <div id="app" class="min-h-screen">
    <!-- 语言切换器 -->
    <LanguageSwitcher />
    
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    
    <!-- Confetti 特效组件 -->
    <Confetti v-if="showConfetti" @complete="showConfetti = false" />
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import Confetti from './components/Confetti.vue'

const showConfetti = ref(false)

// 提供全局 confetti 触发方法
provide('triggerConfetti', () => {
  showConfetti.value = true
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
.slide-left-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
