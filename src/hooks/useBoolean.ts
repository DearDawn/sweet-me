import { useCallback, useState } from 'react';

/** useBoolean */
export const useBoolean = (
  initFlag = false
): [
  bool: boolean,
  setTrue: VoidFunction,
  setFalse: VoidFunction,
  toggleBool: (flag?: boolean) => void
] => {
  const [flag, setFlag] = useState(initFlag);

  const setTrue = useCallback(() => {
    setFlag(true);
  }, []);

  const setFalse = useCallback(() => {
    setFlag(false);
  }, []);

  const setToggle = useCallback((_flag?: boolean) => {
    setFlag((prev) => _flag ?? !prev);
  }, []);

  return [flag, setTrue, setFalse, setToggle];
};
