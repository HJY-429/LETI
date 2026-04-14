<template>
  <div class="fixed top-4 right-4 z-50">
    <button
      @click="toggleLang"
      class="flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full 
             shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium
             border border-gray-100 hover:border-primary/30"
      :title="currentLang === 'zh-CN' ? 'Switch to English' : '切换到中文'"
    >
      <span v-if="currentLang === 'zh-CN'" class="text-base">🇺🇸</span>
      <span v-else class="text-base">🇨🇳</span>
      <span class="hidden sm:inline">{{ currentLang === 'zh-CN' ? 'EN' : '中文' }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLang = computed(() => locale.value)

function toggleLang() {
  const newLang = currentLang.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = newLang
  localStorage.setItem('life_indicator_lang', newLang)
}
</script>
