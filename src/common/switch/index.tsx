import { useEffect, useState } from 'react';
import styles from './index.module.less';
import clsx from 'clsx';

type IProps = {
  /** 值改变 */
  onValueChange?: (val: boolean) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (val: boolean) => void;
  className?: string;
  /** 值 */
  value?: boolean;
  /** 值 */
  checked?: boolean;
  /** 默认值 */
  defaultValue?: boolean;
  /** 禁用 */
  disabled?: boolean;
};

/** 切换 */
export const Switch = (props: IProps) => {
  const {
    value,
    checked,
    onInput,
    onValueChange,
    defaultValue,
    className,
    disabled,
  } = props || {};
  const [isOn, setIsOn] = useState(value || defaultValue);

  const handleClick = () => {
    if (disabled) return;

    const target = !isOn;

    onValueChange?.(target);
    onInput?.(target);
    setIsOn(target);
  };

  useEffect(() => {
    setIsOn(checked || value || defaultValue);
  }, [defaultValue, value, checked]);

  return (
    <div
      className={clsx(styles.switchWrap, className, {
        [styles.on]: isOn,
        [styles.off]: !isOn,
        [styles.disabled]: disabled,
      })}
      onClick={handleClick}
    >
      <div className={styles.switchThumb} />
    </div>
  );
};
