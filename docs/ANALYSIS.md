# Robot UniApp 企业级移动端模板 — 深度分析与落地规划

> 📅 分析时间：2026-03-18
> 🎯 目标：打造真正开箱即用的成熟企业级移动端模板

---

## 一、已完成的代码质量修复

以下问题已在本次分析中直接修复：

| 问题                     | 文件                   | 修复方案                                                                           |
| ------------------------ | ---------------------- | ---------------------------------------------------------------------------------- |
| Sass Deprecation Warning | vite.config.js         | `silenceDeprecations` 追加 `"global-builtin"`                                      |
| App.vue 双重生命周期     | src/App.vue            | 移除冗余的 Options API `<script>` 块，仅保留 `<script setup>`                      |
| `isLoggedIn` 不应持久化  | stores/modules/user.js | 改为 getter（由 `token` 存在与否推导），从 state 和 persist.paths 中移除           |
| AppStore 无效 persist    | stores/modules/app.js  | 移除空的 persist 配置                                                              |
| 权限指令安全漏洞         | utils/permission.js    | `v-permission`/`v-role` 改为 `removeChild` 移除 DOM（而非 `display:none`）         |
| 误导性的 initRouter 导出 | utils/permission.js    | 移除与 router.js 同名的无关函数                                                    |
| 正则重复定义             | utils/v_verify.js      | 引用 `constants/regex.js` 复用，不再独立定义                                       |
| composables 导入后缀     | composables/index.js   | 移除 `.js` 后缀，利于后续演进                                                      |
| Auto Import 未配置       | vite.config.js         | 集成 `unplugin-auto-import`，自动导入 Vue/Pinia/uni-app API + composables + stores |
| Git 规范缺失             | package.json           | 安装 `@robot-admin/git-standards`（需运行 init 初始化）                            |

---

## 二、核心能力增强规划

### 2.1 HTTP 封装重构（`src/utils/http.js`）

当前问题与增强方向：

| 问题           | 当前状态                          | 增强目标                                        |
| -------------- | --------------------------------- | ----------------------------------------------- |
| 请求取消       | ❌ 页面销毁后请求仍在飞行         | 基于 `requestTask.abort()` 实现页面级自动取消   |
| 请求去重       | ❌ 快速点击重复发送               | 相同 url+params+method 的并发请求自动合并       |
| 失败重试       | ❌ 网络抖动直接失败               | 可配置重试次数 + 指数退避（默认 GET 重试 2 次） |
| baseURL 硬编码 | ❌ `process.env` 与 `env.js` 冗余 | 统一使用 `config/env.js` 作为唯一数据源         |
| 401 无回跳     | ❌ 直接跳登录页丢失来源页         | 401 时存储当前路由，登录后自动回跳              |
| upload 不统一  | ⚠️ upload 未复用拦截逻辑          | upload 走统一的 token 注入 + 错误处理           |

### 2.2 Mock 数据方案

**推荐方案：`uni-mini-mock` 或自建拦截层**

uni-app 生态中没有像 Web 端 `msw` / `mockjs` 那样完美适配的方案。最实用的做法是 **HTTP 层拦截 + 本地 JSON**：

```
src/mock/
├── index.js              # Mock 总开关（仅 DEV 环境激活）
├── interceptor.js        # 拦截 http.js 的 request 方法
├── modules/
│   ├── user.js           # 用户: 登录/用户信息/用户列表
│   ├── message.js        # 消息: 消息列表/未读数/标已读
│   └── common.js         # 通用: 字典数据/文件上传
└── utils/
    └── response.js       # 统一 Mock 响应封装 { code: 0, data, message }
```

**实现原理**：在 `http.js` 的 `request` 方法入口，DEV 环境下优先匹配 Mock 规则，命中则直接返回模拟数据，未命中则走真实请求。无需额外依赖包。

### 2.3 全局错误处理

```
src/utils/error-handler.js
├── app.config.errorHandler         → 捕获 Vue 组件渲染/生命周期错误
├── uni.onError                     → 捕获 JS 运行时异常
├── Promise rejection               → 未处理的 Promise 异常（H5: onunhandledrejection）
├── 错误聚合 + 去重                 → 相同错误 60s 内只上报一次
└── 上报通道                        → DEV 环境 console.error + 生产环境接口上报
```

### 2.4 路由增强

| 增强项       | 说明                                              |
| ------------ | ------------------------------------------------- |
| 登录回跳     | 401 时存储 `redirectUrl`，登录成功后自动恢复      |
| 动态路由权限 | 支持从后端接口获取权限列表，动态控制页面访问      |
| 页面栈管理   | 提供 `getPageStack()` / `clearTo(url)` 等便捷工具 |

### 2.5 分包加载

```json
// pages.json 分包结构
{
  "pages": [
    // 主包：仅保留首页 + 登录（确保主包 < 2MB）
    { "path": "pages/login/index" },
    { "path": "pages/index/index" }
  ],
  "subPackages": [
    {
      "root": "pages-sub/message",
      "pages": [{ "path": "index" }]
    },
    {
      "root": "pages-sub/profile",
      "pages": [{ "path": "index" }, { "path": "settings" }]
    },
    {
      "root": "pages-sub/robot",
      "pages": [{ "path": "index" }]
    },
    {
      "root": "pages-demo",
      "pages": [
        { "path": "01-icon/index" }
        // ...所有 demo 页
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pages-sub/message"]
    }
  }
}
```

### 2.6 数据字典管理

```
stores/modules/dict.js         → 字典缓存 Store（按 type 缓存）
composables/useDict.js         → useDict('approval_status') 返回 { label, value, color }
components/C_DictTag            → <C_DictTag type="approval_status" :value="row.status" />
策略: 首次加载 → Storage 缓存 → 过期后自动刷新
```

### 2.7 版本更新检测

```
composables/useUpdate.js
├── 小程序端: uni.getUpdateManager() 自动检测
├── App 端: wgt 热更新（静默下载 + 提示安装）
├── H5 端: 接口返回最新版本号 → 与本地对比 → 提示刷新
├── 强制更新 vs 非强制更新（由后端 force 字段控制）
└── 更新弹窗 UI（下载进度 + 当前版本 → 新版本）
```

### 2.8 安全加固

| 项目         | 方案                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| XSS 防护     | http.js 响应拦截中对字符串字段做 HTML 实体转义；富文本使用 `rich-text` 组件而非 `v-html` |
| 登录回跳安全 | `redirectUrl` 仅允许站内路径（正则检查），防止 Open Redirect                             |
| Token 安全   | H5 端切换为 httpOnly cookie + refresh token 双令牌模式                                   |

---

## 三、WebSocket — 具体应用场景

WebSocket 在企业移动端的核心场景：

| 场景             | 说明                                                       | 用户感知                 |
| ---------------- | ---------------------------------------------------------- | ------------------------ |
| **即时消息推送** | 审批通知、系统公告、工作提醒 → 消息中心实时更新 + 角标变化 | 不再需要手动刷新消息列表 |
| **在线状态同步** | 多端登录检测、强制下线通知                                 | 其他设备登录时弹窗提示   |
| **实时数据看板** | 生产数据、销售数据、设备状态实时推送                       | 数据看板自动刷新         |
| **协同编辑通知** | 多人操作同一工单/审批单时的冲突提醒                        | "xxx 正在编辑此单据"     |

**如果项目不涉及以上场景，WebSocket 可以延后。** 用轮询 + 消息中心页手动刷新也能满足基础需求。

---

## 四、高级组件补充清单

### 已有 15 个组件 + 建议新增的实用组件：

| 组件               | 企业场景                        | 具体功能                                   | 优先级 |
| ------------------ | ------------------------------- | ------------------------------------------ | ------ |
| **C_Cascader**     | 省市区选择、部门层级选择        | 多级联动、异步加载子级、搜索过滤           | P1     |
| **C_SwipeAction**  | 消息列表删除/置顶、待办列表归档 | 左右滑动操作区、回弹动画、自动关闭         | P1     |
| **C_ImagePreview** | 工单附件查看、聊天图片放大      | 多图切换、双指缩放、保存到相册、指示器     | P1     |
| **C_Signature**    | 合同签署、快递签收              | Canvas 手写签名、撤销、清空、导出图片      | P1     |
| **C_Calendar**     | 考勤打卡、会议预约、排班表      | 单选/多选/范围选择、日期标记、自定义渲染   | P1     |
| **C_IndexList**    | 通讯录、城市选择                | 字母侧边栏、吸顶分组标题、快速定位         | P1     |
| **C_TreeSelect**   | 部门树、分类树、权限树          | 单选/多选、异步加载、搜索过滤、全选/反选   | P1     |
| **C_Progress**     | 文件上传进度、任务完成度        | 线形/环形/仪表盘、动画、自定义颜色         | P2     |
| **C_Timeline**     | 物流跟踪、审批流程记录          | 时间轴、图标自定义、状态颜色               | P2     |
| **C_Notify**       | 系统公告、营销横幅              | 顶部通知条、自动消失、点击跳转、关闭       | P2     |
| **C_Popover**      | 更多操作气泡、字段说明          | 多方向弹出、箭头指向、点击外部关闭         | P2     |
| **C_Rate**         | 服务评价、满意度评分            | 星星/笑脸/自定义图标、半星、只读           | P2     |
| **C_Divider**      | 内容分隔、加载更多分隔          | 文字位置、虚线/实线、自定义颜色            | P2     |
| **C_CountDown**    | 秒杀倒计时、活动倒计时          | 天/时/分/秒格式、自定义样式、毫秒级        | P2     |
| **C_TabNav**       | 商品分类、内容频道              | 可滚动Tab、徽标、吸顶、下划线/背景切换动画 | P1     |

---

## 五、业务页面模板清单

### 必须提供的页面模板（让使用者开箱即用）：

| 页面            | 文件路径                  | 涉及组件/能力                                    | 说明                                           |
| --------------- | ------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| **注册页**      | pages/register/index      | C_Form + 验证码倒计时 + 协议勾选                 | 手机号/邮箱注册，密码强度提示                  |
| **忘记密码**    | pages/forgot/index        | C_Steps + C_Form + 倒计时                        | 3 步：填手机号 → 输验证码 → 设新密码           |
| **引导页**      | pages/guide/index         | Swiper + 动画                                    | 首次安装展示 3-5 张特性介绍，支持跳过          |
| **CRUD 列表页** | pages-tpl/list/index      | C_Search + C_List + C_Skeleton + C_Empty + C_Tag | 搜索 + 筛选条件 + 分页列表 + 下拉刷新 + 骨架屏 |
| **详情页**      | pages-tpl/detail/index    | C_Skeleton + C_Tag + C_Steps + 分享              | 顶部状态标签 + 信息区块 + 操作按钮栏           |
| **表单页**      | pages-tpl/form/index      | C_Form + C_Upload + C_Search(选择器)             | 多种表单项（输入/选择/日期/上传/级联）         |
| **审批流页**    | pages-tpl/approval/index  | C_Steps + C_Form + C_ActionSheet                 | 流程节点 + 审批意见 + 同意/驳回/转交           |
| **数据看板**    | pages-tpl/dashboard/index | 统计卡片 + 图表(ucharts/echarts)                 | 数字统计 + 趋势图 + 排名列表                   |
| **关于页面**    | pages/about/index         | 版本检测 + 缓存管理                              | Logo + 版本号 + 检查更新 + 清除缓存 + 反馈入口 |
| **WebView**     | pages/webview/index       | web-view 组件                                    | 通用嵌入外部页面（协议、公告、H5 活动）        |
| **搜索结果页**  | pages/search/index        | C_Search + C_List + C_Empty                      | 搜索历史 + 热门搜索 + 结果列表 + 关键词高亮    |
| **图片预览页**  | pages/preview/index       | swiper + 手势缩放                                | 多图浏览 + 保存 + 分享                         |
| **扫码页**      | pages/scan/index          | uni.scanCode                                     | 扫码 + 手电筒 + 相册识别 + 结果处理            |

---

## 六、落地执行优先级

### Phase 1：✅ 已完成

- [x] Sass 警告修复
- [x] unplugin-auto-import 集成
- [x] @robot-admin/git-standards 安装
- [x] App.vue / Store / permission.js / v_verify.js 代码质量修复

### Phase 2：核心基础设施

```
□ 初始化 @robot-admin/git-standards（运行 init 选择预设）
□ HTTP 封装重构（取消/去重/重试/baseURL 统一）
□ Mock 拦截层搭建 + 用户模块 Mock 数据
□ 全局错误处理
□ 登录回跳机制
□ 分包加载配置
```

### Phase 3：企业功能

```
□ 数据字典管理（Store + composable + C_DictTag）
□ 版本更新检测（多端适配）
□ 安全加固
□ 高级组件：C_Cascader / C_SwipeAction / C_ImagePreview / C_Signature / C_TabNav
```

### Phase 4：业务页面

```
□ 注册 + 忘记密码 + 引导页
□ CRUD 列表 + 详情 + 表单（模板页）
□ 审批流 + 数据看板（模板页）
□ 关于页 + WebView + 搜索结果页
```

### Phase 5：WebSocket + 更多组件（按需）

```
□ WebSocket 封装（如有即时通知需求）
□ C_Calendar / C_IndexList / C_TreeSelect / C_Timeline
□ 埋点采集
□ CLI 代码生成器
```

---

> 📝 本文档以实际落地为导向，跟随项目进展持续更新。
