export type ICommonBaseProps = {
  className?: string
  children?: any
}

export type ICommonProps<T = HTMLDivElement> = Omit<
  React.HTMLAttributes<T> & React.InputHTMLAttributes<T>,
  'title' | 'size' | 'form' | 'onSubmit'
> & ICommonBaseProps;
