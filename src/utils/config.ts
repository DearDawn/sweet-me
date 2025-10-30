/** 组件库全局配置 */
export class Config {
  private static instance: Config;
  /** 是否禁用返回拦截 */
  private disableBackIntercept = false;

  constructor() {}

  get globalConfig() {
    return {
      /** 是否禁用返回拦截 */
      disableBackIntercept: this.disableBackIntercept,
    };
  }

  /**
   * 获取 Config 单例实例
   * @returns Config 实例
   */
  static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return new Config();
  }

  /**
   * 配置组件库
   */
  config({
    disableBackIntercept = false,
  }: {
    /** 是否禁用后退拦截 (如在 IOS 微信中禁用) */
    disableBackIntercept?: boolean;
  }) {
    this.disableBackIntercept = disableBackIntercept;
  }
}

/**
 * 组件库全局配置, config 单例
 */
export const sweetMeConfig = Config.getInstance();
