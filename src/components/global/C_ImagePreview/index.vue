<template>
  <view
    v-if="visible"
    class="c-image-preview"
    @click="onClose"
  >
    <!-- 遮罩层 -->
    <view class="c-image-preview__overlay" />

    <!-- 图片区域 -->
    <Swiper
      class="c-image-preview__swiper"
      :current="currentIndex"
      @change="onSwiperChange"
      @click.stop
    >
      <SwiperItem
        v-for="(img, idx) in images"
        :key="idx"
        class="c-image-preview__item"
      >
        <MovableArea class="c-image-preview__area">
          <MovableView
            class="c-image-preview__view"
            direction="all"
            scale
            :scale-min="1"
            :scale-max="3"
            @click.stop="onClose"
            @longpress="onLongPress(img)"
          >
            <image
              class="c-image-preview__image"
              :src="img"
              mode="aspectFit"
              @error="onImageError(idx)"
            />
          </MovableView>
        </MovableArea>
      </SwiperItem>
    </Swiper>

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
      @click.stop="onClose"
    >
      <WdIcon
        name="close"
        size="22px"
        color="#fff"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { defaultProps } from './data'

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

  const emit = defineEmits(['update:visible', 'change', 'save'])

  const currentIndex = ref(props.current)

  watch(
    () => props.current,
    val => {
      currentIndex.value = val
    }
  )

  /** swiper 切换 */
  function onSwiperChange(e) {
    currentIndex.value = e.detail.current
    emit('change', currentIndex.value)
  }

  /** 关闭预览 */
  function onClose() {
    emit('update:visible', false)
  }

  /** 长按保存 */
  function onLongPress(imgUrl) {
    if (!props.longPress) return

    uni.showActionSheet({
      itemList: props.saveable ? ['保存到相册'] : [],
      success: res => {
        if (res.tapIndex === 0 && props.saveable) {
          saveImage(imgUrl)
        }
      },
    })
  }

  /**
   * 保存图片到相册
   * @param {string} imgUrl
   */
  function saveImage(imgUrl) {
    // 先下载到本地临时文件
    uni.downloadFile({
      url: imgUrl,
      success: res => {
        if (res.statusCode === 200) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({ title: '已保存到相册', icon: 'success' })
              emit('save', imgUrl)
            },
            fail: () => {
              uni.showToast({ title: '保存失败', icon: 'none' })
            },
          })
        }
      },
      fail: () => {
        uni.showToast({ title: '下载失败', icon: 'none' })
      },
    })
  }

  /** 图片加载失败 */
  function onImageError(idx) {
    console.warn(`[C_ImagePreview] 图片加载失败: index=${idx}`)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
