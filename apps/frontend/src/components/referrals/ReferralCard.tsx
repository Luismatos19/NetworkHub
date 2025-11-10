'use client';

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { BusinessReferral } from "@/lib/api";

type ReferralCardProps = {
  referral: BusinessReferral;
  memberId: string;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating?: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

function getStatusColor(status: string) {
  return STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800";
}

export default function ReferralCard({
  referral,
  memberId,
  onUpdateStatus,
  isUpdating,
}: ReferralCardProps) {
  const canUpdateStatus = referral.referred.id === memberId;
  const isClosed = referral.status === "closed";

  return (
    <Card>
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
                <strong>Valor:</strong>{" "}
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(referral.value)}
              </p>
            )}
            <p className="text-gray-500">
              Criado em:{" "}
              {new Date(referral.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {canUpdateStatus && !isClosed && (
          <div className="ml-4 flex flex-col gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={referral.status}
              onChange={(event) =>
                onUpdateStatus(referral.id, event.target.value)
              }
              disabled={isUpdating}
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="closed">Fechado</option>
              <option value="lost">Perdido</option>
            </select>
            <Link href={`/referrals/${referral.id}/acknowledgment`}>
              <Button
                variant="secondary"
                className="w-full text-sm"
                disabled={isUpdating}
              >
                Agradecer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

