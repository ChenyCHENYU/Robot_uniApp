<!-- 登出期间使用应用唯一的加载层，避免与 HTTP 或页面 loading 重复叠加。 -->
<template><slot /></template>

<script setup lang="ts">
  import { useFeedbackLoading } from '@/utils/feedback'
  const props = withDefaults(
    defineProps<{ visible?: boolean; text?: string }>(),
    {
      visible: false,
      text: '正在退出登录...',
    }
  )
  useFeedbackLoading(
    () => props.visible,
    () => props.text
  )
</script>
