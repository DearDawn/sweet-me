import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps<HTMLInputElement> & {
  onValueChange?: (value?: string) => void
}

export const Input = ({
  className,
  onValueChange,
  value,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLInputElement>) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    const val = e.target.value;
    onValueChange?.(val);
  }, [onValueChange]);

  return (
    <input
      onChange={handleChange}
      className={cs(styles.input, className)} {...rest}
    />
  );
};
