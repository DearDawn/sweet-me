import styles from './index.module.less';
import 'github-markdown-css/github-markdown-light.css';
import clsx from 'clsx';
import { Modal } from '../modal';
import { Button } from '../button';
import { createRoot } from 'react-dom/client';

interface IProps {
  /** 转换后的 html 字符串 */
  mdContent: string;
  /** 预览弹窗是否可见 */
  visible?: boolean;
  /** 关闭弹窗 */
  onClose?: VoidFunction;
}

/**
 * markdown 预览组件
 *
 * 若希望直接 import Markdown 文件为 html 字符串形式，需要插件支持 md 转换
 * parcel: parcel-transformer-markdown
 */
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
