import * as React from 'react';
import { useState, useEffect } from 'react';
import cs from 'classnames';
import styles from './index.module.less'
import { ICommonProps } from 'src/types';

interface IProps extends ICommonProps { }

export const Button = ({
  style = {},
  children,
  className,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {

  return (
    <button className={cs(styles.button, className)} {...rest}>{children}</button>
  );
};
