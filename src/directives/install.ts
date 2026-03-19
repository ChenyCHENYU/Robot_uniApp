/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09 09:50:16
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 09:54:27
 * @FilePath: \Robot_uniApp\src\directives\install.js
 * @Description: 导入所有指令模块
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import type { App } from 'vue'
import { permissionDirectives } from './modules/permission'

const allDirectives = {
  ...permissionDirectives,
}

/** 安装所有自定义指令 */
export function installDirectives(app: App) {
  Object.keys(allDirectives).forEach(key => {
    app.directive(key, allDirectives[key as keyof typeof allDirectives])
  })
}
