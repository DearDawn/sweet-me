import * as React from 'react';
import { useState, useEffect } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less'
import { ICommonProps } from '../../types';

interface IProps extends ICommonProps {}

export const Title = ({
  children,
  className,
  ...rest
}: IProps) => {

  return (
    <div className={cs(styles.title, className)} {...rest}>{children}</div>
  );
};
