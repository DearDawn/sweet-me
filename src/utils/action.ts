/**
 * 简易埋点工具类
 * 使用前需调用 config 方法进行配置
 */
export class Action {
  /** 设备ID存储的 localStorage key */
  private didKey = 'dododawn_action_did';
  private extraParams = {};
  /** 当前设备ID */
  private did = '';
  /** 请求地址 */
  private requestUrl = '';
  /** 请求地址 */
  private requestLoggerUrl = '';
  /** 单例实例 */
  private static instance: Action;

  constructor () { }

  /**
   * 获取基础数据
   * @returns 包含设备ID、当前URL和路径的基础数据对象
   */
  private get baseData () {
    return { did: this.did, url: location.href, page: location.pathname };
  }

  /**
   * 获取 Action 单例实例
   * @returns Action 实例
   */
  static getInstance () {
    if (!Action.instance) {
      Action.instance = new Action();
    }

    return new Action();
  }

  /**
   * 配置埋点
   * @param url - 请求地址
   */
  config ({ url, loggerUrl = '', commonParams = {} }) {
    this.did = this.generateId();
    this.requestUrl = url;
    this.requestLoggerUrl = loggerUrl;
    this.extraParams = { ...commonParams };
  }

  /**
   * 生成设备ID
   * 如果 localStorage 中已存在则直接返回
   * 否则生成新的 UUID 并存储
   * @returns 设备ID
   */
  private generateId () {
    const storageKey = localStorage.getItem(this.didKey);

    if (storageKey) {
      return storageKey;
    }

    const UUID = crypto.randomUUID();
    localStorage.setItem(this.didKey, UUID);
    return UUID;
  }

  /**
   * 记录访问事件
   * @param obj_id - 对象ID
   * @param extra - 额外数据
   * @returns Promise
   */
  visit (obj_id = '', extra?: Record<string, any>) {
    return this.request('visit', { obj_id, extra });
  }

  /**
   * 记录展示事件
   * @param obj_id - 对象ID
   * @param extra - 额外数据
   * @returns Promise
   */
  show (obj_id = '', extra?: Record<string, any>) {
    return this.request('show', { obj_id, extra });
  }

  /**
   * 记录点击事件
   * @param obj_id - 对象ID
   * @param extra - 额外数据
   * @returns Promise
   */
  click (obj_id = '', extra?: Record<string, any>) {
    return this.request('click', { obj_id, extra });
  }

  /** 上报业务日志 */
  log (message = '', extra?: Record<string, any>) {
    return this.requestLogger('info', { message, extra });
  }

  /** 上报错误日志 */
  error (message = '', stack = '', extra?: Record<string, any>) {
    return this.requestLogger('error', { message, stack, extra });
  }

  /**
   * 发送请求
   * @param type - 事件类型
   * @param data - 事件数据
   * @returns Promise
   */
  private request (type = '', data: { obj_id: string, extra: Record<string, any>; }) {
    if (!this.requestUrl) {
      // eslint-disable-next-line no-console
      console.log('[dodo] ', '请先使用 action.config 配置请求地址');
      return;
    }

    return fetch(`${this.requestUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.baseData, ...data, extra: { ...data.extra, ...this.extraParams } }),
    })
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .catch(console.error);
  }

  /**
   * 发送请求
   * @param type - 事件类型
   * @param data - 事件数据
   * @returns Promise
   */
  private requestLogger (type = '', data: { message: string, stack?: string, extra?: Record<string, any>; }) {
    if (!this.requestLoggerUrl) {
      // eslint-disable-next-line no-console
      console.log('[dodo] ', '请先使用 action.config 配置请求地址');
      return;
    }

    return fetch(`${this.requestLoggerUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.baseData, ...data, extra: { ...data.extra, ...this.extraParams } }),
    })
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .catch(console.error);
  }
}

/**
 * action 单例
 */
export const action = Action.getInstance();
