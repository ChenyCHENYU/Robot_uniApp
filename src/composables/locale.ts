/**
 * 语言切换 composable — 简体/繁体中文动态转换（opencc-js 懒加载）
 *
 * - 繁体转换器按需 import，不影响初始包体积
 * - t() 依赖 currentLang 响应式状态，在模板中自动刷新
 * - 语言选择持久化到 settings-store
 */
import { ref, computed, shallowRef } from 'vue'
import { useSettingsStore } from '@/stores/modules/settings'

export type Language = 'zh-CN' | 'zh-TW'

const currentLang = ref<Language>('zh-CN')
const converter = shallowRef<((text: string) => string) | null>(null)
let converterLoading = false

/** 是否启用简繁转换（VITE_FEATURE_TW，默认关闭：字典约 1.1MB） */
export const traditionalChineseEnabled: boolean =
  import.meta.env.VITE_FEATURE_TW === 'true'

/** 懒加载简→繁转换器（功能关闭时动态 import 可被构建期摇树移除） */
async function loadConverter() {
  // 直接比较 import.meta.env 常量，确保构建器能静态折叠
  if (import.meta.env.VITE_FEATURE_TW !== 'true') return
  if (converter.value || converterLoading) return
  converterLoading = true
  try {
    const { Converter } = await import('opencc-js/cn2t')
    converter.value = Converter({ from: 'cn', to: 'tw' })
  } finally {
    converterLoading = false
  }
}

/** 初始化（App onLaunch 调用一次，从 settings-store 恢复语言） */
export function initLocale() {
  const settingsStore = useSettingsStore()
  currentLang.value = settingsStore.language === 'zh-TW' ? 'zh-TW' : 'zh-CN'
  if (currentLang.value === 'zh-TW') {
    loadConverter()
  }
}

/** 切换语言（同步 settings-store 持久化） */
export async function setLanguage(lang: Language) {
  currentLang.value = lang
  const settingsStore = useSettingsStore()
  settingsStore.setLanguage(lang)
  if (lang === 'zh-TW') {
    await loadConverter()
  }
}

/** 翻译入口：繁体模式下实时转换，简体模式原样返回 */
export function t(text: string): string {
  if (currentLang.value !== 'zh-TW' || !converter.value) return text
  try {
    return converter.value(text)
  } catch {
    return text
  }
}

/** 响应式当前语言 */
export const currentLocale = computed(() => currentLang.value)

/** locale composable（组件内使用） */
export function useLocale() {
  return {
    currentLocale,
    setLanguage,
    t,
  }
}
