<template>
  <view
    v-if="visible && hasFeedback"
    class="robot-feedback"
    :class="themeClass"
  >
    <view
      v-if="state.loading"
      class="robot-feedback__layer robot-feedback__loading-layer"
    >
      <view
        v-if="state.loading.mask"
        class="robot-feedback__blocker"
        @touchmove.stop.prevent
      />
      <view
        class="robot-feedback__loading"
        role="status"
        aria-live="polite"
      >
        <C_LoadingIndicator />
        <text class="robot-feedback__loading-label">{{
          state.loading.title
        }}</text>
      </view>
    </view>
    <view
      v-if="state.modal"
      class="robot-feedback__layer robot-feedback__modal-layer"
    >
      <view
        class="robot-feedback__backdrop"
        @touchmove.stop.prevent
      />
      <view
        class="robot-feedback__modal"
        role="dialog"
        aria-modal="true"
        @touchmove.stop
      >
        <view
          v-if="modalIcon"
          class="robot-feedback__modal-icon"
          :class="`robot-feedback__modal-icon--${modalIcon}`"
          ><text>{{ modalSymbol }}</text></view
        >
        <text
          v-if="modalOptions.eyebrow"
          class="robot-feedback__eyebrow"
          >{{ modalOptions.eyebrow }}</text
        >
        <text class="robot-feedback__title">{{
          modalOptions.title || '提示'
        }}</text>
        <textarea
          v-if="modalOptions.editable"
          v-model="draft"
          class="robot-feedback__input"
          :placeholder="modalOptions.placeholderText"
          :focus="visible"
          :adjust-position="true"
          :maxlength="-1"
        />
        <text
          v-else-if="modalOptions.content"
          class="robot-feedback__body"
          >{{ modalOptions.content }}</text
        >
        <view
          v-if="modalOptions.fields?.length"
          class="robot-feedback__fields"
        >
          <view
            v-for="field in modalOptions.fields"
            :key="field.label"
            class="robot-feedback__field"
            ><text class="robot-feedback__field-label">{{ field.label }}</text
            ><text class="robot-feedback__field-value">{{
              field.value
            }}</text></view
          >
        </view>
        <view class="robot-feedback__actions">
          <button
            v-if="modalOptions.showCancel !== false"
            class="robot-feedback__button robot-feedback__button--cancel"
            :style="cancelStyle"
            @click="cancel"
            >{{ modalOptions.cancelText || '取消' }}</button
          >
          <button
            class="robot-feedback__button robot-feedback__button--confirm"
            :style="confirmStyle"
            @click="confirm"
            >{{ modalOptions.confirmText || '确定' }}</button
          >
        </view>
      </view>
    </view>
    <view
      v-if="state.sheet && sheetOptions"
      class="robot-feedback__layer robot-feedback__sheet-layer"
    >
      <view
        class="robot-feedback__backdrop"
        @click="cancel"
        @touchmove.stop.prevent
      />
      <view
        class="robot-feedback__sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="sheetOptions.title || sheetOptions.alertText || '选择操作'"
        @touchmove.stop
      >
        <view class="robot-feedback__sheet-handle" />
        <text class="robot-feedback__sheet-title">{{
          sheetOptions.title || sheetOptions.alertText || '选择操作'
        }}</text>
        <text
          v-if="sheetOptions.description"
          class="robot-feedback__sheet-description"
          >{{ sheetOptions.description }}</text
        >
        <scroll-view
          scroll-y
          class="robot-feedback__sheet-options"
        >
          <button
            v-for="(item, index) in sheetOptions.itemList"
            :key="index"
            class="robot-feedback__sheet-item"
            :class="{
              'robot-feedback__sheet-item--selected':
                sheetOptions.selectedIndex === index,
            }"
            :style="sheetItemStyle"
            @click="selectSheet(index)"
          >
            <view class="robot-feedback__sheet-copy"
              ><text class="robot-feedback__sheet-label">{{ item }}</text>
              <text
                v-if="sheetOptions.itemDescriptions?.[index]"
                class="robot-feedback__sheet-note"
                >{{ sheetOptions.itemDescriptions[index] }}</text
              >
            </view>
            <text
              v-if="sheetOptions.selectedIndex === index"
              class="robot-feedback__sheet-check"
              >✓</text
            >
          </button>
        </scroll-view>
        <button
          class="robot-feedback__sheet-cancel"
          @click="cancel"
          >取消</button
        >
      </view>
    </view>
    <view
      v-if="state.toast"
      class="robot-feedback__layer robot-feedback__toast-layer"
      :class="`robot-feedback__toast-layer--${state.toast.position}`"
    >
      <view
        v-if="state.toast.mask"
        class="robot-feedback__blocker"
        @touchmove.stop.prevent
      />
      <view
        class="robot-feedback__toast"
        role="status"
        aria-live="polite"
      >
        <image
          v-if="state.toast.image"
          class="robot-feedback__toast-image"
          :src="state.toast.image"
          mode="aspectFit"
        />
        <C_LoadingIndicator
          v-else-if="state.toast.icon === 'loading'"
          size="small"
        />
        <text
          v-else-if="toastSymbol"
          class="robot-feedback__toast-icon"
          :class="{ 'robot-feedback__toast-icon--error': toastError }"
          >{{ toastSymbol }}</text
        >
        <text>{{ state.toast.title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import C_LoadingIndicator from '../C_LoadingIndicator/index.vue'
  import { useNativeFeedbackHost } from './data'
  const {
    state,
    visible,
    hasFeedback,
    themeClass,
    modalOptions,
    sheetOptions,
    sheetItemStyle,
    selectSheet,
    modalIcon,
    modalSymbol,
    draft,
    toastSymbol,
    toastError,
    confirmStyle,
    cancelStyle,
    confirm,
    cancel,
  } = useNativeFeedbackHost()
</script>

<style lang="scss">
  @import './index.scss';
</style>
