<template>
  <view
    v-if="visible"
    class="c-image-preview"
    @click="onClose"
  >
    <!-- 遮罩层 -->
    <view class="c-image-preview__overlay" />

    <!-- 图片区域 -->
    <swiper
      class="c-image-preview__swiper"
      :current="currentIndex"
      @change="onSwiperChange"
      @click.stop
    >
      <swiper-item
        v-for="(img, idx) in images"
        :key="idx"
        class="c-image-preview__item"
      >
        <movable-area
          class="c-image-preview__area"
          scale-area
        >
          <movable-view
            class="c-image-preview__view"
            direction="all"
            scale
            :scale-min="1"
            :scale-max="3"
            @click.stop="onClose"
            @touchstart="onPreviewTouchStart"
            @touchmove="onPreviewTouchMove"
            @touchend="onPreviewTouchEnd"
            @touchcancel="onPreviewTouchEnd"
            @longpress="onLongPress(img)"
          >
            <view
              v-if="failedImages.includes(idx)"
              class="c-image-preview__error"
              >图片加载失败</view
            >
            <image
              v-else
              class="c-image-preview__image"
              :src="img"
              mode="aspectFit"
              lazy-load
              @error="onImageError(idx)"
            />
          </movable-view>
        </movable-area>
      </swiper-item>
    </swiper>

    <!-- 指示器 -->
    <view
      v-if="showIndicator && images.length > 1"
      class="c-image-preview__indicator"
    >
      <text class="c-image-preview__indicator-text"
        >{{ currentIndex + 1 }} / {{ images.length }}</text
      >
    </view>

    <!-- 关闭按钮 -->
    <view
      class="c-image-preview__close"
      role="button"
      aria-label="关闭图片预览"
      @click.stop="onClose"
    >
      <wd-icon
        name="close"
        size="22px"
        color="#fff"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { defaultProps, downloadPreviewImage } from './data'
  import { logger } from '@/utils/logger'

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 图片列表 */
    images: { type: Array, default: () => defaultProps.images },
    /** 当前图片索引 */
    current: { type: Number, default: defaultProps.current },
    /** 是否显示指示器 */
    showIndicator: { type: Boolean, default: defaultProps.showIndicator },
    /** 是否可保存到相册 */
    saveable: { type: Boolean, default: defaultProps.saveable },
    /** 是否支持长按菜单 */
    longPress: { type: Boolean, default: defaultProps.longPress },
  })

  const emit = defineEmits([
    'update:visible',
    'update:current',
    'change',
    'save',
  ])

  const currentIndex = ref(0)
  const failedImages = ref<number[]>([])
  let longPressAllowed = false
  let longPressMenuOpen = false
  let pressStart: { x: number; y: number } | null = null

  /** 单指静止按压才可弹出菜单，避免轮播吞掉全局结束事件后误触长按。 */
  function onPreviewTouchStart(event) {
    const touches = event.touches || []
    longPressAllowed = touches.length === 1
    pressStart = longPressAllowed
      ? { x: touches[0].pageX, y: touches[0].pageY }
      : null
  }

  /** 滑动及双指操作取消当前按压菜单资格。 */
  function onPreviewTouchMove(event) {
    const touches = event.touches || []
    if (
      touches.length !== 1 ||
      !pressStart ||
      Math.abs(touches[0].pageX - pressStart.x) > 10 ||
      Math.abs(touches[0].pageY - pressStart.y) > 10
    ) {
      longPressAllowed = false
    }
  }

  /** 取消过期按压；已弹出菜单时阻止抬手产生点击关闭菜单。 */
  function onPreviewTouchEnd(event) {
    if (longPressMenuOpen) event.preventDefault?.()
    longPressAllowed = false
    pressStart = null
  }

  watch(
    () => [props.current, props.images.length, props.visible],
    () => {
      currentIndex.value = Math.max(
        0,
        Math.min(props.current, props.images.length - 1)
      )
      if (props.visible) failedImages.value = []
    },
    { immediate: true }
  )

  /** swiper 切换 */
  function onSwiperChange(e) {
    currentIndex.value = e.detail.current
    emit('change', currentIndex.value)
    emit('update:current', currentIndex.value)
  }

  /** 关闭预览 */
  function onClose() {
    emit('update:visible', false)
  }

  /** 长按保存 */
  function onLongPress(imgUrl) {
    if (!props.longPress || !longPressAllowed) return
    // 不可保存时无菜单可展示，直接提示（showActionSheet 要求 itemList 非空）
    if (!props.saveable) {
      uni.showToast({ title: '图片不支持保存', icon: 'none' })
      return
    }

    let saveActionLabel = '保存到相册'
    // #ifdef H5
    saveActionLabel = '下载图片'
    // #endif
    longPressMenuOpen = true
    uni.showActionSheet({
      itemList: [saveActionLabel],
      success: res => {
        if (res.tapIndex === 0) {
          saveImage(imgUrl)
        }
      },
      complete: () => {
        longPressMenuOpen = false
      },
    })
  }

  /**
   * 保存图片到相册
   * @param {string} imgUrl
   */
  async function saveImage(imgUrl) {
    // #ifdef H5
    try {
      await downloadPreviewImage(imgUrl)
      uni.showToast({ title: '已开始下载', icon: 'success' })
      emit('save', imgUrl)
    } catch {
      uni.showToast({
        title: '下载失败，请检查图片地址或跨域授权',
        icon: 'none',
      })
    }
    return
    // #endif
    // #ifndef H5
    // 获取平台可保存的本地路径，兼容包内素材与网络图片。
    uni.getImageInfo({
      src: imgUrl,
      success: res => {
        uni.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => {
            uni.showToast({ title: '已保存到相册', icon: 'success' })
            emit('save', imgUrl)
          },
          fail: () => {
            uni.showToast({ title: '保存失败', icon: 'none' })
          },
        })
      },
      fail: () => {
        uni.showToast({ title: '图片读取失败', icon: 'none' })
      },
    })
    // #endif
  }

  /** 图片加载失败 */
  function onImageError(idx) {
    failedImages.value.push(idx)
    logger.warn(`[C_ImagePreview] 图片加载失败: index=${idx}`)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
