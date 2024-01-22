import { name } from './package.json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import eslint from '@rollup/plugin-eslint';

export const file = (type) => `dist/index.${type}.js`;

export default {
  input: 'src/index.tsx', // 入口文件路径
  output: [
    {
      name,
      file: file("umd"),
      format: "umd",
      globals: {
        react: "React",
        "react/jsx-runtime": "jsxRuntime"
      },
    },
    {
      file: file("esm"),
      format: "es",
      globals: {
        react: "React",
        "react/jsx-runtime": "jsxRuntime"
      },
    },
  ],
  external: ['react', 'react-is', 'react-router', 'react/jsx-runtime'],
  plugins: [
    postcss({
      extract: false, // 独立导出css文件 ，使用组件时需要单独引入
      namedExports: true,
      minimize: true,
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json', // TypeScript 配置文件路径
    }),
    eslint({
      // ESLint 插件的配置选项
      include: ['src/**/*.ts', 'src/**/*.tsx'], // 指定需要检查的文件或文件夹
      exclude: ['node_modules/**'], // 排除的文件或文件夹
      throwOnError: true, // 检查出错时抛出错误
      throwOnWarning: true, // 检查出警告时抛出错误
      fix: true, // 自动修复错误
    }),
    babel({
      exclude: 'node_modules/**', // 忽略 node_modules 下的文件
    }),
  ],
};