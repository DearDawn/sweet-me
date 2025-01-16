import * as React from 'react';
import styles from './index.module.less';
import { ICommonProps } from '../../types';
import { Image } from '../image';
import { ICON, Icon } from '../icon';
import { convertFileSize, toast } from '../../utils';
import { useBoolean } from 'src/hooks';
import { ERROR_IMAGE } from 'src/constants';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type IProps = Omit<ICommonProps<HTMLInputElement>, 'value'> & {
  /** 内容值变化 */
  onValueChange?: ({ file, url }: { file?: File; url: string }) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: ({ file, url }: { file?: File; url: string }) => void;
  /** 图片文件 */
  value?: { file: File; url: string };
  /** 图片选择器大小 */
  size?: number;
  /** 图片大小限制，默认 10MB */
  maxSize?: number;
  /** 自定义图片选择器 */
  holder?: React.ReactElement;
  /** 上传文件，一个函数，返回图片 url 链接 */
  uploader?: (file: File) => Promise<string>;
};

/** 输入框-图片类型 */
export const InputImage = ({
  className,
  onValueChange,
  onInput,
  uploader,
  value,
  size = 100,
  maxSize = 10 * 1024 * 1024,
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
  const [loading, startLoading, endLoading] = useBoolean();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      async (e) => {
        const file = e ? e.target?.files[0] : undefined;

        if (file && file.size >= MAX_FILE_SIZE) {
          toast(`文件过大，最大 ${convertFileSize(MAX_FILE_SIZE)}`);
          return;
        }

        currentFile.current = file;
        const res = { file, url: '' };

        if (file) {
          const imgURL = URL.createObjectURL(file);
          res.url = imgURL;
          setPreviewUrl(imgURL);
        } else {
          setPreviewUrl('');
        }

        if (uploader && file) {
          try {
            startLoading();
            res.url = await uploader(file);
            setPreviewUrl(res.url || ERROR_IMAGE);
          } finally {
            endLoading();
          }
        }

        onValueChange?.(res);
        onInput?.(res);
      },
      [endLoading, onInput, onValueChange, startLoading, uploader]
    );

  const onDelete = React.useCallback(() => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.clear();
    inputFileRef.current.files = dataTransfer.files;
    inputFileRef.current.dispatchEvent(
      new Event('input', { bubbles: true, cancelable: true })
    );
  }, []);

  // 使用React.cloneElement克隆children组件并添加新的props
  const modifiedHolder = React.cloneElement(holder, {
    onClick: (event) => {
      // 首先调用原始元素的 onClick 事件处理程序（如果存在）
      holder.props.onClick?.(event);
      // 执行额外的点击处理逻辑
      inputFileRef.current.click();
    },
  });

  const renderContent = () => {
    if (previewUrl) {
      return (
        <div className={styles.imgItemWrap}>
          <Image
            className={styles.imgItem}
            style={{ width: size, height: size }}
            src={previewUrl}
            alt='图片'
          />
          <Icon
            className={styles.delIcon}
            onClick={onDelete}
            type={ICON.delete}
            size={20}
          />
          {loading && <div className={styles.loading} />}
        </div>
      );
    }

    return modifiedHolder;
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      const { file } = value || {};
      const dataTransfer = new DataTransfer();
      const needDispatch = file !== currentFile.current;

      if (file) {
        dataTransfer.items.add(file);
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
      {renderContent()}
      <input
        ref={inputFileRef}
        onInput={handleChange}
        className={styles.inputImage}
        type='file'
        accept='image/*'
        multiple={false}
        {...rest}
      />
    </>
  );
};
