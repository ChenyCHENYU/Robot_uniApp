<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Empty 空状态"
          subtitle="多场景缺省状态展示"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-inbox-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 默认空状态 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="默认空状态"
            subtitle="通用场景"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-inbox"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty />
          </view>
        </view>

        <!-- 网络错误 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="网络异常"
            subtitle="type=network"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-wifi-off"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="network"
              :showAction="true"
              actionText="重新加载"
            />
          </view>
        </view>

        <!-- 搜索为空 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="搜索为空"
            subtitle="type=search"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-magnify"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="search"
              text="换个关键词试试"
            />
          </view>
        </view>

        <!-- 无权限 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="无权限"
            subtitle="type=permission"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-lock-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="permission"
              text="暂无访问权限"
              :showAction="true"
              actionText="申请权限"
            />
          </view>
        </view>

        <!-- 系统错误 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="系统错误"
            subtitle="type=error"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-alert-circle-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="error"
              :showAction="true"
              actionText="返回首页"
            />
          </view>
        </view>

        <!-- 购物车为空 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="购物车为空"
            subtitle="type=cart"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-cart-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="cart"
              :showAction="true"
              actionText="去购物"
            />
          </view>
        </view>

        <!-- 暂无消息 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="暂无消息"
            subtitle="type=message"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-message-text-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty type="message" />
          </view>
        </view>

        <!-- 暂无收藏 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="暂无收藏"
            subtitle="type=collect"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-heart-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg flex justify-center">
            <C_Empty
              type="collect"
              :showAction="true"
              actionText="去发现"
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="八种场景，一键切换"
          subtitle="默认 · 网络 · 搜索 · 权限 · 错误 · 购物车 · 消息 · 收藏"
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
