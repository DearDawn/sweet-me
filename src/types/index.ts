export type ICommonBaseProps = {
  className?: string;
  children?: any;
};

export type ICommonBaseInputCompoProps<T> = {
  /** 内容值 */
  value?: T;
  // /** 内容值变化 */
  onValueChange?: (value: T) => void;
  /** 输入（供 FormItem 使用） */
  onInput?: (value: T) => void;
  /** 禁用表单 */
  disabled?: boolean;
  /** 占位符 */
  placeholder?: T;
  children?: any;
} & ICommonBaseProps;

export type ICommonProps<T = HTMLDivElement> = Omit<
  React.HTMLAttributes<T> & React.InputHTMLAttributes<T>,
  'size' | 'form' | 'onSubmit'
> & ICommonBaseProps;
