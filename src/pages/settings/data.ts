import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'
import { useSettingsStore } from '@/stores/modules/settings'
import { updateUser, uploadAvatar } from '@/api'
import { setLanguage, t, traditionalChineseEnabled } from '@/composables/locale'
import { maskPhone } from '@/utils/format'
import { useTheme } from '@/composables/useTheme'

/** 页面状态、加载与交互。 */
export function useSettingsPage() {
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()

  // 偏好设置（持久化到 settings-store）
  const { preferences } = storeToRefs(settingsStore)

  // 用户信息
  const avatarError = ref(false)
  const updatingAvatar = ref(false)
  const userAvatar = computed(() => userStore.avatar)
  const hasCustomAvatar = computed(
    () => !avatarError.value && !userAvatar.value.endsWith('default-avatar.png')
  )
  const handleAvatarError = () => {
    avatarError.value = true
  }
  const nickname = computed(() => userStore.nickname)
  const userInitial = computed(() => (nickname.value || '用户').slice(0, 1))
  watch(userAvatar, () => {
    avatarError.value = false
  })
  const bioStorageKey = `profile-bio:${userStore.userInfo?.id || 'guest'}`
  const bio = ref(String(uni.getStorageSync(bioStorageKey) || ''))
  const maskedPhone = computed(() =>
    userStore.userInfo?.phone ? maskPhone(userStore.userInfo.phone) : '未绑定'
  )

  // 外观（来自 settingsStore）
  const fontSizeLabel = computed(() => settingsStore.fontSizeLabel)
  const languageLabel = computed(() => settingsStore.languageLabel)

  // 外观模式（浅色/深色/跟随系统）
  const { themeModeLabel, setThemeMode } = useTheme()
  const handleThemeSelect = () => {
    uni.showActionSheet({
      itemList: ['跟随系统', '浅色', '深色'],
      success: ({ tapIndex }) => {
        setThemeMode((['system', 'light', 'dark'] as const)[tapIndex])
        uni.showToast({
          title: `已切换：${themeModeLabel.value}`,
          icon: 'none',
        })
      },
    })
  }

  // 字号循环：小 → 标准 → 大 → 特大
  const cycleFontSize = () => {
    const sizes = [12, 14, 16, 18]
    const next =
      sizes[(sizes.indexOf(settingsStore.fontSize) + 1) % sizes.length]
    settingsStore.setFontSize(next)
    uni.showToast({
      title: `字号：${settingsStore.fontSizeLabel}`,
      icon: 'none',
    })
  }

  // 语言切换（简/繁，opencc-js 实时转换；繁体需 VITE_FEATURE_TW=true）
  const handleLanguageSelect = () => {
    if (!traditionalChineseEnabled) {
      uni.showToast({
        title: '当前应用仅提供简体中文',
        icon: 'none',
      })
      return
    }
    uni.showActionSheet({
      itemList: ['简体中文', '繁體中文'],
      success: async ({ tapIndex }) => {
        await setLanguage(tapIndex === 1 ? 'zh-TW' : 'zh-CN')
        uni.showToast({ title: t('语言已切换'), icon: 'none' })
      },
    })
  }

  // 事件处理
  const handleChangeAvatar = () => {
    if (updatingAvatar.value) return
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async result => {
        const path = result.tempFilePaths[0]
        if (!path || updatingAvatar.value) return
        updatingAvatar.value = true
        try {
          const uploaded = await uploadAvatar(path)
          if (!uploaded.url) {
            uni.showToast({ title: '头像上传失败，请重试', icon: 'none' })
            return
          }
          const updated = await updateUser({ avatar: uploaded.url })
          if (updated) userStore.userInfo = updated
          avatarError.value = false
          uni.showToast({ title: '头像已更新', icon: 'success' })
        } catch {
          /* 请求层已提示，保留旧头像。 */
        } finally {
          updatingAvatar.value = false
        }
      },
    })
  }

  const handleEditNickname = () => {
    uni.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      content: nickname.value,
      success: async ({ confirm, content }) => {
        const next = content?.trim()
        if (!confirm || !next) return
        try {
          // 同步到服务端与本地 store
          await updateUser({ nickname: next })
          if (userStore.userInfo) {
            userStore.userInfo.nickname = next
          }
          uni.showToast({ title: '昵称已更新', icon: 'success' })
        } catch {
          // http 层已提示
        }
      },
    })
  }

  const handleEditBio = () => {
    uni.showModal({
      title: '修改签名',
      editable: true,
      placeholderText: '一句话介绍自己',
      content: bio.value,
      success: ({ confirm, content }) => {
        if (confirm) {
          bio.value = content?.trim() || ''
          uni.setStorageSync(bioStorageKey, bio.value)
          uni.showToast({ title: '签名已更新', icon: 'success' })
        }
      },
    })
  }

  const handleEditPhone = () => {
    uni.showModal({
      title: '手机号管理',
      content: '手机号变更需要身份验证，当前请联系管理员办理。',
      showCancel: false,
    })
  }

  const handleChangePassword = () => {
    uni.navigateTo({ url: '/pages/settings/change-password/index' })
  }

  return {
    preferences,
    updatingAvatar,
    userAvatar,
    hasCustomAvatar,
    userInitial,
    handleAvatarError,
    nickname,
    bio,
    maskedPhone,
    fontSizeLabel,
    languageLabel,
    themeModeLabel,
    handleThemeSelect,
    cycleFontSize,
    handleLanguageSelect,
    handleChangeAvatar,
    handleEditNickname,
    handleEditBio,
    handleEditPhone,
    handleChangePassword,
  }
}
