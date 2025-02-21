import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { findClosestScrollableParent } from '../../utils';
import { ERROR_IMAGE } from '../../constants';
import { ICON, Icon } from '../icon';
import { Button } from '../button';

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
  previewMinScale?: number;
  previewMaxScale?: number,
};

/** 图片组件 */
export const Image = (props: IProps) => {
  const {
    onClick,
    className,
    withPreview = true,
    previewMinScale = 0.25,
    previewMaxScale = 6,
    imgRef,
    lazyLoad,
    lazyRoot,
    errorHolder = ERROR_IMAGE,
    src,
    style,
    ...rest
  } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [cursorMode, setCursorMode] =
    useState<React.CSSProperties['cursor']>('default');
  const [imgSrc, setImgSrc] = useState(lazyLoad ? undefined : src);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const selfRef = useRef<HTMLImageElement>(null);
  const imgDomRef = imgRef || selfRef;
  const fullImgDomWrapRef = useRef<HTMLImageElement>(null);
  const touchData = useRef({ startX: 0, startY: 0 });
  const singleTouchMode = useRef(false);
  const initialDistance = useRef(0);
  const isTouching = useRef(false);
  const moveTimer = useRef(0);
  const translateRef = useRef(translate);
  translateRef.current = translate;

  const handleFullScreenClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();

    setIsFullScreen(false);
  }, []);

  const handleImageClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
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

  const handleWheel = useCallback((event: WheelEvent) => {
    setScale((prevScale) => {
      const newScale = prevScale + event.deltaY * -0.01;
      setCursorMode(newScale > prevScale ? 'zoom-in' : 'zoom-out');
      return Math.min(Math.max(0.5, newScale), 3); // 限制缩放范围
    });
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialDistance.current = distance;
    } else if (event.touches.length === 1) {
      singleTouchMode.current = true;
      const touch = event.touches[0];
      touchData.current.startX = touch.clientX;
      touchData.current.startY = touch.clientY;
    }
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    isTouching.current = true;
    setCursorMode('grab');

    const touch = event;
    touchData.current.startX = touch.clientX;
    touchData.current.startY = touch.clientY;
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        singleTouchMode.current = false;
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const newScale = scale * (distance / initialDistance.current);
        clearTimeout(moveTimer.current);
        setScale(Math.min(Math.max(previewMinScale, newScale), previewMaxScale)); // 限制缩放范围
        initialDistance.current = distance;
      } else if (event.touches.length === 1 && singleTouchMode.current) {
        const touch = event.touches[0];

        setTranslate({
          x:
            (touch.clientX - touchData.current.startX) / scale +
            translateRef.current.x,
          y:
            (touch.clientY - touchData.current.startY) / scale +
            translateRef.current.y,
        });
        touchData.current.startX = touch.clientX;
        touchData.current.startY = touch.clientY;
      }
    },
    [previewMaxScale, previewMinScale, scale]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isTouching.current) {
        return;
      }

      const touch = event;

      setCursorMode('grabbing');

      setTranslate({
        x:
          (touch.clientX - touchData.current.startX) / scale +
          translateRef.current.x,
        y:
          (touch.clientY - touchData.current.startY) / scale +
          translateRef.current.y,
      });
      touchData.current.startX = touch.clientX;
      touchData.current.startY = touch.clientY;
    },
    [scale]
  );

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    isTouching.current = false;
    singleTouchMode.current = false;
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    setCursorMode('default');
    isTouching.current = false;
  }, []);

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

  useEffect(() => {
    if (isFullScreen) {
      const imgElement = fullImgDomWrapRef.current;

      if (imgElement) {
        imgElement.addEventListener('wheel', handleWheel);
        imgElement.addEventListener('touchstart', handleTouchStart);
        imgElement.addEventListener('mousedown', handleMouseDown);
        imgElement.addEventListener('touchmove', handleTouchMove);
        imgElement.addEventListener('mousemove', handleMouseMove);
        imgElement.addEventListener('touchend', handleTouchEnd);
        imgElement.addEventListener('touchcancel', handleTouchEnd);
        imgElement.addEventListener('mouseup', handleMouseUp);
        imgElement.addEventListener('mouseleave', handleMouseUp);
      }

      return () => {
        imgElement.removeEventListener('wheel', handleWheel);
        imgElement.removeEventListener('touchstart', handleTouchStart);
        imgElement.removeEventListener('mousedown', handleMouseDown);
        imgElement.removeEventListener('touchmove', handleTouchMove);
        imgElement.removeEventListener('mousemove', handleMouseMove);
        imgElement.removeEventListener('touchend', handleTouchEnd);
        imgElement.removeEventListener('touchcancel', handleTouchEnd);
        imgElement.removeEventListener('mouseup', handleMouseUp);
        imgElement.removeEventListener('mouseleave', handleMouseUp);
      };
    } else {
      setTranslate({ x: 0, y: 0 });
      setScale(1);
      setCursorMode('default');
    }
  }, [
    isFullScreen,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    imgDomRef,
    handleMouseDown,
    handleMouseMove,
    handleTouchEnd,
    handleMouseUp,
  ]);

  return (
    <>
      {isFullScreen &&
        createPortal(
          <div
            ref={fullImgDomWrapRef}
            className={styles.fullImgWrap}
            onClick={handleFullScreenClick}
            style={{ cursor: cursorMode }}
          >
            <Button onClick={handleFullScreenClick} className={styles.closeBtn}>
              <Icon type={ICON.close} size={30} />
            </Button>
            <img
              className={styles.img}
              src={imgSrc}
              style={{
                transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
              }}
              draggable={false}
              onClick={handleImageClick}
              {...rest}
            />
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
