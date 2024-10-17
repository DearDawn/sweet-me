import * as React from 'react';
import { clsx } from 'clsx';
import * as styles from './index.module.less';
import { ICommonBaseInputCompoProps } from '../../types';
import { Button } from '../button';
import { ICON, Icon } from '../icon';

type IProps = ICommonBaseInputCompoProps<any[]> & {
  /** 最大数量 */
  maxCount?: number;
  /** 支持创建 */
  creatable?: boolean;
  layout?: 'vertical' | 'horizontal';
};

/** 输入框 */
export const MultiInput = ({
  className,
  onInput,
  onValueChange,
  maxCount = 3,
  creatable = false,
  layout = 'vertical',
  children,
  value,
}: IProps) => {
  const [linesVal, setLinesVal] = React.useState(value || []);
  const valRef = React.useRef(linesVal);
  valRef.current = linesVal;
  const _id = React.useRef(0);
  const [currentCount, setCurrentCount] = React.useState(
    creatable ? 1 : maxCount
  );

  const handleValueChange = React.useCallback(
    (value, index) => {
      const newVal = [...linesVal];
      newVal[index] = value;
      setLinesVal(newVal);
      onInput?.(newVal);
      onValueChange?.(newVal);
    },
    [linesVal, onInput, onValueChange]
  );

  const handleAddLine = React.useCallback(() => {
    setCurrentCount((prev) => Math.min(prev + 1, maxCount));
    handleValueChange('', linesVal.length);
  }, [handleValueChange, linesVal.length, maxCount]);

  const handleDeleteLine = React.useCallback(
    (index) => () => {
      setCurrentCount((prev) => Math.max(prev - 1, 1));
      const newVal = [...linesVal];
      newVal.splice(index, 1);
      onInput?.(newVal);
      onValueChange?.(newVal);
      setLinesVal(newVal);
    },
    [linesVal, onInput, onValueChange]
  );

  const list = React.useMemo(() => {
    return Array.from({ length: currentCount }).map(() => _id.current++);
  }, [currentCount]);

  React.useEffect(() => {
    if (JSON.stringify(valRef.current) === JSON.stringify(value)) {
      return;
    }

    if (!value) {
      setLinesVal([]);
      setCurrentCount(creatable ? 1 : maxCount);
      _id.current = 0;
    } else {
      setLinesVal(value || []);
      setCurrentCount(value?.length || 1);
    }
  }, [creatable, maxCount, value]);

  return (
    <div
      className={clsx(
        styles.multiLineWrap,
        styles[`layout_${layout}`],
        className
      )}
    >
      {list.map((id, _idx) => (
        <div key={id} className={styles.lineItem}>
          {React.cloneElement(children, {
            value: linesVal[_idx] ?? '',
            onInput: (value) => {
              handleValueChange?.(value, _idx);
              children.props.onInput?.(value);
            },
          })}
          {currentCount > 1 && creatable && (
            <Button
              className={styles.removeLineItem}
              onClick={handleDeleteLine(_idx)}
            >
              <Icon type={ICON.garbageCan} size={24} />
            </Button>
          )}
        </div>
      ))}
      {currentCount < maxCount && (
        <Button className={styles.addLineItem} onClick={handleAddLine}>
          <Icon type={ICON.add} size={24} />
        </Button>
      )}
    </div>
  );
};
