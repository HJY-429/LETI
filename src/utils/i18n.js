import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'

const savedLang = localStorage.getItem('life_indicator_lang') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
