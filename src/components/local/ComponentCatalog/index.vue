<template>
  <C_Layout title="组件库">
    <view class="catalog">
      <view class="catalog__hero">
        <text class="catalog__eyebrow">ROBOT UNIAPP</text>
        <text class="catalog__title">组件探索</text>
        <text class="catalog__description"
          >从基础展示到复杂交互，找到适合你的组件。</text
        >
        <view class="catalog__meta"
          ><text>{{ total }} 个组件</text
          ><text>{{ categoryOptions.length - 1 }} 个分类</text></view
        >
      </view>
      <view class="catalog__search">
        <C_Icon
          name="mdi-magnify"
          :size="21"
          color="var(--r-text-secondary)"
        />
        <input
          v-model="keyword"
          placeholder="搜索组件、功能或关键词"
          placeholder-style="color:var(--r-text-secondary)"
          aria-label="搜索组件"
        />
        <button
          v-if="keyword"
          class="catalog__clear"
          aria-label="清空搜索"
          @click="keyword = ''"
          ><C_Icon
            name="mdi-close"
            :size="18"
            color="var(--r-text-secondary)"
        /></button>
      </view>
      <scroll-view
        scroll-x
        class="catalog__categories"
      >
        <view
          class="catalog__category-row"
          role="tablist"
          aria-label="组件分类"
        >
          <button
            v-for="category in categoryOptions"
            :key="category.key"
            class="catalog__category"
            :class="{ 'is-active': activeCategory === category.key }"
            role="tab"
            :aria-selected="activeCategory === category.key"
            :aria-label="`${category.name}，${category.count} 个组件`"
            @click="activeCategory = category.key"
          >
            <text>{{ category.name }}</text>
          </button>
        </view>
      </scroll-view>
      <view class="catalog__result-heading"
        ><text>{{
          keyword ? '搜索结果' : getCategoryName(activeCategory)
        }}</text
        ><text class="catalog__result-count"
          >{{ filteredComponents.length }} 项</text
        ></view
      >
      <view class="catalog__list">
        <button
          v-for="component in filteredComponents"
          :key="component.id"
          class="catalog__card"
          @click="navigateToDemo(component)"
        >
          <view class="catalog__icon"
            ><C_Icon
              :name="component.icon"
              :size="24"
              color="var(--r-color-primary)"
          /></view>
          <view class="catalog__info">
            <text class="catalog__name">{{ component.name }}</text>
            <text class="catalog__desc">{{ component.description }}</text>
            <view class="catalog__tags"
              ><text
                v-for="tag in component.tags.slice(0, 2)"
                :key="tag"
                >{{ tag }}</text
              ></view
            >
          </view>
          <C_Icon
            name="mdi-chevron-right"
            :size="18"
            color="var(--r-text-placeholder)"
          />
        </button>
      </view>
      <view
        v-if="filteredComponents.length === 0"
        class="catalog__empty"
      >
        <C_Icon
          name="mdi-magnify"
          :size="40"
          color="var(--r-text-placeholder)"
        />
        <text>没有找到相关组件</text
        ><text class="catalog__empty-tip">试试其他关键词或切换分类。</text>
        <button
          class="demo-button"
          @click="resetFilters"
          >重置筛选</button
        >
      </view>
      <text class="catalog__footer"
        >每个组件都有可操作的示例，点击即可体验。</text
      >
    </view>
  </C_Layout>
</template>
<script setup lang="ts">
  import { useComponentCatalog } from './data'
  const {
    keyword,
    activeCategory,
    categoryOptions,
    filteredComponents,
    total,
    resetFilters,
    navigateToDemo,
    getCategoryName,
  } = useComponentCatalog()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
