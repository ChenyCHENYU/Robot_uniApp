/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08
 * @Description: 全局组件统一导出
 */

import C_Header from "./C_Header.vue";
import C_Tabbar from "./C_Tabbar.vue";

// 全局组件列表
const globalComponents = {
  C_Header,
  C_Tabbar,
};

// 安装全局组件的方法
export const installGlobalComponents = (app) => {
  Object.keys(globalComponents).forEach((name) => {
    app.component(name, globalComponents[name]);
  });
};

// 单独导出组件
export { C_Header, C_Tabbar };

export default globalComponents;
