<template>
  <C_Layout
    title="工作台"
    :notification-count="unreadCount"
  >
    <view class="home">
      <view class="home__welcome">
        <view
          class="home__welcome-orbit"
          aria-hidden="true"
        />
        <view class="home__welcome-top">
          <text class="home__date">{{ todayText }}</text>
          <text class="home__brand">{{ appName }}</text>
        </view>
        <view class="home__greeting">
          <text>{{ greeting }}，</text>
          <text class="home__name">{{ displayName }}</text>
        </view>
        <text class="home__welcome-note">把常用操作放在手边。</text>
      </view>

      <button
        class="home__search"
        aria-label="搜索功能和页面"
        role="button"
        tabindex="0"
        @click="openSearch()"
        @keydown.enter="openSearch()"
        @keydown.space.prevent="openSearch()"
      >
        <C_Icon
          name="mdi-magnify"
          :size="18"
          color="var(--r-text-secondary)"
        />
        <text class="home__search-placeholder">搜索功能和页面</text>
        <text class="home__search-label">搜索</text>
        <C_Icon
          name="mdi-arrow-top-right"
          :size="14"
          color="var(--r-color-primary)"
        />
      </button>

      <view class="home__section">
        <view class="home__section-heading">
          <text>常用应用</text>
          <text class="home__section-note">一步直达</text>
        </view>
        <view class="home__app-grid">
          <button
            v-for="entry in pageEntries"
            :key="entry.url"
            class="home__app"
            :class="`home__app--${entry.tone}`"
            role="button"
            tabindex="0"
            @click="openPage(entry)"
            @keydown.enter="openPage(entry)"
            @keydown.space.prevent="openPage(entry)"
          >
            <view class="home__app-icon">
              <C_Icon
                :name="entry.icon"
                :size="21"
                color="currentColor"
              />
            </view>
            <view class="home__app-copy">
              <text class="home__app-title">{{ entry.title }}</text>
              <text class="home__app-description">{{ entry.description }}</text>
            </view>
            <C_Icon
              class="home__app-arrow"
              name="mdi-chevron-right"
              :size="13"
              color="var(--r-text-placeholder)"
            />
          </button>
        </view>
      </view>

      <view class="home__section">
        <view class="home__section-heading">
          <text>最近搜索</text>
          <button
            class="home__text-action"
            role="button"
            tabindex="0"
            @click="openSearch()"
            @keydown.enter="openSearch()"
            @keydown.space.prevent="openSearch()"
          >
            查看全部
            <C_Icon
              name="mdi-chevron-right"
              :size="13"
              color="var(--r-text-secondary)"
            />
          </button>
        </view>
        <view
          v-if="recentSearches.length"
          class="home__recent-list"
        >
          <button
            v-for="keyword in recentSearches"
            :key="keyword"
            class="home__recent"
            role="button"
            tabindex="0"
            @click="openSearch(keyword)"
            @keydown.enter="openSearch(keyword)"
            @keydown.space.prevent="openSearch(keyword)"
          >
            <C_Icon
              name="mdi-history"
              :size="16"
              color="var(--r-text-secondary)"
            />
            <text>{{ keyword }}</text>
            <C_Icon
              name="mdi-arrow-top-left"
              :size="15"
              color="var(--r-text-placeholder)"
            />
          </button>
        </view>
        <view
          v-else
          class="home__empty"
        >
          <view class="home__empty-icon"
            ><C_Icon
              name="mdi-magnify"
              :size="22"
              color="var(--r-text-placeholder)"
          /></view>
          <view class="home__empty-copy">
            <text>还没有搜索记录</text>
            <text>搜索过的内容会出现在这里</text>
          </view>
        </view>
      </view>

      <view class="home__section">
        <view class="home__section-heading"><text>我的空间</text></view>
        <view class="home__space-list">
          <button
            v-for="entry in spaceEntries"
            :key="entry.url"
            class="home__space"
            role="button"
            tabindex="0"
            @click="openSpaceEntry(entry)"
            @keydown.enter="openSpaceEntry(entry)"
            @keydown.space.prevent="openSpaceEntry(entry)"
          >
            <C_Icon
              :name="entry.icon"
              :size="20"
              color="var(--r-text-secondary)"
            />
            <view class="home__space-copy">
              <text>{{ entry.title }}</text>
              <text>{{ entry.description }}</text>
            </view>
            <C_Icon
              name="mdi-chevron-right"
              :size="13"
            />
          </button>
        </view>
      </view>

      <view class="home__footer">
        <view class="home__connection">
          <view
            class="home__status-dot"
            :class="{ 'is-online': networkOnline }"
          />
          <text>{{ networkLabel }}</text>
          <text class="home__footer-divider">·</text>
          <text>{{ platformName }}</text>
        </view>
        <button
          class="home__version"
          role="button"
          tabindex="0"
          @click="openAbout"
          @keydown.enter="openAbout"
          @keydown.space.prevent="openAbout"
          >v{{ projectVersion }}</button
        >
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useHomeData } from './data'
  const {
    unreadCount,
    displayName,
    todayText,
    greeting,
    pageEntries,
    recentSearches,
    spaceEntries,
    networkLabel,
    networkOnline,
    platformName,
    projectVersion,
    appName,
    openSearch,
    openAbout,
    openPage,
    openSpaceEntry,
  } = useHomeData()
</script>

<style lang="scss" scoped src="./index.scss"></style>
