<template>
  <view
    class="c-layout"
    :class="[layoutClasses, themeClass]"
  >
    <!-- Header区域 -->
    <C_Header
      v-if="showHeader"
      ref="headerRef"
      v-bind="headerConfig"
      :notification-count="realNotificationCount"
      @user-click="emit('userClick', $event)"
      @notification-click="handleNotificationClick"
      @settings-click="handleSettingsClick"
      @status-click="emit('statusClick', $event)"
      @back-click="handleBackClick"
    />

    <!-- 页面内容区域 -->
    <view
      class="c-layout__content"
      :style="contentStyles"
    >
      <slot />
    </view>

    <!-- Tabbar区域 -->
    <C_Tabbar
      v-if="showTabbar"
      ref="tabbarRef"
      v-model="currentTabIndex"
      v-bind="tabbarConfig"
      @change="handleTabChange"
    />

    <!-- 环境角标（非生产环境显示） -->
    <C_EnvironmentBadge />

    <!-- 全局Loading -->
    <view
      v-if="globalLoading"
      class="c-layout__loading"
    >
      <wd-loading
        :size="60"
        color="var(--r-color-primary, #007AFF)"
      />
      <text class="c-layout__loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
  import { onShow, onUnload } from '@dcloudio/uni-app'
  import {
    useSmartLayout,
    layoutProps,
    layoutEmits,
    tabbarConfig,
    getCurrentTabIndex,
  } from './data'
  import { useMessageStore } from '@/stores/modules/message'
  import { useTheme } from '@/composables/useTheme'
  import http from '@/utils/http'
  import C_Header from '../C_Header/index.vue'
  import C_Tabbar from '../C_Tabbar/index.vue'
  import C_EnvironmentBadge from '../C_EnvironmentBadge/index.vue'

  const props = defineProps(layoutProps)
  const emit = defineEmits(layoutEmits)

  // 全局未读消息数（优先使用 store，允许 prop 覆盖）
  const messageStore = useMessageStore()
  const { themeClass } = useTheme()
  const realNotificationCount = computed(() =>
    props.notificationCount > 0
      ? props.notificationCount
      : messageStore.totalUnread
  )

  const headerRef = ref()
  const tabbarRef = ref()

  const {
    isNavigating,
    currentTabIndex,
    currentPath,
    layoutType,
    showHeader,
    showTabbar,
    headerConfig,
    layoutClasses,
    contentStyles,
    canGoBack,
    getCurrentPath,
    getPageInfo,
  } = useSmartLayout(props)

  // 页面路径监听
  watch(
    () => currentPath.value,
    newPath => {
      // 更新Tab索引
      if (showTabbar.value) {
        const activeIndex = getCurrentTabIndex(newPath)
        if (activeIndex !== -1) {
          currentTabIndex.value = activeIndex
        }
      }
      emit('layoutChange', getPageInfo())
    },
    { immediate: true }
  )

  // 同步 tabbar 消息角标
  const syncMessageBadge = () => {
    const msgTab = tabbarConfig.tabList.find(t => t.id === 'message')
    if (msgTab) msgTab.badge = messageStore.totalUnread
  }

  // 页面再次显示时重新同步 tab 索引（修复缓存页面 tab 高亮不一致）
  onShow(() => {
    if (showTabbar.value) {
      const path = getCurrentPath()
      const activeIndex = getCurrentTabIndex(path)
      if (activeIndex !== -1 && currentTabIndex.value !== activeIndex) {
        currentTabIndex.value = activeIndex
      }
    }
    // 同步消息 tabbar 角标
    syncMessageBadge()
  })

  // 页面卸载：取消该页面所有在飞请求，避免 setData 浪费与内存泄漏
  onUnload(() => {
    const path = getCurrentPath()
    if (path) http.cancelPageRequests(path)
  })

  // H5 端组件卸载兜底（部分场景 onUnload 不触发）
  onUnmounted(() => {
    const path = getCurrentPath()
    if (path) http.cancelPageRequests(path)
  })

  // 监听未读数变化，实时同步 tabbar badge
  watch(() => messageStore.totalUnread, syncMessageBadge, { immediate: true })

  // 返回首页兜底策略
  const navigateToHome = () => {
    const firstTab = tabbarConfig.tabList?.[0]
    if (firstTab) {
      uni.switchTab({ url: firstTab.path })
    } else {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }

  // 通知按钮处理 - 默认跳转消息中心（tab页需用switchTab）
  const handleNotificationClick = data => {
    emit('notificationClick', data)
    uni.switchTab({ url: '/pages/message/index' })
  }

  // 设置按钮处理 - 默认跳转个人设置
  const handleSettingsClick = () => {
    emit('settingsClick')
    uni.navigateTo({ url: '/pages/settings/index' })
  }

  // 智能返回处理
  const handleBackClick = () => {
    emit('backClick')

    if (props.backBehavior === 'custom') return
    if (props.backBehavior === 'none') return

    const pages = getCurrentPages()
    const hasPageStack = pages.length > 1

    // 正常返回
    if (hasPageStack) {
      uni.navigateBack({
        delta: props.backDelta,
        success: () =>
          emit('backSuccess', {
            delta: props.backDelta,
            fromPath: currentPath.value,
          }),
        fail: () => navigateToHome(),
      })
    } else {
      // 页面栈只有1层时，兜底跳转首页
      navigateToHome()
    }
  }

  // Tab切换处理
  const handleTabChange = data => {
    const { item, index } = data

    currentTabIndex.value = index

    if (item.path === currentPath.value) {
      emit('tabChange', data)
      return
    }

    if (isNavigating.value) return

    isNavigating.value = true

    uni.switchTab({
      url: item.path,
      success: () => {
        emit('tabChange', {
          ...data,
          fromPath: currentPath.value,
          toPath: item.path,
        })
      },
      fail: () => {
        // switchTab失败时降级使用reLaunch
        uni.reLaunch({ url: item.path })
      },
      complete: () => {
        nextTick(() =>
          setTimeout(() => {
            isNavigating.value = false
          }, 300)
        )
      },
    })
  }

  // 公共API
  const setHeaderStatus = status => headerRef.value?.setAiStatus?.(status)
  const setHeaderTheme = theme => headerRef.value?.setTheme?.(theme)
  const goBack = () => handleBackClick()
  const refreshPage = () => uni.reLaunch({ url: getPageInfo().path })

  const setTabBadge = (tabId, count) => {
    const tab = tabbarConfig.tabList.find(item => item.id === tabId)
    if (tab) {
      tab.badge = count
      tabbarRef.value?.updateBadge?.(tabId, count)
    }
  }

  const clearAllBadges = () => {
    tabbarConfig.tabList.forEach(tab => {
      tab.badge = 0
    })
    tabbarRef.value?.clearAllBadges?.()
  }

  // 组件生命周期
  onMounted(() => {
    if (showTabbar.value) {
      const activeIndex = getCurrentTabIndex(currentPath.value)
      if (activeIndex !== -1) {
        currentTabIndex.value = activeIndex
      }
    }
    emit('layoutChange', { ...getPageInfo(), mounted: true })
  })

  // 对外暴露API
  defineExpose({
    setHeaderStatus,
    setHeaderTheme,
    goBack,
    canGoBack,
    refreshPage,
    setTabBadge,
    clearAllBadges,
    getPageInfo,
    getCurrentPath,
    getLayoutType: () => layoutType.value,
    headerRef,
    tabbarRef,
    isNavigating: () => isNavigating.value,
    getCurrentTabIndex: () => currentTabIndex.value,
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
