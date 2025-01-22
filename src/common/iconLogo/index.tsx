import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

/** LOGO 图标枚举 */
export enum ICON_LOGO {
  /** 微博 */
  weiBo = '&#xeb74;',
  /** 哔哩哔哩 */
  bilibili = '&#xeb78;',
  /** 小红书 */
  redBook = '&#xeb79;',
  /** 网易云音乐 */
  cloud = '&#xeb7d;',
  /** 优酷 */
  youKu = '&#xe600;',
  /** 抖音 */
  douYin = '&#xe684;',
  /** 西瓜视频 */
  xiGua = '&#xe61e;',
  /** YouTube */
  youtube = '&#xeb73;',
  /** 微信公众号 */
  weiXinMp = '&#xeb7a;',
  /** 酷狗音乐 */
  kuGou = '&#xeb7e;',
  /** 普通链接 */
  link = '&#xe7c7;',
}

type IProps = ICommonProps & {
  /** 图标类型 */
  type?: ICON_LOGO;
  /** 尺寸，默认 fontSize 32 */
  size?: number;
};

/** LOGO 图标 */
export const IconLogo = ({
  className,
  type = ICON_LOGO.link,
  size,
  ...rest
}: IProps) => {
  return (
    <i
      style={size ? { fontSize: size } : {}}
      className={cs(styles.iconfont, 'dodo-logo-icon', className)}
      dangerouslySetInnerHTML={{ __html: type }}
      {...rest}
    ></i>
  );
};
