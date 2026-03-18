/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09 09:50:16
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 09:54:27
 * @FilePath: \Robot_uniApp\src\directives\install.js
 * @Description: 导入所有指令模块
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import { permissionDirectives } from './modules/permission'
// 未来添加新指令时在这里导入
// import { copyDirectives } from './modules/copy'

// 合并所有指令
const allDirectives = {
  ...permissionDirectives,
  // 未来添加新指令时在这里展开
  // ...copyDirectives,
}

/** 安装所有自定义指令 */
export function installDirectives(app) {
  Object.keys(allDirectives).forEach(key => {
    app.directive(key, allDirectives[key])
  })
}
