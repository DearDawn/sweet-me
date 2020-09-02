import LoginBox from './src/login-box';
import toast from './src/toast';

// @ts-ignore
window.React2 = require('react');
// @ts-ignore
console.log('react1221212', window.React1 === window.React2);

export { LoginBox, toast };
