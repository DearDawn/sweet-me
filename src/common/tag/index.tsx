import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { getColorRGB, rgbToHsl } from 'src/utils';

type IProps = ICommonProps & {
  /** tag 颜色：红橙黄绿青蓝紫灰 */
  color?: "red" | "orange" | "yellow" | "green" | "cyan" | "blue" | "purple" | "gray";
  loading?: boolean;
};

export const Tag = ({
  style = {},
  children,
  className,
  color = 'gray',
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLDivElement>) => {
  const [r, g, b] = getColorRGB(color);
  const [h, s, l] = rgbToHsl(r, g, b);

  return (
    <div
      style={{ '--h': h, '--s': `${s}%`, '--l': `${l}%`, ...style } as any}
      className={cs(styles.tag, className)}
      {...rest}
    >
      {children}
    </div>
  );
};
