'use client';

import Button from "@/components/ui/Button";

type IntentionsFilterBarProps = {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
};

export default function IntentionsFilterBar({
  value,
  onChange,
  onRefresh,
  isLoading,
}: IntentionsFilterBarProps) {
  return (
    <div className="mb-4 flex gap-2">
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todas</option>
        <option value="pending">Pendentes</option>
        <option value="approved">Aprovadas</option>
        <option value="rejected">Recusadas</option>
      </select>

      <Button onClick={onRefresh} isLoading={isLoading}>
        Atualizar
      </Button>
    </div>
  );
}

