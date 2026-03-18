<!--
 * @Description: 审批流模板页 - 审批工作流展示
-->
<template>
  <C_Layout>
    <view class="approval-page">
      <!-- 审批头部 -->
      <view
        class="approval-header"
        :style="{ background: statusConfig[detail.status].bg }"
      >
        <view class="header-content">
          <view class="status-icon-wrap">
            <wd-icon
              :name="statusConfig[detail.status].icon"
              size="32px"
              color="#fff"
            />
          </view>
          <text class="approval-status">{{
            statusConfig[detail.status].label
          }}</text>
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
        <view class="flow-list">
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
          @click="handleApprove"
        >
          <wd-icon
            name="check"
            size="18px"
            color="#fff"
          />
          <text class="btn-text approve">通过</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface FlowNode {
    title: string
    user: string
    status: string
    time?: string
    remark?: string
  }

  const statusConfig: Record<
    string,
    { label: string; icon: string; bg: string }
  > = {
    pending: {
      label: '审批中',
      icon: 'time',
      bg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    approved: {
      label: '已通过',
      icon: 'check',
      bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
    rejected: {
      label: '已驳回',
      icon: 'close',
      bg: 'linear-gradient(135deg, #f5576c, #f093fb)',
    },
  }

  const nodeStatusMap: Record<string, string> = {
    approved: '已通过',
    rejected: '已驳回',
    pending: '待审批',
    waiting: '等待中',
  }

  const detail = ref({
    title: '差旅费报销申请',
    status: 'pending',
    content:
      '因参加2025年Q1技术峰会，产生差旅费用，包含往返交通费、住宿费和餐饮费，请审批。',
    amount: '3,860.00',
  })

  const infoFields = ref([
    { label: '申请人', value: 'ChenY' },
    { label: '申请部门', value: '技术部' },
    { label: '申请时间', value: '2025-01-15 09:30' },
    { label: '审批编号', value: 'AP-2025-0042' },
    { label: '审批类型', value: '费用报销' },
  ])

  const flowNodes = ref<FlowNode[]>([
    {
      title: '提交申请',
      user: 'ChenY',
      status: 'approved',
      time: '01-15 09:30',
      remark: '提交审批申请',
    },
    {
      title: '部门主管审批',
      user: '李经理',
      status: 'approved',
      time: '01-15 14:20',
      remark: '费用合理，同意报销',
    },
    { title: '财务审核', user: '王会计', status: 'pending' },
    { title: '总经理审批', user: '张总', status: 'waiting' },
  ])

  const handleApprove = () => {
    uni.showModal({
      title: '确认通过',
      content: '确定通过该审批？',
      success: res => {
        if (res.confirm) {
          uni.showToast({ title: '审批通过', icon: 'success' })
        }
      },
    })
  }

  const handleReject = () => {
    uni.showModal({
      title: '确认驳回',
      content: '确定驳回该审批？',
      success: res => {
        if (res.confirm) {
          uni.showToast({ title: '已驳回', icon: 'none' })
        }
      },
    })
  }
</script>

<style lang="scss" scoped>
  .approval-page {
    background: var(--r-bg-page);
    min-height: 100vh;
    padding-bottom: 140rpx;
  }

  .approval-header {
    padding: 60rpx 32rpx 48rpx;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -20rpx;
      left: 0;
      right: 0;
      height: 40rpx;
      background: var(--r-bg-page);
      border-radius: 32rpx 32rpx 0 0;
    }

    .header-content {
      text-align: center;
    }

    .status-icon-wrap {
      width: 100rpx;
      height: 100rpx;
      margin: 0 auto 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }

    .approval-status {
      display: block;
      font-size: 32rpx;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8rpx;
    }

    .approval-title {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .info-card,
  .content-card,
  .flow-card {
    margin: 20rpx 24rpx;
    padding: 28rpx;
    background: var(--r-bg-card);
    border-radius: 20rpx;
    box-shadow: var(--r-shadow-sm);
  }

  .info-card {
    margin-top: 8rpx;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16rpx 0;
      border-bottom: 1rpx solid var(--r-border-light);

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 26rpx;
        color: var(--r-text-secondary);
      }

      .info-value {
        font-size: 26rpx;
        color: var(--r-text-primary);
        font-weight: 500;
      }
    }
  }

  .card-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: var(--r-text-primary);
    margin-bottom: 16rpx;
  }

  .content-text {
    font-size: 28rpx;
    color: var(--r-text-secondary);
    line-height: 1.7;
  }

  .amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid var(--r-border-light);

    .amount-label {
      font-size: 26rpx;
      color: var(--r-text-secondary);
    }

    .amount-value {
      font-size: 36rpx;
      font-weight: 700;
      color: #f56c6c;
    }
  }

  .flow-list {
    .flow-node {
      display: flex;
      gap: 20rpx;

      .node-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;

        .node-dot {
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
          flex-shrink: 0;

          &.approved {
            background: #43e97b;
          }
          &.rejected {
            background: #f56c6c;
          }
          &.pending {
            background: #4facfe;
          }
        }

        .node-line {
          width: 2rpx;
          flex: 1;
          min-height: 40rpx;
          background: #e0e0e0;

          &.approved {
            background: #43e97b;
          }
        }
      }

      .node-content {
        flex: 1;
        padding-bottom: 28rpx;

        .node-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4rpx;

          .node-title {
            font-size: 28rpx;
            font-weight: 600;
            color: var(--r-text-primary);
          }

          .node-status-text {
            font-size: 22rpx;

            &.approved {
              color: #43e97b;
            }
            &.rejected {
              color: #f56c6c;
            }
            &.pending {
              color: #4facfe;
            }
            &.waiting {
              color: #ccc;
            }
          }
        }

        .node-user {
          display: block;
          font-size: 24rpx;
          color: var(--r-text-secondary);
        }

        .node-time {
          font-size: 22rpx;
          color: var(--r-text-placeholder);
        }

        .node-remark {
          display: block;
          font-size: 24rpx;
          color: var(--r-text-secondary);
          margin-top: 8rpx;
          padding: 12rpx 16rpx;
          background: var(--r-bg-page);
          border-radius: 8rpx;
        }
      }
    }
  }

  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 20rpx;
    padding: 20rpx 32rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    background: var(--r-bg-card);
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

    .action-btn {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      border-radius: 16rpx;

      &.reject {
        background: rgba(245, 108, 108, 0.1);
        border: 1rpx solid rgba(245, 108, 108, 0.3);
      }

      &.approve {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
      }

      .btn-text {
        font-size: 28rpx;
        font-weight: 600;

        &.reject {
          color: #f56c6c;
        }
        &.approve {
          color: #fff;
        }
      }
    }
  }
</style>
