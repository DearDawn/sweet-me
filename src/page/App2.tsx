import '../../global.d';
import * as React from 'react';
import * as styles from './App.module.less';
import { Button } from '../../dist';
import clsx from 'clsx';
import { notice } from '../../dist/utils/notice';
export const App = () => {
  return (
    <div className={styles.buttonWrap}>
      <Button
        className={styles.button}
        size='large'
        onClick={() => {
          notice.info('click');
        }}
      >
        大按钮
      </Button>
      <Button className={styles.button} size='normal'>
        中按钮
      </Button>
      <Button className={styles.button} size='small'>
        小按钮
      </Button>
      <Button className={styles.button} size='mini'>
        迷你钮
      </Button>
      <Button className={clsx(styles.button, styles.long)} size='long'>
        长按钮
      </Button>
      <Button className={styles.button} status='default'>
        默认
      </Button>
      <Button className={styles.button} status='success'>
        成功
      </Button>
      <Button className={styles.button} status='warning'>
        警告
      </Button>
      <Button className={styles.button} status='error'>
        错误
      </Button>
      <Button className={clsx(styles.button, styles.long)} size='long' loading>
        Loading
      </Button>
    </div>
  );
};
