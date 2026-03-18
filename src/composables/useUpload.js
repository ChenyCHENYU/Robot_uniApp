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
export function useUpload(options = {}) {
  const {
    maxCount = 9,
    maxSize = 10 * 1024 * 1024, // 10MB
    _accept = FILE_ACCEPT.IMAGE,
    compress = true,
  } = options

  const files = ref([])
  const uploading = ref(false)

  /**
   * 选择图片
   * @returns {Promise<Array>}
   */
  const chooseImage = () => {
    const remaining = maxCount - files.value.length
    if (remaining <= 0) {
      uni.showToast({ title: `最多上传${maxCount}张`, icon: 'none' })
      return Promise.resolve([])
    }

    return new Promise(resolve => {
      uni.chooseImage({
        count: remaining,
        sizeType: compress ? ['compressed'] : ['original'],
        sourceType: ['album', 'camera'],
        success: res => {
          const validFiles = res.tempFiles.filter(file => {
            if (file.size > maxSize) {
              uni.showToast({ title: '文件过大', icon: 'none' })
              return false
            }
            return true
          })
          const newFiles = validFiles.map(file => ({
            url: file.path,
            name: file.name || file.path.split('/').pop(),
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

  /**
   * 上传单个文件
   * @param {string} uploadUrl 上传接口地址
   * @param {number} index 文件索引
   * @param {object} formData 附加表单数据
   * @returns {Promise<object>}
   */
  const uploadFile = (uploadUrl, index, formData = {}) => {
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

  /**
   * 上传所有待上传文件
   * @param {string} uploadUrl
   * @param {object} formData
   */
  const uploadAll = async (uploadUrl, formData = {}) => {
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

  const removeFile = index => {
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
