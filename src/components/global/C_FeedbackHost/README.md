# C_FeedbackHost

H5 应用唯一的持久反馈层，由 `utils/feedback-h5.ts` 挂载，页面不自行引用。适配桌面手机机身、深色主题、安全区、键盘焦点与减少动态效果。

现有 `uni.showToast/showModal/showLoading/hideLoading/hideToast` 自动使用此层，保留回调、Promise、可编辑弹窗和按钮语义。弹窗按顺序展示；HTTP 与手动 loading 的所有权独立。

结构化信息可使用 `showStyledModal`（`@/utils/feedback`），支持 `eyebrow`、`icon` 和 `fields: { label, value }[]`。小程序/App 使用同一状态与样式的 `C_NativeFeedbackHost`。
