'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  participationIntentionsAPI,
  ParticipationIntention,
} from "@/lib/api";

export function useParticipationIntentions(adminSecret: string) {
  const [intentions, setIntentions] = useState<ParticipationIntention[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  const fetchIntentions = useCallback(async () => {
    if (!adminSecret) {
      setIntentions([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await participationIntentionsAPI.list(
        adminSecret,
        filter || undefined
      );
      setIntentions(response.data || response);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao carregar intenções");
    } finally {
      setIsLoading(false);
    }
  }, [adminSecret, filter]);

  useEffect(() => {
    fetchIntentions();
  }, [fetchIntentions]);

  const approve = useCallback(
    async (id: string) => {
      if (!adminSecret) return;

      setPendingActionId(id);
      setError("");

      try {
        await participationIntentionsAPI.approve(id, adminSecret);
        await fetchIntentions();
      } catch (err: any) {
        setError(err?.message ?? "Erro ao aprovar intenção");
      } finally {
        setPendingActionId(null);
      }
    },
    [adminSecret, fetchIntentions]
  );

  const reject = useCallback(
    async (id: string) => {
      if (!adminSecret) return;

      setPendingActionId(id);
      setError("");

      try {
        await participationIntentionsAPI.reject(id, adminSecret);
        await fetchIntentions();
      } catch (err: any) {
        setError(err?.message ?? "Erro ao recusar intenção");
      } finally {
        setPendingActionId(null);
      }
    },
    [adminSecret, fetchIntentions]
  );

  const clearError = useCallback(() => setError(""), []);

  const hasIntentions = useMemo(
    () => intentions.length > 0,
    [intentions.length]
  );

  return {
    intentions,
    filter,
    setFilter,
    isLoading,
    error,
    clearError,
    pendingActionId,
    refresh: fetchIntentions,
    approve,
    reject,
    hasIntentions,
  };
}

