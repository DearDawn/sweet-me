import React, { useCallback, useRef, useState } from 'react';
import * as styles from './index.module.less';
import { Button, Space, dodoStorage } from '../../dist';

dodoStorage.config({ namespace: 'sweet-me', sync: true, params: { dodokey: 123 } });

export const Storage = () => {
  const [storageStr, setStorageStr] = useState('');
  const storageKey = useRef('testKey');

  const handleList = useCallback(async () => {
    const str = await dodoStorage.get();

    setStorageStr(JSON.stringify(str, undefined, 2));
  }, []);

  const handleGet = useCallback(async () => {
    const str = await dodoStorage.get(storageKey.current);

    setStorageStr(JSON.stringify({ [storageKey.current]: str }, undefined, 2));
  }, []);

  const handleSet = useCallback(() => {
    storageKey.current = `testKey_${Math.floor(Math.random() * 77)}`;

    dodoStorage.set(storageKey.current, Math.floor(Math.random() * 7777777));
  }, []);

  return (
    <div className={styles.storage}>
      <Space padding='0 10px'>Storage:</Space>
      <div className={styles.content}>{storageStr}</div>
      <Space stretch>
        <Button onClick={handleList}>列表</Button>
        <Button onClick={handleGet}>取</Button>
        <Button onClick={handleSet}>存</Button>
      </Space>
    </div>
  );
};