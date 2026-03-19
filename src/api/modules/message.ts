import { api } from '../factory'

export const getMessageList = api.get('/message/list')
export const getMessageDetail = (id: number) =>
  api.get('/message/detail')({ id })
export const markMessageRead = (id: number) => api.put('/message/read')({ id })
export const markAllMessageRead = api.put('/message/read-all')
export const deleteMessage = (id: number) => api.del('/message/item')({ id })
export const getUnreadCount = api.get('/message/unread-count', { silent: true })
