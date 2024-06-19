import { useEffect, useState } from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';

export type IRadioOption = {
  label: React.ReactNode;
  value: number | string;
};

export const Radio = (props: {
  options: IRadioOption[];
  onValueChange?: (val: IRadioOption) => void;
  onInput?: (val: number | string) => void;
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: 'radio' | 'block';
}) => {
  const {
    value: propsValue,
    options = [],
    onInput,
    onValueChange,
    defaultValue,
    className,
    type = 'block',
  } = props || {};
  const [activeKey, setActiveKey] = useState<string | number>(
    defaultValue || propsValue
  );
  const key = activeKey || propsValue;

  const handleClick = (it: IRadioOption) => () => {
    if (onValueChange || onInput) {
      onValueChange?.(it);
      onInput?.(it.value);
    } else {
      setActiveKey(it.value);
    }
  };

  useEffect(() => {
    setActiveKey(propsValue || defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsValue]);

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
