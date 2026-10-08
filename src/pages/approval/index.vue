<!--
 * @Description: 审批流模板页 - 审批工作流展示
-->
<template>
  <C_Layout
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresh="handleRefresh"
  >
    <view class="approval-page">
      <!-- 加载/空态 -->
      <view
        v-if="!detail"
        class="approval-loading"
      >
        <text class="loading-text">{{
          loading ? '正在加载审批详情…' : errorText
        }}</text
        ><button
          v-if="!loading"
          class="retry-btn"
          @click="retry"
          >重新加载</button
        >
      </view>

      <template v-if="detail">
        <!-- 审批头部 -->
        <view
          class="approval-header"
          :class="detail.status"
        >
          <view class="header-content">
            <view class="status-icon-wrap">
              <wd-icon
                :name="approvalState.icon"
                size="28px"
                color="var(--r-color-primary)"
              />
            </view>
            <text class="approval-status">{{ approvalState.label }}</text>
            <text class="approval-title">{{ detail.title }}</text>
          </view>
        </view>

        <!-- 审批信息 -->
        <view class="info-card">
          <view
            class="info-row"
            v-for="field in infoFields"
            :key="field.label"
          >
            <text class="info-label">{{ field.label }}</text>
            <text class="info-value">{{ field.value }}</text>
          </view>
        </view>

        <!-- 审批内容 -->
        <view class="content-card">
          <text class="card-title">审批内容</text>
          <text class="content-text">{{ detail.content }}</text>
          <view
            v-if="detail.amount"
            class="amount-row"
          >
            <text class="amount-label">申请金额</text>
            <text class="amount-value">¥{{ detail.amount }}</text>
          </view>
        </view>

        <!-- 审批流程 -->
        <view class="flow-card">
          <text class="card-title">审批流程</text>
          <text
            v-if="flowNodes.length === 0"
            class="section-empty"
            >暂无审批流程记录</text
          ><view class="flow-list">
            <view
              v-for="(node, index) in flowNodes"
              :key="index"
              class="flow-node"
            >
              <view class="node-indicator">
                <view
                  class="node-dot"
                  :class="node.status"
                >
                  <wd-icon
                    v-if="node.status === 'approved'"
                    name="check"
                    size="12px"
                    color="#fff"
                  />
                  <wd-icon
                    v-else-if="node.status === 'rejected'"
                    name="close"
                    size="12px"
                    color="#fff"
                  />
                </view>
                <view
                  v-if="index < flowNodes.length - 1"
                  class="node-line"
                  :class="node.status"
                ></view>
              </view>
              <view class="node-content">
                <view class="node-header">
                  <text class="node-title">{{ node.title }}</text>
                  <text
                    class="node-status-text"
                    :class="node.status"
                    >{{ nodeStatusMap[node.status] }}</text
                  >
                </view>
                <text class="node-user">{{ node.user }}</text>
                <text
                  v-if="node.time"
                  class="node-time"
                  >{{ node.time }}</text
                >
                <text
                  v-if="node.remark"
                  class="node-remark"
                  >{{ node.remark }}</text
                >
              </view>
            </view>
          </view>
        </view>

        <!-- 操作按钮（待我审批时显示） -->
        <view
          v-if="detail.status === 'pending'"
          class="action-bar"
        >
          <view
            class="action-btn reject"
            :class="{ disabled: acting }"
            @click="handleReject"
          >
            <wd-icon
              name="close"
              size="18px"
              color="#f56c6c"
            />
            <text class="btn-text reject">驳回</text>
          </view>
          <view
            class="action-btn approve"
            :class="{ disabled: acting }"
            @click="handleApprove"
          >
            <wd-icon
              name="check"
              size="18px"
              color="#fff"
            />
            <text class="btn-text approve">{{
              acting ? '处理中…' : '通过审批'
            }}</text>
          </view>
        </view>
      </template>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useApprovalPage } from './data'

  const {
    nodeStatusMap,
    detail,
    loading,
    acting,
    errorText,
    approvalState,
    retry,
    flowNodes,
    infoFields,
    handleApprove,
    handleReject,
    refreshing,
    handleRefresh,
  } = useApprovalPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
