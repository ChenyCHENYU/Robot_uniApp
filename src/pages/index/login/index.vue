<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:34:18
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-08 15:34:36
 * @FilePath: \Robot_uniApp\src\pages\index\login\index.vue
 * @Description: 登录页面（模拟）
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <view class="login-container">
    <u-form :model="form" ref="formRef">
      <u-form-item label="用户名" prop="username">
        <u-input v-model="form.username" placeholder="请输入用户名" />
      </u-form-item>
      <u-form-item label="密码" prop="password">
        <u-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
      </u-form-item>
      <u-button @click="handleLogin" type="primary" :loading="loading">
        登录
      </u-button>
    </u-form>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const loading = ref(false);
const form = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login(form.value);

    // 登录成功，跳转到首页
    uni.switchTab({
      url: "/pages/index/index",
    });
  } catch (error) {
    // 错误处理已在 store 中完成
    console.log("登录失败");
  } finally {
    loading.value = false;
  }
};
</script>
