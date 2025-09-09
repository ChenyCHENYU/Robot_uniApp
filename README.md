<div align="center">
  <a href="https://github.com/ChenyCHENYU/Robot_uniApp">
    <img src="./src/static/robot-avatar.png" height="120" />
  </a>
  
  <h1>🤖 Robot UniApp</h1>
  <p><strong>企业级跨平台移动应用开发框架</strong></p>
  <p><em>一次开发，十端运行 | 现代化架构 | 开箱即用</em></p>
  
  <p>
    <img src="https://img.shields.io/badge/vue-3.4.21-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue Version">
    <img src="https://img.shields.io/badge/UniApp-3.0.0-07C160?style=for-the-badge&logo=wechat&logoColor=white" alt="UniApp Version">
    <img src="https://img.shields.io/badge/Pinia-2.1.7-FFD43B?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia Version">
    <img src="https://img.shields.io/badge/UnoCSS-0.66.5-FF6B35?style=for-the-badge&logo=css3&logoColor=white" alt="UnoCSS Version">
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
  <p>Vue3 + Vite + UnoCSS + TypeScript 等最新技术栈</p>
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

- **Vue 3.4.21** - 最新稳定版，Composition API
- **UniApp 3.0.0** - 跨平台应用开发框架
- **Pinia 2.1.7** - 新一代状态管理
- **UnoCSS 66.5.1** - 原子化 CSS 引擎
- **uView-Plus 3.5.39** - 专业跨平台 UI 组件库
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

### 🧩 核心组件

- **C_Layout** - 统一页面布局容器
- **C_Header** - 响应式头部组件，支持多主题
- **C_Tabbar** - 底部导航栏，支持自定义图标
- **权限管理** - 完整的 RBAC 权限控制体系
- **主题系统** - 多主题支持，深色/浅色模式
- **国际化** - vue-i18n 多语言支持

---

## 🏗️ 项目架构

### 📁 目录结构

```
Robot_UniApp/
├── src/
│   ├── api/                  # API接口管理
│   ├── components/           # 组件库
│   │   └── global/           # 全局组件
│   │       ├── C_Header/     # 头部组件
│   │       ├── C_Layout/     # 布局组件
│   │       └── C_Tabbar/     # 底部导航
│   ├── pages/                # 页面目录
│   │   ├── index/            # 首页
│   │   ├── login/            # 登录页
│   │   ├── chat/             # AI对话页
│   │   ├── robot/            # 机器人管理
│   │   └── profile/          # 个人中心
│   ├── stores/               # Pinia状态管理
│   ├── utils/                # 工具函数
│   ├── static/               # 静态资源
│   └── main.js               # 入口文件
├── package.json              # 项目配置
├── vite.config.js            # Vite配置
└── uno.config.js             # UnoCSS配置
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

```
// src/uni.scss - 全局样式变量
$uni-color-primary: #00d4ff;
$uni-color-success: #4cd964;
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
- [uView-Plus](https://uview-plus.jiangruyi.com/) - 全面兼容的 uni-app 生态组件库
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
