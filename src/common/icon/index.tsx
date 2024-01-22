import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

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
  likeFull = '&#xe60f;'
}

interface IProps extends ICommonProps {
  type?: ICON
}

export const Icon = ({
  className,
  type = ICON.home,
  ...rest
}: IProps) => {

  return (
    <i
      className={cs(styles.iconfont, className)}
      dangerouslySetInnerHTML={{ __html: type }}
      {...rest}
    ></i>
  );
};
