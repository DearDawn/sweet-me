export type RequestUrl = `/${string}` | `http${string}`

export const apiGet = <T> (input: RequestUrl, params: Record<string, any> = {}, init?: RequestInit) => {
  const searchStr = new URLSearchParams({ ...params }).toString();
  const url = searchStr ? `${input}?${searchStr}` : input;

  return fetch(url, init).then(res => res.json()) as Promise<T>;
};
