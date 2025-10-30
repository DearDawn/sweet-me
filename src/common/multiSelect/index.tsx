import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import clsx from 'clsx';
import { useBoolean } from '../../hooks';
import { Input } from '../input';
import { Button } from '../button';

type IOption = {
  label: React.ReactNode;
  value: any;
  /** 是否禁用 */
  disabled?: boolean;
};

type IProps = ICommonProps & {
  /** 值 */
  value?: any[];
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (value?: any[]) => void;
  /** 值改变 */
  onValueChange?: (values?: IOption[]) => void;
  /** 打开选择面板 */
  onVisibleChange?: (visible?: boolean) => void;
  /** 选择框类型：文字，图标 */
  type?: 'text' | 'icon';
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 选项 */
  options?: IOption[];
  /** 占位符 */
  placeholder?: string;
  /** 是否允许创建新选项 */
  allowCreate?: boolean;
  /** 创建新选项的提示 */
  createPlaceholder?: string;
  /** 最大选择数量 */
  maxCount?: number;
  /** 是否显示已选项数量 */
  showCount?: boolean;
};

/** 多选下拉选择框，高度通过 css 变量 --height 设置 */
export const MultiSelect = ({
  className,
  onValueChange,
  onVisibleChange,
  onInput,
  value: propsValue,
  placeholder = '请选择',
  align = 'center',
  type = 'text',
  options = [],
  allowCreate = false,
  createPlaceholder = '填写新选项',
  maxCount,
  showCount = false,
  ...rest
}: IProps) => {
  const [selfOptions, setSelfOptions] = React.useState(options);
  const [selfValues, setSelfValues] = React.useState<any[]>([]);
  const [visible, openPanel, closePanel] = useBoolean(false);
  const [pos, setPos] = React.useState<'top' | 'bottom'>('bottom');
  const [inputValue, setInputValue] = React.useState<string>('');

  const values = React.useMemo(
    () => (selfValues.length > 0 ? selfValues : propsValue || []),
    [propsValue, selfValues]
  );
  const selectWrapRef = React.useRef<HTMLDivElement>(null);
  const onVisibleChangeRef = React.useRef(onVisibleChange);
  onVisibleChangeRef.current = onVisibleChange;

  const handleSelect = React.useCallback(
    (it: IOption) => () => {
      if (it.disabled) return;

      let newValues: any[];
      const isSelected = values.includes(it.value);

      if (isSelected) {
        // 取消选中
        newValues = values.filter((val) => val !== it.value);
      } else {
        // 选中
        if (maxCount && values.length >= maxCount) {
          return; // 达到最大选择数量
        }
        newValues = [...values, it.value];
      }

      if (onValueChange || onInput) {
        const selectedOptions = selfOptions.filter((option) =>
          newValues.includes(option.value)
        );
        onValueChange?.(selectedOptions);
        onInput?.(newValues);
      } else {
        setSelfValues(newValues);
      }
    },
    [onInput, onValueChange, values, maxCount, selfOptions]
  );

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

  const handleCreate = React.useCallback(() => {
    if (!inputValue) return;

    const newOption: IOption = {
      label: inputValue,
      value: inputValue,
    };

    const newOptions = [...selfOptions, newOption];
    setSelfOptions(newOptions);
    setInputValue('');

    if (maxCount && values.length >= maxCount) {
      return;
    }

    // 自动选中新创建的选项
    const newValues = [...values, newOption.value];
    if (onValueChange || onInput) {
      const selectedOptions = newOptions.filter((option) =>
        newValues.includes(option.value)
      );
      onValueChange?.(selectedOptions);
      onInput?.(newValues);
    } else {
      setSelfValues(newValues);
    }
  }, [inputValue, maxCount, onInput, onValueChange, selfOptions, values]);

  // 点击外部时，自动关闭面板
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!selectWrapRef.current?.contains(target)) {
        closePanel();
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchend', handler);
    };
  }, [closePanel]);

  React.useEffect(() => {
    setSelfOptions(options);
  }, [options]);

  React.useEffect(() => {
    setSelfValues(propsValue || []);
  }, [propsValue]);

  React.useEffect(() => {
    onVisibleChangeRef.current?.(visible);
  }, [visible]);

  const selectedItems = selfOptions.filter((it) => values.includes(it.value));

  // 获取显示文本
  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }

    if (showCount) {
      return `已选择 ${selectedItems.length} 项`;
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <div
      ref={selectWrapRef}
      className={cs(
        styles.select,
        styles[`pos_${pos}`],
        styles[`type_${type}`],
        styles[`align_${align}`],
        className,
        {
          [styles.empty]: selectedItems.length === 0,
          [styles.visible]: visible,
        }
      )}
      {...rest}
    >
      <div
        className={clsx(styles.input, 'dodo-multi-select-input')}
        onClick={handleToggle}
      >
        {getDisplayText()}
      </div>
      <div className={clsx(styles.optionList, 'dodo-multi-select-option-list')}>
        {selfOptions.map((it) => {
          const isSelected = values.includes(it.value);
          const isMaxReached =
            maxCount && values.length >= maxCount && !isSelected;

          return (
            <div
              className={clsx(
                styles.optionItem,
                'dodo-multi-select-option-item',
                {
                  [styles.active]: isSelected,
                  [styles.disabled]: it.disabled || isMaxReached,
                }
              )}
              key={it.value}
              onClick={handleSelect(it)}
            >
              {it.label}
            </div>
          );
        })}
        {allowCreate && (
          <div className={clsx(styles.optionItem, styles.createItem)}>
            <Input
              className={styles.input}
              placeholder={createPlaceholder}
              value={inputValue}
              onValueChange={(value) => setInputValue(value)}
            />
            <Button
              className={styles.button}
              size='small'
              onClick={handleCreate}
            >
              创建
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
