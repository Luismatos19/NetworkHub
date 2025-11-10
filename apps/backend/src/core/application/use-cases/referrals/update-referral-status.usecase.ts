import { Injectable } from "@nestjs/common";
import { ReferralRepository } from "../../../../infra/database/repositories/referral.repository";
import { GetReferralUseCase } from "./get-referral.usecase";
import { UnauthorizedActionException } from "../../../../common/exceptions/domain-exceptions";
import { REFERRAL_STATUS } from "../../../../common/constants/status.constants";

export interface UpdateReferralStatusInput {
  referralId: string;
  memberId: string;
  status: string;
}

@Injectable()
export class UpdateReferralStatusUseCase {
  constructor(
    private readonly referralRepository: ReferralRepository,
    private readonly getReferralUseCase: GetReferralUseCase
  ) {}

  async execute(input: UpdateReferralStatusInput) {
    const referral = await this.getReferralUseCase.execute({
      referralId: input.referralId,
      memberId: input.memberId,
    });

    if (referral.referredId !== input.memberId) {
      throw new UnauthorizedActionException(
        "atualizar o status desta indicação"
      );
    }

    const updateData: { status: string; updatedAt?: Date } = {
      status: input.status,
    };

    if (input.status === REFERRAL_STATUS.CLOSED) {
      updateData.updatedAt = new Date();
    }

    return this.referralRepository.updateStatus(
      input.referralId,
      updateData.status,
      updateData.updatedAt
    );
  }
}

