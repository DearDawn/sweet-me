import * as React from 'react';

interface IConfig {
  field: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
}

interface IState {
  required?: boolean;
  value?: any;
  defaultValue?: any;
}

const valuePass = (value?: string | number) => {
  if (typeof value === 'string') {
    return !!value.trim();
  }

  return typeof value === 'number' && !Number.isNaN(value);
};

export const useFormState = <T,>() => {
  const [stateMap, setStateMap] = React.useState<Record<keyof T | any, IState>>(
    {}
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const defaultValueMap = React.useRef<Record<keyof T | any, any>>({});
  const stateMapRef = React.useRef<typeof stateMap>({});

  const handleInput = React.useCallback(
    (config: IConfig, value?: any, isInit?: boolean) =>
      (e?: React.ChangeEvent<HTMLInputElement>) => {
        const { field = '', required = false, disabled = false } = config;

        const inputVal = e?.target instanceof Element ? e?.target?.value : e;

        setStateMap((f) => ({
          ...f,
          [field]: {
            ...stateMapRef.current[field],
            required,
            value: value ?? inputVal,
            disabled,
          },
        }));

        if (isInit) {
          defaultValueMap.current[field] = value;
        }
      },
    []
  );

  const initField = React.useCallback(
    (config: IConfig) => {
      const { defaultValue } = config;
      handleInput(config, defaultValue, true)();
    },
    [handleInput]
  );

  const getInitProps = React.useCallback(
    (config: IConfig) => {
      const { field = '', disabled = false } = config;

      return {
        value: stateMap[field]?.value ?? '',
        onInput: handleInput(config),
        disabled,
      };
    },
    [handleInput, stateMap]
  );

  const setFieldsValue = React.useCallback((obj) => {
    const newKV = {};

    Object.entries(obj).forEach(([key, val]) => {
      newKV[key] = { ...stateMapRef.current[key], value: val };
    });

    setStateMap((map) => ({ ...map, ...newKV }));
  }, []);

  const setFieldValue = React.useCallback((key, val) => {
    const newKV = {};

    newKV[key] = { ...stateMapRef.current[key], value: val };

    setStateMap((map) => ({ ...map, ...newKV }));
  }, []);

  const resetField = React.useCallback(() => {
    const newObj = {};

    Object.entries(stateMapRef.current).forEach(([key, _]) => {
      newObj[key] = {
        ...stateMapRef.current[key],
        value: defaultValueMap.current[key] ?? undefined,
      };
    });

    setStateMap(newObj);
  }, []);

  const validate = React.useCallback(() => {
    let pass = true;
    Object.entries(stateMapRef.current).forEach(([_, val]) => {
      if (val?.required && !valuePass(val.value)) {
        if (pass) {
          pass = !pass;
        }
      }
    });

    return pass;
  }, []);

  const getFieldsValue = React.useCallback(() => {
    const newObj: Record<keyof T | any, T[keyof T]> = {};

    Object.entries(stateMapRef.current).forEach(([key, val]) => {
      newObj[key] = stateMapRef.current[key]?.value;
    });

    return newObj;
  }, []);

  const getFieldValue = React.useCallback((key: string) => {
    return stateMapRef.current[key]?.value;
  }, []);

  const dispatchSubmit = React.useCallback(() => {
    formRef.current.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
    );
  }, [formRef]);

  React.useEffect(() => {
    stateMapRef.current = stateMap;
  }, [getFieldValue, stateMap]);

  const form = React.useMemo(
    () => ({
      getFieldsValue,
      getFieldValue,
      resetField,
      setFieldsValue,
      setFieldValue,
      validate,
      initField,
      dispatchSubmit,
      formRef,
    }),
    [
      getFieldValue,
      getFieldsValue,
      initField,
      resetField,
      setFieldValue,
      setFieldsValue,
      validate,
      dispatchSubmit,
    ]
  );

  form['getInitProps'] = getInitProps;
  form['state'] = stateMap;

  return { form, stateMap };
};

export type FormInstant<T> = ReturnType<typeof useFormState<T>>['form'];
export type FormState<T> = ReturnType<typeof useFormState<T>>['stateMap'];
