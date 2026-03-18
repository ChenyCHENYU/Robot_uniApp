<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Upload 上传"
          subtitle="图片与文件上传组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-cloud-upload"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础上传 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="点击选择图片上传"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-image-plus"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Upload
              v-model="fileList1"
              :maxCount="3"
            />
          </view>
          <text class="text-xs text-gray-400 text-center block"
            >已选 {{ fileList1.length }} / 3 张</text
          >
        </view>

        <!-- 限制数量 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="数量限制"
            subtitle="maxCount 控制上传数量"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-numeric"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Upload
              v-model="fileList2"
              :maxCount="6"
            />
          </view>
          <text class="text-xs text-gray-400 text-center block"
            >最多 6 张图片</text
          >
        </view>

        <!-- 禁用状态 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="禁用状态"
            subtitle="disabled 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-block-helper"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Upload
              v-model="disabledList"
              disabled
            />
          </view>
          <text class="text-xs text-gray-400 text-center block"
            >禁用状态下不可上传/删除</text
          >
        </view>

        <!-- 功能特性 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="核心能力"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-four-points"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text
                class="i-mdi-image-size-select-large text-xl text-blue-500"
              ></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >预览尺寸</text
                >
                <text class="text-xs text-gray-500"
                  >previewSize 自定义缩略图大小</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-file-alert text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >大小限制</text
                >
                <text class="text-xs text-gray-500">maxSize 默认 10MB</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-delete text-xl text-red-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >可删除</text
                >
                <text class="text-xs text-gray-500"
                  >deletable 控制删除按钮显示</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="便捷上传，预览直观"
          subtitle="多图 · 大小限制 · 禁用 · 可删除"
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
  const fileList1 = ref([])
  const fileList2 = ref([])
  const disabledList = ref([
    {
      url: 'https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/robot_admin/login.png',
    },
  ])
</script>
