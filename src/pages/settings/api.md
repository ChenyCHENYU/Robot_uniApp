# 账户设置接口与行为约定

| 方法         | 路径           | 请求                                       | 响应       |
| ------------ | -------------- | ------------------------------------------ | ---------- |
| POST（上传） | `/user/avatar` | 项目 `uploadAvatar(filePath)` 既有上传封装 | `{ url }`  |
| PUT          | `/user/info`   | `nickname` 或 `avatar`                     | `UserInfo` |

头像选图→真实上传→更新用户，不持久化临时文件路径；失败保留旧头像。昵称同步 API 与 Store。现有 UserInfo 没有签名字段，签名保存在按账户隔离的本地 `profile-bio:<id>`，不再误用 email。手机号变更未接入验证服务，明确提示联系管理员。生物识别登录未接入，显示暂未启用；其他偏好沿用 Settings Store 持久化。语言/外观仍使用既有 composable。
