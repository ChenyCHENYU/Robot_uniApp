import { ref, onMounted, getCurrentInstance } from 'vue'

/**
 * C_Signature - 电子签名组件数据逻辑
 */

export const defaultProps = {
  /** 画笔颜色 */
  penColor: '#000000',
  /** 画笔粗细 */
  lineWidth: 3,
  /** 画布背景色 */
  bgColor: '#ffffff',
  /** 画布高度(rpx) */
  height: 400,
  /** 是否显示底部操作栏 */
  showFooter: true,
  /** 导出图片类型 */
  exportType: 'png',
  /** 占位提示文字 */
  placeholder: '请在此处签名',
}

interface SignatureProps {
  penColor: string
  lineWidth: number
  bgColor: string
  exportType: string
}

/** C_Signature 交互状态，每次组件挂载独立创建。 */
export function useSignature(
  props: SignatureProps,
  emit: (event: 'confirm' | 'clear', ...args: unknown[]) => void
) {
  const instance = getCurrentInstance()
  const canvasId = `signature-${instance?.uid ?? Date.now()}`
  const isEmpty = ref(true)

  let mouseDrawing = false
  let ctx: UniApp.CanvasContext | null = null
  let paths: { x: number; y: number }[][] = []
  let currentPath: { x: number; y: number }[] = []

  onMounted(() => {
    ctx = uni.createCanvasContext(canvasId, instance?.proxy)
    _initCanvas()
  })

  /** 初始化画布 */
  function _initCanvas(afterDraw?: () => void) {
    if (!ctx) return
    ctx.setFillStyle(props.bgColor)
    ctx.fillRect(0, 0, 9999, 9999)
    ctx.setStrokeStyle(props.penColor)
    ctx.setLineWidth(props.lineWidth)
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    ctx.draw(false, afterDraw)
  }

  /** 触摸开始 */
  function onTouchStart(e) {
    if (!ctx) return
    const point = getPoint(e)
    if (!point) return
    const { x, y } = point
    currentPath = [{ x, y }]
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  /** 触摸移动 */
  function onTouchMove(e) {
    if (!ctx) return
    const point = getPoint(e)
    if (!point || !currentPath.length) return
    const { x, y } = point
    currentPath.push({ x, y })
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.draw(true)
    ctx.moveTo(x, y)
  }

  /** 触摸结束 */
  function onTouchEnd() {
    if (currentPath.length) {
      if (currentPath.length === 1 && ctx) {
        const point = currentPath[0]
        ctx.lineTo(point.x + 0.1, point.y + 0.1)
        ctx.stroke()
        ctx.draw(true)
      }
      paths.push([...currentPath])
      isEmpty.value = false
    }
    currentPath = []
  }

  /** 清除画布 */
  function clear() {
    paths = []
    currentPath = []
    isEmpty.value = true
    _initCanvas()
    emit('clear')
  }

  /** 撤销上一笔 */
  function undo() {
    if (paths.length === 0) return
    paths.pop()
    _redraw()
    if (paths.length === 0) isEmpty.value = true
  }

  /** 重绘所有笔画 */
  function _redraw() {
    _initCanvas(() => {
      if (!ctx) return
      paths.forEach(path => {
        ctx!.beginPath()
        ctx!.moveTo(path[0].x, path[0].y)
        path.forEach((point, i) => {
          if (i > 0) ctx!.lineTo(point.x, point.y)
        })
        if (path.length === 1) ctx!.lineTo(path[0].x + 0.1, path[0].y + 0.1)
        ctx!.stroke()
      })
      ctx!.draw(true)
    })
  }

  /** 确认签名 → 导出图片 */
  function confirm() {
    if (isEmpty.value) {
      uni.showToast({ title: '请先签名', icon: 'none' })
      return
    }

    uni.canvasToTempFilePath(
      {
        canvasId,
        fileType: props.exportType,
        success: res => {
          emit('confirm', res.tempFilePath)
        },
        fail: () => {
          uni.showToast({ title: '导出失败', icon: 'none' })
        },
      },
      instance?.proxy
    )
  }

  /** 读取原生触摸坐标。 */
  function getTouchPoint(e) {
    const touch = e.touches?.[0]
    if (!touch) return null
    return Number.isFinite(touch.x) && Number.isFinite(touch.y)
      ? { x: touch.x, y: touch.y }
      : null
  }

  /** 触摸和鼠标事件的屏幕坐标。 */
  function getClientPoint(e) {
    const touch = e.touches?.[0]
    return touch
      ? { x: touch.clientX, y: touch.clientY }
      : { x: e.clientX, y: e.clientY }
  }

  /** 桌面机身缩放后，将屏幕坐标还原为画布布局坐标。 */
  function getWebPoint(e) {
    // #ifdef H5
    const wrapper = instance?.proxy?.$el as HTMLElement | undefined
    const canvas = wrapper?.querySelector(
      '.c-signature__canvas'
    ) as HTMLElement | null
    const point = getClientPoint(e)
    if (!canvas || !Number.isFinite(point.x) || !Number.isFinite(point.y))
      return null
    const rect = canvas.getBoundingClientRect()
    const scale = canvas.offsetWidth ? rect.width / canvas.offsetWidth : 1
    return { x: (point.x - rect.left) / scale, y: (point.y - rect.top) / scale }
    // #endif
    // #ifndef H5
    return null
    // #endif
  }

  /** H5 先还原缩放，其他端使用 canvas 原生触摸坐标。 */
  function getPoint(e) {
    return getWebPoint(e) || getTouchPoint(e)
  }

  const onMouseDown = e => {
    mouseDrawing = true
    onTouchStart(e)
  }
  const onMouseMove = e => {
    if (mouseDrawing) onTouchMove(e)
  }
  const onMouseUp = () => {
    if (mouseDrawing) onTouchEnd()
    mouseDrawing = false
  }

  return {
    canvasId,
    isEmpty,
    clear,
    undo,
    confirm,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }
}
