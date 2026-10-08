import { ref, computed, getCurrentInstance } from 'vue'

/**
 * C_FloatButton - 悬浮按钮组件数据逻辑
 */

export const defaultProps = {
  icon: 'add',
  position: 'right-bottom', // right-bottom / left-bottom
  bottom: 160,
  right: 32,
  left: 32,
  size: 112, // rpx
}

interface FloatButtonProps {
  position: string
  bottom: number
  right: number
  left: number
  size: number
  draggable: boolean
}

/** C_FloatButton 交互状态，每次组件挂载独立创建。 */
export function useFloatButton(
  props: FloatButtonProps,
  emit: (event: 'click', ...args: unknown[]) => void
) {
  const dragging = ref(false)
  const offsetX = ref(0)
  const offsetY = ref(0)
  let startX = 0
  let startY = 0
  let touchStartX = 0
  let touchStartY = 0
  let suppressClick = false
  let scale = 1
  let bounds = {
    minX: -Infinity,
    maxX: Infinity,
    minY: -Infinity,
    maxY: Infinity,
  }
  const instance = getCurrentInstance()

  const btnStyle = computed(() => {
    const style: Record<string, string> = {
      width: `${props.size}rpx`,
      height: `${props.size}rpx`,
      bottom: `calc(${props.bottom}rpx + env(safe-area-inset-bottom))`,
      // 拖拽偏移统一用 transform（px 与触摸事件单位一致）
      transform: `translate(${offsetX.value}px, ${offsetY.value}px)`,
    }
    if (props.position === 'left-bottom') {
      style.left = `${props.left}rpx`
    } else {
      style.right = `${props.right}rpx`
    }
    return style
  })

  const onTouchStart = (e: TouchEvent) => {
    if (!props.draggable) return
    const touch = e.touches[0]
    if (!touch) return
    suppressClick = false
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    measureBounds()
    startX = touch.clientX / scale - offsetX.value
    startY = touch.clientY / scale - offsetY.value
    dragging.value = true
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!props.draggable || !dragging.value) return
    const touch = e.touches[0]
    if (!touch) return
    if (
      Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY) > 6
    )
      suppressClick = true
    offsetX.value = Math.min(
      bounds.maxX,
      Math.max(bounds.minX, touch.clientX / scale - startX)
    )
    offsetY.value = Math.min(
      bounds.maxY,
      Math.max(bounds.minY, touch.clientY / scale - startY)
    )
  }

  const onClick = () => {
    if (suppressClick) {
      suppressClick = false
      return
    }
    emit('click')
  }

  /** H5 按实际机身布局限制拖动范围，CSS 缩放后的触摸坐标还原为布局像素。 */
  function measureNativeBounds() {
    const info = uni.getSystemInfoSync()
    const unit = info.windowWidth / 750
    const sizePx = props.size * unit
    const leftPx =
      props.position === 'left-bottom'
        ? props.left * unit
        : info.windowWidth - props.right * unit - sizePx
    const topPx =
      info.windowHeight -
      props.bottom * unit -
      sizePx -
      (info.safeAreaInsets?.bottom || 0)
    bounds = {
      minX: 8 - leftPx,
      maxX: info.windowWidth - 8 - leftPx - sizePx,
      minY: 8 + (info.statusBarHeight || 0) - topPx,
      maxY: info.windowHeight - 8 - topPx - sizePx,
    }
    scale = 1
  }

  /** 从当前 DOM 读取机身几何数据，仅 H5 使用。 */
  function measureFrameBounds() {
    // #ifdef H5
    const element = instance?.proxy?.$el as HTMLElement | undefined
    if (!element?.getBoundingClientRect) return
    const rect = element.getBoundingClientRect()
    const frame = element.closest('uni-page-body') as HTMLElement | null
    const desktop = window.innerWidth >= 600 ? frame : null
    const area = desktop
      ? desktop.getBoundingClientRect()
      : {
          left: 0,
          top: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          width: window.innerWidth,
        }
    scale =
      desktop && desktop.offsetWidth ? area.width / desktop.offsetWidth : 1
    const margin = 8 * scale
    const base = {
      left: rect.left - offsetX.value * scale,
      right: rect.right - offsetX.value * scale,
      top: rect.top - offsetY.value * scale,
      bottom: rect.bottom - offsetY.value * scale,
    }
    const tabbar = getEdge(frame, '.c-tabbar', 'top', area.bottom)
    const header = getEdge(frame, '.c-header', 'bottom', area.top)
    bounds = {
      minX: (area.left + margin - base.left) / scale,
      maxX: (area.right - margin - base.right) / scale,
      minY: (header + margin - base.top) / scale,
      maxY: (tabbar - margin - base.bottom) / scale,
    }
    // #endif
  }

  /** 读取已存在的导航边界，避免拖到栏位下方。 */
  function getEdge(
    frame: HTMLElement | null,
    selector: string,
    edge: 'top' | 'bottom',
    fallback: number
  ) {
    const rect = frame?.querySelector(selector)?.getBoundingClientRect()
    return rect ? rect[edge] : fallback
  }

  /** 真机先使用系统尺寸，H5 再覆盖为布局机身尺寸。 */
  function measureBounds() {
    measureNativeBounds()
    measureFrameBounds()
  }

  const onTouchEnd = () => {
    dragging.value = false
  }
  return { dragging, btnStyle, onClick, onTouchStart, onTouchMove, onTouchEnd }
}
