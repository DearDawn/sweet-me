import * as React from 'react';
import * as styles from './App.module.less';
import { Button, toast, notice } from 'dist';

interface IProps { }

export const App = (props: IProps) => {
  React.useEffect(() => {
    console.log('[dodo] ', 'home');

    setTimeout(() => {
      // toast('123123213123213');
      notice.info('info', 10000)
      notice.error('error', 20000)
      notice.success('success', 30000)
    }, 3000);
  }, []);

  return <div className={styles.app}>
    <Button>你好啊</Button>
  </div>;
};
