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
  quickValidate,
  validateWithToast,
} from "@/utils/v_verify";

export function useLoginData() {
  const userStore = useUserStore();
  const loading = ref(false);
  const rememberLogin = ref(["remember"]);

  // 表单数据
  const form = reactive({
    username: "CHENY",
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

  // 切换记住登录
  const toggleRemember = () => {
    if (rememberLogin.value.includes("remember")) {
      rememberLogin.value = [];
    } else {
      rememberLogin.value = ["remember"];
    }
  };

  // 字段失焦验证
  const handleFieldBlur = (field) => {
    const value = form[field];
    const fieldRules = rules[field];
    const result = quickValidate(value, fieldRules, field);

    if (!result.valid) {
      uni.showToast({
        title: result.message,
        icon: "none",
        duration: 2000,
      });
    }
  };

  // 登录处理
  const handleLogin = async () => {
    // 使用弹框验证表单
    if (!validateWithToast(form, rules)) {
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
          nickname: "CHENY",
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

  return {
    // 响应式数据
    loading,
    rememberLogin,
    form,

    // 方法
    handleLogin,
    handleForgotPassword,
    handleWechatLogin,
    handleQuickLogin,
    handleFieldBlur,
    toggleRemember,
  };
}
