import { useEffect, useState } from 'react';
import { RequestUrl, waitTime } from 'src/utils';
import { useBoolean } from './useBoolean';
import { useRequest } from './useRequest';

export type ListRequestProps = {
  url: RequestUrl;
  params?: Record<string, any>;
  init?: RequestInit;
  autoRun?: boolean;
  loadingFn?: () => VoidFunction;
  cache?: boolean;
  pageSize?: number;
};

type ListRequest<T> = {
  list: T[];
  has_more: boolean;
};

/** 请求 */
export const useListRequest = <T = any> (props: ListRequestProps) => {
  const { url = '/', params = {}, init = {}, loadingFn, pageSize = 20 } = props || {};
  const [data, setData] = useState<ListRequest<T>>();
  const [page, setPage] = useState(0);
  const [refreshing, startRefreshing, endRefreshing] = useBoolean(false);
  const isFirstRequest = !data?.list?.length;
  const { runApi, loading, error } = useRequest({
    url,
    params: { page, limit: pageSize, ...params },
    init,
    loadingFn: isFirstRequest ? loadingFn : undefined,
  });

  const onRefresh = async (manual = false) => {
    setPage(0);
    await waitTime(0);
    try {
      !manual && startRefreshing();
      await waitTime(300);
      const res = await runApi();
      const { list, has_more } = res;
      setData({ list, has_more });
      setPage((p) => p + 1);
    } catch (error) {
      return false;
    } finally {
      !manual && endRefreshing();
    }
  };

  const onLoadMore = async () => {
    try {
      const res = await runApi();

      setData((_data) => ({
        list: [...(_data?.list || []), ...res.list],
        has_more: res.has_more,
      }));
      setPage((p) => p + 1);
      return { hasMore: res.has_more };
    } catch (error) {
      return { hasMore: true, error };
    }
  };

  useEffect(() => {
    if (!loading || !loadingFn) return;

    if (isFirstRequest) {
      const fn = loadingFn();
      return fn;
    } else {
      return () => { };
    }
  }, [isFirstRequest, loading, loadingFn]);

  return {
    refreshing,
    page,
    data,
    error,
    loading,
    runApi,
    onRefresh,
    onLoadMore,
  };
};
