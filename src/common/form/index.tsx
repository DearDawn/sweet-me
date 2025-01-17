import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonBaseProps, ICommonProps } from '../../types';
import { FormInstant, FormState } from '../../hooks/useForm';
import React, {
  FormEvent,
  ReactElement,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
} from 'react';

type IFormProps = ICommonProps<HTMLFormElement> & {
  /** 表单实例，通过 useFormState Hook 获取 */
  form: FormInstant<any>;
  /** 提交表单 */
  onSubmit?: (values?: Record<string, any>) => void;
};

type IFormItemProps = Omit<ICommonBaseProps, 'children' | 'label'> & {
  /** 表单项展示名 */
  label?: string;
  /** 表单项字段名 */
  field: string;
  /** 表单项展示名样式 */
  labelClassName?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否不要边距 */
  noMargin?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 默认值 */
  defaultValue?: any;
  children: ReactElement<FormChildProps>;
};

interface FormChildProps {
  value: any;
  id?: string;
  onChange: (value: any) => void;
}

export const FormContext = React.createContext<{
  form: FormInstant<any>;
  state?: FormState<any>;
}>({
  form: null,
});

/** 表单 */
export const Form = ({
  children,
  className,
  form,
  onSubmit,
  ...rest
}: IFormProps) => {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const values = form.getFieldsValue();
      onSubmit?.(values);
    },
    [form, onSubmit]
  );

  return (
    <FormContext.Provider value={{ form, state: form['state'] }}>
      <form
        ref={form.formRef}
        onSubmit={handleSubmit}
        className={cs(styles.form, className)}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

/**
 * 表单项
 *
 * 输入组件在配合表单使用时， onValueChange 可用， onInput 供 FormItem 使用
 */
export const FormItem = ({
  children,
  className,
  labelClassName,
  label,
  required,
  disabled,
  defaultValue,
  noMargin = false,
  field,
  ...rest
}: IFormItemProps) => {
  const { form } = useContext(FormContext);

  useEffect(() => {
    if (!form || !children) return null;

    form.initField({ field, required, disabled, defaultValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!form || !children) return null;

  // 使用React.cloneElement克隆children组件并添加新的props
  const modifiedChildren = cloneElement(children, {
    id: field,
    ...form['getInitProps']({ field, required, disabled, defaultValue }),
  });

  return (
    <div
      className={cs(
        styles.formItem,
        {
          [styles.noMargin]: noMargin,
        },
        className
      )}
      {...rest}
    >
      {label && (
        <label className={cs(styles.formLabel, labelClassName)} htmlFor={field}>
          {label}
        </label>
      )}
      {modifiedChildren}
    </div>
  );
};

Form.Item = FormItem;
