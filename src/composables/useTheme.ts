/**
 * 主题切换 composable — 亮色 / 暗色 / 跟随系统
 *
 * - 选择持久化到 settings-store（theme: light | dark | system）
 * - system 模式监听 uni.onThemeChange 实时跟随
 * - 输出 themeClass（'theme-dark' | ''）供 C_Layout 根节点绑定，
 *   CSS 变量向整页子树级联；H5 端同步 html[data-theme] 覆盖页面级背景
 *
 * 初始化：App.vue onLaunch 调用 initTheme()（含系统主题监听注册）
 */
import { ref, computed, watchEffect } from 'vue'
import { useSettingsStore } from '@/stores/modules/settings'

export type ThemeMode = 'light' | 'dark' | 'system'

/** 系统当前主题（uni.onThemeChange 维护） */
const systemTheme = ref<'light' | 'dark'>('light')
let listenerReady = false

/** 注册系统主题监听（幂等） */
function ensureSystemListener() {
  if (listenerReady) return
  listenerReady = true

  // 初始值
  try {
    const info = uni.getSystemInfoSync()
    if (info.theme === 'dark' || info.theme === 'light') {
      systemTheme.value = info.theme
    }
  } catch {
    // 忽略：部分端不支持
  }

  uni.onThemeChange?.(res => {
    if (res.theme === 'dark' || res.theme === 'light') {
      systemTheme.value = res.theme
    }
  })
}

/** 初始化主题（App onLaunch 调用一次） */
export function initTheme() {
  ensureSystemListener()
}

/**
 * wot-design-uni 主题变量（官方 themeVars API）
 * 将本项目品牌 token 注入组件库（值引用 var()，随主题切换自动解析）
 */
const WOT_THEME_VARS = {
  colorTheme: 'var(--r-color-primary)',
  colorSuccess: 'var(--r-color-success)',
  colorWarning: 'var(--r-color-warning)',
  colorDanger: 'var(--r-color-error)',
  colorTitle: 'var(--r-text-primary)',
  colorContent: 'var(--r-text-regular)',
  colorSecondary: 'var(--r-text-secondary)',
}

/** 主题 composable */
export function useTheme() {
  const settingsStore = useSettingsStore()

  /** 用户选择的主题模式 */
  const themeMode = computed<ThemeMode>(() => settingsStore.theme)

  /** 实际生效主题（system 时解析系统值） */
  const effectiveTheme = computed<'light' | 'dark'>(() =>
    themeMode.value === 'system' ? systemTheme.value : themeMode.value
  )

  /** 绑定到 C_Layout 根节点的类名 */
  const themeClass = computed(() =>
    effectiveTheme.value === 'dark' ? 'theme-dark' : ''
  )

  /** H5：同步 html[data-theme]（覆盖 :root 层变量与 body 背景） */
  watchEffect(() => {
    // #ifdef H5
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.dataset.theme = effectiveTheme.value
    }
    // #endif
  })

  /** 切换主题模式（持久化） */
  const setThemeMode = (mode: ThemeMode) => {
    settingsStore.setTheme(mode)
  }

  /** wot-design-uni 组件库主题（官方 ConfigProvider theme 值） */
  const wotTheme = computed<'light' | 'dark'>(() => effectiveTheme.value)

  /** wot-design-uni 主题变量（品牌 token 注入） */
  const wotThemeVars = WOT_THEME_VARS

  /** 当前模式文案 */
  const themeModeLabel = computed(
    () =>
      (
        ({
          light: '浅色',
          dark: '深色',
          system: '跟随系统',
        }) as Record<ThemeMode, string>
      )[themeMode.value]
  )

  return {
    themeMode,
    effectiveTheme,
    themeClass,
    themeModeLabel,
    wotTheme,
    wotThemeVars,
    setThemeMode,
  }
}
