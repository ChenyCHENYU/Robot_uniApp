# 信息填报接口与行为约定

| 方法 | 路径           | 请求                                                                                           | 响应             |
| ---- | -------------- | ---------------------------------------------------------------------------------------------- | ---------------- |
| POST | `/form/submit` | `FormPayload`：name、phone、email?、gender、department、position?、joinDate?、skills?、remark? | `{ id: string }` |

必填 name、phone、gender、department，使用项目已有 v_verify 完成必填/手机号/可选邮箱校验与逐字段提示。保留既有备注 200 字限制。提交明确构造字段载荷，禁止重复提交；失败不丢填写内容。入职日期改为跨平台原生 picker；部门 ActionSheet 使用实际 `{ item, index }` 事件。
