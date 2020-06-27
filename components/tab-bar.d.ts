import React from 'react';
interface IProps {
    tablist: string[];
    activeTab: number;
    onTabChange?: (index: number) => void;
    style?: React.CSSProperties;
}
declare const TabBar: ({ tablist, activeTab, onTabChange, style, }: IProps) => JSX.Element;
export default TabBar;
