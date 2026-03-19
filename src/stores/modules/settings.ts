import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark' | 'system'
type Language = 'zh-CN' | 'en'

interface SettingsState {
  theme: ThemeMode
  language: Language
  fontSize: number
  compactMode: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14,
    compactMode: false,
  }),

  getters: {
    isDark: state => state.theme === 'dark',
  },

  actions: {
    setTheme(mode: ThemeMode) {
      this.theme = mode
    },
    setLanguage(lang: Language) {
      this.language = lang
    },
    setFontSize(size: number) {
      this.fontSize = size
    },
    toggleCompact() {
      this.compactMode = !this.compactMode
    },
  },

  persist: {
    key: 'settings-store',
    paths: ['theme', 'language', 'fontSize', 'compactMode'],
  },
})
