import { Injectable } from "@nestjs/common";
import { ReferralRepository } from "../../../../infra/database/repositories/referral.repository";

export interface ListReferralsInput {
  memberId: string;
  type?: "sent" | "received";
  status?: string;
}

@Injectable()
export class ListReferralsUseCase {
  constructor(private readonly referralRepository: ReferralRepository) {}

  async execute(input: ListReferralsInput) {
    return this.referralRepository.findByFilters({
      memberId: input.memberId,
      type: input.type,
      status: input.status,
    });
  }
}

