/**
 * 简易埋点工具类
 * 使用前需调用 config 方法进行配置
 */
export class Action {
  /** localStorage 中存储设备ID的键名 */
  private didKey = 'dododawn_action_did';
  /** 额外的公共参数 */
  private extraParams: Record<string, any> = {};
  /** 是否为开发环境 */
  private isDev = false;
  /** 是否禁用开发环境日志 */
  private disableDevLog = false;
  /** 当前设备ID */
  private did = '';
  /** 埋点请求地址 */
  private requestUrl = '';
  /** 日志请求地址 */
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
   */
  config ({
    url,
    loggerUrl = '',
    commonParams = {},
    isDev = false,
    disableDevLog = false
  }: {
    /** 请求地址 */
    url: string;
    /** 日志请求地址 */
    loggerUrl?: string;
    /** 公共参数 */
    commonParams?: Record<string, any>;
    /** 是否为开发环境 */
    isDev?: boolean;
    /** 是否禁用开发环境日志 */
    disableDevLog?: boolean;
  }) {
    this.did = this.generateId();
    this.requestUrl = url;
    this.isDev = isDev;
    this.disableDevLog = disableDevLog;
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
   * 开发环境日志输出
   * @param info - 要输出的日志信息
   */
  private consoleLog (...info: any) {
    if (!this.disableDevLog) return;

    // eslint-disable-next-line no-console
    console.log('[sweet-me action] ', ...info);
  }

  /**
   * 开发环境错误输出
   * @param info - 要输出的错误信息
   */
  private consoleError (...info: any) {
    if (!this.disableDevLog) return;

    // eslint-disable-next-line no-console
    console.error('[sweet-me action] ', ...info);
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
      this.consoleError('请先使用 action.config 配置请求地址');
      return;
    }

    const body = { ...this.baseData, ...data, extra: { ...data.extra, ...this.extraParams } };

    if (this.isDev) {
      this.consoleLog(body);
      return;
    }

    return fetch(`${this.requestUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
      this.consoleError('请先使用 action.config 配置请求地址');
      return;
    }

    const body = { ...this.baseData, ...data, extra: { ...data.extra, ...this.extraParams } };

    if (this.isDev) {
      if (type === 'error') {
        this.consoleError(body);
      } else {
        this.consoleLog(body);
      }
      return;
    }

    return fetch(`${this.requestLoggerUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
