<!--
 * @Description: 顶部导航栏 — 简洁现代风格（token 驱动，亮/暗主题自适应）
 * 左：返回/头像；中：标题+副标题；右：通知/设置
-->
<template>
  <view class="c-header">
    <view
      class="c-header__bg"
      aria-hidden="true"
    ></view>

    <view class="c-header__bar">
      <!-- 左区 -->
      <view class="c-header__left">
        <view
          v-if="showBack"
          class="c-header__btn"
          hover-class="c-header__btn--hover"
          :hover-stay-time="80"
          @click="handleBack"
        >
          <wd-icon
            name="arrow-left"
            size="20px"
            :color="iconColor"
          />
        </view>
        <view
          v-else-if="showUser"
          class="c-header__avatar-box"
          @click="emit('userClick')"
        >
          <image
            class="c-header__avatar"
            :src="avatarSrc"
            mode="aspectFill"
          />
          <view class="c-header__online"></view>
        </view>
      </view>

      <!-- 中区：标题 -->
      <view class="c-header__center">
        <text class="c-header__title">{{ displayTitle }}</text>
        <text
          v-if="displaySubtitle"
          class="c-header__subtitle"
          >{{ displaySubtitle }}</text
        >
      </view>

      <!-- 右区 -->
      <view class="c-header__right">
        <view
          class="c-header__btn"
          hover-class="c-header__btn--hover"
          :hover-stay-time="80"
          @click="emit('notificationClick')"
        >
          <wd-icon
            name="notification"
            size="20px"
            :color="iconColor"
          />
          <view
            v-if="notificationCount > 0"
            class="c-header__dot"
          >
            <text class="c-header__dot-text">{{
              notificationCount > 99 ? '99+' : notificationCount
            }}</text>
          </view>
        </view>
        <view
          class="c-header__btn"
          hover-class="c-header__btn--hover"
          :hover-stay-time="80"
          @click="emit('settingsClick')"
        >
          <wd-icon
            name="setting"
            size="20px"
            :color="iconColor"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { headerProps, headerEmits, useHeaderData } from './data'

  const props = defineProps(headerProps)
  const emit = defineEmits(headerEmits)

  const { displayTitle, displaySubtitle, avatarSrc, handleBack } =
    useHeaderData(props, emit)

  /** 图标色：跟随主题文字色（亮色深字/暗色浅字） */
  const iconColor = computed(() => 'var(--r-text-regular, #3c3c43)')
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
