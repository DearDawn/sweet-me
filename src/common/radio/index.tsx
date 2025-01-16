import { useState } from 'react';
import styles from './index.module.less';
import clsx from 'clsx';

export type IRadioOption = {
  label: React.ReactNode;
  value: number | string;
};

type IProps = {
  /** 选项 */
  options: IRadioOption[];
  /** 值改变 */
  onValueChange?: (val: IRadioOption) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (val: number | string) => void;
  className?: string;
  /** 值 */
  value?: string | number;
  /** 默认值 */
  defaultValue?: string | number;
  /** 类型 */
  type?: 'radio' | 'block';
};

/** 单选 */
export const Radio = (props: IProps) => {
  const {
    value: propsValue,
    options = [],
    onInput,
    onValueChange,
    defaultValue,
    className,
    type = 'block',
  } = props || {};
  const [activeKey, setActiveKey] = useState<string | number>(defaultValue);
  const key = activeKey || propsValue;

  const handleClick = (it: IRadioOption) => () => {
    if (onValueChange || onInput) {
      onValueChange?.(it);
      onInput?.(it.value);
    } else {
      setActiveKey(it.value);
    }
  };

  return (
    <div className={clsx(styles.radio, styles[`type_${type}`], className)}>
      {options.map((it) => (
        <div
          className={clsx(styles.radioItem, {
            [styles.active]: key === it.value,
          })}
          key={it.value}
          onClick={handleClick(it)}
        >
          {it.label}
        </div>
      ))}
    </div>
  );
};
