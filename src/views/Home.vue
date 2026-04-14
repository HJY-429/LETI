<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-lg">
      <!-- 主卡片 -->
      <div class="result-card p-8 md:p-12 text-center animate-fade-in">
        <!-- Logo 和标题 -->
        <div class="mb-8">
          <div class="text-6xl mb-4 animate-bounce-gentle">🧬</div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {{ t('home.title') }}
          </h1>
          <p class="text-base text-gray-500 leading-relaxed max-w-md mx-auto">
            {{ t('home.subtitle') }}
          </p>
        </div>

        <!-- 特性列表 -->
        <div class="space-y-3 mb-8 text-left">
          <div v-for="(feature, key) in features" :key="key"
               class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-green-50/50 transition-colors">
            <span class="text-lg flex-shrink-0">{{ getEmoji(key) }}</span>
            <span class="text-sm text-gray-600 leading-relaxed">{{ feature }}</span>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="flex justify-center gap-6 mb-8 text-sm text-gray-500">
          <span>{{ t('home.duration') }}</span>
          <span>{{ t('home.questions') }}</span>
        </div>

        <!-- 开始按钮 -->
        <button
          @click="startTest"
          class="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 group"
        >
          <span>{{ t('home.startButton') }}</span>
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <!-- 底部提示 -->
        <p class="mt-5 text-xs text-gray-400">
          * {{ t('welcome.disclaimer') }}
        </p>

        <!-- 开发者/用户模式切换 -->
        <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-3">
          <span class="text-xs text-gray-400">{{ isZh ? '模式' : 'Mode' }}:</span>
          <button
            @click="appStore.toggleMode()"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
            :class="appStore.mode === 'developer'
              ? 'bg-gray-900 text-green-400 ring-2 ring-green-500/30'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <span v-if="appStore.mode === 'developer'">👨‍💻</span>
            <span v-else>👤</span>
            {{ appStore.mode === 'developer'
               ? (isZh ? '开发者模式' : 'Developer')
               : (isZh ? '用户模式' : 'User') }}
          </button>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="flex justify-center gap-2 mt-6 opacity-40">
        <span class="text-xs">Powered by</span>
        <span class="text-xs font-medium">HJY</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz.js'
import { useAppStore } from '../stores/app.js'

const router = useRouter()
const { locale, t } = useI18n()
const quizStore = useQuizStore()
const appStore = useAppStore()

const isZh = computed(() => locale.value === 'zh-CN')

// 同步 store 的 isDeveloper
const syncIsDev = () => { appStore.isDeveloper = appStore.mode === 'developer' }
syncIsDev()

const features = computed(() => ({
  f2: t('home.features.f2'),
  f3: t('home.features.f3'),
  f4: t('home.features.f4')
}))

function getEmoji(key) {
  const map = { f1: '🔬', f2: '🧠', f3: '📊', f4: '💡' }
  return map[key] || '✨'
}

function startTest() {
  router.push('/quiz')
}
</script>
