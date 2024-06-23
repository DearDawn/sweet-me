import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 按钮大小 */
  size?: 'normal' | 'small' | 'large' | 'mini' | 'long'
  /** 按钮状态 */
  status?: 'success' | 'error' | 'warning' | 'default'
  /** 按钮加载中，期间不可点击 */
  loading?: boolean;
  /** 按钮禁用，期间不可点击 */
  disabled?: boolean;
}

/** 按钮 */
export const Button = ({
  style = {},
  children,
  className,
  size = 'normal',
  status = 'default',
  disabled = false,
  loading = false,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {

  return (
    <button
      style={style}
      className={cs(styles.button, styles[`size_${size}`], styles[`status_${status}`], className, {
        [styles.loading]: loading
      })}
      type='button'
      {...rest}
      disabled={loading || disabled}
    >
      {children}
    </button>
  );
};
