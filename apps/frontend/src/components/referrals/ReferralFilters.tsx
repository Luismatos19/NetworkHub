'use client';

import Button from "@/components/ui/Button";
import { ReferralFilter } from "@/hooks/useReferrals";

type ReferralFiltersProps = {
  filter: ReferralFilter;
  onFilterChange: (key: keyof ReferralFilter, value?: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
};

export default function ReferralFilters({
  filter,
  onFilterChange,
  onRefresh,
  isLoading,
}: ReferralFiltersProps) {
  return (
    <div className="mb-4 flex gap-2 flex-wrap sm:flex-nowrap">
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg"
        value={filter.type || ""}
        onChange={(event) =>
          onFilterChange("type", event.target.value || undefined)
        }
      >
        <option value="">Todas</option>
        <option value="sent">Enviadas</option>
        <option value="received">Recebidas</option>
      </select>

      <select
        className="px-4 py-2 border border-gray-300 rounded-lg"
        value={filter.status || ""}
        onChange={(event) =>
          onFilterChange("status", event.target.value || undefined)
        }
      >
        <option value="">Todos os Status</option>
        <option value="pending">Pendente</option>
        <option value="in_progress">Em Progresso</option>
        <option value="closed">Fechado</option>
        <option value="lost">Perdido</option>
      </select>

      <Button onClick={onRefresh} isLoading={isLoading}>
        Atualizar
      </Button>
    </div>
  );
}

