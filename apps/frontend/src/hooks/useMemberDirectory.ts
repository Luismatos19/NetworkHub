'use client';

import { useCallback, useEffect, useState } from "react";
import { referralsAPI, Member } from "@/lib/api";

type DirectoryMember = Member & {
  user?: {
    email?: string;
  };
};

export function useMemberDirectory() {
  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await referralsAPI.getAllMembers();
      setMembers(response || []);
    } catch (err) {
      console.error("Erro ao carregar membros", err);
      setError("Não foi possível carregar a lista de membros.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const searchByEmail = useCallback(async (email: string) => {
    setIsSearching(true);
    setError("");

    try {
      const member = await referralsAPI.getMemberByEmail(email);
      return member as DirectoryMember;
    } catch (err: any) {
      const message =
        err?.message ?? "Não foi possível encontrar um membro com este e-mail.";
      setError(message);
      throw err;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    members,
    isLoading,
    isSearching,
    error,
    clearError,
    reload: loadMembers,
    searchByEmail,
  };
}

