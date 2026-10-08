# C_FeedbackHost

H5 应用唯一的持久反馈层，由 `utils/feedback-h5.ts` 挂载，页面不自行引用。适配桌面手机机身、深色主题、安全区、键盘焦点与减少动态效果。

现有 `uni.showToast/showModal/showActionSheet/showLoading/hideLoading/hideToast` 自动使用此层，保留回调、Promise、可编辑弹窗和按钮语义。确认弹窗与操作菜单共用队列；HTTP 与手动 loading 的所有权独立。

操作菜单保留 `tapIndex`，取消触发 `fail/complete`，Promise 模式以 `showActionSheet:fail cancel` 拒绝。`showStyledActionSheet` 可补充描述、当前选中项与选项说明，调用方需处理取消。H5 支持 Escape、焦点限制与恢复；App/PDA 实体返回先关闭当前反馈。

结构化信息可使用 `showStyledModal`（`@/utils/feedback`），支持 `eyebrow`、`icon` 和 `fields: { label, value }[]`。小程序/App 使用同一状态与样式的 `C_NativeFeedbackHost`。
