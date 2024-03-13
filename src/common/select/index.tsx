import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import clsx from 'clsx';
import { useBoolean } from 'src';

type IOption = {
  label: React.ReactNode,
  value: string,
  disabled?: boolean
}
type IProps = ICommonProps & {
  value?: string,
  onInput?: (value?: string) => void,
  onValueChange?: (it?: IOption) => void,
  type?: 'text' | 'icon',
  options?: IOption[]
}

export const Select = ({
  className,
  onValueChange,
  onInput,
  value: propsValue,
  type = 'text',
  options = [],
  ...rest
}: IProps) => {
  const [selfVal, setSelfVal] = React.useState<string>();
  const [visible, openPanel, closePanel] = useBoolean(false);
  const [pos, setPos] = React.useState<'top' | "bottom">('bottom');
  const value = selfVal || propsValue;
  const selectWrapRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = React.useCallback((it: IOption) => () => {
    if (it.disabled) return;

    if (onValueChange || onInput) {
      onValueChange?.(it);
      onInput?.(it.value);
    } else {
      setSelfVal(it.value);
    }
    closePanel();
  }, [closePanel, onInput, onValueChange]);

  const handleToggle = React.useCallback(() => {
    if (!selectWrapRef.current) return;

    if (visible) {
      closePanel();
      return;
    }

    const { bottom } = selectWrapRef.current.getBoundingClientRect();
    const leftSpace = window.innerHeight - bottom;
    setPos(leftSpace >= 160 ? 'bottom' : 'top');
    openPanel();
  }, [closePanel, openPanel, visible]);

  // 点击外部时，自动关闭面板
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!selectWrapRef.current?.contains(target)) {
        closePanel();
      }
    };

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [closePanel]);

  const activeItem = options.find(it => it.value === value);

  return (
    <div
      ref={selectWrapRef}
      className={cs(styles.select, styles[`pos_${pos}`], styles[`type_${type}`], className, {
        [styles.empty]: !activeItem,
        [styles.visible]: visible
      })}
      {...rest}
    >
      <div className={styles.input} onClick={handleToggle}>{activeItem?.label || '请选择'}</div>
      <div className={styles.optionList}>
        {options.map(it => (
          <div
            className={clsx(styles.optionItem, {
              [styles.active]: value === it.value,
              [styles.disabled]: it.disabled
            })}
            key={it.value}
            onClick={handleSelect(it)}
          >
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
};
