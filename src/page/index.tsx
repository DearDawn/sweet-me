import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.less';
import { App } from './App';
export const holder = {};

const app = document.getElementById('app')!;
const root = createRoot(app);

root.render(<App />);
