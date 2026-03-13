<template>
  <view class="c-search">
    <!-- 搜索栏 -->
    <view class="c-search__bar">
      <view class="c-search__input-wrap">
        <wd-icon
          name="search"
          size="18px"
          color="#909399"
          class="c-search__icon"
        />
        <input
          class="c-search__input"
          :value="keyword"
          :placeholder="placeholder"
          confirm-type="search"
          @input="onInput"
          @confirm="onSearch"
          @focus="focused = true"
        />
        <view v-if="keyword" class="c-search__clear" @click="onClear">
          <wd-icon name="close-circle-filled" size="16px" color="#c0c4cc" />
        </view>
      </view>
      <view v-if="showAction" class="c-search__action" @click="onSearch">
        搜索
      </view>
    </view>

    <!-- 搜索历史 -->
    <view
      v-if="showHistory && !keyword && historyList.length"
      class="c-search__history"
    >
      <view class="c-search__history-header">
        <text class="c-search__history-title">搜索历史</text>
        <text class="c-search__history-clear" @click="onClearHistory"
          >清空</text
        >
      </view>
      <view class="c-search__history-tags">
        <view
          v-for="(item, index) in historyList"
          :key="index"
          class="c-search__history-tag"
          @click="onClickHistory(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  defaultProps,
  getSearchHistory,
  saveSearchHistory,
  clearSearchHistory,
} from "./data.js";

const props = defineProps({
  /** 搜索框占位文本 */
  placeholder: { type: String, default: defaultProps.placeholder },
  /** 最大历史记录数 */
  maxHistory: { type: Number, default: defaultProps.maxHistory },
  /** 是否显示搜索历史 */
  showHistory: { type: Boolean, default: defaultProps.showHistory },
  /** 防抖时间 (ms) */
  debounceTime: { type: Number, default: defaultProps.debounceTime },
  /** 是否显示搜索按钮 */
  showAction: { type: Boolean, default: true },
});

const emit = defineEmits(["search", "input", "clear"]);

const keyword = ref("");
const focused = ref(false);
const historyList = ref([]);
let debounceTimer = null;

onMounted(() => {
  historyList.value = getSearchHistory();
});

const onInput = (e) => {
  keyword.value = e.detail.value;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit("input", keyword.value);
  }, props.debounceTime);
};

const onSearch = () => {
  if (!keyword.value.trim()) return;
  historyList.value = saveSearchHistory(keyword.value, props.maxHistory);
  emit("search", keyword.value);
};

const onClear = () => {
  keyword.value = "";
  emit("clear");
};

const onClickHistory = (item) => {
  keyword.value = item;
  onSearch();
};

const onClearHistory = () => {
  clearSearchHistory();
  historyList.value = [];
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
