import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import ReactDom from 'react-dom';
import { useCallback } from 'react';

type IProps = ICommonProps & {
  visible: boolean
  maskClosable?: boolean
  rootElement?: Element
  onClose?: VoidFunction
}

export const Modal = ({
  children,
  className,
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
      <div className={styles.content} onClick={handleContentClick}>
        {children}
      </div>
    </div>
    , rootElement);
};
