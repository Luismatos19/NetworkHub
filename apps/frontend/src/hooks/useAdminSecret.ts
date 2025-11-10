'use client';

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useAdminSecret() {
  const [adminSecret, setAdminSecret, removeAdminSecret] = useLocalStorage<
    string
  >("admin_secret", "");

  const persistSecret = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        removeAdminSecret();
        return;
      }

      setAdminSecret(trimmed);
    },
    [removeAdminSecret, setAdminSecret]
  );

  const clearSecret = useCallback(() => {
    removeAdminSecret();
  }, [removeAdminSecret]);

  const hasSecret = useMemo(() => Boolean(adminSecret), [adminSecret]);

  return {
    adminSecret,
    hasSecret,
    persistSecret,
    clearSecret,
  };
}

