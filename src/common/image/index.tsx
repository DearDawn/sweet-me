import React, { useCallback, useState } from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

type IProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  onClick?: VoidFunction;
  withPreview?: boolean;
};

export const Image = (props: IProps) => {
  const { onClick, className, withPreview = true, ...rest } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  const handleClick = useCallback(() => {
    if (withPreview) {
      setIsFullScreen(true);
    }

    onClick?.();
  }, [onClick]);

  return (
    <>
      {isFullScreen &&
        createPortal(
          <div className={styles.fullImgWrap} onClick={handleFullScreenClick}>
            <img className={styles.img} {...rest} />
          </div>,
          document.body
        )}
      <img
        className={clsx(styles.img, className)}
        {...rest}
        onClick={handleClick}
      />
    </>
  );
};
