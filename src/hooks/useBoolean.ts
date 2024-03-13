import { useRef, useState } from "react";

/** useBoolean */
export const useBoolean = (initFlag = false): [
  bool: boolean,
  setTrue: VoidFunction,
  setFalse: VoidFunction,
  toggleBool: VoidFunction
] => {
  const [flag, setFlag] = useState(initFlag);

  const setTrue = useRef(() => setFlag(true));
  const setFalse = useRef(() => setFlag(false));
  const setToggle = useRef(() => setFlag(_flag => !_flag));

  return [flag, setTrue.current, setFalse.current, setToggle.current];
};