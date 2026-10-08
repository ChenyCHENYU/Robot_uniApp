/** Cascader 级联选择：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'
import pcaData from '@/data/pca-code.json'

export const PAGE_META = {
  name: 'cascader',
  title: '级联选择',
  component: 'C_Cascader',
  summary: '多级联动选择器',
  category: '表单',
  instruction: '逐级选择地区和分类，完成后查看已选路径。',
  number: '26',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const showArea = ref(false)

  const showCategory = ref(false)

  const areaText = ref('')
  const areaValues = ref<string[]>([])
  const categoryValues = ref<string[]>([])

  const categoryText = ref('')

  const areaOptions = pcaData

  const categoryOptions = [
    {
      label: '电子产品',
      value: 'electronics',
      children: [
        { label: '手机', value: 'phone' },
        { label: '电脑', value: 'computer' },
        { label: '平板', value: 'tablet' },
      ],
    },
    {
      label: '服装',
      value: 'clothing',
      children: [
        { label: '男装', value: 'men' },
        { label: '女装', value: 'women' },
      ],
    },
  ]

  function onAreaConfirm(result: { values: string[]; labels: string[] }) {
    areaText.value = result.labels.join(' / ')
    areaValues.value = result.values
  }

  function onCategoryConfirm(result: { values: string[]; labels: string[] }) {
    categoryText.value = result.labels.join(' > ')
    categoryValues.value = result.values
  }
  return {
    showArea,
    showCategory,
    areaText,
    areaValues,
    categoryValues,
    categoryText,
    areaOptions,
    categoryOptions,
    onAreaConfirm,
    onCategoryConfirm,
  }
}
