import { useCallback, useEffect, useRef, useState } from "react";
import { RequestUrl, apiGet } from "../utils/request";
import { useBoolean } from "./useBoolean";

export type RequestProps = {
  url: RequestUrl;
  params?: Record<string, any>;
  init?: RequestInit;
  autoRun?: boolean;
  loadingFn?: () => VoidFunction;
  cache?: boolean;
};

/** 请求 */
export const useRequest = <T = any> (props: RequestProps) => {
  const { url = '/', params = {}, init = {}, loadingFn, autoRun = false, cache = false } = props || {};
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>();
  const [loading, startLoading, endLoading] = useBoolean(false);
  const doRequest = useRef<() => Promise<T>>(() => Promise.resolve(data));
  const cacheDataMap = useRef<Record<string, T>>({});
  const cacheKey = `${url}-${JSON.stringify(params)}`;

  const doRequestFn = () => {
    const cacheData = cacheDataMap.current[cacheKey];

    if (cache && cacheData) {
      return Promise.resolve(cacheData);
    }

    startLoading();
    return new Promise<T>((resolve, reject) => {
      if (loading) return doRequestFn;

      apiGet<T>(url, params, init).then(res => {
        cacheDataMap.current[cacheKey] = res;
        setData(res);
        resolve(res);
      }).catch(err => {
        setError(err);
        reject(err);
      }).finally(endLoading);
    });
  };

  doRequest.current = doRequestFn;

  const runApi = useCallback(() => {
    return doRequest.current();
  }, [doRequest]);

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