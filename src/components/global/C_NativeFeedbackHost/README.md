# C_NativeFeedbackHost

小程序/App 的共享反馈层。挂载在 `C_Layout` 及登录、注册、引导、扫描、WebView 页，共用 H5 的状态、队列、Promise、输入结果和样式令牌。仅当前页面获得展示权，隐藏的缓存页面不重复展示。

模板只使用原生 uni 组件，不引用 DOM、HTML 元素或原生系统 Toast/Modal。真实设备的键盘避让及 WebView 原生层遮挡仍需设备验收。
