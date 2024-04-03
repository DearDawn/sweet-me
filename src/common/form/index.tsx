import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonBaseProps, ICommonProps } from '../../types';
import { FormState } from '../../hooks/useForm';
import React, { FormEvent, ReactElement, cloneElement, useCallback, useContext } from 'react';

type IFormProps = ICommonProps<HTMLFormElement> & {
  form: FormState<any>
  onSubmit?: (values?: Record<string, any>) => void
}

type IFormItemProps = Omit<ICommonBaseProps, 'children' | 'label'> & {
  label?: string
  field: string
  labelClassName?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: any
  children: ReactElement<FormChildProps>
}

interface FormChildProps {
  value: any;
  id?: string;
  onChange: (value: any) => void;
}

const FormContext = React.createContext<{ form: FormState<any> }>({ form: null });

export const Form = ({
  children,
  className,
  form,
  onSubmit,
  ...rest
}: IFormProps) => {
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    const values = form.getFieldsValue();
    onSubmit?.(values);
  }, [form, onSubmit]);

  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={handleSubmit} className={cs(styles.form, className)} {...rest}>{children}</form>
    </FormContext.Provider>
  );
};

export const FormItem = ({
  children,
  className,
  labelClassName,
  label,
  required,
  disabled,
  defaultValue,
  field,
  ...rest
}: IFormItemProps) => {
  const { form } = useContext(FormContext);

  if (!form || !children) return null;

  // 使用React.cloneElement克隆children组件并添加新的props
  const modifiedChildren = cloneElement(children, {
    id: field,
    ...(form.input({ field, required, disabled, defaultValue }))
  });

  return (
    <div className={cs(styles.formItem, className)} {...rest}>
      {label && (
        <label className={cs(styles.formLabel, labelClassName)} htmlFor={field}>{label}</label>
      )}
      {modifiedChildren}
    </div>
  );
};

Form.Item = FormItem;