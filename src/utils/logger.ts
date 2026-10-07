/**
 * 统一日志工具 — 由环境配置 LOG_LEVEL 控制输出级别
 *
 * 级别优先级：debug < info < warn < error < silent
 * - 开发环境默认 'debug'（全量输出）
 * - 生产环境默认 'error'（仅 error，配合构建期 drop console 双保险）
 *
 * 用法：
 *   import { logger } from '@/utils/logger'
 *   logger.debug('调试信息', data)
 *   logger.info('普通信息')
 *   logger.warn('警告')
 *   logger.error('错误', err)
 */
import config from '@/config/env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

function resolveLevel(): LogLevel {
  const envLevel = (config.LOG_LEVEL || '').toLowerCase() as LogLevel
  if (envLevel && envLevel in LEVEL_PRIORITY) return envLevel
  return config.IS_PROD ? 'error' : 'debug'
}

const currentPriority = LEVEL_PRIORITY[resolveLevel()]

function noop() {}

function createMethod(
  level: LogLevel,
  method: (...args: any[]) => void
): (...args: any[]) => void {
  return LEVEL_PRIORITY[level] >= currentPriority ? method : noop
}

export const logger = {
  debug: createMethod('debug', console.debug.bind(console)),
  info: createMethod('info', console.info.bind(console)),
  log: createMethod('info', console.log.bind(console)),
  warn: createMethod('warn', console.warn.bind(console)),
  error: createMethod('error', console.error.bind(console)),
}

/** 当前生效级别（调试用） */
export const currentLogLevel: LogLevel = resolveLevel()
