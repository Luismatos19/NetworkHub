'use client';

import { useCallback, useState } from "react";
import { referralsAPI } from "@/lib/api";

interface AcknowledgmentPayload {
  message: string;
  isPublic: boolean;
}

export function useCreateAcknowledgment(
  memberId: string,
  referralId: string
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = useCallback(
    async (payload: AcknowledgmentPayload) => {
      if (!memberId) {
        setError("É necessário selecionar um membro antes de agradecer.");
        throw new Error("member-id-missing");
      }

      setIsSubmitting(true);
      setError("");

      try {
        await referralsAPI.createAcknowledgment(memberId, referralId, payload);
      } catch (err: any) {
        const message =
          err?.message ?? "Não foi possível criar o agradecimento.";
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [memberId, referralId]
  );

  const clearError = useCallback(() => setError(""), []);

  return {
    submit,
    isSubmitting,
    error,
    clearError,
  };
}

