import { Injectable } from "@nestjs/common";
import { ReferralRepository } from "../../../../infra/database/repositories/referral.repository";
import {
  AccessDeniedException,
  ReferralNotFoundException,
} from "../../../../common/exceptions/domain-exceptions";

export interface GetReferralInput {
  referralId: string;
  memberId: string;
}

@Injectable()
export class GetReferralUseCase {
  constructor(private readonly referralRepository: ReferralRepository) {}

  async execute(input: GetReferralInput) {
    const referral = await this.referralRepository.findById(input.referralId);

    if (!referral) {
      throw new ReferralNotFoundException(input.referralId);
    }

    if (
      referral.referrerId !== input.memberId &&
      referral.referredId !== input.memberId
    ) {
      throw new AccessDeniedException();
    }

    return referral;
  }
}
