import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import ReactDom from 'react-dom';
import { ReactNode, useCallback } from 'react';

type IProps = ICommonProps & {
  visible: boolean
  maskClosable?: boolean
  rootElement?: Element
  footer?: ReactNode
  onClose?: VoidFunction
}

export const Modal = ({
  children,
  className,
  footer,
  onClose,
  visible = false,
  maskClosable = false,
  rootElement = document.body,
  ...rest
}: IProps) => {
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleMaskClick = useCallback(() => {
    if (!maskClosable) return;

    onClose?.();
  }, [maskClosable, onClose]);

  if (!visible) return null;

  return ReactDom.createPortal(

    <div
      className={cs(styles.modal, {
        [styles.visible]: visible
      }, className)}
      onClick={handleMaskClick}
      {...rest}
    >
      <div className={styles.modalContent} onClick={handleContentClick}>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
    , rootElement);
};
