import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  autoFitHeight?: boolean;
  enterAsSubmit?: boolean;
  onValueChange?: (value?: string) => void
}

export const Textarea = ({
  className,
  autoFitHeight = true,
  enterAsSubmit = true,
  onValueChange,
  ...rest
}: IProps & React.ButtonHTMLAttributes<HTMLTextAreaElement>) => {
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
    const val = e.target.value;
    onValueChange?.(val);
  }, [onValueChange]);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoFitHeight) return;

    const adjustTextareaHeight = () => {
      textarea.style.height = 'auto';
      const computedHeight = textarea.scrollHeight;
      textarea.style.height = `${computedHeight}px`;
    };

    const submitOnEnter = (event: KeyboardEvent) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        if (!event.repeat) {
          const newEvent = new Event("submit", { bubbles: true, cancelable: true });
          textareaRef.current?.form?.dispatchEvent(newEvent);
        }

        event.preventDefault();
      }
    };

    const handleResize = () => {
      adjustTextareaHeight();
    };

    if (enterAsSubmit && textareaRef.current?.form) {
      textarea.addEventListener("keydown", submitOnEnter);
    }

    textarea.addEventListener('input', adjustTextareaHeight);
    window.addEventListener('resize', handleResize);

    adjustTextareaHeight();

    return () => {
      textarea.removeEventListener("keydown", submitOnEnter);
      textarea.removeEventListener('input', adjustTextareaHeight);
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
