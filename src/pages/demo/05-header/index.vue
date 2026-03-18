<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Header 页头"
          subtitle="智能页头导航组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-page-layout-header"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 用户模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="用户模式"
            subtitle="展示用户头像、昵称与问候语"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-account-circle"
            :show-decoration="true"
          />
          <view
            class="my-6 rounded-xl overflow-hidden"
            style="border: 1px solid #e5e7eb"
          >
            <!-- 手机壳模拟 -->
            <view
              class="header-preview"
              style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 24rpx 24rpx 28rpx;
              "
            >
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-3">
                  <view
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      background: rgba(255, 255, 255, 0.2);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="user"
                      size="20px"
                      color="#fff"
                    />
                  </view>
                  <view>
                    <text class="text-white/60 text-xs block">下午好 ☀</text>
                    <text class="text-white font-semibold text-sm block"
                      >CHENY</text
                    >
                  </view>
                </view>
                <view class="flex items-center gap-2">
                  <view
                    style="
                      padding: 4px 10px;
                      border-radius: 12px;
                      background: rgba(255, 255, 255, 0.15);
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    "
                  >
                    <view
                      style="
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #4ade80;
                      "
                    ></view>
                    <text class="text-white text-xs">在线</text>
                  </view>
                  <view
                    style="
                      position: relative;
                      width: 32px;
                      height: 32px;
                      border-radius: 8px;
                      background: rgba(255, 255, 255, 0.12);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="notification"
                      size="16px"
                      color="#fff"
                    />
                    <view
                      style="
                        position: absolute;
                        top: -3px;
                        right: -3px;
                        min-width: 14px;
                        height: 14px;
                        border-radius: 7px;
                        background: #f56c6c;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <text
                        style="color: #fff; font-size: 9px; font-weight: 600"
                        >8</text
                      >
                    </view>
                  </view>
                  <view
                    style="
                      width: 32px;
                      height: 32px;
                      border-radius: 8px;
                      background: rgba(255, 255, 255, 0.12);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="setting"
                      size="16px"
                      color="#fff"
                    />
                  </view>
                </view>
              </view>
            </view>
            <view class="bg-gray-50 px-4 py-3">
              <text class="text-xs text-gray-400"
                >← 当前页面顶部的 Header 即为用户模式</text
              >
            </view>
          </view>
        </view>

        <!-- 返回按钮模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="返回模式"
            subtitle="显示返回按钮与页面标题"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-arrow-left"
            :show-decoration="true"
          />
          <view
            class="my-6 rounded-xl overflow-hidden"
            style="border: 1px solid #e5e7eb"
          >
            <view
              class="header-preview"
              style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 24rpx 24rpx 28rpx;
              "
            >
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view
                    style="
                      width: 32px;
                      height: 32px;
                      border-radius: 8px;
                      background: rgba(255, 255, 255, 0.15);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="arrow-left"
                      size="16px"
                      color="#fff"
                    />
                  </view>
                  <text class="text-white font-medium text-sm">详情页</text>
                </view>
                <view class="flex items-center gap-2">
                  <view
                    style="
                      position: relative;
                      width: 32px;
                      height: 32px;
                      border-radius: 8px;
                      background: rgba(255, 255, 255, 0.12);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="notification"
                      size="16px"
                      color="#fff"
                    />
                    <view
                      style="
                        position: absolute;
                        top: -3px;
                        right: -3px;
                        min-width: 14px;
                        height: 14px;
                        border-radius: 7px;
                        background: #f56c6c;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <text
                        style="color: #fff; font-size: 9px; font-weight: 600"
                        >3</text
                      >
                    </view>
                  </view>
                  <view
                    style="
                      width: 32px;
                      height: 32px;
                      border-radius: 8px;
                      background: rgba(255, 255, 255, 0.12);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <wd-icon
                      name="setting"
                      size="16px"
                      color="#fff"
                    />
                  </view>
                </view>
              </view>
            </view>
            <view class="bg-gray-50 px-4 py-3">
              <text class="text-xs text-gray-400"
                >子页面自动识别 → 显示返回按钮 + 标题</text
              >
            </view>
          </view>
        </view>

        <!-- 功能说明 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="核心能力"
            subtitle="Header 组件特性一览"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-four-points"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-shield-account text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >安全区适配</text
                >
                <text class="text-xs text-gray-500">自动适配状态栏高度</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-robot text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >AI 状态指示</text
                >
                <text class="text-xs text-gray-500"
                  >在线 / 忙碌 / 离线三种状态</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-bell-ring text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >消息角标</text
                >
                <text class="text-xs text-gray-500">右上角通知数量提示</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-view-compact text-xl text-purple-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >紧凑模式</text
                >
                <text class="text-xs text-gray-500"
                  >isCompactMode 缩小尺寸</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="智能导航，场景自适"
          subtitle="用户模式 · 返回模式 · AI状态 · 安全区适配"
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
