import * as React from 'react';
import { useState, useEffect } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less'
import { ICommonProps } from '../../types';

interface IProps extends ICommonProps {
  /** 按钮大小 */
  size?: 'normal' | 'small' | 'large' | 'mini' | 'long'
  /** 按钮状态 */
  status?: 'success' | 'error' | 'warning' | 'default'
}

export const Button = ({
  style = {},
  children,
  className,
  size = 'normal',
  status = 'default',
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {

  return (
    <button className={cs(styles.button, styles[`size_${size}`], styles[`status_${status}`], className)} {...rest}>{children}</button>
  );
};
