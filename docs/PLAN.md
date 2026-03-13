# Robot UniApp 企业级移动端架构规划

> 📅 创建时间：2026-03-13 | 项目版本：2.0.0  
> 🎯 定位：企业级跨平台移动端解决方案（对标 Robot Admin PC端）

---

## 一、项目现状评估

### 已完成的基础设施

| 维度       | 现状                                           | 评价        |
| ---------- | ---------------------------------------------- | ----------- |
| 框架       | UniApp 3.x (Vue 3 + Vite)                      | ✅ 成熟稳定 |
| UI 库      | ~~uview-plus~~ → **wot-design-uni**            | ✅ 已迁移   |
| 状态管理   | Pinia + persistedstate                         | ✅ 最佳实践 |
| CSS 方案   | UnoCSS (Wind3 + Attributify + Icons) + SCSS    | ✅ 高效     |
| 请求封装   | 自封装 Http 类 (token / loading / 错误处理)    | ✅ 可用     |
| 权限体系   | 路由守卫 + v-permission 指令 + Store RBAC      | ✅ 完整     |
| 多环境配置 | .env.development / staging / production / test | ✅ 完整     |
| 国际化     | vue-i18n（已安装，待落地）                     | ⚠️ 待接入   |

### 已完成的组件

| 组件     | 说明                                     | 状态 |
| -------- | ---------------------------------------- | ---- |
| C_Icon   | 五类图标 (UnoCSS/wot/SVG/Image/Custom)   | ✅   |
| C_Header | 响应式头部 (头像/问候语/状态/通知/返回)  | ✅   |
| C_Layout | 统一布局容器 (Header + Content + Tabbar) | ✅   |
| C_Tabbar | 底部导航栏 (徽标/路由/安全区域)          | ✅   |
| C_Title  | 玻璃风标题 (6主题/3尺寸/图标/分割线)     | ✅   |

---

## 二、架构规划

### 阶段一：基础设施补全 🏗️

> 优先级: P0 — 所有后续功能的基石

#### 1. 全局样式体系 (`src/styles/`)

```
styles/
├── variables.scss      # 主题 CSS 变量 (色板/字号/间距/圆角/阴影)
├── mixins.scss         # 常用 mixin (文本截断/flex/安全区域/1px边框)
├── reset.scss          # 全局样式重置
├── transition.scss     # 统一过渡动画
└── index.scss          # 统一入口
```

#### 2. 常量管理 (`src/constants/`)

```
constants/
├── storage.js          # 存储 Key 枚举
├── regex.js            # 正则集合 (手机/邮箱/身份证等)
└── business.js         # 业务状态码 / 字典映射
```

#### 3. 组合函数库 (`src/composables/`)

```
composables/
├── useLoading.js       # 加载态管理
├── usePagination.js    # 分页逻辑 (页码/每页条数/总数/加载更多)
├── useNetwork.js       # 网络状态监听 + 弱网处理
├── useModal.js         # Promise 化弹窗调用
├── useCountdown.js     # 倒计时 (验证码/秒杀)
├── useUpload.js        # 文件上传 (压缩/进度/多文件)
├── useShare.js         # 分享能力封装
└── useTheme.js         # 深色模式/主题切换
```

#### 4. HTTP 增强

- 请求去重 (相同 url+params 防重复)
- GET 请求可配置缓存
- 失败重试 (可配置次数)
- 页面销毁时自动取消

#### 5. 全局错误处理

- `app.config.errorHandler`
- `uni.onError`
- Promise rejection 统一捕获
- 错误上报通道

---

### 阶段二：组件库建设 🧩

> 优先级: P0/P1 — 企业级方案的核心价值

#### 必须封装（P0）

| 组件                 | 定位           | 场景                                    |
| -------------------- | -------------- | --------------------------------------- |
| **C_Empty**          | 空状态         | 无数据/无网络/无权限/无搜索结果/自定义  |
| **C_Skeleton**       | 骨架屏         | 页面级+组件级，配合请求自动切换         |
| **C_Card**           | 内容卡片       | 统一卡片视觉规范，支持 skeleton 态      |
| **C_List**           | 高性能列表容器 | 下拉刷新+上拉加载+空态+错误态+骨架屏    |
| **C_Form**           | 表单容器       | 校验+错误提示+防抖提交+与 v_verify 整合 |
| **C_Search**         | 搜索栏         | 防抖+搜索历史+热词推荐                  |
| **C_Modal**          | 弹窗/确认框    | Promise 化调用 `C_Modal.confirm()`      |
| **C_Upload**         | 文件上传       | 压缩+进度+预览+删除+多文件              |
| **C_Tag**            | 状态标签       | 审批中/已完成/已拒绝 等状态展示         |
| **C_Steps**          | 步骤条         | 审批流/订单状态流转                     |
| **C_ActionSheet**    | 底部操作面板   | 图标/描述/危险操作                      |
| **C_Badge**          | 增强徽标       | 统一消息数展示                          |
| **C_Watermark**      | 安全水印       | Canvas 生成用户信息水印                 |
| **C_NumberKeyboard** | 数字键盘       | 金额/验证码输入                         |
| **C_FloatButton**    | 悬浮按钮       | 快捷操作入口                            |

#### 高级组件（P1）

| 组件          | 场景                 |
| ------------- | -------------------- |
| C_Signature   | 电子签名             |
| C_Calendar    | 日期选择 (排班/预约) |
| C_SwipeAction | 滑动操作 (删除/置顶) |
| C_IndexList   | 索引列表 (通讯录)    |
| C_TreeSelect  | 树形选择 (部门/分类) |

---

### 阶段三：高级能力集成 🚀

> 优先级: P1/P2

| 模块              | 说明                                            | 优先级 |
| ----------------- | ----------------------------------------------- | ------ |
| 深色模式          | CSS Variables + UnoCSS `dark:` + Store 偏好     | P1     |
| 版本检测 & 热更新 | wgt 热更新 / 整包更新 / 小程序 getUpdateManager | P1     |
| 埋点采集          | 页面 PV/UV 自动采集 + 关键操作手动埋点          | P1     |
| 数据字典          | `useDict(type)` 缓存+取值                       | P1     |
| WebSocket         | 自动重连 + 心跳 + 消息分发                      | P2     |
| UniPush 2.0       | 推送集成 + 通知处理 + 角标管理                  | P2     |
| 分包优化          | 主包 < 2M，子包按业务域拆分                     | P2     |
| 图片工具链        | 拍照/相册→压缩→上传→全屏预览                    | P1     |
| 生物认证          | 指纹/人脸解锁                                   | P2     |
| 扫码能力          | 二维码/条形码扫描与生成                         | P2     |
| vue-i18n 落地     | 组件+页面实际接入 `$t()`                        | P2     |

---

## 三、依赖升级计划

### 已完成升级

| 依赖                        | 旧版本            | 新版本                | 状态      |
| --------------------------- | ----------------- | --------------------- | --------- |
| UI 组件库                   | uview-plus 3.5.39 | wot-design-uni (最新) | ✅ 已迁移 |
| pinia                       | 2.1.7             | 最新                  | ✅        |
| pinia-plugin-persistedstate | 3.x               | 4.x                   | ✅        |
| vue                         | 3.4.21            | 3.5.x                 | ✅        |
| vite                        | 5.2.8             | 兼容最新              | ✅        |
| vue-i18n                    | 9.x               | 11.x                  | ✅        |

---

## 四、组件命名规范

所有全局组件统一 `C_` 前缀，保持以下目录结构：

```
components/global/C_ComponentName/
├── index.vue           # 组件主文件
├── data.js             # 数据逻辑 (Props/Emits/Composable)
├── index.scss          # 组件样式
└── README.md           # 组件文档 (统一模板)
```

### README 文档模板

每个组件 README 统一包含以下章节：

1. **组件简介** — 一句话 + 特性列表
2. **快速开始** — 最简使用示例
3. **API 文档** — Props / Events / Slots / Expose 表格
4. **代码示例** — 典型场景完整代码
5. **注意事项** — 平台差异/已知限制

---

## 五、执行节奏

| 阶段    | 内容                                        | 状态 |
| ------- | ------------------------------------------- | ---- |
| Phase 1 | UI 库迁移 (uview-plus → wot-design-uni)     | ✅   |
| Phase 2 | 依赖升级至最新版本                          | ✅   |
| Phase 3 | 基础设施补全 (styles/constants/composables) | 🔲   |
| Phase 4 | P0 通用组件封装 (15个)                      | 🔲   |
| Phase 5 | P1 高级组件封装 (5个)                       | 🔲   |
| Phase 6 | 高级能力集成 (深色模式/热更新/埋点等)       | 🔲   |
| Phase 7 | 文档完善 + 示例页面                         | 🔲   |

---

> 📝 本文档随项目进展持续更新
