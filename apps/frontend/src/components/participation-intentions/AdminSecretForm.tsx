'use client';

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/common/ErrorAlert";

type AdminSecretFormProps = {
  defaultValue?: string;
  onSubmit: (secret: string) => void;
  error?: string;
};

export default function AdminSecretForm({
  defaultValue = "",
  onSubmit,
  error,
}: AdminSecretFormProps) {
  const [secret, setSecret] = useState(defaultValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(secret);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Área do Administrador
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Secret
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Digite o admin secret"
              required
            />
          </div>

          {error && <ErrorAlert message={error} />}

          <Button type="submit" className="w-full">
            Acessar
          </Button>
        </form>
      </Card>
    </div>
  );
}

