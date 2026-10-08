import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@dcloudio/uni-app', () => ({ onLoad: vi.fn(), onShow: vi.fn() }))
vi.mock('@/api', () => ({
  getCrudList: vi.fn(),
  createCrudItem: vi.fn(),
  updateCrudItem: vi.fn(),
  deleteCrudItem: vi.fn(),
  submitForm: vi.fn(),
}))

import { getCrudList, submitForm, type CrudItem } from '@/api'
import { useCrudListPage } from '@/pages/crud-list/data'
import { useFormTemplatePage } from '@/pages/form-template/data'
import { useSearchResultPage } from '@/pages/search-result/data'
import { STORAGE_KEYS } from '@/constants'

/** 控制请求完成时机，复现连续输入与重试过程。 */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const item = (id: string): CrudItem => ({
  id,
  title: id,
  description: '',
  status: 0,
  createTime: '2026-10-08',
})

const listResult = (id: string, total = 2) => ({
  list: [item(id)],
  total,
  page: 1,
  pageSize: 10,
})

beforeEach(() => {
  vi.restoreAllMocks()
  vi.mocked(getCrudList).mockReset()
  vi.mocked(submitForm).mockReset()
  uni.clearStorageSync()
})

describe('业务列表查询与分页恢复', () => {
  it('请求途中改变筛选会排队执行最新查询，不丢失用户输入', async () => {
    const first = deferred<ReturnType<typeof listResult>>()
    vi.mocked(getCrudList)
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(listResult('最新记录'))
    const page = useCrudListPage()
    const loading = page.loadList(true)
    page.keyword.value = '新关键词'
    page.handleFilterSelect(1)
    expect(getCrudList).toHaveBeenCalledTimes(1)
    first.resolve(listResult('旧记录'))
    await loading
    await vi.waitFor(() => {
      expect(getCrudList).toHaveBeenCalledTimes(2)
      expect(page.dataList.value[0].id).toBe('最新记录')
    })
    expect(vi.mocked(getCrudList).mock.calls[1][0]).toMatchObject({
      page: 1,
      keyword: '新关键词',
      status: 1,
    })
  })

  it('下一页失败后保留已有列表，并在重试时请求同一页', async () => {
    vi.mocked(getCrudList).mockResolvedValueOnce(listResult('第一页'))
    const page = useCrudListPage()
    await page.loadList(true)
    vi.mocked(getCrudList).mockRejectedValueOnce(new Error('offline'))
    await page.loadList()
    expect(page.dataList.value.map(record => record.id)).toEqual(['第一页'])
    expect(page.errorText.value).toBe('数据加载失败，请重试')
    vi.mocked(getCrudList).mockResolvedValueOnce(listResult('第二页'))
    await page.loadList()
    expect(
      vi
        .mocked(getCrudList)
        .mock.calls.slice(1)
        .map(([params]) => params?.page)
    ).toEqual([2, 2])
    expect(page.dataList.value.map(record => record.id)).toEqual([
      '第一页',
      '第二页',
    ])
    expect(page.finished.value).toBe(true)
  })
})

describe('人员填报真实交互与失败保留', () => {
  it('部门选择读取 ActionSheet 的 item，日期接受用户选择的历史日期', () => {
    const page = useFormTemplatePage()
    page.validateField('department')
    expect(page.errors.department).toBeTruthy()
    page.showDeptPicker.value = true
    page.onDeptSelect({ item: { name: '技术部' } })
    page.handleDateChange({ detail: { value: '2022-04-03' } })
    expect(page.form.department).toBe('技术部')
    expect(page.errors.department).toBe('')
    expect(page.showDeptPicker.value).toBe(false)
    expect(page.form.joinDate).toBe('2022-04-03')
  })

  it('非法邮箱不提交，逐字段显示错误', async () => {
    const page = useFormTemplatePage()
    Object.assign(page.form, {
      name: '陈宇',
      phone: '13800138000',
      gender: 'male',
      department: '技术部',
      email: 'invalid-email',
    })
    await page.handleSubmit()
    expect(submitForm).not.toHaveBeenCalled()
    expect(page.errors.email).toBeTruthy()
  })

  it('提交中禁止重复提交与重置，失败后保留用户填写内容', async () => {
    const request = deferred<{ id: string }>()
    vi.mocked(submitForm).mockReturnValueOnce(request.promise)
    const page = useFormTemplatePage()
    Object.assign(page.form, {
      name: ' 陈宇 ',
      phone: '13800138000',
      gender: 'male',
      department: '技术部',
      joinDate: '2022-04-03',
      skills: ['Vue'],
    })
    const pending = page.handleSubmit()
    await page.handleSubmit()
    page.handleReset()
    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(page.form.name).toBe(' 陈宇 ')
    expect(vi.mocked(submitForm).mock.calls[0][0]).toMatchObject({
      name: '陈宇',
      joinDate: '2022-04-03',
      skills: ['Vue'],
    })
    request.reject(new Error('offline'))
    await pending
    expect(page.submitting.value).toBe(false)
    expect(page.form.phone).toBe('13800138000')
    expect(page.form.skills).toEqual(['Vue'])
  })
})

describe('页面与组件搜索', () => {
  it('分类计数与实际关键词结果一致，并导航到实际组件页面', () => {
    const navigate = vi.spyOn(uni, 'navigateTo')
    const page = useSearchResultPage()
    page.quickSearch('C_Form')
    expect(
      page.resultTabs.value.find(tab => tab.key === 'component')?.count
    ).toBe(1)
    expect(page.resultTabs.value.find(tab => tab.key === 'page')?.count).toBe(0)
    expect(page.currentResults.value).toHaveLength(1)
    page.handleResultClick(page.currentResults.value[0])
    expect(navigate).toHaveBeenCalledWith({
      url: '/pages/demo/10-form/index',
    })
  })

  it('搜索历史去重并持久化，清空输入回到历史而不是展示旧结果', () => {
    const page = useSearchResultPage()
    page.quickSearch('列表')
    page.quickSearch('图标')
    page.quickSearch('列表')
    expect(page.searchHistory.value).toEqual(['列表', '图标'])
    expect(JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))).toEqual(
      ['列表', '图标']
    )
    page.clearKeyword()
    expect(page.hasSearched.value).toBe(false)
    expect(page.keyword.value).toBe('')
    page.clearHistory()
    expect(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY)).toBe('')
  })

  it('损坏的历史缓存不会阻止进入搜索页面', () => {
    uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, '{broken')
    const page = useSearchResultPage()
    expect(page.searchHistory.value).toEqual([])
    page.quickSearch('数据看板')
    expect(page.currentResults.value[0].path).toBe('/pages/dashboard/index')
  })
})
