import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { findClosestScrollableParent } from '../../utils';
import { ERROR_IMAGE } from '../../constants';

type IProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  onClick?: VoidFunction;
  /** 是否开启预览 */
  withPreview?: boolean;
  /** 是否懒加载 */
  lazyLoad?: boolean;
  /** 懒加载的根节点, 应为最近可滚动的父元素 */
  lazyRoot?: Element | null;
  /** 图片引用 */
  imgRef?: React.MutableRefObject<HTMLImageElement>;
  /** 加载失败的兜底图片 */
  errorHolder?: string;
};

/** 图片组件 */
export const Image = (props: IProps) => {
  const {
    onClick,
    className,
    withPreview = true,
    imgRef,
    lazyLoad,
    lazyRoot,
    errorHolder = ERROR_IMAGE,
    src,
    style,
    ...rest
  } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imgSrc, setImgSrc] = useState(lazyLoad ? undefined : src);
  const selfRef = useRef<HTMLImageElement>(null);
  const imgDomRef = imgRef || selfRef;

  const handleFullScreenClick = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  const handleClick = useCallback(() => {
    if (withPreview) {
      setIsFullScreen(true);
    }

    onClick?.();
  }, [onClick, withPreview]);

  const handleError = useCallback(
    (error) => {
      setImgSrc(errorHolder);
    },
    [errorHolder]
  );

  useEffect(() => {
    if (!lazyLoad) return;

    const closestScrollableParent =
      findClosestScrollableParent(imgDomRef.current) || document;

    const img = imgDomRef.current;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImgSrc(src);
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: lazyRoot || closestScrollableParent,
      rootMargin: '0px 0px 200px 0px',
    });

    if (img) {
      observer.observe(img);
    }

    return () => {
      if (img) {
        observer.unobserve(img);
      }
    };
  }, [lazyLoad, src, lazyRoot, imgDomRef]);

  useEffect(() => {
    setImgSrc((_src) => (_src ? src : _src));
  }, [src]);

  return (
    <>
      {isFullScreen &&
        createPortal(
          <div className={styles.fullImgWrap} onClick={handleFullScreenClick}>
            <img className={styles.img} src={imgSrc} {...rest} />
          </div>,
          document.body
        )}
      {
        <img
          ref={imgDomRef}
          className={clsx(styles.img, className)}
          src={imgSrc}
          style={style}
          {...rest}
          onClick={handleClick}
          onError={handleError}
        />
      }
    </>
  );
};
