export interface ICommonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  className?: string
  children?: any
}