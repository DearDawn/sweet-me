import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 间距 */
  gap?: string
  padding?: string
  isColumn?: boolean;
  stretch?: boolean;
}

export const Space = ({
  children,
  className,
  gap = '10px',
  padding = '10px',
  isColumn = false,
  stretch = false,
  ...rest
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {

  return (
    <div
      style={{ gap, padding }}
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
