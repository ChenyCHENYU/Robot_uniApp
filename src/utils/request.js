import { useUserStore } from "@/stores/user";

class Http {
  constructor() {
    this.baseURL =
      process.env.UNI_APP_API_BASE_URL || "https://api.example.com";
    this.timeout = 30000;
    this.loadingCount = 0;
  }

  // 显示loading
  showLoading() {
    if (this.loadingCount === 0) {
      uni.showLoading({ title: "加载中...", mask: true });
    }
    this.loadingCount++;
  }

  // 隐藏loading
  hideLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      uni.hideLoading();
    }
  }

  // 统一请求处理
  async request(url, options = {}) {
    const {
      method = "GET",
      data = {},
      silent = false, // 静默请求，不显示loading和错误提示
      ...config
    } = options;

    // 构建请求配置
    const requestConfig = {
      url: url.startsWith("http") ? url : this.baseURL + url,
      method,
      data,
      timeout: this.timeout,
      header: {
        "Content-Type": "application/json",
        ...config.header,
      },
      ...config,
    };

    // 添加token
    const userStore = useUserStore();
    if (userStore.token) {
      requestConfig.header.Authorization = `Bearer ${userStore.token}`;
    }

    // 显示loading（静默请求除外）
    if (!silent) {
      this.showLoading();
    }

    try {
      const response = await this.executeRequest(requestConfig);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error, silent);
    } finally {
      if (!silent) {
        this.hideLoading();
      }
    }
  }

  // 执行请求
  executeRequest(config) {
    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        success: resolve,
        fail: reject,
      });
    });
  }

  // 处理响应
  handleResponse(response) {
    const { statusCode, data } = response;

    if (statusCode === 200) {
      // 业务成功
      if (data.code === 0 || data.success === true) {
        return data.data || data;
      }
      // 业务失败
      throw {
        code: data.code,
        message: data.message || "请求失败",
      };
    }

    // HTTP错误
    throw {
      code: statusCode,
      message: this.getStatusMessage(statusCode),
    };
  }

  // 处理错误
  async handleError(error, silent) {
    // token过期处理
    if (error.code === 401) {
      const userStore = useUserStore();
      userStore.logout();
      uni.reLaunch({ url: "/pages/login/index" });
      return Promise.reject(error);
    }

    // 显示错误提示（静默请求除外）
    if (!silent) {
      uni.showToast({
        title: error.message || "网络错误",
        icon: "none",
      });
    }

    return Promise.reject(error);
  }

  // 获取状态码对应的错误信息
  getStatusMessage(code) {
    const messages = {
      400: "请求参数错误",
      401: "未授权，请重新登录",
      403: "权限不足",
      404: "请求的资源不存在",
      500: "服务器内部错误",
      502: "网关错误",
      503: "服务不可用",
    };
    return messages[code] || "网络错误";
  }

  // GET请求
  get(url, params, options = {}) {
    return this.request(url, {
      method: "GET",
      data: params,
      ...options,
    });
  }

  // POST请求
  post(url, data, options = {}) {
    return this.request(url, {
      method: "POST",
      data,
      ...options,
    });
  }

  // PUT请求
  put(url, data, options = {}) {
    return this.request(url, {
      method: "PUT",
      data,
      ...options,
    });
  }

  // DELETE请求
  delete(url, params, options = {}) {
    return this.request(url, {
      method: "DELETE",
      data: params,
      ...options,
    });
  }

  // 文件上传
  upload(url, filePath, formData = {}) {
    return new Promise((resolve, reject) => {
      const userStore = useUserStore();

      this.showLoading();

      uni.uploadFile({
        url: url.startsWith("http") ? url : this.baseURL + url,
        filePath,
        name: "file",
        formData,
        header: {
          Authorization: userStore.token ? `Bearer ${userStore.token}` : "",
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 0 || data.success === true) {
              resolve(data.data || data);
            } else {
              throw new Error(data.message || "上传失败");
            }
          } catch (error) {
            reject(error);
          }
        },
        fail: reject,
        complete: () => {
          this.hideLoading();
        },
      });
    });
  }
}

export default new Http();
