import React from 'react';
import * as styles from './index.module.less';
import HTML from "../../../../CHANGE_LOG.md";
import 'github-markdown-css/github-markdown-light.css';
import clsx from 'clsx';

interface IProps { }

export const Changelog = (props: IProps) => {
  return (
    <div className={clsx(styles.changelog, 'markdown-body')} dangerouslySetInnerHTML={{ __html: HTML }} />
  );
};