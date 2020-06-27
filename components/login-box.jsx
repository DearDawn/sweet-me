"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMode = void 0;
var react_1 = __importStar(require("react"));
var toast_1 = __importDefault(require("../utils/toast"));
var tab_bar_1 = __importDefault(require("./tab-bar"));
var EMode;
(function (EMode) {
    EMode[EMode["register"] = 0] = "register";
    EMode[EMode["login"] = 1] = "login";
})(EMode = exports.EMode || (exports.EMode = {}));
var EModeText = {
    register: '注册',
    login: '登录',
};
var API = {
    register: 'http://localhost:3000/register',
    login: 'http://localhost:3000/login',
};
var LoginBox = function () {
    var _a = react_1.useState(''), account = _a[0], setAccount = _a[1];
    var _b = react_1.useState(''), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(false), error = _c[0], setError = _c[1];
    var _d = react_1.useState(''), errorTip = _d[0], setErrorTip = _d[1];
    var _e = react_1.useState(EMode.login), mode = _e[0], setMode = _e[1];
    var _f = react_1.useState(EModeText.login), modeText = _f[0], setModeText = _f[1];
    react_1.useEffect(function () {
        if (mode === EMode.login) {
            setModeText(EModeText.login);
            return;
        }
        if (mode === EMode.register) {
            setModeText(EModeText.register);
        }
    }, [mode]);
    var onSubmitClick = function () {
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
                    account: account,
                    password: password,
                }),
            })
                .then(function (res) { return res.json(); })
                .then(function (res) {
                if (res.status === 0) {
                    toast_1.default('注册成功！');
                }
                else {
                    toast_1.default('注册失败');
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
                    account: account,
                    password: password,
                }),
            })
                .then(function (res) { return res.json(); })
                .then(function (res) {
                if (res.status === 0) {
                    toast_1.default('登录成功！');
                    window.location.href = "./qia-home";
                }
                else {
                    toast_1.default('登录失败');
                }
            });
            return;
        }
    };
    react_1.useEffect(function () {
        if (account !== '' && password !== '') {
            setError(false);
        }
    }, [account, password]);
    return (<div className='login-box absolute-center'>
      <tab_bar_1.default tablist={['登录', '注册']} activeTab={0} onTabChange={function (index) {
        if (index === 0) {
            setMode(EMode.login);
        }
        else if (index === 1) {
            setMode(EMode.register);
            setAccount('');
            setPassword('');
        }
    }}/>
      <div className='account'>
        账号：
        <input type='text' value={account} placeholder='输入账号' onChange={function (e) { return setAccount(e.currentTarget.value.trim()); }}/>
      </div>
      <div className='password'>
        密码：
        <input type='text' value={password} placeholder='输入密码' onChange={function (e) { return setPassword(e.currentTarget.value.trim()); }}/>
      </div>
      <div className='submit' onClick={onSubmitClick}>
        {modeText}
      </div>
      {error && <div className='error'>{errorTip}</div>}
      <style jsx>{"\n        .login-box {\n          width: 300px;\n          min-height: 200px;\n          height:fit-content;\n          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          align-items: center;\n          background-color: #fff;\n          padding: 20px;\n        }\n        .absolute-center {\n          position: absolute;\n          top: 0;\n          bottom: 0;\n          left: 0;\n          right: 0;\n          margin: auto;\n        }\n        .account,\n        .submit,\n        .password {\n          display: flex;\n          height: 30px;\n          width: 100%;\n          justify-content: center;\n          align-items: center;\n        }\n        .account{\n          margin-top:30px;\n        }\n        .password {\n          margin-top: 20px;\n        }\n        input {\n          flex: 1;\n          height: 100%;\n          font-size: inherit;\n          padding: 0 10px;\n        }\n        .error {\n          color: red;\n          margin-top: 20px;\n        }\n        .submit {\n          margin-top: 40px;\n          height: 40px;\n          color: #fff;\n          background-color: #999;\n        }\n        .submit:hover {\n          color: #ddd;\n          background-color: #666;\n        }\n        .submit:active {\n          color: #bbb;\n          background-color: #333;\n        }\n      "}</style>
    </div>);
};
exports.default = LoginBox;
