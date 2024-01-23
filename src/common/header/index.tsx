import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { ICON, Icon } from '../icon';

interface IProps extends ICommonProps {
  leftPart?: React.ReactNode
  title?: React.ReactNode
  rightPart?: React.ReactNode
  isSticky?: boolean
}

export const Header = ({
  className,
  title = 'Header',
  leftPart = <Icon type={ICON.home} />,
  rightPart = <Icon type={ICON.sugar} />,
  isSticky = false,
  ...rest
}: IProps) => {

  return (
    <div
      className={cs(styles.header, className, {
        [styles.sticky]: isSticky
      })}
      {...rest}
    >
      <div className={styles.leftPart}>
        {leftPart}
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.rightPart}>
        {rightPart}
      </div>
    </div>
  );
};
