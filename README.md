<div align="center">
  <a href="https://github.com/ChenyCHENYU/Robot_uniApp">
    <img src="./src/static/robot-avatar.png" height="120" />
  </a>
  
  <h1>🤖 Robot UniApp</h1>
  <p><strong>企业级跨平台移动应用开发框架</strong></p>
  <p><em>一次开发，十端运行 | 现代化架构 | 开箱即用</em></p>
  
  <p>
    <img src="https://img.shields.io/badge/vue-3.5.30-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue Version">
    <img src="https://img.shields.io/badge/UniApp-3.0.0-07C160?style=for-the-badge&logo=wechat&logoColor=white" alt="UniApp Version">
    <img src="https://img.shields.io/badge/Pinia-2.3.1-FFD43B?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia Version">
    <img src="https://img.shields.io/badge/UnoCSS-66.5.1-FF6B35?style=for-the-badge&logo=css3&logoColor=white" alt="UnoCSS Version">
    <img src="https://img.shields.io/badge/wot--design--uni-1.14.0-0078D7?style=for-the-badge" alt="wot-design-uni">
    <img src="https://img.shields.io/badge/Vite-5.2.8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Version">
  </p>

  <p>
    <img src="https://img.shields.io/github/stars/ChenyCHENYU/Robot_uniApp?style=social" alt="GitHub stars">
    <img src="https://img.shields.io/github/forks/ChenyCHENYU/Robot_uniApp?style=social" alt="GitHub forks">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="License">
    <img src="https://img.shields.io/github/last-commit/ChenyCHENYU/Robot_uniApp?style=flat&color=orange" alt="Last Commit">
  </p>

  <p>
    <a href="#-快速开始">⚡ 快速开始</a> •
    <a href="#-核心特性">✨ 核心特性</a> •
    <a href="#-项目架构">🏗️ 项目架构</a> •
    <a href="#-开发指南">📖 开发指南</a> •
    <a href="#-演示预览">📱 在线预览</a>
  </p>

  <h3>🎯 一个真正意义上的企业级跨平台解决方案</h3>
</div>

---

## 🚀 项目简介

**Robot UniApp** 是一个基于 **Vue 3 + UniApp + UnoCSS** 的企业级跨平台移动应用开发框架，旨在为开发者提供统一、高效的开发体验，支持 **H5、小程序、App** 等多端同步开发。

> 💫 面向未来的跨平台解决方案，让您专注于业务逻辑，而不是平台差异。

### 🎨 设计理念

<table>
<tr>
<td width="25%" align="center">
  <h4>🚀 一码多端</h4>
  <p>一套代码，同时运行在 H5、小程序、App 等 10+ 平台</p>
</td>
<td width="25%" align="center">
  <h4>🏗️ 企业级</h4>
  <p>完整的开发规范和最佳实践，支持大型项目</p>
</td>
<td width="25%" align="center">
  <h4>✨ 现代化</h4>
  <p>Vue3 + Vite + UnoCSS + wot-design-uni 等最新技术栈</p>
</td>
<td width="25%" align="center">
  <h4>🛠️ 开箱即用</h4>
  <p>丰富的组件库和工具链，新手也能快速上手</p>
</td>
</tr>
</table>

### 🏆 为什么选择 Robot UniApp？

- 📊 **数据驱动**: 支持实时数据同步，状态管理统一
- 🎨 **原子化 CSS**: UnoCSS 提供极速的样式开发体验
- 🔒 **权限系统**: 完整的 RBAC 权限控制体系
- 🌍 **国际化**: 支持多语言和国际化配置
- 🛡️ **类型安全**: TypeScript 支持，提供更好的开发体验
- 🔌 **热更新**: Vite 提供闪电般的热更新速度

---

## ⚡ 快速开始

```
# 1. 克隆项目
git clone https://github.com/ChenyCHENYU/Robot_uniApp.git
cd Robot_uniApp

# 2. 安装依赖
pnpm install

# 3. 启动H5开发（推荐新手）
pnpm run dev:h5

# 4. 启动微信小程序开发
pnpm run dev:mp-weixin
```

### 📋 快速上手指南

1. **环境准备** 🔧

   - 安装 [Node.js](https://nodejs.org/) >= 16.x
   - 安装 [pnpm](https://pnpm.io/) 包管理器
   - 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html) （可选）

2. **开始开发** 💻

   ```bash
   # 克隆下来后，进入项目目录
   cd Robot_uniApp

   # 安装依赖
   pnpm install

   # 启动H5开发服务器
   pnpm run dev:h5
   ```

3. **查看效果** 👀
   - 打开浏览器访问 `http://localhost:3000`
   - 就可以看到精美的页面了！

### 📦 更多命令

<details>
<summary>📝 点击查看完整命令列表</summary>

```
# 🖥️ H5 开发命令
pnpm run dev:h5          # H5开发服务器
pnpm run build:h5        # H5生产构建
pnpm run dev:h5:ssr      # H5 SSR开发
pnpm run build:h5:ssr    # H5 SSR构建

# 📱 小程序开发命令
pnpm run dev:mp-weixin   # 微信小程序
pnpm run dev:mp-alipay   # 支付宝小程序
pnpm run dev:mp-baidu    # 百度小程序
pnpm run dev:mp-toutiao  # 字节跳动小程序
pnpm run dev:mp-qq       # QQ小程序
pnpm run dev:mp-kuaishou # 快手小程序

# 📱 App 开发命令
pnpm run dev:app         # App开发
pnpm run dev:app-android # Android开发
pnpm run dev:app-ios     # iOS开发

# 🔍 其他平台
pnpm run dev:quickapp-webview # 快应用
pnpm run dev:mp-360      # 360小程序

# 🏗️ 构建命令
pnpm run build:mp-weixin # 微信小程序构建
pnpm run build:app       # App构建
pnpm run build:app-plus  # App-Plus构建
```

</details>

---

## ✨ 核心特性

### 🏗️ 技术栈

- **Vue 3.5.30** - 最新稳定版，Composition API
- **UniApp 3.0.0** - 跨平台应用开发框架
- **Pinia 2.3.1** - 新一代状态管理（+ persistedstate 持久化插件）
- **UnoCSS 66.5.1** - 原子化 CSS 引擎（Wind3 + Attributify + Icons）
- **wot-design-uni 1.14.0** - 京东风格 Vue 3 跨平台 UI 组件库
- **vue-i18n 11.3.0** - 国际化支持
- **Vite 5.2.8** - 下一代构建工具

### 📱 平台支持

支持 **10+** 平台编译部署：

|     移动端     |      小程序       |     其他     |
| :------------: | :---------------: | :----------: |
|     📱 H5      |   🟢 微信小程序   | 🚀 HarmonyOS |
|   🍎 iOS App   |  🔵 支付宝小程序  |  ⚡ 快应用   |
| 🤖 Android App |   🟡 QQ 小程序    |              |
|                |   🔴 百度小程序   |              |
|                | 🟠 字节跳动小程序 |              |

### 🧩 自研组件库（20 个全局组件）

**基础布局类：**
- **C_Layout** - 统一页面布局容器（Header + Content + Tabbar）
- **C_Header** - 响应式头部组件（头像/问候语/通知/返回）
- **C_Tabbar** - 底部导航栏（徽标/路由/安全区域）
- **C_Title** - 玻璃风标题（6 主题 / 3 尺寸 / 图标 / 分割线）
- **C_Icon** - 五类图标封装（UnoCSS / wot / SVG / Image / Custom）

**数据展示类：**
- **C_Card** - 内容卡片（4 级阴影 / header-body-footer 三段式）
- **C_List** - 高性能列表容器（下拉刷新 / 上拉加载 / 空态 / 错误态）
- **C_Empty** - 空状态（8 种预设类型 / 自定义图标文案）
- **C_Skeleton** - 骨架屏（头像 + 标题 + 段落 / 脉冲动画）
- **C_Tag** - 状态标签（5 色 / 朴素实心 / 可关闭）
- **C_Badge** - 增强徽标（数值 / 圆点 / max 溢出）
- **C_Steps** - 步骤条（水平 / 垂直 / 审批流）
- **C_Watermark** - 安全水印（Canvas 生成 / 全页覆盖）

**表单交互类：**
- **C_Form** - 表单容器（声明式校验 / required+pattern+validator）
- **C_Search** - 搜索栏（防抖输入 / 搜索历史 / 清空）
- **C_Upload** - 文件上传（压缩 / 进度 / 预览 / 多文件）
- **C_NumberKeyboard** - 数字键盘（金额 / 验证码 / 安全随机排列）

**反馈交互类：**
- **C_Modal** - 弹窗（v-model 控制 / 自定义内容 / 纯文本）
- **C_ActionSheet** - 底部操作面板（图标 / 描述 / 危险操作）
- **C_FloatButton** - 悬浮按钮（固定定位 / 可拖拽 / 安全区适配）

### 🛠️ 企业级能力

- **权限体系** - 路由守卫 + v-permission 指令 + Store RBAC
- **主题系统** - CSS Variables + 深色模式 + useTheme composable
- **国际化** - vue-i18n 11.x 已集成
- **表单校验** - v_verify 工具 + C_Form 声明式校验

---

## 🏗️ 项目架构

### 📁 目录结构

```
Robot_UniApp/
├── docs/                         # 架构文档
│   └── PLAN.md                   # 项目规划路线图
├── env/                          # 多环境配置
├── src/
│   ├── api/                      # API 接口管理
│   │   └── modules/              # 按业务域拆分
│   ├── components/global/        # 全局组件库 (20 个)
│   │   ├── C_Header/             # 响应式头部
│   │   ├── C_Layout/             # 统一布局容器
│   │   ├── C_Tabbar/             # 底部导航栏
│   │   ├── C_Title/              # 玻璃风标题
│   │   ├── C_Icon/               # 五类图标
│   │   ├── C_Card/               # 内容卡片
│   │   ├── C_List/               # 高性能列表
│   │   ├── C_Empty/              # 空状态
│   │   ├── C_Skeleton/           # 骨架屏
│   │   ├── C_Tag/                # 状态标签
│   │   ├── C_Badge/              # 增强徽标
│   │   ├── C_Steps/              # 步骤条
│   │   ├── C_Watermark/          # 安全水印
│   │   ├── C_Form/               # 表单容器
│   │   ├── C_Search/             # 搜索栏
│   │   ├── C_Upload/             # 文件上传
│   │   ├── C_NumberKeyboard/     # 数字键盘
│   │   ├── C_Modal/              # 弹窗
│   │   ├── C_ActionSheet/        # 底部操作面板
│   │   └── C_FloatButton/        # 悬浮按钮
│   ├── composables/              # 组合函数库 (8 个)
│   │   ├── useLoading.js         # 加载态管理
│   │   ├── usePagination.js      # 分页逻辑
│   │   ├── useNetwork.js         # 网络状态监听
│   │   ├── useModal.js           # Promise 化弹窗
│   │   ├── useCountdown.js       # 倒计时
│   │   ├── useUpload.js          # 文件上传
│   │   ├── useShare.js           # 分享能力
│   │   └── useTheme.js           # 深色模式/主题
│   ├── constants/                # 常量管理
│   │   ├── storage.js            # 存储 Key 枚举
│   │   ├── regex.js              # 正则集合
│   │   └── business.js           # 业务状态码/字典
│   ├── config/                   # 运行时配置
│   ├── directives/               # 自定义指令
│   ├── pages/                    # 页面目录
│   │   ├── index/                # 首页
│   │   ├── login/                # 登录页
│   │   ├── chat/                 # AI 对话页
│   │   ├── robot/                # 机器人管理
│   │   └── profile/              # 个人中心
│   ├── stores/                   # Pinia 状态管理
│   ├── styles/                   # 全局样式体系
│   │   ├── variables.scss        # CSS 变量 (色板/字号/间距/阴影)
│   │   ├── mixins.scss           # SCSS Mixins
│   │   ├── reset.scss            # 样式重置
│   │   ├── transition.scss       # 统一过渡动画
│   │   └── index.scss            # 入口
│   ├── utils/                    # 工具函数
│   ├── static/                   # 静态资源
│   └── main.js                   # 入口文件
├── package.json                  # 项目配置
├── vite.config.js                # Vite 配置
└── uno.config.js                 # UnoCSS 配置
```

### 🔄 架构设计

```
mermaid
graph TB
    A[表现层] --> B[业务层]
    B --> C[数据层]

    subgraph "表现层"
        A1[Pages] --> A2[Components]
    end

    subgraph "业务层"
        B1[Stores] --> B2[Utils]
    end

    subgraph "数据层"
        C1[API] --> C2[HTTP]
    end
```

### 🔊 实用功能

<details>
<summary>📈 点击查看更多功能特性</summary>

#### 🌌 现代化开发体验

- **热重载** - Vite 提供闪电般的开发体验
- **TypeScript** - 完整的类型支持（可选）
- **ESLint + Prettier** - 代码质量保障
- **自动导入** - 组件和 API 自动导入

#### 📱 移动端优化

- **触摸反馈** - 丰富的手势交互
- **性能优化** - 懒加载和代码分割
- **离线支持** - Service Worker 缓存策略
- **响应式设计** - 适配各种屏幕尺寸

#### 🔒 企业级特性

- **权限系统** - 基于 RBAC 的权限控制
- **安全防护** - XSS/CSRF 防护机制
- **错误监控** - 全局错误处理和日志
- **数据持久化** - 多级缓存策略

</details>

---

## 📖 开发指南

### 🔧 环境要求

- **Node.js**: >= 16.x (推荐 18.x+)
- **pnpm**: >= 7.x (推荐最新版)
- **HBuilderX**: 官方推荐 IDE
- **微信开发者工具**: 小程序开发必需

### 🎨 开发规范

#### 创建新页面

```
# 1. 在src/pages下创建页面目录
mkdir src/pages/your-page

# 2. 创建页面文件
touch src/pages/your-page/index.vue

# 3. 在pages.json中注册页面
```

#### 创建新组件

```
# 在src/components/global下创建组件
mkdir src/components/global/C_YourComponent
```

#### 主题定制

```scss
// src/styles/variables.scss - 全局 CSS 变量
:root {
  --r-color-primary: #007aff;
  --r-color-success: #4cd964;
  --r-radius-lg: 24rpx;
  --r-shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}
```

---

## 🛠️ 功能特性

### 🔐 权限管理

- 路由级权限控制
- 菜单动态生成
- 按钮级权限控制
- JWT Token 认证

### 🎨 主题系统

- 多主题支持（Ocean、Sunset、Forest）
- 深色/浅色模式
- 动态主题切换
- 自定义主题色

### 📱 响应式设计

- 移动优先设计
- 多屏幕适配
- 触摸友好交互
- 性能优化

---

## 📊 性能优化

|   优化项    |   效果   |
| :---------: | :------: |
| 🚀 启动速度 |   < 2s   |
|  ⚡ 热更新  | < 200ms  |
|  📦 包体积  | 减少 60% |
| 🔄 路由切换 | < 100ms  |

### 优化策略

- 代码分割和懒加载
- Tree Shaking 无用代码移除
- 图片压缩和格式优化
- 智能缓存机制

---

## 🤝 参与贡献

### 快速贡献

```
# 1. Fork项目
# 2. 创建功能分支
git checkout -b feature/awesome-feature

# 3. 提交修改
git commit -m "feat: 添加新功能"

# 4. 提交PR
```

### 贡献方向

- 🎨 页面/组件开发
- 🐛 Bug 修复
- 📖 文档完善
- ⚡ 性能优化

---

## 🔒 安全特性

- **身份认证**: JWT Token + 自动刷新
- **权限控制**: RBAC 权限体系
- **数据安全**: HTTPS + 数据加密
- **代码安全**: 依赖扫描 + 代码混淆

---

## 📞 联系我们

- **项目地址**: [GitHub](https://github.com/ChenyCHENYU/Robot_uniApp)
- **问题反馈**: [提交 Issue](https://github.com/ChenyCHENYU/Robot_uniApp/issues)
- **功能建议**: [讨论区](https://github.com/ChenyCHENYU/Robot_uniApp/discussions)
- **作者**: [@ChenyCHENYU](https://github.com/ChenyCHENYU)

---

## 🏆 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [UniApp](https://uniapp.dcloud.io/) - 跨平台应用开发框架
- [wot-design-uni](https://wot-design-uni.pages.dev/) - 京东风格 Vue 3 跨平台 UI 组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [UnoCSS](https://unocss.dev/) - 原子化 CSS 引擎
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

特别感谢所有开源贡献者的无私奉献！🙏

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源协议。

---

<div align="center">

### 🚀 开始你的跨平台开发之旅

<p>
  <strong>如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！</strong><br>
  <em>你的支持是我们前进的动力 🌟</em>
</p>

<p>
  <a href="https://github.com/ChenyCHENYU/Robot_uniApp">
    <img src="https://img.shields.io/badge/⭐-给个Star-yellow?style=for-the-badge&logo=github" alt="GitHub Star">
  </a>
  <a href="https://github.com/ChenyCHENYU/Robot_uniApp/fork">
    <img src="https://img.shields.io/badge/🍴-Fork项目-blue?style=for-the-badge&logo=github" alt="GitHub Fork">
  </a>
</p>

**🤖 Robot UniApp - 让跨平台开发变得简单而高效**

<p>
  <em>"好的框架不仅要功能强大，更要让开发者用得愉快"</em><br>
  <strong>— Robot UniApp 团队</strong>
</p>

<p>
  <strong>Made with ❤️ by ChenY</strong><br>
  <em>感谢开源让世界更美好 🌍</em>
</p>

<h3>💫 一次开发，十端运行</h3>
<p><em>让每个开发者都能享受跨平台的便利</em></p>

</div>
