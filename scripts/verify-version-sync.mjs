/**
 * 契约测试：版本号三处同步
 *
 * package.json（npm 包版本）↔ src/manifest.json（App versionName）↔
 * env/.env（VITE_APP_VERSION，注入 __VERSION__/APP_VERSION）必须一致。
 * 任一漂移即失败，防止"关于页显示 1.0 / 安装包 1.2"的版本错位。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []

const pkgVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/manifest.json')))
const manifestVersion = manifest.versionName

const envFile = fs.readFileSync(path.join(root, 'env/.env'), 'utf8')
const envMatch = envFile.match(/^VITE_APP_VERSION=(.+)$/m)
const envVersion = envMatch ? envMatch[1].trim() : null

if (!envVersion) {
  errors.push('env/.env 缺少 VITE_APP_VERSION')
} else if (envVersion !== pkgVersion) {
  errors.push(`env/.env VITE_APP_VERSION=${envVersion} ≠ package.json ${pkgVersion}`)
}

if (manifestVersion !== pkgVersion) {
  errors.push(`manifest versionName=${manifestVersion} ≠ package.json ${pkgVersion}`)
}

if (errors.length) {
  console.error('[verify-version-sync] 失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}

console.log(`[verify-version-sync] 通过：三处版本一致（v${pkgVersion}）`)
