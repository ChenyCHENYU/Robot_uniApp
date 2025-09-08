import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(
  createPersistedState({
    storage: {
      getItem(key) {
        return uni.getStorageSync(key);
      },
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
    },
  })
);

export default pinia;

// 统一导出所有 store
export { useUserStore } from "./modules/user";
export { useAppStore } from "./modules/app";
