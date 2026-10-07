/**
 * C_NumberKeyboard - 数字键盘组件数据逻辑
 */

export const defaultProps = {
  visible: false,
  title: '',
  maxLength: -1, // -1 不限制
  showDot: true,
  randomOrder: false,
  extraKey: '',
}

export interface KeyItem {
  text: string
  type: 'number' | 'dot' | 'extra' | 'delete' | 'empty'
}

/** Fisher-Yates 洗牌（sort(() => Math.random() - 0.5) 分布不均匀） */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 生成键盘按键（randomOrder 时对 0-9 整体洗牌，保证不丢数字、不重复） */
export const generateKeys = (
  showDot: boolean,
  extraKey: string,
  randomOrder: boolean
): KeyItem[] => {
  // 标准顺序：1-9 主区域 + 0 键位；随机模式对 0-9 整体洗牌后同布局放置
  const base = randomOrder
    ? shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  // 前 9 个占据主区域
  const keys: KeyItem[] = base
    .slice(0, 9)
    .map(n => ({ text: String(n), type: 'number' as const }))

  // 左下角
  if (extraKey) {
    keys.push({ text: extraKey, type: 'extra' })
  } else if (showDot) {
    keys.push({ text: '.', type: 'dot' })
  } else {
    keys.push({ text: '', type: 'empty' })
  }

  // 第 10 个数字占据 0 键位置
  keys.push({ text: String(base[9]), type: 'number' })

  // 退格
  keys.push({ text: 'delete', type: 'delete' })

  return keys
}
