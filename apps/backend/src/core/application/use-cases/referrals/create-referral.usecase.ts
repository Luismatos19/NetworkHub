import { Injectable } from "@nestjs/common";
import { ReferralRepository } from "../../../../infra/database/repositories/referral.repository";
import { MemberRepository } from "../../../../infra/database/repositories/member.repository";
import {
  MemberNotFoundException,
  SelfReferralException,
} from "../../../../common/exceptions/domain-exceptions";
import { REFERRAL_STATUS } from "../../../../common/constants/status.constants";

export interface CreateReferralInput {
  referrerId: string;
  referredId: string;
  title: string;
  description: string;
  value?: number | null;
}

@Injectable()
export class CreateReferralUseCase {
  constructor(
    private readonly referralRepository: ReferralRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async execute(input: CreateReferralInput) {
    await this.ensureMemberExists(input.referrerId);
    await this.ensureMemberExists(input.referredId);
    this.ensureNotSelfReferral(input.referrerId, input.referredId);

    return this.referralRepository.create({
      referrer: { connect: { id: input.referrerId } },
      referred: { connect: { id: input.referredId } },
      title: input.title,
      description: input.description,
      value: input.value ?? null,
      status: REFERRAL_STATUS.PENDING,
    });
  }

  private async ensureMemberExists(memberId: string) {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundException(memberId);
    }
  }

  private ensureNotSelfReferral(referrerId: string, referredId: string) {
    if (referrerId === referredId) {
      throw new SelfReferralException();
    }
  }
}
