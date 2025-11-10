'use client';

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ParticipationIntention } from "@/lib/api";

type IntentionCardProps = {
  intention: ParticipationIntention;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing?: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function getStatusColor(status: string) {
  return STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800";
}

export default function IntentionCard({
  intention,
  onApprove,
  onReject,
  isProcessing,
}: IntentionCardProps) {
  return (
    <Card>
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
            <p className="text-gray-600">Empresa: {intention.company}</p>
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
              onClick={() => onApprove(intention.id)}
              isLoading={isProcessing}
            >
              Aprovar
            </Button>
            <Button
              variant="danger"
              onClick={() => onReject(intention.id)}
              disabled={isProcessing}
            >
              Recusar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

