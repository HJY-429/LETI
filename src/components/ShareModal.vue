<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
      
      <!-- 弹窗内容 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto
                    animate-scale-up">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">{{ t('share.title') }}</h3>
          <button 
            @click="$emit('close')" 
            class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <!-- 内容区 -->
        <div class="p-5 space-y-4">
          <!-- 海报预览区域 -->
          <div id="share-poster-area" ref="posterArea" class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 text-center">
            <p class="text-sm text-primary mb-2">🧬 {{ isZh ? '生命长度预测' : 'Life Expectancy Predictor' }}</p>
            <div v-if="resultData" class="space-y-3">
              <div class="text-2xl md:text-3xl font-bold" :style="{ color: resultData.lifeType?.color }">
                {{ resultData.lifeType?.emoji }} {{ lifeTypeName }}
              </div>
              <div class="flex justify-center gap-4 text-sm">
                <div class="bg-white/80 rounded-lg px-4 py-2 shadow-sm">
                  <div class="text-xs text-gray-500">{{ t('result.predictedAge') }}</div>
                  <div class="text-xl font-bold text-primary">{{ resultData.predictedAge }} {{ t('result.yearsUnit') }}</div>
                </div>
                <div class="bg-white/80 rounded-lg px-4 py-2 shadow-sm">
                  <div class="text-xs text-gray-500">{{ t('result.idealAge') }}</div>
                  <div class="text-xl font-bold text-secondary">{{ resultData.idealAge }} {{ t('result.yearsUnit') }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                ▲ {{ t('result.potentialGain', { years: resultData.potentialGain }) }}
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-3">{{ t('share.disclaimer') }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="grid grid-cols-1 gap-3">
            <button 
              @click="downloadPoster" 
              class="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl
                     font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              📷 {{ t('share.downloadImage') }}
            </button>
            
            <button 
              @click="copyLink" 
              class="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl
                     font-medium hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              🔗 {{ copied ? t('share.copied') : t('share.link') }}
            </button>
            
            <button 
              @click="copyText" 
              class="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl
                     font-medium hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-2"
            >
              📝 {{ isZh ? '复制分享文案' : 'Copy Share Text' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateSharePoster, copyToClipboard, generateShareText } from '../composables/useShare.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  resultData: { type: Object, default: null }
})

const emit = defineEmits(['close'])
const { locale, t } = useI18n()
const posterArea = ref(null)
const copied = ref(false)

const isZh = computed(() => locale.value === 'zh-CN')
const lifeTypeName = computed(() => {
  if (!props.resultData?.lifeType) return ''
  const name = props.resultData.lifeType.name
  return isZh.value ? (name.zh || name.en) : (name.en || name.zh)
})

async function downloadPoster() {
  if (posterArea.value) {
    await generateSharePoster(posterArea.value)
  }
}

async function copyLink() {
  const url = window.location.href
  const success = await copyToClipboard(url)
  if (success) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

async function copyText() {
  if (!props.resultData) return
  const text = generateShareText(props.resultData)
  const success = await copyToClipboard(text)
  if (success) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
