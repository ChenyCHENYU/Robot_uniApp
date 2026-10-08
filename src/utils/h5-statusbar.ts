/**
 * H5 桌面端虚拟状态栏 — 以 DOM 注入方式挂在页面容器顶部
 *
 * 仅在 H5 且桌面（≥600px 手机外框形态）可见；提供时间/信号/电池点缀，
 * 并为页面内容让出顶部空间（CSS 变量 + padding），随 [data-theme] 适配暗色。
 */

const STYLE_ID = 'robot-h5-statusbar-style'
const BAR_ID = 'robot-h5-statusbar'

const CSS = `
@media screen and (min-width: 600px) {
  #robot-h5-statusbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 28px;
    position: sticky;
    top: 0;
    z-index: 2147483000;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  #robot-h5-statusbar .sb-time {
    font-size: 14px;
    font-weight: 600;
    color: var(--r-text-primary, #1c1c1e);
    font-variant-numeric: tabular-nums;
  }
  #robot-h5-statusbar .sb-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  #robot-h5-statusbar .sb-signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
  }
  #robot-h5-statusbar .sb-bar {
    width: 3px;
    border-radius: 1px;
    background: var(--r-text-disabled, #d1d1d6);
  }
  #robot-h5-statusbar .sb-bar.on {
    background: var(--r-text-primary, #1c1c1e);
  }
  #robot-h5-statusbar .sb-shell {
    width: 22px;
    height: 11px;
    border: 1.5px solid var(--r-text-secondary, #8e8e93);
    border-radius: 3px;
    padding: 1.5px;
    box-sizing: border-box;
  }
  #robot-h5-statusbar .sb-fill {
    width: 80%;
    height: 100%;
    border-radius: 1px;
    background: var(--r-text-primary, #1c1c1e);
  }
  #robot-h5-statusbar .sb-tip {
    width: 1.5px;
    height: 4px;
    border-radius: 0 1px 1px 0;
    background: var(--r-text-secondary, #8e8e93);
    margin-left: 1px;
  }
}
@media screen and (max-width: 599px) {
  #robot-h5-statusbar { display: none; }
}
`

/** 安装虚拟状态栏（幂等；仅 H5 桌面可见） */
export function installH5StatusBar() {
  // #ifdef H5
  if (typeof document === 'undefined') return

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
  }

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
    b.style.height = `${3 + i * 2}px`
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

  // 挂到 uni-app 页面容器最顶部（随路由常驻）
  const mount = () => {
    const host = document.querySelector('uni-page-body') || document.body
    if (host && !host.contains(bar)) {
      host.insertBefore(bar, host.firstChild)
    }
  }
  mount()
  // 路由切换后重挂（H5 页面容器可能重建）
  window.addEventListener('hashchange', mount)
  // #endif
}
