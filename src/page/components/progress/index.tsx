import React from 'react';
import * as styles from './index.module.less';
import HTML from "../../../../README.md";
import 'github-markdown-css/github-markdown-light.css';
import clsx from 'clsx';

interface IProps { }

export const Progress = (props: IProps) => {
  return (
    <div className={clsx(styles.progress, 'markdown-body')} dangerouslySetInnerHTML={{ __html: HTML }} />
  );
};