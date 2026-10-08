/** Steps 步骤条：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'steps',
  title: '步骤条',
  component: 'C_Steps',
  summary: '引导用户按步骤完成任务',
  category: '导航',
  instruction: '使用上一步和下一步切换流程，对比水平与竖向展示。',
  number: '09',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const currentStep = ref(1)

  const steps = [
    { title: '填写信息', description: '基本资料' },
    { title: '身份验证', description: '实名认证' },
    { title: '完成注册', description: '开始使用' },
  ]

  const verticalSteps = [
    { title: '提交申请', description: '2026-03-15 10:00' },
    { title: '审核中', description: '预计 1-3 个工作日' },
    { title: '审核完成', description: '等待处理' },
    { title: '已发放', description: '等待完成' },
  ]
  const previousStep = () => {
    currentStep.value = Math.max(0, currentStep.value - 1)
  }
  const nextStep = () => {
    currentStep.value = Math.min(steps.length - 1, currentStep.value + 1)
  }
  return { currentStep, steps, verticalSteps, previousStep, nextStep }
}
