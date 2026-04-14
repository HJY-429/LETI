<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="result-card p-8 md:p-10 text-center animate-fade-in">
        <!-- 欢迎图标 -->
        <div class="text-5xl mb-6 animate-bounce-gentle">👋</div>
        
        <!-- 标题 -->
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {{ t('welcome.title') }}
        </h1>
        
        <p class="text-gray-500 mb-8">{{ t('welcome.subtitle') }}</p>

        <!-- 语言选择 -->
        <div class="space-y-3 mb-8">
          <button
            @click="selectLang('zh-CN')"
            class="w-full p-4 rounded-xl border-2 transition-all duration-200
                   hover:border-primary hover:bg-green-50 flex items-center justify-center gap-3"
            :class="locale === 'zh-CN' ? 'border-primary bg-green-50 shadow-md' : 'border-gray-200'"
          >
            <span class="text-2xl">🇨🇳</span>
            <span class="font-medium" :class="locale === 'zh-CN' ? 'text-primary' : 'text-gray-700'">
              {{ t('welcome.langZh') }}
            </span>
          </button>
          
          <button
            @click="selectLang('en-US')"
            class="w-full p-4 rounded-xl border-2 transition-all duration-200
                   hover:border-primary hover:bg-green-50 flex items-center justify-center gap-3"
            :class="locale === 'en-US' ? 'border-primary bg-green-50 shadow-md' : 'border-gray-200'"
          >
            <span class="text-2xl">🇺🇸</span>
            <span class="font-medium" :class="locale === 'en-US' ? 'text-primary' : 'text-gray-700'">
              {{ t('welcome.langEn') }}
            </span>
          </button>
        </div>

        <!-- 提示 -->
        <p class="text-sm text-gray-400 mb-6">{{ t('welcome.hint') }}</p>

        <!-- 继续按钮 -->
        <button
          @click="goToQuiz"
          class="btn-primary w-full py-4 text-lg"
        >
          {{ t('welcome.continue') }}
        </button>

        <!-- 免责声明 -->
        <p class="mt-5 text-xs text-gray-400 leading-relaxed">
          {{ t('welcome.disclaimer') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { locale, t } = useI18n()

function selectLang(lang) {
  locale.value = lang
  localStorage.setItem('life_indicator_lang', lang)
}

function goToQuiz() {
  router.push('/quiz')
}
</script>
