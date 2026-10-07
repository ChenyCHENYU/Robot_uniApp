import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark' | 'system'
type Language = 'zh-CN' | 'en'

/** 通知/安全偏好（持久化） */
export interface Preferences {
  biometric: boolean
  push: boolean
  systemNotify: boolean
  sound: boolean
}

interface SettingsState {
  theme: ThemeMode
  language: Language
  fontSize: number
  compactMode: boolean
  preferences: Preferences
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14,
    compactMode: false,
    preferences: {
      biometric: false,
      push: true,
      systemNotify: true,
      sound: true,
    },
  }),

  getters: {
    isDark: state => state.theme === 'dark',
    fontSizeLabel: state =>
      ({ 12: '小', 14: '标准', 16: '大', 18: '特大' } as Record<
        number,
        string
      >)[state.fontSize] || '标准',
    languageLabel: state => (state.language === 'zh-CN' ? '简体中文' : 'English'),
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
    setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
      this.preferences[key] = value
    },
  },

  persist: {
    key: 'settings-store',
    paths: ['theme', 'language', 'fontSize', 'compactMode', 'preferences'],
  },
})
