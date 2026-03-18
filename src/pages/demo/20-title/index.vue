<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Title 标题"
          subtitle="多功能标题展示组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-format-header-1"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 标题类型 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="五种类型"
            subtitle="type 属性"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-palette-swatch"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Primary 主要"
                subtitle="默认类型"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Success 成功"
                subtitle="操作成功"
                type="success"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Warning 警告"
                subtitle="需要注意"
                type="warning"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Danger 危险"
                subtitle="危险操作"
                type="danger"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Info 信息"
                subtitle="一般提示"
                type="info"
              />
            </view>
          </view>
        </view>

        <!-- 标题层级 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="标题层级"
            subtitle="level 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-format-header-pound"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Level 1 一级标题"
                :level="1"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Level 2 二级标题"
                :level="2"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Level 3 三级标题"
                :level="3"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Level 4 四级标题"
                :level="4"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="Level 5 五级标题"
                :level="5"
                type="primary"
              />
            </view>
          </view>
        </view>

        <!-- 图标与装饰 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="图标与装饰"
            subtitle="left-icon & show-decoration"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-star"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="带图标标题"
                subtitle="带装饰条"
                left-icon="i-mdi-rocket-launch"
                :show-decoration="true"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="纯文字标题"
                subtitle="无图标无装饰"
                type="success"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="仅图标"
                left-icon="i-mdi-heart"
                type="danger"
              />
            </view>
          </view>
        </view>

        <!-- 对齐方式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="对齐方式"
            subtitle="align 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-format-align-center"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="左对齐"
                subtitle="align=left"
                type="primary"
                align="left"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="居中对齐"
                subtitle="align=center"
                type="success"
                align="center"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="右对齐"
                subtitle="align=right"
                type="warning"
                align="right"
              />
            </view>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="分割线"
            subtitle="show-divider 属性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-minus"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="底部分割线"
                subtitle="默认位置"
                :show-divider="true"
                type="primary"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="顶部分割线"
                subtitle="divider-position=top"
                :show-divider="true"
                divider-position="top"
                type="success"
              />
            </view>
          </view>
        </view>

        <!-- 尺寸 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="尺寸"
            subtitle="size 属性"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-resize"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="小尺寸"
                size="small"
                type="primary"
                left-icon="i-mdi-minus"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="中等尺寸"
                size="medium"
                type="success"
                left-icon="i-mdi-circle-outline"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg">
              <C_Title
                title="大尺寸"
                size="large"
                type="danger"
                left-icon="i-mdi-plus"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="灵活标题，多样展示"
          subtitle="类型 · 层级 · 图标 · 装饰 · 对齐 · 分割线 · 尺寸"
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

<script setup lang="ts"></script>
