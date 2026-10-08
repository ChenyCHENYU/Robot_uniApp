/** C_Icon 的尺寸、名称规范化与渲染状态。 */
import { computed, ref, watch, type CSSProperties } from 'vue'

export type IconType = 'unocss' | 'wot' | 'svg' | 'image' | 'custom'

export interface IconProps {
  type?: IconType
  name?: string
  size?: string | number
  color?: string
  bold?: boolean
  label?: string
  customPrefix?: string
  customStyle?: CSSProperties
}

export const defaultIconProps = {
  type: 'unocss' as IconType,
  size: 24,
  color: 'var(--r-text-primary)',
}

/** 接受 Iconify 的冒号名称与现有短横线名称，统一为可提取的 UnoCSS 类。 */
export function normalizeIconName(name: string) {
  const value = name.trim()
  const match = value.match(
    /^(?:i-)?(fluent-color|fluent|solar|mdi|ion)[:-]([a-z0-9]+(?:-[a-z0-9]+)*)$/
  )
  return match ? `i-${match[1]}-${match[2]}` : value
}

/** 数字与数字字符串统一为 px；rpx、rem 等显式单位保持原样。 */
export function formatIconSize(size: string | number) {
  if (typeof size === 'number') {
    return `${Number.isFinite(size) && size > 0 ? size : 24}px`
  }
  const value = size.trim()
  if (!value) return '24px'
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return formatIconSize(Number(value))
  return value
}

/** 创建渲染绑定，避免失效图片留下空白。彩色 SVG 的背景由 UnoCSS 管理。 */
export function useIcon(
  props: IconProps,
  emit: (event: 'click', value: unknown) => void
) {
  const imageFailed = ref(false)
  const normalizedName = computed(() => normalizeIconName(props.name || ''))
  const sizeValue = computed(() => formatIconSize(props.size ?? 24))
  const hasValidName = computed(() => {
    if (imageFailed.value) return false
    if (props.type === 'unocss') return normalizedName.value.startsWith('i-')
    return Boolean(props.name?.trim())
  })
  const iconStyle = computed(() => ({
    color: props.color,
    ...props.customStyle,
  }))
  const unocssStyle = computed(() => ({
    width: sizeValue.value,
    height: sizeValue.value,
    color: props.color,
  }))
  const imageStyle = computed(() => ({
    width: sizeValue.value,
    height: sizeValue.value,
  }))
  const wotProps = computed(() => ({
    name: props.name?.trim() || '',
    size: sizeValue.value,
    color: props.color,
    classPrefix: props.customPrefix?.trim() || 'wd-icon',
    customStyle: props.bold ? 'font-weight:700;line-height:1' : 'line-height:1',
  }))
  const fallbackLabel = computed(() =>
    imageFailed.value ? '图片图标加载失败' : '图标名称或类型无效'
  )

  watch(
    () => [props.name, props.type],
    () => {
      imageFailed.value = false
    }
  )

  /** 资源错误转为可见提示。 */
  function onImageError() {
    imageFailed.value = true
  }

  /** 保留调用方收到的原始点击事件。 */
  function handleClick(event: unknown) {
    emit('click', event)
  }

  return {
    normalizedName,
    hasValidName,
    iconStyle,
    unocssStyle,
    imageStyle,
    wotProps,
    fallbackLabel,
    onImageError,
    handleClick,
  }
}
