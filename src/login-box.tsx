import * as React from 'react';
import toast from './toast';
import TabBar from './tab-bar';
import { useState, useEffect } from 'react';

export enum EMode {
  register,
  login,
}

const EModeText = {
  register: '注册',
  login: '登录',
};

const API = {
  register: 'http://localhost:3000/register',
  login: 'http://localhost:3000/login',
};

const LoginBox = ():JSX.Element => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorTip, setErrorTip] = useState('');
  const [mode, setMode] = useState(EMode.login);
  const [modeText, setModeText] = useState(EModeText.login);

  useEffect(() => {
    if (mode === EMode.login) {
      setModeText(EModeText.login);
      return;
    }
    if (mode === EMode.register) {
      setModeText(EModeText.register);
    }
  }, [mode]);

  const onSubmitClick = () => {
    if (account === '' || password === '') {
      setError(true);
      setErrorTip('不能为空');
      return;
    }

    if (mode === EMode.register) {
      window
        .fetch(API.register, {
          method: 'post',
          body: JSON.stringify({
            account,
            password,
          }),
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 0) {
            toast('注册成功！');
          } else {
            toast('注册失败');
          }
        });
      return;
    }
    if (mode === EMode.login) {
      window
        .fetch(API.login, {
          method: 'post',
          credentials: 'include',
          body: JSON.stringify({
            account,
            password,
          }),
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 0) {
            toast('登录成功！');
            window.location.href="./qia-home"
          } else {
            toast('登录失败');
          }
        });
      return;
    }
  };

  useEffect(() => {
    if (account !== '' && password !== '') {
      setError(false);
    }
  }, [account, password]);

  return (
    <div className='login-box absolute-center'>
      <TabBar
        tablist={['登录', '注册']}
        activeTab={0}
        onTabChange={(index) => {
          if (index === 0) {
            setMode(EMode.login);
          } else if (index === 1) {
            setMode(EMode.register);
            setAccount('');
            setPassword('');
          }
        }}
      />
      <div className='account'>
        账号：
        <input
          type='text'
          value={account}
          placeholder='输入账号'
          onChange={(e) => setAccount(e.currentTarget.value.trim())}
        />
      </div>
      <div className='password'>
        密码：
        <input
          type='text'
          value={password}
          placeholder='输入密码'
          onChange={(e) => setPassword(e.currentTarget.value.trim())}
        />
      </div>
      <div className='submit' onClick={onSubmitClick}>
        {modeText}
      </div>
      {error && <div className='error'>{errorTip}</div>}
      <style jsx>{`
        .login-box {
          width: 300px;
          min-height: 200px;
          height:fit-content;
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          padding: 20px;
        }
        .absolute-center {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
        }
        .account,
        .submit,
        .password {
          display: flex;
          height: 30px;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
        .account{
          margin-top:30px;
        }
        .password {
          margin-top: 20px;
        }
        input {
          flex: 1;
          height: 100%;
          font-size: inherit;
          padding: 0 10px;
        }
        .error {
          color: red;
          margin-top: 20px;
        }
        .submit {
          margin-top: 40px;
          height: 40px;
          color: #fff;
          background-color: #999;
        }
        .submit:hover {
          color: #ddd;
          background-color: #666;
        }
        .submit:active {
          color: #bbb;
          background-color: #333;
        }
      `}</style>
    </div>
  );
};

export default LoginBox;
