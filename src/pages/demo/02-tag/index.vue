<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Tag 标签"
          subtitle="语义化标记与状态展示"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-label"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础类型 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础类型"
            subtitle="五种语义色系"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view
            class="flex flex-wrap justify-center items-center gap-3 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Tag
              text="主要"
              type="primary"
            />
            <C_Tag
              text="成功"
              type="success"
            />
            <C_Tag
              text="警告"
              type="warning"
            />
            <C_Tag
              text="错误"
              type="error"
            />
            <C_Tag
              text="信息"
              type="info"
            />
          </view>
        </view>

        <!-- 实心模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="实心模式"
            subtitle="填充色更醒目"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-format-color-fill"
            :show-decoration="true"
          />
          <view
            class="flex flex-wrap justify-center items-center gap-3 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Tag
              text="主要"
              type="primary"
              :plain="false"
            />
            <C_Tag
              text="成功"
              type="success"
              :plain="false"
            />
            <C_Tag
              text="警告"
              type="warning"
              :plain="false"
            />
            <C_Tag
              text="错误"
              type="error"
              :plain="false"
            />
            <C_Tag
              text="信息"
              type="info"
              :plain="false"
            />
          </view>
        </view>

        <!-- 圆角标签 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="圆角胶囊"
            subtitle="round 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-rounded-corner"
            :show-decoration="true"
          />
          <view
            class="flex flex-wrap justify-center items-center gap-3 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Tag
              text="朴素圆角"
              type="primary"
              round
            />
            <C_Tag
              text="朴素圆角"
              type="success"
              round
            />
            <C_Tag
              text="实心圆角"
              type="warning"
              round
              :plain="false"
            />
            <C_Tag
              text="实心圆角"
              type="error"
              round
              :plain="false"
            />
          </view>
        </view>

        <!-- 尺寸 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="标签尺寸"
            subtitle="small / default / large"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-resize"
            :show-decoration="true"
          />
          <view
            class="flex flex-wrap justify-center items-end gap-3 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Tag
              text="小号"
              type="primary"
              size="small"
            />
            <C_Tag
              text="默认"
              type="primary"
              size="default"
            />
            <C_Tag
              text="大号"
              type="primary"
              size="large"
            />
          </view>
        </view>

        <!-- 可关闭 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="可关闭标签"
            subtitle="点击 × 移除"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-close-circle"
            :show-decoration="true"
          />
          <view
            class="flex flex-wrap justify-center items-center gap-3 my-6 p-4 bg-gray-50 rounded-lg min-h-12"
          >
            <C_Tag
              v-for="tag in closableTags"
              :key="tag"
              :text="tag"
              type="primary"
              closeable
              @close="removeTag(tag)"
            />
            <text
              v-if="!closableTags.length"
              class="text-sm text-gray-400"
              >已全部移除</text
            >
          </view>
          <view
            v-if="!closableTags.length"
            class="text-center mt-2"
          >
            <text
              class="text-xs text-blue-500"
              @click="resetTags"
              >重置</text
            >
          </view>
        </view>

        <!-- 业务场景 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="业务场景"
            subtitle="实际应用示例"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-briefcase"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <view class="flex items-center gap-2">
              <text class="text-sm text-gray-600 w-16">订单：</text>
              <C_Tag
                text="待付款"
                type="warning"
                size="small"
              />
              <C_Tag
                text="已发货"
                type="primary"
                size="small"
              />
              <C_Tag
                text="已完成"
                type="success"
                size="small"
              />
            </view>
            <view class="flex items-center gap-2">
              <text class="text-sm text-gray-600 w-16">角色：</text>
              <C_Tag
                text="管理员"
                type="error"
                size="small"
                round
                :plain="false"
              />
              <C_Tag
                text="编辑"
                type="primary"
                size="small"
                round
                :plain="false"
              />
              <C_Tag
                text="访客"
                type="info"
                size="small"
                round
                :plain="false"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="轻量灵活，场景丰富"
          subtitle="五种类型 · 三种尺寸 · 圆角 · 可关闭"
          :level="5"
          type="info"
          align="center"
          :show-divider="true"
          divider-position="top"
        />
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const allTags = ['前端', '后端', 'UI设计', '产品']
  const closableTags = ref([...allTags])
  const removeTag = (tag: string) => {
    closableTags.value = closableTags.value.filter(t => t !== tag)
  }
  const resetTags = () => {
    closableTags.value = [...allTags]
  }
</script>
