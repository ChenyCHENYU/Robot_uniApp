# Robot UniApp 项目路线图与开发指南

> 最后更新：2025年  
> 当前版本：v0.2.0（业务模板 + Dashboard 改版）  
> 定位：企业级跨平台应用开发框架，开箱即用

---

## 一、项目当前状态

### 1.1 已完成

| 模块       | 内容                                                                                                                                                                                                          | 数量  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 基础组件   | C_Icon, C_Tag, C_Badge, C_FloatButton, C_Header, C_Layout, C_Tabbar, C_Card, C_Steps, C_Form, C_Search, C_Upload, C_NumberKeyboard, C_Empty, C_Skeleton, C_List, C_Watermark, C_Modal, C_ActionSheet, C_Title | 20 个 |
| 高级组件   | C_SwipeAction, C_ImagePreview, C_Signature, C_IndexList, C_Calendar, C_Cascader, C_TabNav, C_Progress, C_Timeline, C_Notify, C_Rate, C_Divider, C_CountDown                                                   | 13 个 |
| 组件演示   | 33 个组件演示页（统一风格）                                                                                                                                                                                   | 33 页 |
| 业务模板页 | 注册页、引导页、CRUD列表、详情页、表单模板、审批流、数据看板、关于页、WebView、搜索结果页、扫码页                                                                                                             | 11 页 |
| 核心页面   | 首页 Dashboard、消息中心、个人中心、登录页（账号/手机/微信三入口）、设置页                                                                                                                                    | 5 页  |
| 基础设施   | TypeScript 全量迁移（0 error）、Mock 数据层、HTTP 封装、WebSocket、权限指令、Pinia 持久化、vue-i18n                                                                                                           | -     |
| 工程化     | UnoCSS 原子化、CSS 变量主题系统、easycom 自动注册、分包加载、图片懒加载、虚拟滚动、骨架屏 composable                                                                                                          | -     |
| 响应式     | H5 桌面端移动居中布局（480px max-width）、多端适配条件编译                                                                                                                                                    | -     |

### 1.2 技术栈

| 技术           | 版本    | 职责                    |
| -------------- | ------- | ----------------------- |
| uni-app        | 3.0.0   | 跨端核心框架            |
| Vue            | 3.5.30  | 响应式 + 组合式 API     |
| TypeScript     | 5.7.3   | 类型安全                |
| Vite           | 5.2.8   | 构建工具                |
| Pinia          | 2.3.1   | 状态管理                |
| UnoCSS         | -       | 原子化 CSS              |
| wot-design-uni | 1.14.0+ | UI 基础库（kebab-case） |
| vue-i18n       | 11.3.0  | 国际化                  |
| sass           | -       | CSS 预处理              |

---

## 二、三端场景方案

### 2.1 H5 场景

**目标**：企业后台管理 H5、移动端 WebApp、微信公众号嵌入页

**已实现**：

- [x] 桌面端移动模拟器布局（居中 480px，外层背景）
- [x] CSS 变量驱动主题系统（亮/暗/自定义）
- [x] 响应式断点适配
- [x] web-view 组件嵌入外部页面
- [x] H5 条件编译（`#ifdef H5`）

**待完善**：

- [ ] PC 端宽屏多列布局（列表页左右分栏）
- [ ] 浏览器 History / Hash 路由策略切换
- [ ] SEO 优化（SSR / 预渲染 meta 注入）
- [ ] PWA 离线支持（manifest.json + Service Worker）
- [ ] 微前端集成方案（qiankun / wujie 嵌入）

### 2.2 微信小程序场景

**目标**：独立发布小程序、企业微信小程序

**已实现**：

- [x] 条件编译 `#ifdef MP-WEIXIN` 预留
- [x] 微信登录占位逻辑（getUserProfile）
- [x] 分包配置（subPackages 已就绪）

**待完善**：

- [ ] 微信小程序授权登录全流程（code → 后端 → openid）
- [ ] 小程序分享（onShareAppMessage / onShareTimeline）
- [ ] 订阅消息推送
- [ ] 小程序码生成与扫码识别
- [ ] 微信支付对接
- [ ] 包体积优化（主包 < 2MB，分包 < 2MB）
- [ ] 小程序隐私协议弹窗

### 2.3 App 场景（uni-app → App）

**目标**：Android / iOS 原生应用

**已实现**：

- [x] 条件编译 `#ifdef APP-PLUS` 预留
- [x] 扫码页（uni.scanCode 原生调用）

**待完善**：

- [ ] 推送通知（uni-push 2.0，厂商通道集成）
- [ ] APP 升级检测（wgt 热更新 + 整包更新）
- [ ] 原生插件管理（相机、蓝牙、NFC、指纹）
- [ ] 启动页 + 引导页完整流程
- [ ] 离线数据同步（SQLite + 增量同步策略）
- [ ] 应用保活与后台任务

---

## 三、开箱即用策略

### 3.1 核心理念

```
克隆 → 安装 → 启动 → 即可基于模板开发业务
```

### 3.2 开箱即用清单

| 能力       | 说明                                       | 状态 |
| ---------- | ------------------------------------------ | ---- |
| 登录流程   | 账号/手机/微信三合一，含表单验证           | ✅   |
| 权限控制   | 路由守卫 + 权限指令 + 角色判断             | ✅   |
| 请求封装   | 拦截器、错误处理、Token 自动注入、超时重试 | ✅   |
| 状态管理   | Pinia + 持久化，用户/应用状态分模块        | ✅   |
| 主题切换   | CSS 变量驱动，一键切换亮/暗主题            | ✅   |
| 国际化     | vue-i18n，按需加载语言包                   | ✅   |
| 组件库     | 33 个通用组件 + wot-design-uni 底层        | ✅   |
| 业务模板   | 11 个可复用业务页面模板                    | ✅   |
| 工程化     | ESLint + Prettier + cspell + Git hooks     | ✅   |
| Mock 数据  | 开发环境自带 Mock，无需后端即可跑通流程    | ✅   |
| Dashboard  | 数据卡片、快捷操作、待办列表、动态 Feed    | ✅   |
| 表单方案   | 多种表单模板（登录、注册、CRUD、审批）     | ✅   |
| 列表方案   | 搜索 + 筛选 + 分页 + 虚拟滚动              | ✅   |
| Token 刷新 | Access + Refresh 双令牌                    | 🔲   |
| 文件上传   | 图片/文件上传、压缩、预览                  | ✅   |
| 错误监控   | Sentry 集成                                | 🔲   |
| CI/CD      | GitHub Actions 自动构建                    | 🔲   |

### 3.3 快速开始

```bash
# 1. 克隆项目
git clone git@github.com:ChenyCHENYU/Robot_uniApp.git

# 2. 安装依赖
pnpm install

# 3. 启动 H5 开发
pnpm dev

# 4. 构建小程序
pnpm build:mp-weixin

# 5. 构建 App
pnpm build:app
```

---

## 四、扩展与维护策略

### 4.1 项目结构分层

```
src/
├── api/              # 接口层：按业务模块拆分，统一 request 封装
│   └── modules/      # 每个业务线一个文件（user.ts, order.ts, ...）
├── components/       # 组件层：全局通用组件（C_* easycom 自动注册）
│   └── global/       # 所有 C_* 组件，每个组件独立目录
├── composables/      # 组合式函数层：可复用状态逻辑
├── config/           # 配置层：环境变量、常量
├── constants/        # 常量层：业务常量、正则、存储 key
├── directives/       # 指令层：v-permission 等自定义指令
├── pages/            # 页面层：按业务拆分
├── stores/           # 状态层：Pinia 模块化
├── styles/           # 样式层：变量、混入、重置、动画
└── utils/            # 工具层：HTTP、路由、验证、格式化
```

### 4.2 新增业务模块规范

当需要新增一个业务模块时：

```
1. api/modules/ 下新建接口文件
2. stores/modules/ 下新建状态模块（如需要）
3. pages/ 下创建页面目录
4. pages.json 中注册路由（建议加入 subPackages 分包）
5. 复用组件库 + 业务模板开发页面
6. constants/ 中声明业务常量
```

### 4.3 组件开发规范

```
src/components/global/C_XxxName/
├── data.ts          # 默认属性、工具函数、类型定义
├── index.vue        # 组件主体（<script setup lang="ts">）
├── index.scss       # 样式（使用 CSS 变量，scoped）
└── README.md        # Props / Events / Slots 文档
```

**命名约束**：

- 组件目录：`C_` 前缀 + PascalCase（如 `C_FloatButton`）
- 模板中使用：直接 `<C_FloatButton>`（easycom 自动注册）
- wot-design-uni 组件：kebab-case（如 `<wd-button>`）
- CSS 变量：`--r-` 前缀（如 `--r-bg-card`、`--r-color-primary`）

### 4.4 环境区分

| 环境       | 配置                   | 用途       |
| ---------- | ---------------------- | ---------- |
| dev        | `env/.env.development` | 本地开发   |
| staging    | `env/.env.staging`     | 预发布测试 |
| production | `env/.env.production`  | 生产部署   |

条件编译标记：

```
// #ifdef H5          → H5 专属逻辑
// #ifdef MP-WEIXIN   → 微信小程序专属
// #ifdef APP-PLUS    → App 专属
// #ifndef MP-WEIXIN  → 非微信小程序
```

### 4.5 版本迭代策略

| 版本   | 里程碑                           | 状态      |
| ------ | -------------------------------- | --------- |
| v0.1.0 | 基础组件库 + 演示系统            | ✅ 已发布 |
| v0.2.0 | 业务模板 + Dashboard + 页面增强  | ✅ 当前   |
| v0.3.0 | 多端适配完善 + Token 刷新 + 推送 | 🔲 下一步 |
| v0.4.0 | 测试覆盖 + CI/CD + 错误监控      | 🔲 计划中 |
| v1.0.0 | 正式发布，文档站 + npm 包        | 🎯 目标   |

### 4.6 提交规范

```
<type>(<scope>): <subject>

type:   feat | fix | docs | style | refactor | perf | test | chore
scope:  组件名 | 模块名 | 页面名
subject: 简洁中文描述
```

示例：

```
feat(dashboard): 首页改版为数据看板
feat(login): 新增手机号登录模式
fix(C_List): 修复虚拟滚动高度计算
chore: 性能优化，图片懒加载+骨架屏
```

### 4.7 分支策略

| 分支        | 用途                          |
| ----------- | ----------------------------- |
| `main`      | 生产环境，只接受 release 合并 |
| `dev`       | 开发主分支，日常开发          |
| `feature/*` | 新功能分支                    |
| `fix/*`     | Bug 修复分支                  |
| `release/*` | 发布准备分支                  |

---

## 五、后续高优先级任务

### P0 - 核心完善

- [ ] Token 双令牌机制（Access + Refresh）
- [ ] 机器人控制页实现（WebSocket 指令通信）
- [ ] 微信小程序登录全流程闭环
- [ ] 单元测试引入（Vitest，覆盖核心组件和 composables）

### P1 - 体验提升

- [ ] 暗黑主题完善（所有业务页面适配）
- [ ] 骨架屏全页面覆盖
- [ ] 页面切换动画优化
- [ ] 错误边界处理（组件级 ErrorBoundary）
- [ ] 无障碍（A11y）支持

### P2 - 工程化

- [ ] GitHub Actions CI/CD（lint → test → build → deploy）
- [ ] Sentry 错误监控
- [ ] 组件库独立 npm 包抽离
- [ ] 组件可视化文档站（Histoire / Storybook）
- [ ] Changelog 自动生成（conventional-commits）

### P3 - 生态建设

- [ ] 项目脚手架 CLI（create-robot-app）
- [ ] VS Code 代码片段插件
- [ ] 在线模板市场
- [ ] 社区贡献指南（CONTRIBUTING.md）

---

> 本文档为滚动更新路线图，随项目迭代持续调整。
