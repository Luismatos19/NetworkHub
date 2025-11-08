"use client";

import { useState, useEffect } from "react";
import { participationIntentionsAPI, ParticipationIntention } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminIntentionsPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [intentions, setIntentions] = useState<ParticipationIntention[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("");

  const loadIntentions = async () => {
    if (!adminSecret) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await participationIntentionsAPI.list(
        adminSecret,
        filter || undefined
      );
      setIntentions(data.data || data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar intenções");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedSecret = localStorage.getItem("admin_secret");
    if (savedSecret) {
      setAdminSecret(savedSecret);
    }
  }, []);

  useEffect(() => {
    if (adminSecret) {
      loadIntentions();
    }
  }, [adminSecret, filter]);

  const handleApprove = async (id: string) => {
    if (!adminSecret) return;

    try {
      await participationIntentionsAPI.approve(id, adminSecret);
      await loadIntentions();
      alert(
        "Intenção aprovada! Link de cadastro gerado (verifique o console do backend)"
      );
    } catch (err: any) {
      alert(err.message || "Erro ao aprovar intenção");
    }
  };

  const handleReject = async (id: string) => {
    if (!adminSecret) return;

    if (!confirm("Tem certeza que deseja recusar esta intenção?")) return;

    try {
      await participationIntentionsAPI.reject(id, adminSecret);
      await loadIntentions();
    } catch (err: any) {
      alert(err.message || "Erro ao recusar intenção");
    }
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_secret", adminSecret);
    loadIntentions();
  };

  if (!adminSecret || !localStorage.getItem("admin_secret")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Área do Administrador
          </h1>
          <form onSubmit={handleSecretSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Secret
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Digite o admin secret"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Acessar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Intenções
          </h1>
          <Button
            variant="secondary"
            onClick={() => {
              localStorage.removeItem("admin_secret");
              setAdminSecret("");
            }}
          >
            Sair
          </Button>
        </div>

        <div className="mb-4 flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovadas</option>
            <option value="rejected">Recusadas</option>
          </select>
          <Button onClick={loadIntentions} isLoading={isLoading}>
            Atualizar
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {intentions.map((intention) => (
            <Card key={intention.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{intention.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        intention.status
                      )}`}
                    >
                      {intention.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{intention.email}</p>
                  {intention.phone && (
                    <p className="text-gray-600">Tel: {intention.phone}</p>
                  )}
                  {intention.company && (
                    <p className="text-gray-600">
                      Empresa: {intention.company}
                    </p>
                  )}
                  {intention.message && (
                    <p className="text-gray-700 mt-2">{intention.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Enviado em:{" "}
                    {new Date(intention.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                {intention.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(intention.id)}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(intention.id)}
                    >
                      Recusar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {intentions.length === 0 && !isLoading && (
            <Card>
              <p className="text-center text-gray-500">
                Nenhuma intenção encontrada
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
