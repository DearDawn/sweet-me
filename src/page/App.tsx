import '../../global.d'
import * as React from 'react';
import * as styles from './App.module.less';
import { toast, notice, Button } from './dist';

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
    <Button>你好啊</Button>
  </div>;
};
