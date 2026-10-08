import { ref } from 'vue'

export function useGuideData() {
  const current = ref(0)

  interface GuideStep {
    icon: string
    title: string
    desc: string
    gradient: string
    ringColor: string
  }

  const steps = ref<GuideStep[]>([
    {
      icon: 'mdi-devices',
      title: '跨平台开发',
      desc: '一套代码，同时运行在 H5、小程序、App 多个平台，大幅降低开发成本',
      gradient: 'var(--r-color-primary-soft)',
      ringColor: 'var(--r-color-primary-soft)',
    },
    {
      icon: 'mdi-view-grid-outline',
      title: '丰富组件',
      desc: '内置33+高质量UI组件，覆盖表单、列表、导航等常见场景，开箱即用',
      gradient: 'var(--r-color-primary-soft)',
      ringColor: 'var(--r-color-primary-soft)',
    },
    {
      icon: 'mdi-flash-outline',
      title: '极致性能',
      desc: '虚拟滚动、图片懒加载、骨架屏预渲染，为用户带来流畅的使用体验',
      gradient: 'var(--r-color-primary-soft)',
      ringColor: 'var(--r-color-primary-soft)',
    },
    {
      icon: 'mdi-shield-check-outline',
      title: '企业级架构',
      desc: '完善的权限管理、状态管理、请求拦截，满足企业级应用开发需求',
      gradient: 'var(--r-color-primary-soft)',
      ringColor: 'var(--r-color-primary-soft)',
    },
  ])

  const onSwiperChange = (e: { detail: { current: number } }) => {
    current.value = e.detail.current
  }

  const handleNext = () => {
    if (current.value < steps.value.length - 1) {
      current.value++
    }
  }

  const handleSkip = () => {
    finishGuide()
  }

  const handleStart = () => {
    finishGuide()
  }

  const finishGuide = () => {
    uni.setStorageSync('guide_completed', true)
    uni.reLaunch({ url: '/pages/login/index' })
  }

  return { current, steps, onSwiperChange, handleNext, handleSkip, handleStart }
}
