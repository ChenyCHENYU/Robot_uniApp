/**
 * usePagination - 分页逻辑
 *
 * @example
 * const { list, loadMore, refresh, finished, loading } = usePagination(fetchList)
 */
import { ref, reactive } from "vue";
import { PAGINATION } from "@/constants";

export function usePagination(fetchFn, options = {}) {
  const { pageSize = PAGINATION.PAGE_SIZE, immediate = false } = options;

  const list = ref([]);
  const loading = ref(false);
  const finished = ref(false);
  const refreshing = ref(false);

  const pagination = reactive({
    page: PAGINATION.PAGE,
    pageSize,
    total: 0,
  });

  const loadMore = async (params = {}) => {
    if (loading.value || finished.value) return;
    loading.value = true;
    try {
      const res = await fetchFn({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...params,
      });
      const rows = res.rows || res.list || res.data || [];
      pagination.total = res.total || 0;

      if (refreshing.value) {
        list.value = rows;
        refreshing.value = false;
      } else {
        list.value = [...list.value, ...rows];
      }

      if (
        list.value.length >= pagination.total ||
        rows.length < pagination.pageSize
      ) {
        finished.value = true;
      } else {
        pagination.page++;
      }
    } catch (error) {
      console.error("[usePagination] loadMore failed:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const refresh = async (params = {}) => {
    pagination.page = PAGINATION.PAGE;
    finished.value = false;
    refreshing.value = true;
    list.value = [];
    return loadMore(params);
  };

  const reset = () => {
    list.value = [];
    pagination.page = PAGINATION.PAGE;
    pagination.total = 0;
    finished.value = false;
    loading.value = false;
    refreshing.value = false;
  };

  if (immediate) {
    loadMore();
  }

  return {
    list,
    loading,
    finished,
    refreshing,
    pagination,
    loadMore,
    refresh,
    reset,
  };
}
