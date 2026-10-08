# 个人中心接口与行为约定

个人资料、角色与登录态来自 User Store，未读徽章来自 Message Store。登出复用 `userStore.logout()` 调用 `POST /auth/logout` 并清除账户状态。消息入口使用 switchTab，其他菜单使用 navigateTo。资源统计保留已有框架资产示例并标注“开发资源”。缓存清理范围与关于页一致，不删除登录、偏好和本地资料。未接入的反馈服务显示联系方式指引，未产生假成功。
