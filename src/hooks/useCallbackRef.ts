import { useRef } from 'react';

/** 无依赖版 useCallback */
export const useCallbackRef = (callback) => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  return callbackRef;
};
