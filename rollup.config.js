import { name } from './package.json'
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss'
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

    babel({
      exclude: 'node_modules/**', // 忽略 node_modules 下的文件
    }),
  ],
};