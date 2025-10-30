import { useCallback, useEffect, useRef, useState } from 'react';
import { RequestUrl, apiGet } from '../utils/request';
import { useBoolean } from './useBoolean';

export type RequestProps = {
  url: RequestUrl;
  params?: Record<string, any>;
  init?: RequestInit;
  autoRun?: boolean;
  loadingFn?: () => VoidFunction;
  cache?: boolean;
};

/** 请求 */
export const useRequest = <T = any>(props: RequestProps) => {
  const {
    url = '/',
    params = {},
    init = {},
    loadingFn,
    autoRun = false,
    cache = false,
  } = props || {};
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>();
  const [loading, startLoading, endLoading] = useBoolean(false);
  const doRequest = useRef<(p?: RequestProps['params']) => Promise<T>>(() =>
    Promise.resolve(data)
  );
  const reqPromise = useRef<Promise<T>>();
  const cacheDataMap = useRef<Record<string, T>>({});
  const cacheKey = `${url}-${JSON.stringify(params)}`;

  const doRequestFn = (_params?: RequestProps['params']) => {
    const cacheData = cacheDataMap.current[cacheKey];

    if (cache && cacheData) {
      return Promise.resolve(cacheData);
    }

    if (loading) return reqPromise.current;

    startLoading();
    reqPromise.current = new Promise<T>((resolve, reject) => {
      apiGet<T>(url, { ...params, ..._params }, init)
        .then((res) => {
          cacheDataMap.current[cacheKey] = res;
          setData(res);
          resolve(res);
        })
        .catch((err) => {
          setError(err);
          reject(err);
        })
        .finally(endLoading);
    });

    return reqPromise.current;
  };

  doRequest.current = doRequestFn;

  const runApi = useCallback(
    (params?: RequestProps['params']) => {
      return doRequest.current(params);
    },
    [doRequest]
  );

  useEffect(() => {
    if (!loading || !loadingFn) return;

    const fn = loadingFn();
    return fn;
  }, [loading, loadingFn]);

  useEffect(() => {
    if (!autoRun) return;

    doRequest.current();
  }, [autoRun, doRequest]);

  return { data, error, loading, runApi };
};
