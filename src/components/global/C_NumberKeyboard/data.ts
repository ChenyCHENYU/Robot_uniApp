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

/** 生成键盘按键 */
export const generateKeys = (showDot, extraKey, randomOrder) => {
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  if (randomOrder) {
    numbers = numbers.sort(() => Math.random() - 0.5)
  }

  const keys = numbers.map(n => ({ text: String(n), type: 'number' }))

  // 左下角
  if (extraKey) {
    keys.push({ text: extraKey, type: 'extra' })
  } else if (showDot) {
    keys.push({ text: '.', type: 'dot' })
  } else {
    keys.push({ text: '', type: 'empty' })
  }

  // 0
  const zero = randomOrder ? Math.floor(Math.random() * 10) : 0
  keys.push({ text: String(randomOrder ? zero : 0), type: 'number' })

  // 退格
  keys.push({ text: 'delete', type: 'delete' })

  return keys
}
