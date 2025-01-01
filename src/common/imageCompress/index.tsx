import { useBoolean } from 'src/hooks';
import * as styles from './index.module.less';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  compressImage,
  toast,
  convertFileSize,
  getFileFromUrl,
} from 'src/utils';
import { Button } from '../button';
import { showModal } from '../modal';
import { Slider } from '../slider';
import { Space } from '../space';
import { Switch } from '../switch';
import { Image } from '../image';
import clsx from 'clsx';

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 上传文件，一个函数，返回图片 url 链接 */
  uploader?: (file: File) => Promise<string>;
  /** 最大文件大小 */
  maxSize?: number;
  /** 压缩完成 */
  onClose?: (data?: { file: File; url: string }) => void;
} & (
    | {
        /** 图片 Url */
        imgUrl: string;
        /** 图片 File */
        imgFile?: File;
      }
    | {
        /** 图片 Url */
        imgUrl?: string;
        /** 图片 File */
        imgFile: File;
      }
  );

/** 图片压缩组件 */
export const ImageCompress: FC<IProps> = (props) => {
  const {
    onClose,
    imgFile: _imgFile,
    imgUrl: _imgUrl,
    uploader,
    maxSize,
    className,
    ...rest
  } = props || {};
  const [initUrl] = useState(_imgUrl || URL.createObjectURL(_imgFile));
  const [initFile, setInitFile] = useState(_imgFile);
  const isPngImg = initFile?.type === 'image/png';
  const [resUrl, setResUrl] = useState(initUrl);
  const [resFile, setResFile] = useState(initFile);
  const [size, setSize] = useState([0, 0]);
  const [loading, startLoading, endLoading] = useBoolean(false);
  const defaultScale = 70;
  const defaultQuality = isPngImg ? 100 : 70;
  const [scale, setScale] = useState(defaultScale);
  const [quality, setQuality] = useState(defaultQuality);
  const [noCompress, setNoCompress] = useState(false);
  const timer = useRef(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const compress = useCallback(
    (scaleRatio = defaultScale, qualityRatio = defaultQuality) => {
      startLoading();
      timer.current = setTimeout(() => {
        compressImage({
          imgUrl: initUrl,
          outputFileName: initFile?.name || initUrl,
          scaleRatio: scaleRatio / 100,
          quality: isPngImg ? 1 : qualityRatio / 100,
          targetType: isPngImg
            ? 'png'
            : (initFile?.type?.slice(6) as any) || 'jpeg',
        })
          .then((res) => {
            setResUrl(res.url);
            setResFile(res.file || initFile);
          })
          .finally(endLoading);
      }, 500);
    },
    [defaultQuality, endLoading, initFile, initUrl, isPngImg, startLoading]
  );

  const handleQualityChange = useCallback((value) => {
    setQuality(value);
  }, []);

  const handleScaleChange = useCallback((value) => {
    setScale(value);
  }, []);

  const handleSwitchChange = useCallback(
    (value) => {
      setNoCompress(value);
      if (value) {
        setScale(100);
        setQuality(100);
      } else {
        setScale(defaultScale);
        setQuality(defaultQuality);
      }
    },
    [defaultQuality]
  );

  const handleSubmit = useCallback(async () => {
    if (maxSize && resFile.size >= maxSize) {
      toast(`文件过大，最大 ${convertFileSize(maxSize)}`);
      return;
    }

    if (uploader) {
      uploader(resFile).then((res) => {
        onClose?.({ file: resFile, url: res });
      });
    } else {
      onClose?.({ file: resFile, url: resUrl });
    }
  }, [maxSize, onClose, resFile, resUrl, uploader]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onImageLoad = useCallback(() => {
    if (imageWrapRef.current) {
      const { clientWidth, clientHeight } = imageWrapRef.current;
      imageWrapRef.current.style.width = `${clientWidth}px`;
      imageWrapRef.current.style.height = `${clientHeight}px`;
    }
  }, []);

  useEffect(() => {
    compress(scale, quality);

    return () => {
      endLoading();
      clearTimeout(timer.current);
    };
  }, [compress, endLoading, quality, scale]);

  useEffect(() => {
    const img = new window.Image();

    img.src = resUrl || URL.createObjectURL(resFile);
    img.onload = () => {
      URL.revokeObjectURL(img.src); // 释放内存
      setSize([img.width, img.height]);
    };
  }, [resFile, resUrl]);

  useEffect(() => {
    if (initUrl && !initFile) {
      const image = new window.Image();
      image.src = initUrl;

      getFileFromUrl(initUrl, initUrl).then((file) => {
        setInitFile(file);
      });
    }
  }, [initUrl, initFile]);

  return (
    <div
      className={clsx(styles.card, className)}
      {...rest}
    >
      <div
        className={styles.imageWrap}
        ref={imageWrapRef}
      >
        <Image
          className={styles.codeImg}
          src={resUrl}
          onLoad={onImageLoad}
        />
      </div>
      <Space
        padding='10px'
        className={styles.desc}
      >
        <div>压缩比: {Number(resFile?.size / initFile?.size).toFixed(2)}</div>
        <div>{`尺寸: ${size[0]} x ${size[1]} `}</div>
        <div>
          {`大小: ${convertFileSize(resFile?.size || initFile?.size || 0)}`}
        </div>
      </Space>

      <Space>
        原图:{' '}
        <Switch
          onValueChange={handleSwitchChange}
          checked={noCompress}
        />
      </Space>
      {!isPngImg && !noCompress && (
        <Space
          className={styles.sliderWrap}
          padding='10px'
        >
          质量:
          <Slider
            className={styles.slider}
            min={10}
            max={100}
            step={5}
            defaultValue={defaultQuality}
            onValueChange={handleQualityChange}
          />
        </Space>
      )}
      {!noCompress && (
        <Space
          className={styles.sliderWrap}
          padding='10px'
        >
          缩放:
          <Slider
            className={styles.slider}
            min={10}
            max={100}
            step={5}
            defaultValue={defaultScale}
            onValueChange={handleScaleChange}
          />
        </Space>
      )}

      <Space
        className={styles.sliderWrap}
        padding='10px 0 0'
        isColumn
      >
        <Button
          status='success'
          size='long'
          loading={loading}
          onClick={handleSubmit}
        >
          发送
        </Button>
        <Button
          size='long'
          onClick={handleClose}
        >
          关闭
        </Button>
      </Space>
    </div>
  );
};

/** 显示图片压缩弹窗*/
export const showImageCompressModal = (
  props: IProps & {
    modalProps?: Parameters<typeof showModal>[1];
  }
) => {
  const {
    onClose: _onClose,
    modalProps,
    imgUrl,
    imgFile,
    ...rest
  } = props || {};

  return showModal(
    ({ onClose }) => (
      <ImageCompress
        imgUrl={imgUrl}
        imgFile={imgFile}
        onClose={async (res) => {
          await _onClose?.(res);
          onClose();
        }}
        {...rest}
      />
    ),
    {
      maskClosable: false,
      ...modalProps,
    }
  );
};
