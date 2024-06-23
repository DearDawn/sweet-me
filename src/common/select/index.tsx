import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import clsx from 'clsx';
import { useBoolean } from '../../hooks';

type IOption = {
  label: React.ReactNode,
  value: any,
  /** 是否禁用 */
  disabled?: boolean
}
type IProps = ICommonProps & {
  /** 值 */
  value?: string,
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (value?: any) => void,
  /** 值改变 */
  onValueChange?: (it?: IOption) => void,
  /** 选择框类型：文字，图标 */
  type?: 'text' | 'icon',
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 选项 */
  options?: IOption[]
  /** 占位符 */
  placeholder?: string
}

/** 下拉选择框 */
export const Select = ({
  className,
  onValueChange,
  onInput,
  value: propsValue,
  placeholder = '请选择',
  align = 'center',
  type = 'text',
  options = [],
  ...rest
}: IProps) => {
  const [selfVal, setSelfVal] = React.useState();
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
      className={cs(styles.select, styles[`pos_${pos}`], styles[`type_${type}`], styles[`align_${align}`], className, {
        [styles.empty]: !activeItem,
        [styles.visible]: visible
      })}
      {...rest}
    >
      <div className={styles.input} onClick={handleToggle}>{activeItem?.label || placeholder}</div>
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
