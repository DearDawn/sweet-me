import { useCallback, useState } from "react";

/** useBoolean */
export const useBoolean = (initFlag = false): [
  bool: boolean,
  setTrue: VoidFunction,
  setFalse: VoidFunction,
  toggleBool: VoidFunction
] => {
  const [flag, setFlag] = useState(initFlag);

  const setTrue = useCallback(() => {
    setFlag(true);
  }, []);

  const setFalse = useCallback(() => {
    setFlag(false);
  }, []);

  const setToggle = useCallback(() => {
    setFlag((prev) => !prev);
  }, []);

  return [flag, setTrue, setFalse, setToggle];
};