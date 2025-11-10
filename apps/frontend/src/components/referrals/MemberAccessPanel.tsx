"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/common/ErrorAlert";
import { Member } from "@/lib/api";

type MemberWithUser = Member & {
  user?: {
    email?: string;
  };
};

type MemberAccessPanelProps = {
  members: MemberWithUser[];
  isLoadingMembers?: boolean;
  isSearching?: boolean;
  error?: string;
  onDismissError?: () => void;
  onSelectMember: (memberId: string) => void;
  onSearchByEmail: (email: string) => Promise<MemberWithUser | void>;
};

export default function MemberAccessPanel({
  members,
  isLoadingMembers,
  isSearching,
  error,
  onDismissError,
  onSelectMember,
  onSearchByEmail,
}: MemberAccessPanelProps) {
  const [searchEmail, setSearchEmail] = useState("");
  const [manualMemberId, setManualMemberId] = useState("");

  const handleSearch = async () => {
    if (!searchEmail) return;
    try {
      const member = await onSearchByEmail(searchEmail);
      if (member?.id) {
        onSelectMember(member.id);
      }
    } catch {}
  };

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!manualMemberId) return;
    onSelectMember(manualMemberId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Sistema de Indicações
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Buscar por Email
            </h2>
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchEmail}
                onChange={(event) => setSearchEmail(event.target.value)}
                placeholder="Digite seu email cadastrado"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleSearch}
                isLoading={isSearching}
              >
                Buscar
              </Button>
            </div>
          </section>

          <Divider />

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Selecionar um Membro
            </h2>
            {isLoadingMembers ? (
              <p className="text-gray-500 text-sm">Carregando membros...</p>
            ) : members.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => onSelectMember(member.id)}
                    className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {member.name}
                    </div>
                    {member.company && (
                      <div className="text-sm text-gray-600">
                        {member.company}
                      </div>
                    )}
                    {member?.user?.email && (
                      <div className="text-xs text-gray-500 mt-1">
                        {member.user.email}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      ID: {member.id}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Nenhum membro cadastrado ainda. Faça o registro primeiro.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Ou digite o Member ID manualmente
            </h2>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualMemberId}
                onChange={(event) => setManualMemberId(event.target.value)}
                placeholder="Digite o Member ID"
                required
              />
              <Button type="submit">Acessar</Button>
            </form>
          </section>

          <ErrorAlert message={error} onClose={onDismissError} />
        </div>
      </Card>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">ou</span>
      </div>
    </div>
  );
}
