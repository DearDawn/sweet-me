import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps<HTMLInputElement> & {
  /** 按钮大小 */
  size?: 'normal' | 'small' | 'large' | 'mini' | 'long'
  /** 按钮状态 */
  status?: 'success' | 'error' | 'warning' | 'default'
  onValueChange?: (value?: string) => void
}

export const Input = ({
  className,
  size = 'normal',
  status = 'default',
  defaultValue = '',
  onValueChange,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLInputElement>) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    const val = e.target.value;
    onValueChange?.(val);
  }, [onValueChange]);

  return (
    <input
      key={defaultValue as string}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cs(styles.input, styles[`size_${size}`], styles[`status_${status}`], className)} {...rest}
    />
  );
};
