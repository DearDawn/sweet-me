import * as React from 'react';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { ICON, Icon } from '../icon';
import { Button } from '../button';

type IProps = Omit<ICommonProps<HTMLInputElement>, 'value'> & {
  /** 内容值变化 */
  onValueChange?: (file?: File) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (file?: File) => void;
  /** 文件 */
  value?: File;
};

/** 输入框-文件类型 */
export const InputFile = ({
  className,
  onValueChange,
  onInput,
  value,
  children = (
    <Button>
      <Icon className={styles.uploadIcon} type={ICON.file} />
      选择文件
    </Button>
  ),
  ...rest
}: IProps) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const currentFile = React.useRef<File>();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e.target.files[0];
        currentFile.current = file;
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

  React.useEffect(() => {
    if (inputFileRef.current) {
      const dataTransfer = new DataTransfer();
      const needDispatch = value !== currentFile.current;

      if (value) {
        dataTransfer.items.add(value);
      } else {
        dataTransfer.items.clear();
      }

      inputFileRef.current.files = dataTransfer.files;

      if (needDispatch) {
        // 手动触发 change 事件
        inputFileRef.current.dispatchEvent(
          new Event('input', { bubbles: true, cancelable: true })
        );
      }
    }
  }, [value]);

  return (
    <>
      {modifiedChildren}
      <input
        ref={inputFileRef}
        onInput={handleChange}
        className={styles.inputFile}
        type='file'
        {...rest}
      />
    </>
  );
};
