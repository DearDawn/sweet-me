import React, { useContext, useEffect } from 'react';
import * as styles from './index.module.less';
import { Icon, storage } from '../../dist';
import { FormContext } from '../../../common/form';
import { ICON } from '../../../common';

storage.config({ namespace: 'sweet-me', sync: true, params: { dodokey: 123 } });

export const FileList = () => {
  const { state } = useContext(FormContext);
  const { value: file } = state?.file || {};

  useEffect(() => {
    console.log('[dodo] ', 'file', file);
  }, [file]);

  if (!file) {
    return null;
  }

  return (
    <div className={styles.fileList}>
      <div className={styles.fileItem}>
        <Icon className={styles.fileIcon} type={ICON.file} size={40} />
        {file?.name}
        <Icon className={styles.closeIcon} type={ICON.close} size={24} />
      </div>
    </div>
  );
};
