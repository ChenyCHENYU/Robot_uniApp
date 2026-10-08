# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，
版本号语义遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [1.7.1] - 2026-10-08

### 优化与修复

- 四个 Tab、普通页面打开与返回统一使用加载反馈，缓存页切换也完整呈现 220ms 入场动画；重复点击当前 Tab 不触发加载。
- 首次页面等待 onReady，缓存页等待 onShow；目标页面视图绘制完成且导航 API 成功后结束导航加载，失败或异常超时自动释放。
- 导航使用独立 owner，与 HTTP 等任务合并展示一层加载，避免某个任务完成时误关其他加载；旧页面生命周期及过期回调不会结束后续导航。
- 以页面 onShow 的实际路径变化补齐浏览器历史、系统返回与侧滑返回；同一路径回到前台不触发加载，保留 SDK Promise、回调和登录/权限守卫。
- 同步包版本、App 版本及环境配置为 `1.7.1`，App `versionCode` 为 `171`；README 说明导航行为并保留 v1.7.0 界面截图。

### 测试

- 新增 25 项导航行为测试，覆盖页面准备、缓存切换、加载归属、动画时长、失败/超时和 SDK 调用兼容；累计 23 个测试文件、230 项单元测试。

### 验证

- 5 项契约检查、230 项单元测试、vue-tsc、Oxlint 与 ESLint 检查通过；保留既有脚本的 4 条 await-loop 警告。
- H5 浏览器 22 项检查通过，覆盖四个 Tab 首次及缓存切换、当前 Tab 重复点击、普通导航、多层页面返回、浏览器历史返回、失败释放、加载归属、深色主题及减少动态效果；无页面异常或 UI 警告。
- H5、微信小程序与 App 生产构建通过；微信 52 页、101 份 WXSS 完整，包体预算检查通过。微信小程序与 App 真机尚未验收。

## [1.7.0] - 2026-10-08

### 新增

- 首页改为个人工作台：四个常用应用、当前账号问候、本机最近搜索及个人设置入口；搜索历史为空时保留自然空状态。
- 共享反馈宿主统一提示、输入弹窗与加载体验，兼容回调、Promise、弹窗队列与加载归属；刷新启动、登录请求和行内加载采用细轨道、呼吸点与光条。
- README 补充新版亮色、深色预览与实际数据来源说明；同步包版本、App 版本及环境配置为 `1.7.0`，App `versionCode` 为 `170`。

### 优化与修复

- 统一组件库、33 个组件演示及业务页面的布局、图标、卡片和双主题；业务逻辑、样式与接口契约按页面分离，组件库复用分类目录。
- 移除首页重复的组件介绍与演示统计、待办、动态，缩小操作入口并完善搜索导航与键盘操作。
- 修复底栏遮挡、页面滚动和布局定位；重设计消息详情，保持共享未读状态与页面同步。
- 修复五套图标演示的缺失图形与色块；加载卡使用不透明主题底色，避免背景文字透出。
- 按当前账号恢复昵称与头像首字，隔离切换账号后的旧请求、缓存及演示令牌，保持 CHENY 身份展示。
- 微信小程序历史搜索参数安全解码一次，保留 H5/App 已解析文本及非法百分号输入。
- H5 用实际联网状态校正 SDK 并监听断开、恢复；重复事件与联网制式切换不误弹提示，迟到的网络查询不会覆盖新状态。
- 微信生产构建补齐页面 WXSS 并清理不兼容引用，避免编译成功但样式产物缺失。

### 验证

- 5 项契约检查、22 个测试文件共 205 项单元测试，以及类型、Oxlint、ESLint 检查通过。
- H5、微信小程序与 App 生产构建通过；微信 52 页样式、101 份 WXSS 与包体预算复核通过。
- H5 浏览器验证小屏、桌面、亮暗主题、真实搜索历史及断网/恢复行为；App 与微信真机尚未验收。

## [1.6.1] - 2026-10-08

### 新增

- store/http 行为测试：user store 登录/登出/权限同步 6 例；
  http 协议/重试/401/去重 7 例（uni.request 桩驱动）——单测累计 69 例
- resumable-upload 存储层测试 4 例（job 持久化/chunkSize 边界/状态流转）

### 重构

- 复杂度警告 4→0：C_Form validateField 拆 checkRule、usePagination 拆
  normalizePage、crud-list 拆 buildQuery、C_Layout 拆 deriveTitleFromPath
- tsconfig 标注 noImplicitAny 债务（174 处）与渐进开启路径

## [1.6.0] - 2026-10-08

### 新增

- vitest 单元测试 52 例（纯逻辑层全覆盖），tests/setup 提供 uni 全局桩
- 第 5 项契约测试：版本号三处同步（package.json ↔ manifest ↔ env）
- GitHub Actions CI（质量门禁 + 双端构建 + 包体预算）
- C_List 虚拟滚动容器实测高度 + offset 触底提前量 prop
- CHANGELOG 与 C_Layout/C_Header/C_Tabbar/C_Title 组件文档

### 修复（单测驱动发现）

- NumberKeyboard 标准模式数字顺序错误（0-8+0 历史重构回归）
- checkPermission 对带 query 路径误判
- strongPassword 文案与正则语义不符（宣称大小写、实际字母+数字）
- profile 消息角标非响应式（ref 初始值捕获一次）

### 重构

- v_verify quickValidate 复杂度 27→达标（行为由 15 例测试锁定后拆分）
- index/profile 页面拆分 data.ts/types.ts（数据视图分离）
- 品牌渐变 token 化（--r-gradient-\* 8 个，15+ 文件收敛）
- 认证场景共享样式 auth-scene.scss（根布局/容器/float 关键帧）
- 骨架屏接入 message/crud-list 首刷；核心页 hover-class 按压态；
  register 安全区适配

## [1.5.1] - 2026-10-07

### 新增

- wot-design-uni 官方暗色集成：`wd-config-provider` 包裹布局内容，
  `themeVars` 注入品牌 token（组件库与业务 token 单向统一）

## [1.5.0] - 2026-10-07

### 新增

- 亮/暗双主题 token 体系（`.theme-dark` 级联 + `[data-theme='dark']` H5 覆盖）
- 浅色/深色/跟随系统三模式切换（`uni.onThemeChange` 实时跟随，设置页可切）
- 全局网络状态监听（断网/恢复提示）
- C_Tabbar 玻璃模式暗色适配；webview/scan 自绘页主题接入

## [1.4.0] - 2026-10-07

### 新增

- 第 4 项契约测试：平台 API 隔离（Web 全局对象必须位于条件编译块内）

### 重构

- http 拆分 helpers/types；`useDashboardData` 首页与看板共享；
  `constants/status`、`utils/format` 收敛重复实现
- C_Search 防抖卸载清理；resumable-upload 复杂度收敛

## [1.3.0] - 2026-10-07

### 新增

- 企业基座能力：分级日志、错误脱敏上报钩子、请求身份代次、
  C_EnvironmentBadge、WXSS 构建清洗、包体预算门禁、3 项契约测试、
  断点续传上传、App 热更新（sha256 校验）、简繁转换（门控零包体）、
  C_LogoutTransition、platform 平台能力接口层

## [1.2.0] - 2026-10-07

### 新增

- 业务模板页全量接入 API（dashboard/crud/approval/detail/form/register/settings），
  偏好持久化，mock 同步扩展

## [1.1.0] - 2026-10-07

### 安全

- 登录真实链路（删除预填口令/后门通道）、WebView 白名单、扫码确认、
  Android 权限最小化、`?env=` 生产守卫

### 修复

- 统一响应协议 `code:0`（原 http 与 mock 协议断裂）
- 路由守卫默认拒绝模型 + 全平台 store 注入
- 401 并发去重、登录回跳、页面级请求取消接线
- 组件缺陷：FloatButton 拖拽、ImagePreview 空 itemList、
  watch immediate、NumberKeyboard 随机键盘、C_Rate readonly 冲突、
  三组件 scoped+BEM、token 双挂载 `:root`+`page`

### 工程化

- 环境配置单一来源（envDir 修正）、vue-tsc 0 错误基线、
  pre-commit 本地化、生产 drop console、分包优化/按需注入/预下载、
  UnoCSS 图标显式声明、README 对齐实际

## [1.0.0] - 2026-03-01

- 初始版本：34 组件、演示模板页、基础请求/状态/路由封装
