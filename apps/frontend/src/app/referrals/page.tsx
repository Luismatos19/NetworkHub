"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorAlert from "@/components/common/ErrorAlert";
import MemberAccessPanel from "@/components/referrals/MemberAccessPanel";
import ReferralFilters from "@/components/referrals/ReferralFilters";
import ReferralCard from "@/components/referrals/ReferralCard";
import { useMemberSession } from "@/hooks/useMemberSession";
import { useReferrals } from "@/hooks/useReferrals";
import { useMemberDirectory } from "@/hooks/useMemberDirectory";

export default function ReferralsPage() {
  const { memberId, hasMember, persistMemberId, clearMemberId } =
    useMemberSession();

  const {
    members,
    isLoading: isLoadingMembers,
    isSearching,
    error: memberAccessError,
    clearError: clearMemberAccessError,
    searchByEmail,
  } = useMemberDirectory();

  const {
    referrals,
    filter,
    updateFilter,
    refresh,
    updateStatus,
    pendingStatusId,
    isLoading,
    error: referralsError,
    clearError: clearReferralsError,
    hasReferrals,
  } = useReferrals(memberId);

  const handleSelectMember = (id: string) => {
    clearMemberAccessError();
    persistMemberId(id);
  };

  const handleSearchByEmail = async (email: string) => {
    const member = await searchByEmail(email);
    if (member?.id) {
      persistMemberId(member.id);
    }
    return member;
  };

  if (!hasMember) {
    return (
      <MemberAccessPanel
        members={members}
        isLoadingMembers={isLoadingMembers}
        isSearching={isSearching}
        error={memberAccessError}
        onDismissError={clearMemberAccessError}
        onSelectMember={handleSelectMember}
        onSearchByEmail={handleSearchByEmail}
      />
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
                clearReferralsError();
                clearMemberId();
              }}
            >
              Sair
            </Button>
          </div>
        </div>

        <ReferralFilters
          filter={filter}
          onFilterChange={updateFilter}
          onRefresh={refresh}
          isLoading={isLoading}
        />

        <ErrorAlert
          message={referralsError || memberAccessError}
          onClose={() => {
            clearReferralsError();
            clearMemberAccessError();
          }}
          className="mb-4"
        />

        <div className="grid gap-4">
          {referrals.map((referral) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              memberId={memberId}
              onUpdateStatus={updateStatus}
              isUpdating={pendingStatusId === referral.id}
            />
          ))}

          {!hasReferrals && !isLoading && (
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
