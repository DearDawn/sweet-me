import * as React from 'react';
import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';

type IProps = ICommonProps & {
  /** 按钮大小 */
  size?: 'normal' | 'small' | 'large' | 'mini' | 'long'
  /** 按钮状态 */
  status?: 'success' | 'error' | 'warning' | 'default'
  autoFitHeight?: boolean;
  onValueChange?: (value?: string) => void
}

export const Textarea = ({
  className,
  size = 'normal',
  status = 'default',
  autoFitHeight = true,
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

    const handleResize = () => {
      adjustTextareaHeight();
    };

    textarea.addEventListener('input', adjustTextareaHeight);
    window.addEventListener('resize', handleResize);

    adjustTextareaHeight();

    return () => {
      textarea.removeEventListener('input', adjustTextareaHeight);
      window.removeEventListener('resize', handleResize);
    };
  }, [autoFitHeight]);

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cs(styles.textarea, styles[`size_${size}`], styles[`status_${status}`], className)}
      {...rest}
    />
  );
};
