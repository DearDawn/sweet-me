import { useCallback, useEffect, useRef, useState } from 'react';
import { RequestUrl, waitTime } from '../utils';
import { useBoolean } from './useBoolean';
import { useRequest } from './useRequest';

export type ListRequestProps = {
  url: RequestUrl;
  params?: Record<string, any> & { pageRewrite?: number; };
  init?: RequestInit;
  autoRun?: boolean;
  loadingFn?: () => VoidFunction;
  cache?: boolean;
  pageSize?: number;
};

type ListRequest<T> = {
  list: T[];
  has_more: boolean;
  has_later?: boolean;
  first?: T;
  last?: T;
};

/** 请求 */
export const useListRequest = <T = any> (props: ListRequestProps) => {
  const { url = '/', params = {}, init = {}, loadingFn, pageSize = 20 } = props || {};
  const { page: _page, pageRewrite, ...rest } = params || {};
  const [data, setData] = useState<ListRequest<T>>();
  const [page, setPage] = useState(_page || 0);
  const pageRef = useRef(page);
  const pageLaterRef = useRef(page);
  const [refreshing, startRefreshing, endRefreshing] = useBoolean(false);
  const isFirstRequest = !data?.list?.length;
  const { runApi, loading, error } = useRequest({
    url,
    params: { page: pageRewrite ?? page, limit: pageSize, ...rest },
    init,
    loadingFn: isFirstRequest ? loadingFn : undefined,
  });

  const onRefresh = useCallback(async (manual = false) => {
    if (refreshing) return;

    setPage(0);
    pageRef.current = 0;
    pageLaterRef.current = 0;
    await waitTime(0);
    try {
      !manual && startRefreshing();
      await waitTime(300);
      const res = await runApi();
      const { ...rest } = res;
      setData({ ...rest });
      setPage((p) => { pageRef.current = p + 1; return pageRef.current; });
    } catch (error) {
      return false;
    } finally {
      !manual && endRefreshing();
    }
  }, [endRefreshing, refreshing, runApi, startRefreshing]);

  const onLoadMore = useCallback(async () => {
    try {

      setPage(pageRef.current);
      await waitTime(0);
      const res = await runApi();
      const { list: newList, ...rest } = res || {};

      setData((_data) => {
        const { list, ...origin } = _data || {};
        return { list: [...(list || []), ...newList], ...origin, ...rest };
      });
      setPage((p) => { pageRef.current = p + 1; return pageRef.current; });
      return { hasMore: res.has_more, hasLater: res.has_later };
    } catch (error) {
      return { hasMore: true, hasLater: true, error };
    }
  }, [runApi]);

  const onLoadLater = useCallback(async () => {
    try {
      setPage(pageLaterRef.current);
      await waitTime(0);
      const res = await runApi();
      const { list: newList, ...rest } = res || {};

      setData((_data) => {
        const { list, ...origin } = _data || {};
        return { list: [...newList, ...(list || [])], ...origin, ...rest };
      });
      setPage((p) => { pageLaterRef.current = p + 1; return pageLaterRef.current; });
      return { hasMore: res.has_more, hasLater: res.has_later };
    } catch (error) {
      return { hasMore: true, hasLater: true, error };
    }
  }, [runApi]);

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
    onLoadLater
  };
};
