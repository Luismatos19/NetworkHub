'use client';

import { useState, useEffect, useCallback } from "react";

type StoredValue<T> = T | ((previous: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler a chave "${key}" do localStorage`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const setValue = useCallback(
    (value: StoredValue<T>) => {
      setStoredValue((previous) => {
        const valueToStore =
          value instanceof Function ? value(previous) : value;

        if (typeof window !== "undefined") {
          try {
            if (valueToStore === undefined || valueToStore === null) {
              window.localStorage.removeItem(key);
            } else {
              window.localStorage.setItem(
                key,
                JSON.stringify(valueToStore)
              );
            }
          } catch (error) {
            console.error(`Erro ao escrever a chave "${key}" no localStorage`, error);
          }
        }

        return valueToStore;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue, remove] as const;
}

