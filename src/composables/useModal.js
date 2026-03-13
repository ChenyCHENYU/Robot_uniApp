/**
 * useModal - Promise 化弹窗调用
 *
 * @example
 * const { confirm, alert, toast } = useModal()
 * const ok = await confirm('确定删除？')
 * if (ok) { ... }
 */

export function useModal() {
  /**
   * 确认弹窗
   * @param {string} content
   * @param {object} options
   * @returns {Promise<boolean>}
   */
  const confirm = (content, options = {}) => {
    return new Promise((resolve) => {
      uni.showModal({
        title: options.title || "提示",
        content,
        showCancel: true,
        confirmText: options.confirmText || "确定",
        cancelText: options.cancelText || "取消",
        confirmColor: options.confirmColor || "#007AFF",
        ...options,
        success: (res) => resolve(!!res.confirm),
        fail: () => resolve(false),
      });
    });
  };

  /**
   * 提示弹窗（仅确定按钮）
   * @param {string} content
   * @param {object} options
   * @returns {Promise<void>}
   */
  const alert = (content, options = {}) => {
    return new Promise((resolve) => {
      uni.showModal({
        title: options.title || "提示",
        content,
        showCancel: false,
        confirmText: options.confirmText || "知道了",
        ...options,
        success: () => resolve(),
        fail: () => resolve(),
      });
    });
  };

  /**
   * 轻提示
   * @param {string} title
   * @param {object} options
   */
  const toast = (title, options = {}) => {
    uni.showToast({
      title,
      icon: options.icon || "none",
      duration: options.duration || 2000,
      ...options,
    });
  };

  /** 成功提示 */
  const success = (title) => toast(title, { icon: "success" });

  /** 错误提示 */
  const error = (title) => toast(title, { icon: "error" });

  return { confirm, alert, toast, success, error };
}
