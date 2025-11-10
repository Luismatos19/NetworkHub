"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { referralsAPI, BusinessReferral } from "@/lib/api";

export type ReferralFilter = {
  type?: "sent" | "received";
  status?: string;
};

export function useReferrals(memberId: string) {
  const [referrals, setReferrals] = useState<BusinessReferral[]>([]);
  const [filter, setFilter] = useState<ReferralFilter>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!memberId) {
      setReferrals([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await referralsAPI.list(
        memberId,
        filter.type,
        filter.status
      );
      setReferrals(response.data || response);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao carregar indicações");
    } finally {
      setIsLoading(false);
    }
  }, [filter.status, filter.type, memberId]);

  useEffect(() => {
    refresh();
  }, [memberId, refresh]);

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      if (!memberId) return;

      setPendingStatusId(id);
      setError("");

      try {
        await referralsAPI.updateStatus(memberId, id, status);
        await refresh();
      } catch (err: any) {
        setError(err?.message ?? "Erro ao atualizar status");
      } finally {
        setPendingStatusId(null);
      }
    },
    [memberId, refresh]
  );

  const updateFilter = useCallback(
    (key: keyof ReferralFilter, value?: string) => {
      setFilter((previous) => ({
        ...previous,
        [key]: value || undefined,
      }));
    },
    []
  );

  const clearError = useCallback(() => setError(""), []);

  const hasReferrals = useMemo(() => referrals.length > 0, [referrals.length]);

  return {
    referrals,
    filter,
    updateFilter,
    refresh,
    updateStatus,
    pendingStatusId,
    isLoading,
    error,
    clearError,
    hasReferrals,
  };
}
