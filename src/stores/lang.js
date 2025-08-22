import { create } from 'zustand'
import i18n from '../i18n'

// 语言状态：zh/en，使用 localStorage 持久化
export const useLangStore = create((set) => ({
  lang: (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'zh',
  setLang: (l) => {
    set({ lang: l })
    try { localStorage.setItem('lang', l) } catch {}
    i18n.changeLanguage(l)
  }
}))
