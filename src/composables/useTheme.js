/**
 * useTheme - 主题切换 (深色模式)
 *
 * @example
 * const { isDark, toggleTheme, setTheme } = useTheme()
 */
import { ref, watchEffect, onMounted } from "vue";
import { STORAGE_KEYS } from "@/constants";

export function useTheme() {
  // 'light' | 'dark' | 'auto'
  const theme = ref("auto");
  const isDark = ref(false);

  const applyTheme = (dark) => {
    isDark.value = dark;
    // #ifdef H5
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    // #endif
  };

  const matchMedia = () => {
    // #ifdef H5
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    // #endif
    return false;
  };

  const updateTheme = () => {
    if (theme.value === "auto") {
      applyTheme(matchMedia());
    } else {
      applyTheme(theme.value === "dark");
    }
  };

  const setTheme = (mode) => {
    theme.value = mode;
    uni.setStorageSync(STORAGE_KEYS.THEME, mode);
    updateTheme();
  };

  const toggleTheme = () => {
    const next = isDark.value ? "light" : "dark";
    setTheme(next);
  };

  onMounted(() => {
    const saved = uni.getStorageSync(STORAGE_KEYS.THEME);
    if (saved) {
      theme.value = saved;
    }
    updateTheme();

    // 监听系统主题变化
    // #ifdef H5
    if (typeof window !== "undefined" && window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          if (theme.value === "auto") updateTheme();
        });
    }
    // #endif
  });

  return { theme, isDark, setTheme, toggleTheme };
}
