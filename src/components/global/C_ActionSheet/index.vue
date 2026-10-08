<template>
  <view
    v-if="visible"
    class="c-action-sheet"
  >
    <!-- 遮罩 -->
    <view
      class="c-action-sheet__overlay"
      @touchmove.stop.prevent
      @wheel.stop.prevent
      @click="onOverlayClick"
    />

    <!-- 面板 -->
    <view
      class="c-action-sheet__panel"
      ref="panelRef"
      role="dialog"
      aria-modal="true"
      :aria-label="title || '选择操作'"
      tabindex="-1"
    >
      <view
        class="c-action-sheet__handle"
        aria-hidden="true"
      />
      <view
        v-if="title"
        class="c-action-sheet__title"
        >{{ title }}</view
      >

      <view class="c-action-sheet__options">
        <button
          v-for="(item, index) in actions"
          :key="index"
          :class="[
            'c-action-sheet__item',
            item.danger && 'c-action-sheet__item--danger',
            item.disabled && 'c-action-sheet__item--disabled',
            index === selectedIndex && 'c-action-sheet__item--selected',
          ]"
          :disabled="item.disabled"
          role="button"
          :tabindex="item.disabled ? -1 : 0"
          :aria-disabled="!!item.disabled"
          :aria-pressed="index === selectedIndex"
          @click="onSelect(item, index)"
          @keydown.enter.stop.prevent="onSelect(item, index)"
          @keydown.space.stop.prevent="onSelect(item, index)"
        >
          <C_Icon
            v-if="item.icon"
            :type="actionIconType(item.icon)"
            :name="item.icon"
            :size="20"
            color="currentColor"
          />
          <view class="c-action-sheet__item-copy">
            <text class="c-action-sheet__item-label">{{
              item.name || item.text
            }}</text>
            <text
              v-if="item.description"
              class="c-action-sheet__desc"
              >{{ item.description }}</text
            >
          </view>
          <C_Icon
            v-if="index === selectedIndex"
            name="i-mdi-check"
            :size="19"
            color="var(--r-color-primary)"
          />
        </button>
      </view>

      <template v-if="showCancel">
        <button
          class="c-action-sheet__cancel"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.stop.prevent="onCancel"
          @keydown.space.stop.prevent="onCancel"
          >{{ cancelText }}</button
        >
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'

  import C_Icon from '@/components/global/C_Icon/index.vue'
  import { defaultProps, useActionSheet, type ActionSheetItem } from './data'

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 标题 */
    title: { type: String, default: defaultProps.title },
    /** 操作项 [{ name, icon, description, danger, disabled }] */
    actions: { type: Array as PropType<ActionSheetItem[]>, default: () => [] },
    /** 当前选项序号，不设置时作为普通操作菜单 */
    selectedIndex: { type: Number, default: defaultProps.selectedIndex },
    /** 取消按钮文案 */
    cancelText: { type: String, default: defaultProps.cancelText },
    /** 是否显示取消按钮 */
    showCancel: { type: Boolean, default: defaultProps.showCancel },
    /** 点击遮罩关闭 */
    closeOnClickOverlay: {
      type: Boolean,
      default: defaultProps.closeOnClickOverlay,
    },
  })

  const emit = defineEmits<{
    'update:visible': [visible: boolean]
    select: [item: ActionSheetItem, index: number]
    cancel: []
  }>()
  const { panelRef, actionIconType, onOverlayClick, onSelect, onCancel } =
    useActionSheet(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
