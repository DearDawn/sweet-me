import { useEffect, useState } from 'react';

/** 监听页面是否可见 */
export const usePageVisible = () => {
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { pageVisible };
};