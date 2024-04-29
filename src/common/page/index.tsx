import { useEffect, useRef } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 在屏幕宽度 375px 为标准的前提下，1rem 代表的大小，默认 10px */
  rem?: number;
  /** 在屏幕宽度 375px 为标准的前提下，字体的默认大小，默认 1.8rem */
  fontSize?: string;
  minWidth?: string;
  maxWidth?: string;
  pageRef?: React.RefObject<HTMLDivElement>;
};

export const Page = ({
  children,
  className,
  rem = 10,
  fontSize = '1.8rem',
  minWidth = '300px',
  maxWidth = '750px',
  pageRef,
  ...rest
}: IProps) => {

  useEffect(() => {
    const rootStyles = document.documentElement.style;
    const windowWidth = `min(max(${minWidth}, 100vw), ${maxWidth})`;
    rootStyles.setProperty(
      '--dodo-root-fz',
      `calc(${windowWidth} / 375 * ${rem})`
    );
  }, [maxWidth, minWidth, rem]);

  return (
    <div
      style={{ fontSize, minWidth, maxWidth }}
      className={cs(styles.page, className)}
      ref={pageRef}
      {...rest}
    >
      {children}
    </div>
  );
};
