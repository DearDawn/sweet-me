import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { InputFile } from '../inputFile';
import { InputImage } from '../inputImage';

type IProps = ICommonProps<HTMLInputElement> & {
  /** 内容值变化 */
  onValueChange?: (value?: string) => void
}

/** 输入框 */
export const Input = ({
  className,
  onValueChange,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLInputElement>) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    const val = e.target.value;
    onValueChange?.(val);
  }, [onValueChange]);

  return (
    <input
      onChange={handleChange}
      className={cs(styles.input, className)}
      {...rest}
    />
  );
};

Input.File = InputFile;
Input.Image = InputImage;