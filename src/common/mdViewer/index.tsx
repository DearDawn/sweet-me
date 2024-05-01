import * as styles from './index.module.less';
import 'github-markdown-css/github-markdown-light.css';
import clsx from 'clsx';
import { Modal } from '../modal';
import { Button } from '../button';
import { createRoot } from 'react-dom/client';

interface IProps {
  /** 转换后的 html 字符串 */
  mdContent: string;
  visible?: boolean;
  onClose?: VoidFunction;
}

export const MdViewer = (props: IProps) => {
  const { mdContent, visible, onClose } = props || {};

  return (
    <Modal
      onClose={onClose}
      maskClosable
      visible={visible}
      footer={
        <Button className={styles.closeModalBtn} onClick={onClose}>
          关闭
        </Button>
      }
    >
      <div
        className={clsx(styles.progress, 'markdown-body')}
        dangerouslySetInnerHTML={{ __html: mdContent }}
      />
    </Modal>
  );
};

export const showMdViewer = async (mdContent: string) => {
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

  root.render(<MdViewer mdContent={mdContent} visible onClose={onClose} />);

  return promise;
};
