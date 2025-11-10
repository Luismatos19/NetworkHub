import { Injectable } from "@nestjs/common";
import { AcknowledgmentRepository } from "../../../../infra/database/repositories/acknowledgment.repository";
import { ReferralRepository } from "../../../../infra/database/repositories/referral.repository";
import {
  ReferralNotFoundException,
  UnauthorizedActionException,
} from "../../../../common/exceptions/domain-exceptions";

export interface CreateAcknowledgmentInput {
  referralId: string;
  fromMemberId: string;
  message: string;
  isPublic?: boolean;
}

@Injectable()
export class CreateAcknowledgmentUseCase {
  constructor(
    private readonly acknowledgmentRepository: AcknowledgmentRepository,
    private readonly referralRepository: ReferralRepository
  ) {}

  async execute(input: CreateAcknowledgmentInput) {
    const referral = await this.referralRepository.findById(input.referralId);

    if (!referral) {
      throw new ReferralNotFoundException(input.referralId);
    }

    if (referral.referredId !== input.fromMemberId) {
      throw new UnauthorizedActionException(
        "criar um agradecimento para esta indicação"
      );
    }

    return this.acknowledgmentRepository.create({
      referral: { connect: { id: input.referralId } },
      fromMember: { connect: { id: input.fromMemberId } },
      toMember: { connect: { id: referral.referrerId } },
      message: input.message,
      isPublic: input.isPublic ?? true,
    });
  }
}
