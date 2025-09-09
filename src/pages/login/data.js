/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09
 * @FilePath: \Robot_uniApp\src\pages\login\data.js
 * @Description: 登录页面数据和逻辑
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

import { ref, reactive } from "vue";
import { useUserStore } from "@/stores/modules/user";
import {
  required,
  length,
  username as usernameRule,
  email,
} from "@/utils/v_verify";

export function useLoginData() {
  const userStore = useUserStore();
  const loading = ref(false);
  const rememberLogin = ref(["remember"]);
  const formRef = ref(null); // 表单引用

  // 错误状态管理
  const errors = reactive({
    username: "",
    password: "",
  });

  // 表单数据
  const form = reactive({
    username: "admin",
    password: "123456",
  });

  // 表单验证规则
  const rules = {
    username: [
      required("用户名"),
      length("用户名", 3, 20),
      // 支持用户名或邮箱登录
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback();
            return;
          }
          // 检查是否为邮箱格式
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // 检查是否为用户名格式
          const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

          if (emailPattern.test(value) || usernamePattern.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的用户名或邮箱格式"));
          }
        },
        trigger: "blur",
      },
    ],
    password: [required("密码"), length("密码", 6, 20)],
  };

  // 样式配置
  const glassInputStyle = {
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: "32rpx",
  };

  const glassButtonStyle = {
    background:
      "linear-gradient(135deg, rgba(0, 212, 255, 0.8), rgba(11, 11, 254, 0.8))",
    border: "1rpx solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20rpx)",
    height: "96rpx",
    fontSize: "32rpx",
    fontWeight: "bold",
    color: "#ffffff",
    boxShadow: "0 8rpx 32rpx rgba(0, 212, 255, 0.3)",
  };

  // 登录处理
  const handleLogin = async () => {
    // 先进行表单验证
    try {
      await validateForm();
    } catch (error) {
      uni.showToast({
        title: "请检查输入信息",
        icon: "none",
      });
      return;
    }

    loading.value = true;
    try {
      // 模拟登录API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟登录成功
      const mockUserData = {
        token: "mock_token_" + Date.now(),
        userInfo: {
          id: 1,
          username: form.username,
          nickname: "智能用户",
          avatar: "/static/avatar.png",
          email: "user@example.com",
        },
        permissions: ["user:read", "user:write"],
        roles: ["user"],
      };

      // 更新store
      userStore.token = mockUserData.token;
      userStore.userInfo = mockUserData.userInfo;
      userStore.permissions = mockUserData.permissions;
      userStore.roles = mockUserData.roles;
      userStore.isLoggedIn = true;
      userStore.loginTime = new Date().toISOString();

      uni.showToast({
        title: "登录成功！",
        icon: "success",
      });

      // 延迟跳转到主页
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      }, 1500);
    } catch (error) {
      uni.showToast({
        title: "登录失败，请重试",
        icon: "none",
      });
      console.error("登录失败:", error);
    } finally {
      loading.value = false;
    }
  };

  // 忘记密码
  const handleForgotPassword = () => {
    uni.showToast({
      title: "请联系管理员重置密码",
      icon: "none",
      duration: 2000,
    });
  };

  // 微信登录
  const handleWechatLogin = () => {
    uni.showToast({
      title: "微信登录功能开发中",
      icon: "none",
    });
  };

  // 快速体验
  const handleQuickLogin = async () => {
    // 直接使用游客账户登录
    form.username = "guest";
    form.password = "123456";
    await handleLogin();
  };

  // 表单验证函数
  const validateForm = () => {
    return new Promise((resolve, reject) => {
      const usernameValid = validateField("username");
      const passwordValid = validateField("password");

      if (usernameValid && passwordValid) {
        resolve();
      } else {
        reject(new Error("表单验证失败"));
      }
    });
  };

  // 清空表单
  const clearForm = () => {
    form.username = "";
    form.password = "";
    rememberLogin.value = [];
    resetFormValidation();
  };

  // 重置表单验证
  const resetFormValidation = () => {
    errors.username = "";
    errors.password = "";
  };

  // 单字段验证
  const validateField = (field) => {
    const value = form[field];

    if (field === "username") {
      if (!value || value.trim() === "") {
        errors.username = "用户名不能为空";
        return false;
      }
      if (value.length < 3 || value.length > 20) {
        errors.username = "用户名长度在3-20位之间";
        return false;
      }
      // 检查用户名或邮箱格式
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
      if (!emailPattern.test(value) && !usernamePattern.test(value)) {
        errors.username = "请输入正确的用户名或邮箱格式";
        return false;
      }
      errors.username = "";
      return true;
    }

    if (field === "password") {
      if (!value || value.trim() === "") {
        errors.password = "密码不能为空";
        return false;
      }
      if (value.length < 6 || value.length > 20) {
        errors.password = "密码长度在6-20位之间";
        return false;
      }
      errors.password = "";
      return true;
    }

    return true;
  };

  // 清除字段错误
  const clearFieldError = (field) => {
    if (errors[field]) {
      errors[field] = "";
    }
  };

  return {
    // 响应式数据
    loading,
    rememberLogin,
    form,
    errors,
    rules,
    formRef,
    glassInputStyle,
    glassButtonStyle,

    // 方法
    handleLogin,
    handleForgotPassword,
    handleWechatLogin,
    handleQuickLogin,
    validateForm,
    validateField,
    clearFieldError,
    clearForm,
    resetFormValidation,
  };
}
