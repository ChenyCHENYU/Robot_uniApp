/**
 * 业务常量
 *
 * 状态码 / 字典映射 / 业务枚举
 */

/** 接口响应码 */
export const RESPONSE_CODE = {
  SUCCESS: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/** 审批状态 */
export const APPROVAL_STATUS = {
  PENDING: 0, // 待审批
  APPROVED: 1, // 已通过
  REJECTED: 2, // 已拒绝
  REVOKED: 3, // 已撤回
};

export const APPROVAL_STATUS_MAP = {
  [APPROVAL_STATUS.PENDING]: { label: "待审批", color: "warning" },
  [APPROVAL_STATUS.APPROVED]: { label: "已通过", color: "success" },
  [APPROVAL_STATUS.REJECTED]: { label: "已拒绝", color: "error" },
  [APPROVAL_STATUS.REVOKED]: { label: "已撤回", color: "info" },
};

/** 文件类型限制 */
export const FILE_ACCEPT = {
  IMAGE: ["jpg", "jpeg", "png", "gif", "webp"],
  DOCUMENT: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
  VIDEO: ["mp4", "avi", "mov"],
};

/** 分页默认值 */
export const PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20,
};

/** 平台标识 */
export const PLATFORM = {
  H5: "h5",
  MP_WEIXIN: "mp-weixin",
  APP: "app",
};
