import { Injectable } from "@nestjs/common";
import { CreateReferralDto } from "./dto/create-referral.dto";
import { UpdateReferralStatusDto } from "./dto/update-referral-status.dto";
import { CreateAcknowledgmentDto } from "./dto/create-acknowledgment.dto";
import { CreateReferralUseCase } from "../../core/application/use-cases/referrals/create-referral.usecase";
import { ListReferralsUseCase } from "../../core/application/use-cases/referrals/list-referrals.usecase";
import { GetReferralUseCase } from "../../core/application/use-cases/referrals/get-referral.usecase";
import { UpdateReferralStatusUseCase } from "../../core/application/use-cases/referrals/update-referral-status.usecase";
import { CreateAcknowledgmentUseCase } from "../../core/application/use-cases/referrals/create-acknowledgment.usecase";
import { ListMembersUseCase } from "../../core/application/use-cases/referrals/list-members.usecase";
import { FindMemberByEmailUseCase } from "../../core/application/use-cases/referrals/find-member-by-email.usecase";

@Injectable()
export class ReferralsService {
  constructor(
    private readonly createReferralUseCase: CreateReferralUseCase,
    private readonly listReferralsUseCase: ListReferralsUseCase,
    private readonly getReferralUseCase: GetReferralUseCase,
    private readonly updateReferralStatusUseCase: UpdateReferralStatusUseCase,
    private readonly createAcknowledgmentUseCase: CreateAcknowledgmentUseCase,
    private readonly listMembersUseCase: ListMembersUseCase,
    private readonly findMemberByEmailUseCase: FindMemberByEmailUseCase
  ) {}

  async create(memberId: string, dto: CreateReferralDto) {
    return this.createReferralUseCase.execute({
      referrerId: memberId,
      referredId: dto.referredId,
      title: dto.title,
      description: dto.description,
      value: dto.value,
    });
  }

  async findAll(memberId: string, type?: string, status?: string) {
    return this.listReferralsUseCase.execute({
      memberId,
      type: type as "sent" | "received" | undefined,
      status,
    });
  }

  async findOne(id: string, memberId: string) {
    return this.getReferralUseCase.execute({
      referralId: id,
      memberId,
    });
  }

  async updateStatus(
    id: string,
    memberId: string,
    dto: UpdateReferralStatusDto
  ) {
    return this.updateReferralStatusUseCase.execute({
      referralId: id,
      memberId,
      status: dto.status,
    });
  }

  async createAcknowledgment(
    referralId: string,
    fromMemberId: string,
    dto: CreateAcknowledgmentDto
  ) {
    return this.createAcknowledgmentUseCase.execute({
      referralId,
      fromMemberId,
      message: dto.message,
      isPublic: dto.isPublic,
    });
  }

  async findAllMembers() {
    return this.listMembersUseCase.execute();
  }

  async findMemberByEmail(email: string) {
    return this.findMemberByEmailUseCase.execute(email);
  }
}
