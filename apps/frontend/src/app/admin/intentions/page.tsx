"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorAlert from "@/components/common/ErrorAlert";
import AdminSecretForm from "@/components/participation-intentions/AdminSecretForm";
import IntentionsFilterBar from "@/components/participation-intentions/IntentionsFilterBar";
import IntentionCard from "@/components/participation-intentions/IntentionCard";
import { useAdminSecret } from "@/hooks/useAdminSecret";
import { useParticipationIntentions } from "@/hooks/useParticipationIntentions";

export default function AdminIntentionsPage() {
  const { adminSecret, hasSecret, persistSecret, clearSecret } =
    useAdminSecret();
  const {
    intentions,
    filter,
    setFilter,
    isLoading,
    error,
    clearError,
    refresh,
    approve,
    reject,
    pendingActionId,
    hasIntentions,
  } = useParticipationIntentions(adminSecret);

  const handleSecretSubmit = (secret: string) => {
    clearError();
    persistSecret(secret);
  };

  if (!hasSecret) {
    return (
      <AdminSecretForm
        defaultValue={adminSecret}
        onSubmit={handleSecretSubmit}
        error={error}
      />
    );
  }

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
              clearError();
              clearSecret();
            }}
          >
            Sair
          </Button>
        </div>

        <IntentionsFilterBar
          value={filter}
          onChange={setFilter}
          onRefresh={refresh}
          isLoading={isLoading}
        />

        <ErrorAlert message={error} onClose={clearError} className="mb-4" />

        <div className="grid gap-4">
          {intentions.map((intention) => (
            <IntentionCard
              key={intention.id}
              intention={intention}
              onApprove={approve}
              onReject={reject}
              isProcessing={pendingActionId === intention.id}
            />
          ))}

          {!hasIntentions && !isLoading && (
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
