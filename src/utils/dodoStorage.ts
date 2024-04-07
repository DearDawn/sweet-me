import { RequestUrl, apiGet, apiPost } from ".";

class DodoStorage {
  private remoteUrl: RequestUrl;
  private params: Record<string, any>;
  private sync: boolean;
  private namespace: string;
  constructor () {
    const { protocol, hostname } = window.location || {};
    const apiUrl = `${protocol}//${hostname}:7020/api/storage` as RequestUrl;
    const pureHost = hostname.replace(/^www\./g, '');
    this.remoteUrl = apiUrl;
    this.sync = false;
    this.namespace = pureHost;
  }

  config ({ remoteUrl, params, sync, namespace }: {
    remoteUrl?: RequestUrl,
    params?: Record<string, any>,
    sync?: boolean,
    namespace?: string
  }) {
    this.remoteUrl = remoteUrl || this.remoteUrl;
    this.params = params || {};
    this.sync = !!sync;
    this.namespace = namespace || this.namespace;
  }

  get reqParams () {
    return { ...this.params, namespace: this.namespace };
  }

  private localGet (key = '') {
    const allData = {};

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const val = localStorage.getItem(k);
      allData[k] = val;
    }

    if (!key) {
      return allData;
    }

    return allData[key];
  }

  private async remoteGet (key = '') {
    const res = await apiGet(`${this.remoteUrl}/get/${key}`, { ...this.reqParams }) as any;

    return res.data;
  }


  private async remoteSet (key = '', data: any) {
    const res = await apiPost(`${this.remoteUrl}/set/${key}`, { ...this.reqParams }, { data }) as any;
    localStorage.setItem(key, data);

    return res.data;
  }

  private async localSet (key = '', data: any) {
    localStorage.setItem(key, data);
  }

  async get (key = '') {
    if (this.sync) {
      return this.remoteGet(key);
    } else {
      return this.localGet(key);
    }
  }

  async set (key = '', data: any) {
    if (this.sync) {
      return this.remoteSet(key, data);
    } else {
      return this.localSet(key, data);
    }
  }
}

export const dodoStorage = new DodoStorage();