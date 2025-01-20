import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

/** LOGO 图标枚举 */
export enum ICON_LOGO {
  weiBo = '&#xeb74;',
  bilibili = '&#xeb78;',
  redBook = '&#xeb79;',
  cloud = '&#xeb7d;',
  youKu = '&#xe600;',
  douYin = '&#xe684;',
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
