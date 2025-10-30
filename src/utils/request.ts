export type RequestUrl = `/${string}` | `http${string}`;

/**
 * @description get 请求
 * @param input 请求地址
 * @param params 请求参数
 * @param init 请求配置
 * @returns
 */
export const apiGet = <T>(
  input: RequestUrl,
  params: Record<string, any> = {},
  init?: RequestInit
) => {
  const searchStr = new URLSearchParams({ ...params }).toString();
  const url = searchStr ? `${input}?${searchStr}` : input;

  return fetch(url, init).then((res) => res.json()) as Promise<T>;
};

/**
 * @description post 请求
 * @param input 请求地址
 * @param params 请求参数
 * @param body 请求体
 * @param init 请求配置
 * @returns
 */
export const apiPost = <T>(
  input: RequestUrl,
  params: Record<string, any> = {},
  body: Record<string, any> = {},
  init?: RequestInit
) => {
  const searchStr = new URLSearchParams({ ...params }).toString();
  const url = searchStr ? `${input}?${searchStr}` : input;

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  }).then((res) => res.json()) as Promise<T>;
};
