/**
 * 包体预算检查 — 构建产物体积门禁
 *
 * 超预算时非零退出，适合接入 CI / 提交前检查。
 * 预算在下方 budgets 数组中维护。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MIB = 1024 * 1024

const budgets = [
  { name: 'H5', directory: 'dist/build/h5', maxBytes: 2 * MIB },
  {
    name: '微信小程序',
    directory: 'dist/build/mp-weixin',
    maxBytes: 2.2 * MIB,
  },
]

const directorySize = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).reduce((total, entry) => {
    const target = path.join(directory, entry.name)
    return (
      total +
      (entry.isDirectory() ? directorySize(target) : fs.statSync(target).size)
    )
  }, 0)

const failures = []
for (const budget of budgets) {
  const target = path.join(root, budget.directory)
  if (!fs.existsSync(target)) {
    console.log(`${budget.name}：跳过（未构建）`)
    continue
  }
  const bytes = directorySize(target)
  const actual = (bytes / MIB).toFixed(2)
  const limit = (budget.maxBytes / MIB).toFixed(2)
  console.log(`${budget.name}：${actual} MiB / 预算 ${limit} MiB`)
  if (bytes > budget.maxBytes) {
    failures.push(`${budget.name} 包体 ${actual} MiB 超过预算 ${limit} MiB`)
  }
}

if (failures.length) {
  console.error('包体预算检查失败：')
  failures.forEach(message => console.error(`- ${message}`))
  process.exitCode = 1
} else {
  console.log('包体预算检查通过')
}
