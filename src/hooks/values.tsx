import { useEffect, useState } from "react";

 const valuesHook = <T extends Record<string, any>>() => {
  const [values, setValuesState] = useState<T>({} as T);

  return {
    // Obtener todos los valores
    getValues: (): T => values,

    // Cambiar todos los valores
    setValues: (newValues: T) => {
      setValuesState(newValues);
    },

    // Cambiar un valor específico
    setValue: <K extends keyof T>(name: K, value: T[K]) => {
      setValuesState((prev) => ({ ...prev, [name]: value }));
    },

    // Obtener un valor específico
    getValue: <K extends keyof T>(name: K): T[K] | null => {
      return values[name] ?? null;
    },
  };
};

export default valuesHook;
