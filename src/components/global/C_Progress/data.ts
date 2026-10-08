import { computed, watch, onMounted, nextTick, getCurrentInstance } from 'vue'
import { useTheme } from '@/composables/useTheme'

/**
 * @description C_Progress 进度条 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 进度百分比 0-100 */
  percent: 0,
  /** 是否显示文字 */
  showText: true,
  /** 进度条高度 rpx */
  strokeHeight: 16,
  /** 颜色 */
  color: '',
  /** 轨道颜色 */
  trackColor: 'var(--r-bg-hover)',
  /** 是否开启过渡动画 */
  animated: true,
  /** 状态 */
  status: 'normal',
  /** 是否圆形 */
  circle: false,
  /** 圆形尺寸 rpx */
  circleSize: 240,
  /** 圆形线宽 rpx */
  circleStrokeWidth: 12,
}

/** 状态颜色映射 */
export const STATUS_COLORS = {
  normal: 'var(--r-color-primary, #2b6bff)',
  success: 'var(--r-color-success, #34c759)',
  warning: 'var(--r-color-warning, #ff9f0a)',
  error: 'var(--r-color-error, #ff4d4f)',
}

interface ProgressProps {
  percent: number
  color: string
  status: string
  circle: boolean
  circleSize: number
  circleStrokeWidth: number
  trackColor: string
}

/** 进度值和画布绘制；画布 API 只接收解析后的颜色和实际布局尺寸。 */
export function useProgress(props: ProgressProps) {
  const instance = getCurrentInstance()
  const { effectiveTheme } = useTheme()
  const canvasId = `progress_${instance?.uid ?? Date.now()}`
  const clampedPercent = computed(() =>
    Number.isFinite(props.percent)
      ? Math.min(100, Math.max(0, props.percent))
      : 0
  )
  const activeColor = computed(
    () => props.color || STATUS_COLORS[props.status] || STATUS_COLORS.normal
  )

  /** CSS 变量在画布 API 中不会解析，H5 读取令牌，全端提供主题兜底。 */
  function resolveColor(color: string, fallback: string) {
    if (!color.startsWith('var(')) return color
    // #ifdef H5
    const element = instance?.proxy?.$el as HTMLElement | undefined
    const token = color.match(/--[\w-]+/)?.[0]
    if (element && token) {
      const value = window
        .getComputedStyle(element)
        .getPropertyValue(token)
        .trim()
      if (value) return value
    }
    // #endif
    return fallback
  }

  /** 获取布局尺寸，桌面 CSS 缩放后的视觉尺寸不用于画布坐标。 */
  function getCanvasSize() {
    let size = uni.upx2px(props.circleSize)
    // #ifdef H5
    const element = instance?.proxy?.$el as HTMLElement | undefined
    if (element?.offsetWidth) size = element.offsetWidth
    // #endif
    return size
  }

  /** 等待切换到圆形后的画布挂载，再绘制。 */
  async function drawCircle() {
    if (!props.circle) return
    await nextTick()
    const size = getCanvasSize()
    if (size <= 0) return
    const lineWidth = Math.min(
      size / 2,
      Math.max(
        1,
        (props.circleStrokeWidth / Math.max(1, props.circleSize)) * size
      )
    )
    const radius = (size - lineWidth) / 2
    const center = size / 2
    const ctx = uni.createCanvasContext(canvasId, instance?.proxy ?? undefined)
    const dark = effectiveTheme.value === 'dark'
    const palette = dark
      ? {
          normal: '#0a84ff',
          success: '#30d158',
          warning: '#ff9f0a',
          error: '#ff453a',
        }
      : {
          normal: '#3563e9',
          success: '#16a380',
          warning: '#d78a1c',
          error: '#e15464',
        }
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, 2 * Math.PI)
    ctx.setStrokeStyle(
      resolveColor(props.trackColor, dark ? '#2a2a2e' : '#edf1fa')
    )
    ctx.setLineWidth(lineWidth)
    ctx.setLineCap('round')
    ctx.stroke()
    if (clampedPercent.value > 0) {
      const startAngle = -Math.PI / 2
      ctx.beginPath()
      ctx.arc(
        center,
        center,
        radius,
        startAngle,
        startAngle + (clampedPercent.value / 100) * 2 * Math.PI
      )
      ctx.setStrokeStyle(
        resolveColor(activeColor.value, palette[props.status] || palette.normal)
      )
      ctx.stroke()
    }
    ctx.draw()
  }

  watch(
    () => [
      props.percent,
      props.status,
      props.color,
      props.circle,
      props.circleSize,
      props.circleStrokeWidth,
      props.trackColor,
      effectiveTheme.value,
    ],
    drawCircle,
    { flush: 'post' }
  )
  onMounted(drawCircle)
  return { canvasId, clampedPercent, activeColor }
}
