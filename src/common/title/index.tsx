import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  align?: 'left' | 'center' | 'right'
}

export const Title = ({
  children,
  className,
  align = 'left',
  ...rest
}: IProps) => {

  return (
    <div className={cs(styles.title, styles[`align_${align}`], className)} {...rest}>{children}</div>
  );
};
