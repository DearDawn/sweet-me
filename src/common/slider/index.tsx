import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as styles from './index.module.less';
import clsx from 'clsx';

interface IProps {
  /** 值改变 */
  onValueChange?: (val: number) => void;
  /** 与 FormItem 配合时，供 FormItem 使用，请用 onValueChange 替代 */
  onInput?: (value: number) => void;
  className?: string;
  /** 最小值，默认 0 */
  min?: number;
  /** 最大值，默认 100 */
  max?: number;
  /** 滑动步长，默认 1 */
  step?: number;
  /** 值 */
  value?: number;
  /** 默认值 */
  defaultValue?: number;
  /** 是否隐藏尾部数值 */
  hideValue?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

export const Slider = (props: IProps) => {
  const {
    onInput,
    onValueChange,
    className,
    hideValue,
    step = 1,
    min = 0,
    max = 100,
    value: propsValue,
    disabled,
    defaultValue,
  } = props || {};
  const [value, setValue] = useState(propsValue ?? defaultValue ?? min);
  const percent = ((value - min) / (max - min)) * 100;

  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef(null);
  const isDragging = useRef(false);

  const setVal = useCallback(
    (offsetX, rectWidth) => {
      const realVal = (offsetX / rectWidth) * (max - min) + min;
      const formatVal = Math.round(realVal - (realVal % step));

      setValue(formatVal);
      onInput?.(formatVal);
      onValueChange?.(formatVal);
    },
    [max, min, onInput, onValueChange, step]
  );

  useEffect(() => {
    const root = sliderRef.current;

    if (!root || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();

    const handleMouseMove = (event) => {
      if (isDragging.current) {
        let offsetX = event.clientX - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;
        setVal(offsetX, rect.width);
      }
    };

    const handleTouchMove = (event) => {
      if (isDragging.current) {
        let offsetX = event.touches[0].clientX - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;
        setVal(offsetX, rect.width);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [setVal, disabled]);

  useEffect(() => {
    setValue(propsValue ?? defaultValue);
  }, [defaultValue, propsValue]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const handleClick = (event) => {
    if (disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let offsetX = event.clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    setVal(offsetX, rect.width);
  };

  return (
    <div
      className={clsx(styles.sliderContainer, className, {
        [styles.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div className={styles.sliderTrack} ref={sliderRef}>
        <div
          className={styles.sliderThumb}
          ref={thumbRef}
          style={{ left: `${percent}%` }}
        ></div>
      </div>
      {!hideValue && <div className={styles.sliderValue}>{value}</div>}
    </div>
  );
};
