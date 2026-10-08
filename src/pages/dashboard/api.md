# 数据看板接口与行为约定

| 方法 | 路径               | 请求                    | 响应                                      |
| ---- | ------------------ | ----------------------- | ----------------------------------------- |
| GET  | `/dashboard/stats` | 无                      | `DashboardStats`（四项指标及 trends）     |
| GET  | `/dashboard/chart` | `range: day/week/month` | `DashboardChart`（labels、visits、users） |

使用 `useDashboardData()`；排行来自趋势中已有访问量，准确标注访问量排行。导出报告把当前指标/趋势文本复制到剪贴板，其他三项分析服务未接入，明确显示不可用说明。周期加载期间禁止重复请求，支持刷新与空状态。

下拉刷新由 `C_Layout` 内容 `scroll-view` 的 refresh 事件驱动，不使用外层页面的原生刷新生命周期。
