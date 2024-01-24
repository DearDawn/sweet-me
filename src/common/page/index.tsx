import { useEffect } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

interface IProps extends ICommonProps {
  /** 在屏幕宽度 375px 为标准的前提下，1rem 代表的大小，默认 10px */
  rem?: number,
  /** 在屏幕宽度 375px 为标准的前提下，字体的默认大小，默认 18，单位 px */
  fontSize?: number,
  minWidth?: string,
  maxWidth?: string,
}

export const Page = ({
  children,
  className,
  rem = 10,
  fontSize = 18,
  minWidth = '300px',
  maxWidth = '750px',
  ...rest
}: IProps) => {
  useEffect(() => {
    const rootStyles = document.documentElement.style;
    const windowWidth = `min(max(${minWidth}, 100vw), ${maxWidth})`;
    rootStyles.setProperty('--dodo-root-fz', `calc(${windowWidth} / 375 * ${rem})`);
  }, [maxWidth, minWidth, rem]);
  const fz = `${fontSize / rem}rem`;

  return (
    <div style={{ fontSize: fz, minWidth, maxWidth }} className={cs(styles.page, className)} {...rest}>{children}</div>
  );
};
