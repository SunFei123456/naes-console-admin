import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'

// i18n 初始化：中文为默认语言，英文为回退
const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
const lng = saved || 'zh'

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en }
  },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
