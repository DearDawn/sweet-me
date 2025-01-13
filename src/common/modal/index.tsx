import cs from 'clsx';
import * as styles from './index.module.less';
import { ICommonProps } from '../../types';
import ReactDom from 'react-dom';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';

type IProps = ICommonProps & {
  /** 弹窗是否可见 */
  visible: boolean;
  /** 弹窗是否可点击遮罩层关闭 */
  maskClosable?: boolean;
  /** esc键是否可关闭 */
  escClosable?: boolean;
  /** back是否可关闭 */
  backClosable?: boolean;
  /** 弹窗挂载的根节点, 默认 document.body */
  rootElement?: Element;
  /** 弹窗底部内容 */
  footer?: ReactNode;
  /** 关闭弹窗 */
  onClose?: VoidFunction;
  /** 方向 */
  direction?: 'left' | 'right' | 'top' | 'bottom';
};

/** 弹窗组件 */
export const Modal = ({
  children,
  className,
  footer,
  onClose,
  visible = false,
  maskClosable = false,
  escClosable = true,
  backClosable = true,
  rootElement = document.body,
  direction,
  ...rest
}: IProps) => {
  const [selfVisible, setSelfVisible] = useState(false);
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

  useEffect(() => {
    if (!backClosable) return;

    if (selfVisible) {
      // 弹窗打开时，添加一条历史记录
      window.history.pushState({}, '', window.location.href);

      // 监听返回操作
      const handlePopstate = () => {
        if (selfVisible) {
          onClose?.(); // 关闭弹窗
        } else {
          window.history.back(); // 返回上一页
        }
      };

      window.addEventListener('popstate', handlePopstate);

      // 清理函数
      return () => {
        window.removeEventListener('popstate', handlePopstate);
      };
    }
  }, [backClosable, onClose, selfVisible]);

  useEffect(() => {
    const timer = setTimeout(() => setSelfVisible(visible), visible ? 0 : 300);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible && !selfVisible) return null;

  return ReactDom.createPortal(
    <div
      className={cs(
        styles.modal,
        {
          [styles.visible]: selfVisible && visible,
          [styles[direction]]: direction,
        },
        className
      )}
      onClick={handleMaskClick}
      ref={modalRef}
      {...rest}
    >
      <div className={styles.modalContent} onClick={handleContentClick}>
        <div className={cs(styles.content, 'dodo-modal-content')}>
          {children}
        </div>
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

/** 显示弹窗 */
export const showModal = async (
  /** 渲染弹窗内容，提供 onClose */
  renderFn: (params: { onClose: VoidFunction }) => ReactNode,
  /** 透传给 Modal 的弹窗属性 */
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
