import { useRef, useState } from "react";

/** useBoolean */
export const useBoolean = (initFlag = false): [boolean, VoidFunction, VoidFunction] => {
  const [flag, setFlag] = useState(initFlag);

  const setTrue = useRef(() => setFlag(true));
  const setFalse = useRef(() => setFlag(false));

  return [flag, setTrue.current, setFalse.current];
};