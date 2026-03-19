import { api } from '../factory'

export const getCrudList = api.get('/crud/list')
export const getCrudDetail = (id: string) => api.get('/crud/detail')({ id })
export const createCrudItem = api.post('/crud/item')
export const updateCrudItem = api.put('/crud/item')
export const deleteCrudItem = (id: string) => api.del('/crud/item')({ id })
