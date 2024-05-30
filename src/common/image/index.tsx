import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

type IProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  onClick?: VoidFunction;
  withPreview?: boolean;
  lazyLoad?: boolean;
  lazyRoot?: Element | null;
  imgRef?: React.MutableRefObject<HTMLImageElement>;
};

export const Image = (props: IProps) => {
  const {
    onClick,
    className,
    withPreview = true,
    imgRef,
    lazyLoad,
    lazyRoot,
    src,
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

  useEffect(() => {
    if (!lazyLoad) return;

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
      root: lazyRoot || document,
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

  return (
    <>
      {isFullScreen &&
        createPortal(
          <div className={styles.fullImgWrap} onClick={handleFullScreenClick}>
            <img className={styles.img} src={imgSrc} {...rest} />
          </div>,
          document.body
        )}
      <img
        ref={imgDomRef}
        className={clsx(styles.img, className)}
        src={imgSrc}
        {...rest}
        onClick={handleClick}
      />
    </>
  );
};
