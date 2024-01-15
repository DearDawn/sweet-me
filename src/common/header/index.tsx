import * as React from 'react';
import { useState, useEffect } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less'
import { ICommonProps } from '../../types';
import { ICON, Icon } from '../icon';

interface IProps extends ICommonProps {
  leftPart?: React.ReactNode
  title?: React.ReactNode
  rightPart?: React.ReactNode
}

export const Header = ({
  children,
  className,
  title = 'Header',
  leftPart = <Icon type={ICON.home} />,
  rightPart = <Icon type={ICON.sugar} />,
  ...rest
}: IProps) => {

  return (
    <div className={cs(styles.header, className)} {...rest}>
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
