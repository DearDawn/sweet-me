import { safeParse } from './common';
import { RequestUrl, apiGet, apiPost } from './request';

/** 存储类 */
export class Storage {
  /** 接口地址，默认： `${protocol}//${hostname}:7020/api/storage` */
  private remoteUrl?: RequestUrl;
  /** 接口额外参数 */
  private params?: Record<string, any>;
  /** 是否使用服务端 store， 默认 false */
  private sync?: boolean;
  /** 命名空间， 默认：域名 */
  private namespace?: string;
  constructor() {
    const { protocol, hostname } = window.location || {};
    const apiUrl = `${protocol}//${hostname}:7020/api/storage` as RequestUrl;
    const pureHost = hostname.replace(/^www\./g, '');
    this.remoteUrl = apiUrl;
    this.sync = false;
    this.namespace = pureHost;
  }

  config({
    remoteUrl,
    params,
    sync,
    namespace,
  }: {
    /** 接口地址，默认： `${protocol}//${hostname}:7020/api/storage` */
    remoteUrl?: RequestUrl;
    /** 接口额外参数 */
    params?: Record<string, any>;
    /** 是否使用服务端 store， 默认 false */
    sync?: boolean;
    /** 命名空间， 默认：域名 */
    namespace?: string;
  }) {
    this.remoteUrl = remoteUrl || this.remoteUrl;
    this.params = params || {};
    this.sync = !!sync;
    this.namespace = namespace || this.namespace;
  }

  get reqParams() {
    return { ...this.params, namespace: this.namespace };
  }

  localGet(key = '') {
    const allData = {};

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const val = localStorage.getItem(k);
      allData[k] = safeParse(val ?? null);
    }

    if (!key) {
      return allData;
    }

    return allData[key];
  }

  async remoteGet(key = '') {
    try {
      const res = (await apiGet(`${this.remoteUrl}/get/${key}`, {
        ...this.reqParams,
      })) as any;

      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  private async remoteSet(key = '', data: any) {
    this.localSet(key, data);
    try {
      const res = (await apiPost(
        `${this.remoteUrl}/set/${key}`,
        { ...this.reqParams },
        { data }
      )) as any;

      return res.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  private localSet(key = '', data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key = '') {
    if (this.sync) {
      return this.remoteGet(key);
    } else {
      return this.localGet(key);
    }
  }

  set(key = '', data: any) {
    if (this.sync) {
      return this.remoteSet(key, data);
    } else {
      return this.localSet(key, data);
    }
  }
}
