<template>
  <div
    class="robot-feedback"
    :class="themeClass"
  >
    <transition name="feedback-fade">
      <div
        v-if="state.loading"
        class="robot-feedback__layer robot-feedback__loading-layer"
        :class="{ 'robot-feedback__layer--mask': state.loading.mask }"
      >
        <div
          v-if="state.loading.mask"
          class="robot-feedback__blocker"
          @touchmove.prevent
          @wheel.prevent
        />
        <div
          class="robot-feedback__loading"
          role="status"
          aria-live="polite"
        >
          <C_LoadingIndicator />
          <span class="robot-feedback__loading-label">{{
            state.loading.title
          }}</span>
        </div>
      </div>
    </transition>

    <transition name="feedback-modal">
      <div
        v-if="state.modal"
        class="robot-feedback__layer robot-feedback__modal-layer"
      >
        <div
          class="robot-feedback__backdrop"
          @touchmove.prevent
          @wheel.prevent
        />
        <section
          class="robot-feedback__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="robot-feedback-title"
          tabindex="-1"
          @touchmove.stop
          @wheel.stop
        >
          <div
            v-if="modalIcon"
            class="robot-feedback__modal-icon"
            :class="`robot-feedback__modal-icon--${modalIcon}`"
            aria-hidden="true"
            >{{ modalSymbol }}</div
          >
          <span
            v-if="modalOptions.eyebrow"
            class="robot-feedback__eyebrow"
            >{{ modalOptions.eyebrow }}</span
          >
          <h2
            id="robot-feedback-title"
            class="robot-feedback__title"
            >{{ modalOptions.title || '提示' }}</h2
          >
          <textarea
            v-if="modalOptions.editable"
            v-model="draft"
            class="robot-feedback__input"
            :placeholder="modalOptions.placeholderText"
            :aria-label="
              modalOptions.placeholderText || modalOptions.title || '请输入内容'
            "
            rows="3"
          />
          <p
            v-else-if="modalOptions.content"
            class="robot-feedback__body"
            >{{ modalOptions.content }}</p
          >
          <dl
            v-if="modalOptions.fields?.length"
            class="robot-feedback__fields"
          >
            <div
              v-for="field in modalOptions.fields"
              :key="field.label"
              class="robot-feedback__field"
              ><dt class="robot-feedback__field-label">{{ field.label }}</dt
              ><dd class="robot-feedback__field-value">{{
                field.value
              }}</dd></div
            >
          </dl>
          <div class="robot-feedback__actions">
            <button
              v-if="modalOptions.showCancel !== false"
              type="button"
              role="button"
              tabindex="0"
              class="robot-feedback__button robot-feedback__button--cancel"
              :style="cancelStyle"
              @click="cancel"
              @keydown.enter.prevent="cancel"
              @keydown.space.prevent="cancel"
              >{{ modalOptions.cancelText || '取消' }}</button
            >
            <button
              type="button"
              role="button"
              tabindex="0"
              class="robot-feedback__button robot-feedback__button--confirm"
              :style="confirmStyle"
              @click="confirm"
              @keydown.enter.prevent="confirm"
              @keydown.space.prevent="confirm"
              >{{ modalOptions.confirmText || '确定' }}</button
            >
          </div>
        </section>
      </div>
    </transition>

    <transition name="feedback-toast">
      <div
        v-if="state.toast"
        class="robot-feedback__layer robot-feedback__toast-layer"
        :class="`robot-feedback__toast-layer--${state.toast.position}`"
      >
        <div
          v-if="state.toast.mask"
          class="robot-feedback__blocker"
          @touchmove.prevent
          @wheel.prevent
        />
        <div
          class="robot-feedback__toast"
          role="status"
          aria-live="polite"
        >
          <img
            v-if="state.toast.image"
            class="robot-feedback__toast-image"
            :src="state.toast.image"
            alt=""
          />
          <C_LoadingIndicator
            v-else-if="state.toast.icon === 'loading'"
            size="small"
          />
          <span
            v-else-if="toastSymbol"
            class="robot-feedback__toast-icon"
            :class="{ 'robot-feedback__toast-icon--error': toastError }"
            aria-hidden="true"
            >{{ toastSymbol }}</span
          >
          <span>{{ state.toast.title }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import C_LoadingIndicator from '../C_LoadingIndicator/index.vue'
  import { useFeedbackHost } from './data'

  const {
    state,
    themeClass,
    modalOptions,
    modalIcon,
    modalSymbol,
    draft,
    toastSymbol,
    toastError,
    confirmStyle,
    cancelStyle,
    confirm,
    cancel,
  } = useFeedbackHost()
</script>

<style lang="scss">
  @import './index.scss';
</style>
