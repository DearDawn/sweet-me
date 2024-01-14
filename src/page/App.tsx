import '../../global.d'
import * as React from 'react';
import * as styles from './App.module.less';
import { toast, notice, Button, Title } from './dist';
import clsx from 'clsx';

interface IProps { }

export const App = (props: IProps) => {
  React.useEffect(() => {
    console.log('[dodo] ', 'home');

    setTimeout(() => {
      // toast('123123213123213');
      notice.info('info', 1000)
      notice.error('error', 2000)
      notice.success('success', 3000)
    }, 3000);
  }, []);

  return <div className={styles.app}>
    <Title>按钮</Title>
    <div className={styles.buttonWrap}>
      <Button className={styles.button} size='large'>大按钮</Button>
      <Button className={styles.button} size='normal'>中按钮</Button>
      <Button className={styles.button} size='small'>小按钮</Button>
      <Button className={styles.button} size='mini'>迷你钮</Button>
      <Button className={clsx(styles.button, styles.long)} size='long'>长按钮</Button>
      <Button className={styles.button} status='default'>默认</Button>
      <Button className={styles.button} status='success'>成功</Button>
      <Button className={styles.button} status='warning'>警告</Button>
      <Button className={styles.button} status='error'>错误</Button>
    </div>
  </div>;
};
