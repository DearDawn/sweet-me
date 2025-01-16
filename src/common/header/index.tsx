import * as React from 'react';
import cs from 'clsx';
import styles from './index.module.less';
import { ICommonProps } from '../../types';
import { ICON, Icon } from '../icon';

type IProps = Omit<ICommonProps, 'title'> & {
  /** 左侧内容 */
  leftPart?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 右侧内容 */
  rightPart?: React.ReactNode;
  /** 是否吸顶 */
  isSticky?: boolean;
};

/** 头部 */
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
        [styles.sticky]: isSticky,
      })}
      {...rest}
    >
      <div className={styles.leftPart}>{leftPart}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.rightPart}>{rightPart}</div>
    </div>
  );
};
