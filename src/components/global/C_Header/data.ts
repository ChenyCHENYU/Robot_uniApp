import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// Props定义
export const headerProps = {
  defaultAvatar: { type: String, default: '/static/robot-avatar.png' },
  defaultNickname: { type: String, default: 'CHENY' },
  showStatus: { type: Boolean, default: true },
  showBack: { type: Boolean, default: false },
  isCompactMode: { type: Boolean, default: false },
  title: { type: String, default: '' },
  notificationCount: { type: Number, default: 0 },
  theme: { type: String, default: 'default' },
  iconSize: { type: [Number, String], default: 20 },
  enableAnimations: { type: Boolean, default: true },
}

// 事件定义
export const headerEmits = [
  'userClick',
  'notificationClick',
  'settingsClick',
  'statusClick',
  'backClick',
]

// 配置数据
const statusConfig = {
  online: { text: '在线', color: '#00e676', class: 'status-online' },
  offline: { text: '离线', color: '#9e9e9e', class: 'status-offline' },
  busy: { text: '忙碌中', color: '#ff9800', class: 'status-busy' },
  away: { text: '离开', color: '#ffc107', class: 'status-away' },
}

const greetingTimeRanges = [
  { text: '深夜好', range: [0, 6] },
  { text: '上午好', range: [6, 12] },
  { text: '下午好', range: [12, 18] },
  { text: '晚上好', range: [18, 24] },
]

// 主Hook函数
/**
 *
 */
export function useHeaderData(props, emit) {
  const userStore = useUserStore()
  const aiStatus = ref('online')
  const avatarError = ref(false)

  // 计算属性
  const userInfo = computed(() => userStore.userInfo || {})

  const safeAreaTop = computed(() => {
    try {
      const systemInfo = uni.getSystemInfoSync()
      return systemInfo.safeAreaInsets?.top || systemInfo.statusBarHeight || 44
    } catch {
      return 44
    }
  })

  const avatarSrc = computed(() => {
    if (avatarError.value) return props.defaultAvatar

    const userAvatar = userInfo.value?.avatar
    if (
      !userAvatar ||
      userAvatar === '/static/default-avatar.png' ||
      userAvatar.includes('undefined') ||
      userAvatar.includes('null')
    ) {
      return props.defaultAvatar
    }
    return userAvatar
  })

  const displayNickname = computed(() => {
    return (
      userInfo.value?.nickname || userInfo.value?.name || props.defaultNickname
    )
  })

  const greeting = computed(() => {
    const hour = new Date().getHours()
    for (const config of greetingTimeRanges) {
      const [start, end] = config.range
      if (
        (start <= end && hour >= start && hour < end) ||
        (start > end && (hour >= start || hour < end))
      ) {
        return config.text
      }
    }
    return '你好'
  })

  const currentStatus = computed(
    () => statusConfig[aiStatus.value] || statusConfig.online
  )
  const statusClass = computed(() => currentStatus.value.class)
  const statusText = computed(() => currentStatus.value.text)

  // 事件处理
  const handleUserClick = () =>
    emit('userClick', {
      userInfo: userInfo.value,
      greeting: greeting.value,
      displayName: displayNickname.value,
    })

  const handleNotification = () =>
    emit('notificationClick', {
      count: props.notificationCount,
      timestamp: Date.now(),
    })

  const handleSettings = () =>
    emit('settingsClick', {
      currentTheme: props.theme,
      timestamp: Date.now(),
    })

  const handleStatusClick = () =>
    emit('statusClick', {
      status: aiStatus.value,
      statusText: statusText.value,
      statusColor: currentStatus.value.color,
    })

  const handleBack = () =>
    emit('backClick', {
      timestamp: Date.now(),
      title: props.title,
    })

  const handleAvatarError = () => {
    avatarError.value = true
  }

  // 公共方法
  const setAiStatus = status => {
    if (statusConfig[status]) {
      aiStatus.value = status
    }
  }

  const resetAvatarError = () => {
    avatarError.value = false
  }

  return {
    // 响应式数据
    aiStatus,
    avatarError,

    // 计算属性
    userInfo,
    safeAreaTop,
    avatarSrc,
    displayNickname,
    greeting,
    statusClass,
    statusText,

    // 方法
    handleUserClick,
    handleNotification,
    handleSettings,
    handleStatusClick,
    handleBack,
    handleAvatarError,
    setAiStatus,
    resetAvatarError,
  }
}
