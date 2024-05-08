import React, { useContext } from 'react';
import * as styles from './index.module.less';
import { Icon, Storage } from '../../dist';
import { FormContext } from '../../../common/form';
import { ICON } from '../../../common';

const storage = new Storage();
storage.config({ namespace: 'sweet-me', sync: true, params: { dodokey: 123 } });

export const FileList = ({ onDelete }: { onDelete: VoidFunction }) => {
  const { state } = useContext(FormContext);
  const { value: file } = state?.file || {};

  if (!file) {
    return null;
  }

  return (
    <div className={styles.fileList}>
      <div className={styles.fileItem}>
        <Icon className={styles.fileIcon} type={ICON.file} size={40} />
        {file?.name}
        <Icon
          className={styles.closeIcon}
          onClick={onDelete}
          type={ICON.close}
          size={24}
        />
      </div>
    </div>
  );
};
