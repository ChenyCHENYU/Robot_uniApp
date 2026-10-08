# 消息中心接口与行为约定

| 方法   | 路径                    | 请求                        | 响应        |
| ------ | ----------------------- | --------------------------- | ----------- |
| GET    | `/message/list`         | `page`, `pageSize`, `type?` | 消息分页    |
| PUT    | `/message/read`         | `id`                        | 空响应      |
| PUT    | `/message/read-all`     | 无                          | 空响应      |
| DELETE | `/message/item`         | `id`                        | 空响应      |
| GET    | `/message/unread-count` | 无                          | `{ count }` |

页面使用 Message Store。分类筛选当前已载入消息，分类徽章为对应已载入消息未读数，顶部全量未读来自服务端计数。可点击加载更多以避免内容滚动容器使页面触底失效。清除已读调用既有单条删除接口；任何操作在请求完成后才提示成功，失败支持重试。ActionSheet 读取真实 `event.item.value`。

点击消息显示统一设计的详情弹窗，包含消息类型、标题、正文和服务端返回的时间；有操作链接时，通过弹窗主按钮进入对应页面。点击消息时仍调用标记已读接口，失败不更新已读状态。

下拉刷新由 `C_Layout` 内容 `scroll-view` 的 refresh 事件驱动，不使用外层页面的原生刷新生命周期。触底分页由同一 scroll-view 的 reach-bottom 事件驱动，同时保留点击加载更多入口。
