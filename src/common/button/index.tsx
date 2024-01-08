import * as React from 'react';
import { useState, useEffect } from 'react';
import cs from 'classnames';
import * as styles from './index.module.less'
import { ICommonProps } from 'src/types';

interface IProps extends ICommonProps {
  size?: 'normal' | 'small' | 'large'
}

export const Button = ({
  style = {},
  children,
  className,
  size = 'normal',
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {

  return (
    <button className={cs(styles.button, styles[size], className)} {...rest}>{children}</button>
  );
};
