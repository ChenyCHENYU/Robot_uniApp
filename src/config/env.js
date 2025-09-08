/**
 * 环境配置管理
 */

// 获取当前环境
const getEnv = () => {
  // 通过 process.env.NODE_ENV 或自定义标识判断环境
  return process.env.NODE_ENV || "development";
};

// 环境配置
const envConfig = {
  development: {
    API_BASE_URL: "https://dev-api.example.com",
    WS_URL: "wss://dev-ws.example.com",
    CDN_URL: "https://dev-cdn.example.com",
    APP_NAME: "企业应用框架-开发版",
    DEBUG: true,
    LOG_LEVEL: "debug",
  },
  staging: {
    API_BASE_URL: "https://staging-api.example.com",
    WS_URL: "wss://staging-ws.example.com",
    CDN_URL: "https://staging-cdn.example.com",
    APP_NAME: "企业应用框架-测试版",
    DEBUG: true,
    LOG_LEVEL: "info",
  },
  production: {
    API_BASE_URL: "https://api.example.com",
    WS_URL: "wss://ws.example.com",
    CDN_URL: "https://cdn.example.com",
    APP_NAME: "企业应用框架",
    DEBUG: false,
    LOG_LEVEL: "error",
  },
};

// 获取当前环境配置
const getCurrentConfig = () => {
  const env = getEnv();
  return envConfig[env] || envConfig.development;
};

// 导出配置
export default getCurrentConfig();
export { envConfig, getEnv };
