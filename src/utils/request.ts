export type RequestUrl = `/${string}` | `http${string}`

export const apiGet = <T> (input: RequestUrl, params: Record<string, any> = {}, init?: RequestInit) => {
  const searchStr = new URLSearchParams({ ...params }).toString();
  const url = searchStr ? `${input}?${searchStr}` : input;

  return fetch(url, init).then(res => res.json()) as Promise<T>;
};

export const apiPost = <T> (input: RequestUrl, params: Record<string, any> = {}, body: Record<string, any> = {}, init?: RequestInit) => {
  const searchStr = new URLSearchParams({ ...params }).toString();
  const url = searchStr ? `${input}?${searchStr}` : input;

  return fetch(url, { method: 'POST', body: JSON.stringify(body), ...init }).then(res => res.json()) as Promise<T>;
};
