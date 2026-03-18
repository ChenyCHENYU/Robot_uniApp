# C_CountDown 倒计时

精确倒计时组件，支持自定义格式化、毫秒级渲染和外部控制。

## 快速开始

```vue
<C_CountDown :time="60000" @finish="onFinish" />
```

## API 文档

### Props

| 参数        | 说明               | 类型      | 默认值     |
| ----------- | ------------------ | --------- | ---------- |
| time        | 倒计时时长 (ms)    | `Number`  | `0`        |
| format      | 格式化模板         | `String`  | `HH:mm:ss` |
| autoStart   | 是否自动开始       | `Boolean` | `true`     |
| millisecond | 是否开启毫秒级渲染 | `Boolean` | `false`    |

### Events

| 事件名 | 说明       | 回调参数                                          |
| ------ | ---------- | ------------------------------------------------- |
| finish | 倒计时结束 | —                                                 |
| change | 每次更新   | `{ days, hours, minutes, seconds, milliseconds }` |

### Methods (ref)

| 方法名 | 说明       |
| ------ | ---------- |
| start  | 开始倒计时 |
| pause  | 暂停倒计时 |
| reset  | 重置倒计时 |

### Slots

| 名称    | 说明       | 参数                               |
| ------- | ---------- | ---------------------------------- |
| default | 自定义内容 | `{ time: TimeData, text: String }` |

### 格式化模板

| 占位符 | 说明 |
| ------ | ---- |
| DD     | 天数 |
| HH     | 小时 |
| mm     | 分钟 |
| ss     | 秒   |
| SSS    | 毫秒 |

## 代码示例

### 带天数

```vue
<C_CountDown :time="86400000 * 3" format="DD天HH时mm分ss秒" />
```

### 毫秒级

```vue
<C_CountDown :time="10000" format="ss:SSS" millisecond />
```

### 外部控制

```vue
<C_CountDown ref="countDown" :time="60000" :auto-start="false" />
<button @click="$refs.countDown.start()">开始</button>
<button @click="$refs.countDown.pause()">暂停</button>
<button @click="$refs.countDown.reset()">重置</button>
```

### 自定义插槽

```vue
<C_CountDown :time="60000">
  <template #default="{ time }">
    <text class="block">{{ time.hours }}</text>
    <text>:</text>
    <text class="block">{{ time.minutes }}</text>
    <text>:</text>
    <text class="block">{{ time.seconds }}</text>
  </template>
</C_CountDown>
```

## 注意事项

1. `time` 单位为毫秒，如 60 秒传 `60000`。
2. 使用 `Date.now()` 实时校准，避免 `setTimeout` 累积误差。
3. 未包含在模板中的 `DD`（天数）会自动合并到小时。
4. 毫秒级渲染约 30ms 刷新一次，性能敏感场景慎用。
