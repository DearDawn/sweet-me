import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 间距 */
  gap?: string;
  /** 内边距 */
  padding?: string;
  /** 是否为竖直排列 */
  isColumn?: boolean;
  /** 是否拉伸 */
  stretch?: boolean;
};

/** 间距容器 */
export const Space = ({
  children,
  className,
  gap = '10px',
  padding = '10px',
  isColumn = false,
  stretch = false,
  style,
  ...rest
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {

  return (
    <div
      style={{ gap, padding, ...style }}
      className={cs(styles.space, className, {
        [styles.column]: isColumn,
        [styles.stretch]: stretch
      })}
      {...rest}
    >
      {children}
    </div>
  );
};
