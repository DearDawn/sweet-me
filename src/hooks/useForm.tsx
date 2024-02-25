import * as React from 'react';

interface IConfig {
  field: string
  required?: boolean
  disabled?: boolean
}

interface IState {
  required?: boolean
  value?: any
}

export const useFormState = <T,> () => {
  const [stateMap, setStateMap] = React.useState<Record<keyof T | any, IState>>({});

  const handleInput = React.useCallback((config: IConfig, value?: any) => (e?: React.ChangeEvent<HTMLInputElement>) => {
    const { field = '', required = false, disabled = false } = config;
      setStateMap((f) => ({
        ...f,
        [field]: {
          ...stateMap[field],
          required,
          value: value || e?.target?.value,
          disabled
        }
      }));
  }, [stateMap]);

  const input = React.useCallback(
    (config: IConfig) => {
      const { field = '', disabled = false } = config;
      if (!stateMap[field]) {
        setTimeout(() => {
          handleInput(config, '')();
        }, 0);
      }

      return {
        value: stateMap[field]?.value || '',
        onInput: handleInput(config),
        disabled
      };
    },
    [handleInput, stateMap]
  );

  const setFieldsValue = React.useCallback(
    (obj) => {
      const newKV = {};

      Object.entries(obj).forEach(([key, val]) => {
        newKV[key] = { ...stateMap[key], value: val };
      });

      setStateMap((map) => ({ ...map, ...newKV }));
    },
    [stateMap]
  );

  const setFieldValue = React.useCallback(
    (key, val) => {
      const newKV = {};

      newKV[key] = { ...stateMap[key], value: val };

      setStateMap((map) => ({ ...map, ...newKV }));
    },
    [stateMap]
  );

  const resetField = React.useCallback(() => {
    const newObj = {};
    Object.entries(stateMap).forEach(([key, _]) => {
      newObj[key] = { ...stateMap[key], value: '' };
    });

    setStateMap(newObj);
  }, [stateMap]);

  const validate = React.useCallback(() => {
    let pass = true;
    Object.entries(stateMap).forEach(([_, val]) => {
      if (val?.required && !val?.value?.trim()) {
        if (pass) {
          pass = !pass;
        }
      }
    });

    return pass;
  }, [stateMap]);

  const getFieldsValue = React.useCallback(() => {
    const newObj: Record<keyof T | any, T[keyof T]> = {};
    Object.entries(stateMap).forEach(([key, val]) => {
      newObj[key] = stateMap[key]?.value;
    });

    return newObj;
  }, [stateMap]);

  const form = {
    getFieldsValue,
    getFieldValue: (key = '') => stateMap[key]?.value || '',
    resetField,
    setFieldsValue,
    setFieldValue,
    input,
    validate
  };

  return { form };
};

export type FormState<T> = (ReturnType<typeof useFormState<T>>)['form']
