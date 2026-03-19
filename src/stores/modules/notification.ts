import { defineStore } from 'pinia'

interface NotificationState {
  /** 推送通知开关 */
  pushEnabled: boolean
  /** 消息免打扰 */
  doNotDisturb: boolean
  /** 免打扰时间段 */
  quietHours: { start: string; end: string }
  /** 各类型通知开关 */
  typeSettings: Record<string, boolean>
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    pushEnabled: true,
    doNotDisturb: false,
    quietHours: { start: '22:00', end: '08:00' },
    typeSettings: {
      system: true,
      notify: true,
      todo: true,
      interact: true,
    },
  }),

  getters: {
    isTypeEnabled: state => (type: string) => state.typeSettings[type] ?? true,
  },

  actions: {
    togglePush(enabled: boolean) {
      this.pushEnabled = enabled
    },
    toggleDoNotDisturb(enabled: boolean) {
      this.doNotDisturb = enabled
    },
    setTypeEnabled(type: string, enabled: boolean) {
      this.typeSettings[type] = enabled
    },
  },

  persist: {
    key: 'notification-store',
    paths: ['pushEnabled', 'doNotDisturb', 'quietHours', 'typeSettings'],
  },
})
