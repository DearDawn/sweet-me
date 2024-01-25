import { useCallback, useEffect, useRef, useState } from "react";
import { RequestUrl, apiGet } from "src/utils/request";
import { useBoolean } from "./useBoolean";

export type RequestProps = {
  url: RequestUrl;
  params?: Record<string, any>;
  init?: RequestInit;
  autoRun?: boolean;
  loadingFn?: () => VoidFunction
}

/** 请求 */
export const useRequest = <T = any> (props: RequestProps) => {
  const { url = '/', params = {}, init = {}, loadingFn, autoRun = false } = props || {};
  const [data, setData] = useState<T>(null);
  const [error, setError] = useState<Error>(null);
  const [loading, startLoading, endLoading] = useBoolean(false);

  const doRequest = useRef(() => {
    startLoading();
    return new Promise((resolve, reject) => {
      if (loading) return doRequest.current;

      apiGet<T>(url, params, init).then(res => {
        setData(res);
        resolve(res);
      }).catch(err => {
        setError(err);
        reject(err);
      }).finally(endLoading);
    });
  });

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