import '../../global.d'
import * as React from 'react';
import * as styles from './App.module.less';
import { toast, notice, Button, Title, Icon, Header } from './dist';
import clsx from 'clsx';
import { ICON } from '../common/icon';

interface IProps { }

export const App = (props: IProps) => {
  const handleToast = React.useCallback(() => {
    toast('this is a toast');
  }, [])

  const handleNotice = React.useCallback(() => {
    notice.info('info', 1000)
    notice.error('error', 2000)
    notice.success('success', 3000)
  }, [])

  return <div className={styles.app}>
    <Header title="小糖的组件库" />
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
    <Title>Icon</Title>
    <div className={styles.iconWrap}>
      {Object.values(ICON).map((value) => (
        <Icon className={styles.iconItem} key={value} type={value} />
      ))}
    </div>
    <Title>Header</Title>
    <Header
      title="标题组件"
      leftPart={<Icon type={ICON.magicBar} />}
      rightPart={<Icon type={ICON.refresh} />}
    />
    <Title>Toast & Notice</Title>
    <Button onClick={handleToast}>点击 Toast</Button>
    <Button onClick={handleNotice} className={styles.ml10}>点击 Notice</Button>
  </div>;
};
