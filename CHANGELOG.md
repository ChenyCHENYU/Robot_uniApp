# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，
版本号语义遵循 [SemVer](https://semver.org/lang/zh-CN/)。

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
