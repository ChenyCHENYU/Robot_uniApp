/** IndexList 索引列表：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'index-list',
  title: '索引列表',
  component: 'C_IndexList',
  summary: '通讯录样式快速导航',
  category: '数据',
  instruction: '滚动通讯录或触摸右侧索引，查看当前定位的分组。',
  number: '24',
} as const

import { ref } from 'vue'

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const activeGroup = ref('A')
  const selectGroup = (letter: string) => {
    activeGroup.value = letter
  }
  const contactList = [
    { title: 'A', items: [{ name: '阿里巴巴' }, { name: '安踏' }] },
    {
      title: 'B',
      items: [{ name: '百度' }, { name: '比亚迪' }, { name: '北京银行' }],
    },
    { title: 'C', items: [{ name: '长城汽车' }, { name: '创维' }] },
    { title: 'D', items: [{ name: '大疆' }, { name: '滴滴出行' }] },
    {
      title: 'H',
      items: [{ name: '华为' }, { name: '海尔' }, { name: '好未来' }],
    },
    { title: 'J', items: [{ name: '京东' }, { name: '极氪' }] },
    { title: 'M', items: [{ name: '美团' }, { name: '蚂蚁集团' }] },
    { title: 'T', items: [{ name: '腾讯' }, { name: '头条' }] },
    { title: 'X', items: [{ name: '小米' }, { name: '携程' }] },
    { title: 'Z', items: [{ name: '字节跳动' }, { name: '中兴' }] },
  ]

  const techList = [
    { title: 'A', items: [{ name: 'Apple' }, { name: 'Amazon' }] },
    { title: 'G', items: [{ name: 'Google' }, { name: 'GitHub' }] },
    { title: 'M', items: [{ name: 'Microsoft' }, { name: 'Meta' }] },
    { title: 'T', items: [{ name: 'Tesla' }, { name: 'Twitter' }] },
  ]
  return { contactList, techList, activeGroup, selectGroup }
}
