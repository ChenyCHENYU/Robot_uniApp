<template>
  <view class="c-upload">
    <!-- 已上传文件列表 -->
    <view
      v-for="(file, index) in modelValue"
      :key="index"
      class="c-upload__item"
      :style="{ width: previewSize, height: previewSize }"
      @click="onPreview(index)"
    >
      <image
        class="c-upload__preview"
        :src="file.url || file"
        mode="aspectFill"
      />

      <!-- 上传进度 -->
      <view
        v-if="file.status === 'uploading'"
        class="c-upload__progress"
      >
        <view
          class="c-upload__progress-bar"
          :style="{ width: (file.progress || 0) + '%' }"
        />
      </view>

      <!-- 上传失败 -->
      <view
        v-if="file.status === 'error'"
        class="c-upload__status"
      >
        <wd-icon
          name="warning"
          size="24px"
          color="#fff"
        />
      </view>

      <!-- 删除按钮 -->
      <view
        v-if="deletable && !disabled"
        class="c-upload__delete"
        @click.stop="onDelete(index)"
      >
        <wd-icon
          name="close"
          size="12px"
          color="#fff"
        />
      </view>
    </view>

    <!-- 添加按钮 -->
    <view
      v-if="modelValue.length < maxCount && !disabled"
      class="c-upload__add"
      :style="{ width: previewSize, height: previewSize }"
      @click="onChoose"
    >
      <wd-icon
        name="add"
        size="32px"
        color="#c0c4cc"
      />
      <text class="c-upload__add-text"
        >{{ modelValue.length }}/{{ maxCount }}</text
      >
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  const props = defineProps({
    /** 文件列表 (v-model) */
    modelValue: { type: Array, default: () => [] },
    /** 最大上传数 */
    maxCount: { type: Number, default: defaultProps.maxCount },
    /** 最大文件大小 (bytes) */
    maxSize: { type: Number, default: defaultProps.maxSize },
    /** 预览尺寸 */
    previewSize: { type: String, default: defaultProps.previewSize },
    /** 是否可删除 */
    deletable: { type: Boolean, default: defaultProps.deletable },
    /** 是否禁用 */
    disabled: { type: Boolean, default: defaultProps.disabled },
  })

  const emit = defineEmits([
    'update:modelValue',
    'choose',
    'delete',
    'preview',
    'oversize',
  ])

  const onChoose = () => {
    const remaining = props.maxCount - props.modelValue.length
    if (remaining <= 0) return

    uni.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const validFiles = []
        for (const file of res.tempFiles) {
          if (file.size > props.maxSize) {
            emit('oversize', file)
            continue
          }
          validFiles.push({
            url: file.path,
            name: file.name || file.path.split('/').pop(),
            size: file.size,
            status: 'pending',
            progress: 0,
          })
        }
        emit('update:modelValue', [...props.modelValue, ...validFiles])
        emit('choose', validFiles)
      },
    })
  }

  const onDelete = index => {
    const file = props.modelValue[index]
    const newList = [...props.modelValue]
    newList.splice(index, 1)
    emit('update:modelValue', newList)
    emit('delete', file, index)
  }

  const onPreview = index => {
    const urls = props.modelValue.map(f => f.url || f)
    uni.previewImage({ urls, current: index })
    emit('preview', props.modelValue[index], index)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
