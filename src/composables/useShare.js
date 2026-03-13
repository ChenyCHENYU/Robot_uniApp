/**
 * useShare - 分享能力封装
 *
 * @example
 * const { shareToTimeline, shareToMessage } = useShare()
 *
 * 在页面中使用 onShareAppMessage / onShareTimeline 即可
 * 此 composable 提供统一的分享参数管理
 */
import { ref } from "vue";

export function useShare(defaultOptions = {}) {
  const shareInfo = ref({
    title: defaultOptions.title || "Robot 企业移动平台",
    path: defaultOptions.path || "/pages/index/index",
    imageUrl: defaultOptions.imageUrl || "",
  });

  /**
   * 设置分享信息
   * @param {object} options
   */
  const setShareInfo = (options) => {
    shareInfo.value = { ...shareInfo.value, ...options };
  };

  /**
   * 获取分享到聊天的配置（用于 onShareAppMessage）
   */
  const getMessageConfig = () => ({
    title: shareInfo.value.title,
    path: shareInfo.value.path,
    imageUrl: shareInfo.value.imageUrl,
  });

  /**
   * 获取分享到朋友圈的配置（用于 onShareTimeline）
   */
  const getTimelineConfig = () => ({
    title: shareInfo.value.title,
    query: "",
    imageUrl: shareInfo.value.imageUrl,
  });

  return {
    shareInfo,
    setShareInfo,
    getMessageConfig,
    getTimelineConfig,
  };
}
