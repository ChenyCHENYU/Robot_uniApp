# Icon 图标

本页演示 C_Icon 的实际图形与交互，无业务 HTTP 接口。

- MDI、Solar、Fluent、Fluent Color、Ionicons 各展示四个已核对名称的 SVG 图形；Wot 展示已安装字体的四个字形。
- name 支持 i-mdi-home、mdi-home 与 mdi:home 等格式，组件与 UnoCSS 动态登记统一为标准类名。
- 单色图使用 CSS mask 并跟随 color；Fluent Color 使用原始多色 SVG 背景，演示中禁用改色控件。
- size 的数字或数字字符串按 px 处理，rpx、rem 等显式单位保留。
- 点击图标、调整尺寸与颜色仅修改当前页；复制名称调用 uni.setClipboardData。
- SVG 与图片使用真实本地或内嵌图形资源，不使用纯色像素；资源失败显示可辨识的兜底提示。
