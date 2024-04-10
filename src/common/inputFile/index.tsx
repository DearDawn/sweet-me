import * as React from 'react';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { ICON, Icon } from '../icon';
import { Button } from '../button';

type IProps = ICommonProps<HTMLInputElement> & {
  onValueChange?: (file?: File) => void;
  onInput?: (file?: File) => void;
};

export const InputFile = ({
  className,
  onValueChange,
  onInput,
  value: _value,
  children = (
    <Button>
      <Icon className={styles.uploadIcon} type={ICON.file} />
      选择文件
    </Button>
  ),
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLInputElement>) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const value = _value || '';

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e.target.files[0];
        onValueChange?.(file);
        onInput?.(file);
      },
      [onInput, onValueChange]
    );

  // 使用React.cloneElement克隆children组件并添加新的props
  const modifiedChildren = React.cloneElement(children, {
    onClick: (event) => {
      // 首先调用原始元素的 onClick 事件处理程序（如果存在）
      children.props.onClick?.(event);
      // 执行额外的点击处理逻辑
      inputFileRef.current.click();
    },
  });

  return (
    <>
      {modifiedChildren}
      <input
        ref={inputFileRef}
        onInput={handleChange}
        className={styles.inputFile}
        type='file'
        value={value}
        {...rest}
      />
    </>
  );
};
