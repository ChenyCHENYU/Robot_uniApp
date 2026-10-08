import pages from '@/pages.json'
import packageInfo from '../../package.json'
import {
  components,
  categories,
} from '@/components/local/ComponentCatalog/data'

/** 构建时读取项目登记文件；所有计数随实际页面和组件登记变化。 */
export const registeredRoutes = [
  ...pages.pages.map(page => `/${page.path}`),
  ...pages.subPackages.flatMap(group =>
    group.pages.map(page => `/${group.root}/${page.path}`)
  ),
]
export const registeredComponents = components.filter(component =>
  registeredRoutes.includes(component.path)
)
export const registeredCategories = categories.filter(category =>
  registeredComponents.some(component => component.category === category.key)
)
export const componentDemoRoutes = registeredRoutes.filter(
  route => route.startsWith('/pages/demo/') && route !== '/pages/demo/index'
)
export const applicationRoutes = registeredRoutes.filter(
  route => !route.startsWith('/pages/demo/')
)

/** 版本与技术栈来自当前 package.json 声明，不伪装为运行统计。 */
export const projectVersion = packageInfo.version
export const projectDependencies = [
  { name: 'Vue', version: packageInfo.dependencies.vue },
  { name: 'TypeScript', version: packageInfo.devDependencies.typescript },
  { name: 'Wot Design', version: packageInfo.dependencies['wot-design-uni'] },
  { name: 'Pinia', version: packageInfo.dependencies.pinia },
]

export const projectInventory = [
  { value: String(registeredComponents.length), label: '组件' },
  { value: String(registeredCategories.length), label: '分类' },
  { value: String(componentDemoRoutes.length), label: '示例' },
  { value: String(applicationRoutes.length), label: '页面' },
]
