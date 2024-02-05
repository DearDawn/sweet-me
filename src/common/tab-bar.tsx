import { useState, useEffect } from 'react';
import cs from 'clsx';
import { ICommonProps } from 'src';

type IProps = ICommonProps & {
  tablist: string[];
  activeTab: number;
  onTabChange?: (index: number) => void;
  style?: React.CSSProperties;
}

export const TabBar = ({
  tablist,
  activeTab,
  onTabChange = () => {},
  style = {},
}: IProps) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  return (
    <div className='tab-bar' style={style}>
      {tablist.map((item, index) => {
        return (
          <div
            className={cs({ 'tab-item': true, active: active === index })}
            key={index}
            onClick={() => {
              setActive(index);
              onTabChange(index);
            }}
          >
            {item}
          </div>
        );
      })}
      <style>{`
        .tab-bar {
          width: 100%;
          height: 50px;
          background-color: #fff;
          display: flex;
          color: #000;
          border: 1px solid #000;
          cursor: pointer;
        }
        .tab-item {
          height: 100%;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid black;
        }
        .tab-item:nth-last-child(2) {
          border: none;
        }
        .tab-item:not(.active):hover {
          background-color: #eee;
        }
        .tab-item:not(.active):active {
          background-color: #aaa;
        }
        .active {
          background-color: #000000;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
