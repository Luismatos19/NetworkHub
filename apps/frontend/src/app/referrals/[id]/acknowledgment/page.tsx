"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorAlert from "@/components/common/ErrorAlert";
import { useMemberSession } from "@/hooks/useMemberSession";
import { useCreateAcknowledgment } from "@/hooks/useCreateAcknowledgment";

export default function AcknowledgmentPage() {
  const params = useParams();
  const router = useRouter();
  const referralId = params.id as string;

  const { memberId, hasMember } = useMemberSession();
  const { submit, isSubmitting, error, clearError } = useCreateAcknowledgment(
    memberId,
    referralId
  );

  const [formData, setFormData] = useState({
    message: "",
    isPublic: true,
  });

  useEffect(() => {
    if (!hasMember) {
      router.push("/referrals");
    }
  }, [hasMember, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await submit({
        message: formData.message,
        isPublic: formData.isPublic,
      });

      alert("Agradecimento criado com sucesso!");
      router.push("/referrals");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Criar Agradecimento (Obrigado)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem *
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
              value={formData.message}
              onChange={(event) =>
                setFormData({ ...formData, message: event.target.value })
              }
              placeholder="Ex: Muito obrigado pela indicação! O negócio foi fechado com sucesso."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={formData.isPublic}
              onChange={(event) =>
                setFormData({ ...formData, isPublic: event.target.checked })
              }
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Tornar público
            </label>
          </div>

          <ErrorAlert message={error} onClose={clearError} />

          <div className="flex gap-4">
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Criar Agradecimento
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/referrals")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
