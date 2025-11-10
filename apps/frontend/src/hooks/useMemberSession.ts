'use client';

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useMemberSession() {
  const [memberId, setMemberId, removeMemberId] = useLocalStorage<string>(
    "member_id",
    ""
  );

  const persistMemberId = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        removeMemberId();
        return;
      }

      setMemberId(trimmed);
    },
    [removeMemberId, setMemberId]
  );

  const clearMemberId = useCallback(() => {
    removeMemberId();
  }, [removeMemberId]);

  const hasMember = useMemo(() => Boolean(memberId), [memberId]);

  return {
    memberId,
    hasMember,
    persistMemberId,
    clearMemberId,
  };
}

