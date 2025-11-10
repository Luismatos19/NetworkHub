"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { referralsAPI, BusinessReferral } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ReferralsPage() {
  const [memberId, setMemberId] = useState("");
  const [referrals, setReferrals] = useState<BusinessReferral[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<{ type?: string; status?: string }>({});

  useEffect(() => {
    const savedMemberId = localStorage.getItem("member_id");
    if (savedMemberId) {
      setMemberId(savedMemberId);
    }
  }, []);

  useEffect(() => {
    if (memberId) {
      loadReferrals();
    }
  }, [memberId, filter]);

  const loadReferrals = async () => {
    if (!memberId) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await referralsAPI.list(
        memberId,
        filter.type,
        filter.status
      );
      setReferrals(data.data || data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar indicações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!memberId) return;

    try {
      await referralsAPI.updateStatus(memberId, id, newStatus);
      await loadReferrals();
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadAvailableMembers();
  }, []);

  const loadAvailableMembers = async () => {
    try {
      const members = await referralsAPI.getAllMembers();
      setAvailableMembers(members || []);
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    setIsSearching(true);
    try {
      const member = await referralsAPI.getMemberByEmail(searchEmail);
      setMemberId(member.id);
      localStorage.setItem("member_id", member.id);
      loadReferrals();
    } catch (err: any) {
      setError(err.message || "Membro não encontrado com este email");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMember = (selectedMemberId: string) => {
    setMemberId(selectedMemberId);
    localStorage.setItem("member_id", selectedMemberId);
    loadReferrals();
  };

  if (!memberId || !localStorage.getItem("member_id")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Sistema de Indicações
          </h1>

          <div className="space-y-6">
            {/* Buscar por Email */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Buscar por Email
              </h2>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Digite seu email cadastrado"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearchByEmail();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSearchByEmail}
                  isLoading={isSearching}
                >
                  Buscar
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Selecionar da Lista */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Selecionar um Membro
              </h2>
              {availableMembers.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableMembers.map((member: any) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectMember(member.id)}
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
                      {member.user?.email && (
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
            </div>

            {/* Entrada Manual */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Ou digite o Member ID manualmente
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem("member_id", memberId);
                  loadReferrals();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Digite o Member ID"
                  required
                />
                <Button type="submit">Acessar</Button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Indicações</h1>
          <div className="flex gap-2">
            <Link href="/referrals/new">
              <Button>Nova Indicação</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                localStorage.removeItem("member_id");
                setMemberId("");
              }}
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filter.type || ""}
            onChange={(e) =>
              setFilter({ ...filter, type: e.target.value || undefined })
            }
          >
            <option value="">Todas</option>
            <option value="sent">Enviadas</option>
            <option value="received">Recebidas</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filter.status || ""}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value || undefined })
            }
          >
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="closed">Fechado</option>
            <option value="lost">Perdido</option>
          </select>
          <Button onClick={loadReferrals} isLoading={isLoading}>
            Atualizar
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {referrals.map((referral) => (
            <Card key={referral.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{referral.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        referral.status
                      )}`}
                    >
                      {referral.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{referral.description}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>De:</strong> {referral.referrer.name}
                    </p>
                    <p>
                      <strong>Para:</strong> {referral.referred.name}
                    </p>
                    {referral.value && (
                      <p>
                        <strong>Valor:</strong> R${" "}
                        {referral.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    )}
                    <p className="text-gray-500">
                      Criado em:{" "}
                      {new Date(referral.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                {referral.referred.id === memberId &&
                  referral.status !== "closed" && (
                    <div className="ml-4 flex flex-col gap-2">
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={referral.status}
                        onChange={(e) =>
                          handleStatusChange(referral.id, e.target.value)
                        }
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Progresso</option>
                        <option value="closed">Fechado</option>
                        <option value="lost">Perdido</option>
                      </select>
                      <Link href={`/referrals/${referral.id}/acknowledgment`}>
                        <Button variant="secondary" className="w-full text-sm">
                          Agradecer
                        </Button>
                      </Link>
                    </div>
                  )}
              </div>
            </Card>
          ))}

          {referrals.length === 0 && !isLoading && (
            <Card>
              <p className="text-center text-gray-500">
                Nenhuma indicação encontrada
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
