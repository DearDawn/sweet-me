import { useCallback, useEffect, useState } from "react";
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
  const { url, params, init, loadingFn, autoRun = false } = props || {};
  const [data, setData] = useState<T>(null);
  const [error, setError] = useState(null);
  const [loading, startLoading, endLoading] = useBoolean(false);

  const doRequest = useCallback(() => {
    if (loading) return;

    startLoading();
    apiGet<T>(url, params, init).then(res => {
      setData(res);
    }).catch(err => {
      setError(err);
    }).finally(endLoading);
  }, [endLoading, init, loading, params, startLoading, url]);

  const runApi = useCallback(() => {
    doRequest();
  }, [doRequest]);

  useEffect(() => {
    if (!loading || !loadingFn) return;

    const fn = loadingFn();
    return fn;
  }, [loading, loadingFn]);

  useEffect(() => {
    if (!autoRun) return;

    doRequest();
  }, [autoRun, doRequest]);

  return { data, error, loading, runApi };
};