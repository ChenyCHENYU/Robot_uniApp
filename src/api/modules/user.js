/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:23:06
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-08 15:27:16
 * @FilePath: \Robot_uniApp\src\api\modules\user.js
 * @Description: 用户API定义（静态模拟）
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import http from "@/utils/http";

// 用户相关API - 一行定义一个接口
export const login = (data) => http.post("/auth/login", data);
export const logout = () => http.post("/auth/logout"); // 添加 logout 接口
export const getUserInfo = () => http.get("/user/info", {}, { silent: true }); // 静默请求
export const updateUser = (data) => http.put("/user/info", data);
export const getUserList = (params) => http.get("/user/list", params);
export const uploadAvatar = (filePath) => http.upload("/user/avatar", filePath);
