import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

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
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLTextAreaElement>) => {
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
    React.useCallback(
      (e) => {
        const val = e.target.value;
        onValueChange?.(val);
      },
      [onValueChange]
    );

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoFitHeight) return;

    let previousValue = textarea.value;

    const adjustTextareaHeight = () => {
      if (textarea.value === previousValue) return;

      textarea.style.height = 'auto';
      const computedHeight = textarea.scrollHeight;
      textarea.style.height = `${computedHeight}px`;

      previousValue = textarea.value;
    };

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
      adjustTextareaHeight();
    };

    if (enterAsSubmit && textareaRef.current?.form) {
      textarea.addEventListener('keydown', submitOnEnter);
    }

    textarea.addEventListener('input', adjustTextareaHeight);
    textarea.addEventListener('change', adjustTextareaHeight);
    window.addEventListener('resize', handleResize);

    adjustTextareaHeight();

    return () => {
      textarea.removeEventListener('keydown', submitOnEnter);
      textarea.removeEventListener('input', adjustTextareaHeight);
      textarea.removeEventListener('change', adjustTextareaHeight);
      window.removeEventListener('resize', handleResize);
    };
  }, [autoFitHeight, enterAsSubmit]);

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cs(styles.textarea, className)}
      {...rest}
    />
  );
};
