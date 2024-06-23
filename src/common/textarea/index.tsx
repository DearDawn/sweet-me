import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import { useCallbackRef } from 'src/hooks/useCallbackRef';

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
  value,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preValue = React.useRef<any>();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
    React.useCallback(
      (e) => {
        const val = e.target.value;
        onValueChange?.(val);
      },
      [onValueChange]
    );

  const adjustTextareaHeight = useCallbackRef(() => {
    if (value === preValue.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    const computedHeight = textarea.scrollHeight;
    textarea.style.height = `${computedHeight}px`;

    preValue.current = value;
  });

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoFitHeight) return;

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

    const handleResize = () => {
      adjustTextareaHeight.current();
    };

    if (enterAsSubmit && textareaRef.current?.form) {
      textarea.addEventListener('keydown', submitOnEnter);
    }

    textarea.addEventListener('input', handleResize);
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      textarea.removeEventListener('keydown', submitOnEnter);
      textarea.removeEventListener('input', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustTextareaHeight, autoFitHeight, enterAsSubmit]);

  React.useEffect(() => {
    if (!value) {
      adjustTextareaHeight.current();
    }
  }, [adjustTextareaHeight, value]);

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cs(styles.textarea, className)}
      value={value}
      {...rest}
    />
  );
};
