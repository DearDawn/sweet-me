import * as React from 'react';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { Image } from '../image';
import { ICON, Icon } from '../icon';
import { convertFileSize, toast } from '../../utils';
import { useBoolean } from '../../hooks';
import { ERROR_IMAGE } from '../../constants';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type IProps = Omit<ICommonProps<HTMLInputElement>, 'value'> & {
  /** 内容值变化 */
  onValueChange?: ({ file, url }: { file?: File; url: string }) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: ({ file, url }: { file?: File; url: string }) => void;
  /** 图片文件 */
  value?: { file: File; url?: string } | { file?: File; url: string };
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const currentFile = React.useRef<File>();
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [loading, startLoading, endLoading] = useBoolean();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isMouseOver, setIsMouseOver] = React.useState(false);

  const parseFile = React.useCallback(
    async (file: File) => {
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e ? e.target?.files[0] : undefined;

        parseFile(file);
      },
      [parseFile]
    );

  // 全局粘贴事件处理
  const handleGlobalPaste = React.useCallback(
    (event: ClipboardEvent) => {
      if (!isMouseOver) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      // 查找图片类型的粘贴项
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            parseFile(file);
            break;
          }
        }
      }
    },
    [isMouseOver, parseFile]
  );

  const handleMouseOver = React.useCallback(() => {
    setIsMouseOver(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsMouseOver(false);
  }, []);

  // 拖拽上传处理
  const handleDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          parseFile(file);
        }
      }
    },
    [parseFile]
  );

  const onDelete = React.useCallback(() => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.clear();
    if (inputFileRef.current) {
      inputFileRef.current.files = dataTransfer.files;
      inputFileRef.current.dispatchEvent(
        new Event('input', { bubbles: true, cancelable: true })
      );
    }
  }, []);

  const onClick = React.useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const renderContent = () => {
    if (previewUrl) {
      return (
        <div
          className={styles.imgItemWrap}
          onMouseLeave={handleMouseLeave}
          onMouseOut={handleMouseLeave}
        >
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

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onMouseOut={handleMouseLeave}
        onDrop={handleDrop}
        className={isDragOver ? styles.dragOver : ''}
      >
        {holder}
      </div>
    );
  };

  // 添加全局粘贴事件监听
  React.useEffect(() => {
    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handleGlobalPaste]);

  React.useEffect(() => {
    if (inputFileRef.current) {
      const { file, url } = value || {};

      if (url) {
        setPreviewUrl(url);
        return;
      }

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
