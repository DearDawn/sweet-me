import * as React from 'react';
import cs from 'clsx';
import styles from './index.module.less';
import { ICommonBaseInputCompoProps } from '../../types';
import { InputFile } from '../inputFile';
import { InputImage } from '../inputImage';

type IProps = ICommonBaseInputCompoProps<any> & {
  /** 内容值变化 */
  onValueChange?: (value?: string) => void;
};

/** 输入框 */
export const Input = ({
  className,
  onValueChange,
  onInput,
  ...rest
}: IProps) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const val = e.target.value;
        onValueChange?.(val);
        onInput?.(val);
      },
      [onInput, onValueChange]
    );

  return (
    <input
      onChange={handleChange}
      onInput={handleChange}
      className={cs(styles.input, className)}
      {...rest}
    />
  );
};

Input.File = InputFile;
Input.Image = InputImage;
