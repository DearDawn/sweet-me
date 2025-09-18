import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { useCallbackRef } from '../../hooks/useCallbackRef';

type IProps = ICommonProps & {
  /** 是否自动调整高度 */
  autoFitHeight?: boolean;
  /** 输入框回车是否提交 */
  enterAsSubmit?: boolean;
  /** 值改变回调 */
  onValueChange?: (value?: string) => void;
};

/** 多行文本输入框 */
export const Textarea = ({
  className,
  autoFitHeight = true,
  enterAsSubmit = true,
  onValueChange,
  defaultValue,
  value,
  ...rest
}: IProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preValue = React.useRef<any>();
  const withValue = !!value || !!defaultValue;

  const adjustTextareaHeight = useCallbackRef((val = value) => {
    if (val === preValue.current) return;

    preValue.current = val;
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';
    const computedHeight = textarea.scrollHeight;
    textarea.style.height = `${computedHeight}px`;
  });

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
    React.useCallback(
      (e) => {
        const val = e.target.value;
        onValueChange?.(val);
      },
      [onValueChange]
    );

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const submitOnEnter = (event: KeyboardEvent) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        if (!event.repeat) {
          const newEvent = new Event('submit', {
            bubbles: true,
            cancelable: true,
          });
          textareaRef.current?.form?.dispatchEvent(newEvent);
        }

        event.preventDefault();
      }
    };

    if (enterAsSubmit && textareaRef.current?.form) {
      textarea.addEventListener('keydown', submitOnEnter);
    }
    return () => {
      textarea.removeEventListener('keydown', submitOnEnter);
    };
  }, [adjustTextareaHeight, autoFitHeight, enterAsSubmit]);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoFitHeight) return;

    const handleResize = () => {
      adjustTextareaHeight.current();
    };

    textarea.addEventListener('input', handleResize);
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      textarea.removeEventListener('input', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustTextareaHeight, autoFitHeight, enterAsSubmit, withValue]);

  React.useEffect(() => {
    if (autoFitHeight) {
      adjustTextareaHeight.current(value || defaultValue);
    }
  }, [adjustTextareaHeight, autoFitHeight, defaultValue, value]);

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cs(styles.textarea, className)}
      defaultValue={defaultValue}
      value={value}
      {...rest}
    />
  );
};
