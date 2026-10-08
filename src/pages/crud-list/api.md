# 数据管理接口与行为约定

| 方法   | 路径         | 请求                                           | 响应                                          |
| ------ | ------------ | ---------------------------------------------- | --------------------------------------------- |
| GET    | `/crud/list` | `page=1`, `pageSize=10`, `keyword?`, `status?` | `{ list: CrudItem[], total, page, pageSize }` |
| POST   | `/crud/item` | `title`, `description`, `status=0`             | `CrudItem`                                    |
| PUT    | `/crud/item` | `id`, `title`                                  | `CrudItem`                                    |
| DELETE | `/crud/item` | `id`（原请求封装参数）                         | 空响应                                        |

沿用现有接口包装，不引入新接口。筛选与搜索回到第一页；请求进行中的新查询排队刷新。服务端没有排序参数，时间/名称排序只作用于已载入数据。可点击加载更多，不依赖外层页面触底事件；返回本页重新读取数据。

下拉刷新由 `C_Layout` 内容 `scroll-view` 的 refresh 事件驱动，不使用外层页面的原生刷新生命周期。触底分页由同一 scroll-view 的 reach-bottom 事件驱动，同时保留点击加载更多入口。
