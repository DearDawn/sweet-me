import '../../global.d';
import * as React from 'react';
import * as styles from './App.module.less';
import { toast, notice, Button, Title, Icon, Header, Page, Input, loading, Modal, Textarea, Form, Select } from './dist';
import clsx from 'clsx';
import { ICON } from '../common/icon';
import { useBoolean, useFormState, useRequest } from '../hooks';
import { Progress } from './components/progress';
import { Changelog } from './components/changelog';

export const App = () => {
  const [url, setUrl] = React.useState('');
  const { runApi, loading: isLoading } = useRequest({ url: 'https://dododawn.com:7020/api/', params: {} });
  const loadingRef = React.useRef(() => { });
  const [modalVisible, openModal, closeModal] = useBoolean(false);
  const [progressVisible, openProgress, closeProgress] = useBoolean(false);
  const [changeLogVisible, openChangeLog, closeChangeLog] = useBoolean(false);
  const { form } = useFormState();

  const handleToast = React.useCallback(() => {
    toast('this is a toast');
  }, []);

  const handleLoading = React.useCallback((duration?: number, mask = false) => () => {
    loadingRef.current();
    loadingRef.current = loading('loading', duration, mask);
  }, []);

  const handleLoadingEnd = React.useCallback(() => {
    loadingRef.current();
    loadingRef.current = () => { };
  }, []);

  const handleSubmit = React.useCallback(() => {
    runApi().then(res => toast(res?.message)).catch(err => toast(err?.message));
  }, [runApi]);

  const handleFormSubmit = React.useCallback(() => {
    const values = form.getFieldsValue();
    toast(JSON.stringify(values, undefined, 2));
  }, [form]);

  const handleNotice = React.useCallback((type: 'info' | 'error' | 'success') => () => {
    notice[type](type, 1000);
  }, []);

  const handleHelp = () => {
    toast('开发中...');
  };

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[dodo] ', 'input', url);
  }, [url]);

  return (
    <Page className={styles.app}>
      <Header title="小糖的组件库" isSticky />
      <div className={styles.buttonWrap}>
        <div className={styles.helpBtnList}>
          <Button className={styles.button} size='normal' status='success' onClick={openProgress}>
            <Icon type={ICON.pc} className={styles.buttonIcon} />
            开发进展
          </Button>
          <Button className={styles.button} size='normal' status='success' onClick={openChangeLog} >
            <Icon type={ICON.log} size={26} className={styles.buttonIcon} />
            CHANGE LOG
          </Button>
          <Button className={styles.button} size='normal' status='success' onClick={handleHelp} >
            <Icon type={ICON.book} className={styles.buttonIcon} />
            使用文档
          </Button>
          <Modal
            onClose={closeProgress}
            maskClosable
            visible={progressVisible}
            footer={
              <Button className={styles.closeModalBtn} onClick={closeProgress}>关闭</Button>
            }>
            <Progress />
          </Modal>
          <Modal
            maskClosable
            onClose={closeChangeLog}
            visible={changeLogVisible}
            footer={
              <Button className={styles.closeModalBtn} onClick={closeChangeLog}>关闭</Button>
            }>
            <Changelog />
          </Modal>
        </div>
      </div>
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
        <Button className={clsx(styles.button, styles.long)} size='long' loading>Loading</Button>
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
      <Title>Loading</Title>
      <div>
        <Button onClick={handleLoading(1000, true)} className={styles.ml10}>1s Loading</Button>
        <Button onClick={handleLoading(5000)} className={styles.ml10}>5s Loading</Button>
        <Button onClick={handleLoadingEnd} className={styles.ml10} status='error'>End Loading</Button>
      </div>
      <Title>Modal</Title>
      <Button className={styles.ml10} onClick={openModal}>打开弹窗</Button>
      <Modal visible={modalVisible} maskClosable onClose={closeModal}>
        <Button className={styles.closeModalBtn} onClick={closeModal}>关闭弹窗</Button>
      </Modal>
      <Title>Input & Textarea</Title>
      <div className={styles.inputWrap}>
        <Input
          className={styles.input}
          onValueChange={(val = '') => setUrl(val.trim())}
          placeholder="请输入"
        />
        <Button className={styles.ml10} onClick={handleSubmit} loading={isLoading}>提交</Button>
        <Textarea
          className={styles.textarea}
          onValueChange={(val = '') => setUrl(val.trim())}
          placeholder="请输入"
        />
      </div>
      <Title>Select</Title>
      <div className={styles.selectWrap}>
        <Select
          className={styles.select}
          options={[
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '选项三', value: '3', disabled: true },
            { label: '选项四', value: '4' },
            { label: '选项五', value: '5' },
            { label: '选项六', value: '6' },
            { label: '选项七', value: '7' },
          ]}
        />
        <Select
          className={styles.select}
          type='icon'
          options={[
            { label: <Icon type={ICON.home} className={styles.selectIcon} />, value: '1' },
            { label: <Icon type={ICON.rocket} className={styles.selectIcon} />, value: '2' },
            { label: <Icon type={ICON.sugar} className={styles.selectIcon} />, value: '3' },
          ]}
        />
      </div>

      <Title>Form</Title>
      <Form form={form}>
        <Form.Item label='姓名' field='name' className={styles.formItem}>
          <Input placeholder='请输入姓名' className={styles.formItemInput} />
        </Form.Item>
        <Form.Item label='年龄' field='age' className={styles.formItem}>
          <Input placeholder='请输入年龄' className={styles.formItemInput} />
        </Form.Item>
        <Form.Item label='性别' field='sex' className={styles.formItem}>
          <Select
            className={styles.formItemSelect}
            options={[
              { label: '男', value: '1' },
              { label: '女', value: '2' },
              { label: '保密', value: '3' }
            ]}
          />
        </Form.Item>
        <Button size="long" onClick={handleFormSubmit} loading={isLoading}>提交</Button>
      </Form>
    </Page>
  );
};
