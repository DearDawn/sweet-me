import * as React from 'react';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = Omit<ICommonProps<HTMLInputElement>, 'value'> & {
  onValueChange?: (file?: File) => void;
  onInput?: (file?: File) => void;
  value?: File;
  size?: number;
  holder?: React.ReactElement;
};

export const InputImage = ({
  className,
  onValueChange,
  onInput,
  value,
  size = 100,
  holder = (
    <div className={styles.holder} style={{ width: size, height: size }}>
      <div className={styles.icon}></div>
      <div className={styles.text}>选择图片</div>
    </div>
  ),
  ...rest
}: IProps) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const currentFile = React.useRef<File>();
  const [previewUrl, setPreviewUrl] = React.useState('');

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e.target.files[0];
        currentFile.current = file;
        onValueChange?.(file);
        onInput?.(file);

        if (file) {
          const imgURL = URL.createObjectURL(file);
          setPreviewUrl(imgURL);
        } else {
          setPreviewUrl('');
        }
      },
      [onInput, onValueChange]
    );

  const renderDom = () => {
    if (previewUrl) {
      return (
        <img
          className={styles.imgItem}
          style={{ width: size, height: size }}
          src={previewUrl}
          alt='图片'
        />
      );
    }

    return (
      <div className={styles.holder} style={{ width: size, height: size }}>
        <div className={styles.icon}></div>
        <div className={styles.text}>选择图片</div>
      </div>
    );
  };

  const dom = renderDom();

  // 使用React.cloneElement克隆children组件并添加新的props
  const modifiedHolder = React.cloneElement(dom, {
    onClick: (event) => {
      // 首先调用原始元素的 onClick 事件处理程序（如果存在）
      dom.props.onClick?.(event);
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
      {modifiedHolder}
      <input
        ref={inputFileRef}
        onInput={handleChange}
        className={styles.inputImage}
        type='file'
        {...rest}
      />
    </>
  );
};
