import { useEffect } from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 在屏幕宽度 375px 为标准的前提下，1rem 代表的大小，默认 10px */
  rem?: number;
  /** 在屏幕宽度 375px 为标准的前提下，字体的默认大小，默认 1.8rem */
  fontSize?: string;
  /** 页面最小宽度 */
  minWidth?: string;
  /** 页面最大宽度 */
  maxWidth?: string;
  /** 页面容器的引用 */
  pageRef?: React.RefObject<HTMLDivElement>;
  /**
   * 是否使用内部容器，默认为 false
   * 默认需要限制子元素的 fixed 定位在父元素内部，但会导致 fixed 定位跟随滚动
   * 故添加此设置解决该问题，如有需要，请启用，并注意层级变化
   * */
  withInner?: boolean;
  innerClass?: boolean;
};

/** 页面容器 */
export const Page = ({
  children,
  className,
  rem = 10,
  fontSize = '1.8rem',
  minWidth = '300px',
  maxWidth = '750px',
  pageRef,
  style,
  withInner,
  innerClass,
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
      style={{ fontSize, minWidth, maxWidth, ...style }}
      className={cs(styles.page, className)}
      ref={pageRef}
      {...rest}
    >
      {withInner ? (
        <div className={cs(styles.pageInner, innerClass)}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
