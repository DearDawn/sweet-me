import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import ReactDom from 'react-dom';
import React, { ReactNode, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';

type IProps = ICommonProps & {
  visible: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  rootElement?: Element;
  footer?: ReactNode;
  onClose?: VoidFunction;
};

export const Modal = ({
  children,
  className,
  footer,
  onClose,
  visible = false,
  maskClosable = false,
  escClosable = true,
  rootElement = document.body,
  ...rest
}: IProps) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleMaskClick = useCallback(() => {
    if (!maskClosable) return;

    onClose?.();
  }, [maskClosable, onClose]);

  useEffect(() => {
    const modal = modalRef.current;

    if (!modal) {
      return;
    }

    const escClose = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && escClosable) {
        if (!event.repeat) {
          onClose?.();
        }
      }
    };

    modal.addEventListener('input', escClose);

    return () => {
      modal.removeEventListener('input', escClose);
    };
  }, [escClosable, onClose]);

  if (!visible) return null;

  return ReactDom.createPortal(
    <div
      className={cs(
        styles.modal,
        {
          [styles.visible]: visible,
        },
        className
      )}
      onClick={handleMaskClick}
      ref={modalRef}
      {...rest}
    >
      <div className={styles.modalContent} onClick={handleContentClick}>
        <div className={styles.content}>{children}</div>
        {footer && (
          <div className={clsx(styles.footer, 'dodo-modal-footer')}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    rootElement
  );
};

export const showModal = async (
  renderFn: (params: { onClose: VoidFunction }) => ReactNode,
  props?: Omit<IProps, 'visible'>
) => {
  const { maskClosable = true, ...rest } = props || {};

  let resolve = (_) => {};

  const promise = new Promise((res) => {
    resolve = res;
  });

  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const root = createRoot(modalRoot);

  const onClose = () => {
    root.unmount();
    resolve(true);
  };

  root.render(
    <Modal onClose={onClose} visible maskClosable={maskClosable} {...rest}>
      {renderFn({ onClose })}
    </Modal>
  );

  return promise;
};
