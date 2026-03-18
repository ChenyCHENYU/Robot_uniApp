# Robot UniApp 项目后续拓展维护计划

> 最后更新：2025年  
> 当前阶段：基础组件库 + 演示系统完成

---

## 一、项目当前状态

### 已完成

| 模块     | 内容                                                                                                                                                                                                          | 数量  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 基础组件 | C_Icon, C_Tag, C_Badge, C_FloatButton, C_Header, C_Layout, C_Tabbar, C_Card, C_Steps, C_Form, C_Search, C_Upload, C_NumberKeyboard, C_Empty, C_Skeleton, C_List, C_Watermark, C_Modal, C_ActionSheet, C_Title | 20 个 |
| 高级组件 | C_SwipeAction, C_ImagePreview, C_Signature, C_IndexList, C_Calendar, C_Cascader, C_TabNav, C_Progress, C_Timeline, C_Notify, C_Rate, C_Divider, C_CountDown                                                   | 13 个 |
| 演示页面 | 33 个组件演示页（统一 C_Icon 风格）                                                                                                                                                                           | 33 页 |
| 基础设施 | TypeScript 全量迁移、Mock 数据层、错误处理、HTTP 封装、WebSocket、权限指令、Pinia 状态管理                                                                                                                    | -     |

---

## 二、短期计划（1-2 周）

### 2.1 组件质量加固

- [ ] **单元测试覆盖**：为每个组件编写 Vitest 单元测试，覆盖核心逻辑和边界情况
- [ ] **TypeScript 类型优化**：导出组件 Props/Emits 类型供外部使用，完善泛型约束
- [ ] **无障碍访问（A11y）**：为交互组件添加 `aria-*` 属性和键盘导航支持
- [ ] **组件文档完善**：统一各组件 README.md 格式，补充完整的 Props/Events/Slots 文档

### 2.2 性能优化

- [ ] **按需加载优化**：确认 Tree-shaking 正常工作，减少未使用组件的打包体积
- [ ] **图片懒加载**：C_ImagePreview、C_Upload 等图片组件增加懒加载支持
- [ ] **虚拟滚动**：C_List 组件增加虚拟滚动模式，优化长列表渲染性能
- [ ] **骨架屏预渲染**：页面级骨架屏方案，减少首屏白屏时间

---

## 三、中期计划（3-4 周）

### 3.1 业务页面开发

- [ ] **首页**：完成 Dashboard 布局、数据卡片、快捷操作入口
- [ ] **机器人控制页**：实时状态面板、指令发送、WebSocket 通信对接
- [ ] **消息中心**：消息列表、已读/未读状态、消息详情、推送通知
- [ ] **个人中心**：用户信息编辑、设置项、隐私管理
- [ ] **登录优化**：增加微信小程序授权登录、手机号快捷登录

### 3.2 新增组件

| 优先级 | 组件          | 说明                       |
| ------ | ------------- | -------------------------- |
| P0     | C_Picker      | 多列选择器，支持联动       |
| P0     | C_DatePicker  | 日期时间选择器             |
| P0     | C_Popup       | 通用弹出层，支持多方向     |
| P1     | C_Swiper      | 轮播图组件                 |
| P1     | C_Table       | 表格组件，支持排序和固定列 |
| P1     | C_TreeSelect  | 树形选择器                 |
| P2     | C_VirtualList | 虚拟滚动列表               |
| P2     | C_Tooltip     | 文字提示气泡               |
| P2     | C_Collapse    | 折叠面板                   |

### 3.3 状态管理扩展

- [ ] **持久化**：Pinia 状态持久化到 Storage，应用重启恢复
- [ ] **离线缓存**：请求数据缓存策略，断网时使用缓存数据
- [ ] **全局事件总线**：使用 mitt 替代传统 EventBus，统一事件通信

---

## 四、长期计划（1-3 个月）

### 4.1 多端适配

- [ ] **微信小程序**：适配小程序特有 API，处理条件编译
- [ ] **H5 响应式**：PC / Tablet / Mobile 三端响应式布局
- [ ] **App 端**：使用 uni-app 的 App 端能力（推送、相机、蓝牙等）
- [ ] **分包加载**：按业务模块拆分子包，优化首包体积

### 4.2 工程化提升

- [ ] **CI/CD 流水线**：GitHub Actions 自动化构建、测试、部署
- [ ] **代码质量**：集成 SonarQube / CodeClimate 代码质量检测
- [ ] **Changelog 自动生成**：conventional-commits + standard-version
- [ ] **npm 组件库发布**：将组件库抽离为独立 npm 包，支持外部项目复用
- [ ] **Storybook / Histoire**：搭建组件可视化文档站点

### 4.3 安全加固

- [ ] **请求签名**：API 请求增加签名验证，防止篡改
- [ ] **Token 刷新**：实现 Access Token + Refresh Token 双令牌机制
- [ ] **敏感数据加密**：Storage 中敏感数据使用 AES 加密存储
- [ ] **CSP 策略**：配置 Content-Security-Policy，防止 XSS 攻击

### 4.4 监控与运维

- [ ] **错误监控**：集成 Sentry 或自建错误上报系统
- [ ] **性能监控**：页面加载时间、接口响应时间、FPS 监控
- [ ] **用户行为分析**：核心页面埋点，统计用户行为路径
- [ ] **灰度发布**：支持按用户比例逐步放量新版本

---

## 五、维护规范

### 5.1 代码规范

```
提交格式：<type>(<scope>): <subject>
type: feat | fix | docs | style | refactor | perf | test | chore
scope: 组件名 | 模块名 | 页面名
```

### 5.2 分支策略

| 分支        | 用途                          |
| ----------- | ----------------------------- |
| `main`      | 生产环境，只接受 release 合并 |
| `dev`       | 开发主分支，日常开发          |
| `feature/*` | 新功能分支                    |
| `fix/*`     | Bug 修复分支                  |
| `release/*` | 发布准备分支                  |

### 5.3 版本规划

| 版本   | 目标                     | 里程碑 |
| ------ | ------------------------ | ------ |
| v0.1.0 | 基础组件库 + 演示系统 ✅ | 当前   |
| v0.2.0 | 业务页面 + 新增组件      | 中期   |
| v0.3.0 | 多端适配 + 性能优化      | 长期   |
| v1.0.0 | 正式发布，CI/CD + 监控   | 目标   |

### 5.4 组件开发流程

```
1. 在 src/components/global/ 下创建组件目录
2. 编写 data.ts（默认属性 + 工具函数）
3. 编写 index.vue（组件主体）
4. 编写 index.scss（样式，使用 CSS 变量）
5. 编写 README.md（Props / Events / Slots 文档）
6. 在 pages/demo/ 下创建演示页面
7. 在 pages.json 中注册路由
8. 编写 Vitest 单元测试
9. 提交 PR，Code Review 后合并
```

---

## 六、技术选型备忘

| 技术           | 当前版本 | 说明       |
| -------------- | -------- | ---------- |
| uni-app        | 3.0.0    | 跨端框架   |
| Vue            | 3.5.30   | 响应式框架 |
| TypeScript     | 5.7.3    | 类型系统   |
| Vite           | 5.2.8    | 构建工具   |
| Pinia          | -        | 状态管理   |
| UnoCSS         | -        | 原子化 CSS |
| wot-design-uni | 1.14.0+  | UI 基础库  |
| Vitest         | 待引入   | 单元测试   |
| Sentry         | 待引入   | 错误监控   |

---

> 本计划为滚动更新文档，随项目进展持续调整。
