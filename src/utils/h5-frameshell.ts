/**
 * H5 桌面端"手机机身壳" — 探针实测 rpx 比例 + 等比缩放
 *
 * uni-h5 的 rpx→px 系数随浏览器窗口宽度变化（媒体查询分桶），
 * 静态 CSS 无法对齐。方案：
 * 1. 注入 750rpx 宽探针，实测当前系数下 750rpx 的像素值
 * 2. 机身宽度 = 探针宽度（750rpx 恰好铺满机身，与真机一致）
 * 3. 机身按 390:844 比例取高，超出视口则整体 scale 缩放
 * 4. CSS 变量下发给 reset.scss 的机身样式，resize 时重算
 *
 * 同时常驻虚拟状态栏（时间/信号/电池/灵动岛听筒）。
 */

const STYLE_ID = 'robot-h5-frameshell-style'
const BAR_ID = 'robot-h5-statusbar'

const CSS = `
@media screen and (min-width: 600px) {
  #robot-h5-statusbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(44px * var(--r-fs-inv, 1));
    padding: 0 calc(28px * var(--r-fs-inv, 1));
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2147483000;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--r-bg-page);
  }
  #robot-h5-statusbar .sb-time {
    font-size: calc(15px * var(--r-fs-inv, 1));
    font-weight: 600;
    color: var(--r-text-primary, #1c1c1e);
    font-variant-numeric: tabular-nums;
  }
  #robot-h5-statusbar .sb-right {
    display: flex;
    align-items: center;
    gap: calc(6px * var(--r-fs-inv, 1));
  }
  #robot-h5-statusbar .sb-signal {
    display: flex;
    align-items: flex-end;
    gap: calc(2px * var(--r-fs-inv, 1));
  }
  #robot-h5-statusbar .sb-bar {
    width: calc(3px * var(--r-fs-inv, 1));
    border-radius: 1px;
    background: var(--r-text-disabled, #d1d1d6);
  }
  #robot-h5-statusbar .sb-bar.on {
    background: var(--r-text-primary, #1c1c1e);
  }
  #robot-h5-statusbar .sb-shell {
    width: calc(22px * var(--r-fs-inv, 1));
    height: calc(11px * var(--r-fs-inv, 1));
    border: calc(1.5px * var(--r-fs-inv, 1)) solid var(--r-text-secondary, #8e8e93);
    border-radius: calc(3px * var(--r-fs-inv, 1));
    padding: 1px;
    box-sizing: border-box;
  }
  #robot-h5-statusbar .sb-fill {
    width: 80%;
    height: 100%;
    border-radius: 1px;
    background: var(--r-text-primary, #1c1c1e);
  }
  #robot-h5-statusbar .sb-tip {
    width: calc(1.5px * var(--r-fs-inv, 1));
    height: calc(4px * var(--r-fs-inv, 1));
    border-radius: 0 1px 1px 0;
    background: var(--r-text-secondary, #8e8e93);
  }
  /* 灵动岛式听筒 */
  #robot-h5-statusbar::before {
    content: '';
    position: absolute;
    top: calc(11px * var(--r-fs-inv, 1));
    left: 50%;
    transform: translateX(-50%);
    width: calc(92px * var(--r-fs-inv, 1));
    height: calc(22px * var(--r-fs-inv, 1));
    border-radius: 999px;
    background: var(--r-frame-border, #1d1d1f);
  }
}
@media screen and (max-width: 599px) {
  #robot-h5-statusbar {
    display: none;
  }
}
`

/** 机身常量：375×812（html 字号钉 16px 后 rpx 即真机比例） */
const FRAME_W = 375
const FRAME_H = 812
const FRAME_MARGIN = 32

/** 计算并下发机身尺寸变量（超视口时整体缩放） */
function applyFrameVars() {
  if (window.innerWidth < 600) return

  const scale = Math.min(1, (window.innerHeight - FRAME_MARGIN * 2) / FRAME_H)

  const root = document.documentElement.style
  root.setProperty('--r-frame-w', `${FRAME_W}px`)
  root.setProperty('--r-frame-h', `${FRAME_H}px`)
  root.setProperty('--r-frame-scale', String(scale))
  root.setProperty('--r-fs-inv', String((1 / scale).toFixed(4)))
}

/** 安装手机机身壳（幂等；仅 H5） */
export function installH5FrameShell() {
  // #ifdef H5
  if (typeof document === 'undefined') return

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
  }

  installStatusBar()
  applyFrameVars()

  window.addEventListener('resize', applyFrameVars)
  // #endif
}

/** 虚拟状态栏（机身内常驻，路由重建后自动重挂） */
function installStatusBar() {
  if (document.getElementById(BAR_ID)) return

  const bar = document.createElement('div')
  bar.id = BAR_ID

  const time = document.createElement('span')
  time.className = 'sb-time'
  const right = document.createElement('span')
  right.className = 'sb-right'

  const signal = document.createElement('span')
  signal.className = 'sb-signal'
  for (let i = 1; i <= 4; i++) {
    const b = document.createElement('i')
    b.className = 'sb-bar' + (i <= 3 ? ' on' : '')
    b.style.height = `${(3 + i * 2) * 1}px`
    signal.appendChild(b)
  }

  const shell = document.createElement('span')
  shell.className = 'sb-shell'
  const fill = document.createElement('i')
  fill.className = 'sb-fill'
  shell.appendChild(fill)
  const tip = document.createElement('i')
  tip.className = 'sb-tip'

  right.appendChild(signal)
  right.appendChild(shell)
  right.appendChild(tip)
  bar.appendChild(time)
  bar.appendChild(right)

  const updateTime = () => {
    const now = new Date()
    time.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`
  }
  updateTime()
  window.setInterval(updateTime, 30000)

  const mount = () => {
    const host = document.querySelector('uni-page-body') || document.body
    if (host && !host.contains(bar)) {
      host.insertBefore(bar, host.firstChild)
    }
  }
  mount()
  const observer = new MutationObserver(() => mount())
  observer.observe(document.body, { childList: true, subtree: true })
}
