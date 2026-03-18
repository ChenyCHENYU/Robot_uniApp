/**
 * useUpload - 文件上传
 *
 * @example
 * const { files, chooseImage, upload, removeFile } = useUpload({ maxCount: 9 })
 */
import { ref } from 'vue'
import { FILE_ACCEPT } from '@/constants'

/**
 *
 */
interface UploadOptions {
  maxCount?: number
  maxSize?: number
  accept?: string
  compress?: boolean
}

interface UploadFileItem {
  url: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  response?: any
}

/**
 * 文件上传组合式函数
 */
export function useUpload(options: UploadOptions = {}) {
  const {
    maxCount = 9,
    maxSize = 10 * 1024 * 1024,
    accept: _accept = FILE_ACCEPT.IMAGE,
    compress = true,
  } = options

  const files = ref<UploadFileItem[]>([])
  const uploading = ref(false)

  const chooseImage = () => {
    const remaining = maxCount - files.value.length
    if (remaining <= 0) {
      uni.showToast({ title: `最多上传${maxCount}张`, icon: 'none' })
      return Promise.resolve([])
    }

    return new Promise<UploadFileItem[]>(resolve => {
      uni.chooseImage({
        count: remaining,
        sizeType: compress ? ['compressed'] : ['original'],
        sourceType: ['album', 'camera'],
        success: res => {
          const validFiles = (
            res.tempFiles as Array<{
              path: string
              name?: string
              size: number
            }>
          ).filter(file => {
            if (file.size > maxSize) {
              uni.showToast({ title: '文件过大', icon: 'none' })
              return false
            }
            return true
          })
          const newFiles: UploadFileItem[] = validFiles.map(file => ({
            url: file.path,
            name: file.name || file.path.split('/').pop() || 'unknown',
            size: file.size,
            status: 'pending',
            progress: 0,
          }))
          files.value = [...files.value, ...newFiles]
          resolve(newFiles)
        },
        fail: () => resolve([]),
      })
    })
  }

  const uploadFile = (
    uploadUrl: string,
    index: number,
    formData: Record<string, any> = {}
  ) => {
    const file = files.value[index]
    if (!file || file.status === 'success') return Promise.resolve(file)

    file.status = 'uploading'
    return new Promise((resolve, reject) => {
      const task = uni.uploadFile({
        url: uploadUrl,
        filePath: file.url,
        name: 'file',
        formData,
        success: res => {
          const data = JSON.parse(res.data)
          file.status = 'success'
          file.response = data
          resolve(data)
        },
        fail: err => {
          file.status = 'error'
          reject(err)
        },
      })
      task.onProgressUpdate(res => {
        file.progress = res.progress
      })
    })
  }

  const uploadAll = async (
    uploadUrl: string,
    formData: Record<string, any> = {}
  ) => {
    uploading.value = true
    try {
      const tasks = files.value.map((_, i) =>
        files.value[i].status !== 'success'
          ? uploadFile(uploadUrl, i, formData)
          : Promise.resolve()
      )
      return await Promise.all(tasks)
    } finally {
      uploading.value = false
    }
  }

  const removeFile = (index: number) => {
    files.value.splice(index, 1)
  }

  const clear = () => {
    files.value = []
  }

  return {
    files,
    uploading,
    chooseImage,
    uploadFile,
    uploadAll,
    removeFile,
    clear,
  }
}
