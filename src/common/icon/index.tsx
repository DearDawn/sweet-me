import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

/** 图标枚举 */
export enum ICON {
  home = '&#xe607;',
  sugar = '&#xe611;',
  refresh = '&#xe650;',
  rocket = '&#xe647;',
  magicBar = '&#xe740;',
  search = '&#xe615;',
  back = '&#xe62b;',
  done = '&#xe627;',
  likeCircle = '&#xe61a;',
  likeFull = '&#xe60f;',
  pc = '&#xe620;',
  pad = '&#xe6f4;',
  mobile = '&#xe75f;',
  clock = '&#xe60d;',
  bulb = '&#xe6cb;',
  log = '&#xe612;',
  book = '&#xe622;',
  copy = '&#xe62d;',
  file = '&#xe638;',
  image = '&#xfb84;',
  download = '&#xe628;',
  close = '&#xe62a;',
  delete = '&#xe7e8;',
  /** 垃圾桶删除 */
  garbageCan = '&#xe718;',
  add = '&#xe610;',
  jump = '&#xe823;',
}

type IProps = ICommonProps & {
  /** 图标类型 */
  type?: ICON;
  /** 尺寸，默认 fontSize 32 */
  size?: number;
};

/** 图标 */
export const Icon = ({
  className,
  type = ICON.home,
  size,
  ...rest
}: IProps) => {
  return (
    <i
      style={size ? { fontSize: size } : {}}
      className={cs(styles.iconfont, 'dodo-icon', className)}
      dangerouslySetInnerHTML={{ __html: type }}
      {...rest}
    ></i>
  );
};
