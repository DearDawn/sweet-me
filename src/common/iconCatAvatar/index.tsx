import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '@/types';

/** 图标枚举 */
export enum ICON_CAT_AVATAR {
  '蓝白猫' = '&#xe619;',
  '蓝猫' = '&#xe61a;',
  '银渐层' = '&#xe61b;',
  '金渐层' = '&#xe61c;',
  '美短' = '&#xe61d;',
  '暹罗猫' = '&#xe61e;',
  '加菲猫' = '&#xe61f;',
  '布偶猫-海豹双色' = '&#xe621;',
  '布偶猫-重点色' = '&#xe622;',
  '布偶猫-稀有色' = '&#xe623;',
  '缅因猫' = '&#xe624;',
  '狮子猫' = '&#xe625;',
  '大橘猫' = '&#xe626;',
  '奶牛猫' = '&#xe627;',
  '狸花猫' = '&#xe629;',
  '黑猫' = '&#xe62a;',
  '绿底黑猫' = '&#xe60a;',
  '三花猫' = '&#xe62b;',
  '玳瑁猫' = '&#xe62c;',
  '阿比西尼亚猫' = '&#xe62d;',
  '斯芬克斯无毛猫' = '&#xe62e;',
}

type IProps = ICommonProps & {
  /** 图标类型 */
  type?: ICON_CAT_AVATAR;
  /** 尺寸，默认 fontSize 32 */
  size?: number;
};

/** 图标 */
export const IconCatAvatar = ({ className, type, size, ...rest }: IProps) => {
  return (
    <i
      style={size ? { fontSize: size } : {}}
      className={cs(styles.iconfont, 'dodo-icon-cat-avatar', className)}
      dangerouslySetInnerHTML={{ __html: type || ICON_CAT_AVATAR['黑猫'] }}
      {...rest}
    ></i>
  );
};
