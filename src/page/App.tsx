import '../../global.d';
import * as React from 'react';
import * as styles from './App.module.less';
import { toast, notice, Button, Title, Icon, Header, Page, Input } from './dist';
import clsx from 'clsx';
import { ICON } from '../common/icon';

export const App = () => {
  const handleToast = React.useCallback(() => {
    toast('this is a toast');
  }, []);

  const handleNotice = React.useCallback((type: 'info' | 'error' | 'success') => () => {
    notice[type](type, 1000);
  }, []);

  return (
    <Page className={styles.app}>
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
      <div>
        <Button onClick={handleToast} className={styles.ml10}>Toast</Button>
        <Button onClick={handleNotice('info')} className={styles.ml10} status='default'>Notice</Button>
        <Button onClick={handleNotice('success')} className={styles.ml10} status='success'>Notice</Button>
        <Button onClick={handleNotice('error')} className={styles.ml10} status='error'>Notice</Button>
      </div>
      <Title>Input</Title>
      <div className={styles.inputWrap}>
        <Input className={styles.input} placeholder="请输入" />
        <Button className={styles.ml10}>提交</Button>
      </div>
    </Page>
  );
};
