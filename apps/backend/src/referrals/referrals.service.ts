import { Injectable } from "@nestjs/common";
import { ReferralRepository } from "../common/repositories/referral.repository";
import { MemberRepository } from "../common/repositories/member.repository";
import { AcknowledgmentRepository } from "../common/repositories/acknowledgment.repository";
import { CreateReferralDto } from "./dto/create-referral.dto";
import { UpdateReferralStatusDto } from "./dto/update-referral-status.dto";
import { CreateAcknowledgmentDto } from "./dto/create-acknowledgment.dto";
import {
  MemberNotFoundException,
  ReferralNotFoundException,
  AccessDeniedException,
  SelfReferralException,
  UnauthorizedActionException,
} from "../common/exceptions/domain-exceptions";
import { REFERRAL_STATUS } from "../common/constants/status.constants";

@Injectable()
export class ReferralsService {
  constructor(
    private readonly referralRepository: ReferralRepository,
    private readonly memberRepository: MemberRepository,
    private readonly acknowledgmentRepository: AcknowledgmentRepository
  ) {}

  async create(referrerId: string, dto: CreateReferralDto) {
    await this.validateMemberExists(dto.referredId);
    this.validateNotSelfReferral(referrerId, dto.referredId);

    return this.referralRepository.create({
      referrer: { connect: { id: referrerId } },
      referred: { connect: { id: dto.referredId } },
      title: dto.title,
      description: dto.description,
      value: dto.value || null,
      status: REFERRAL_STATUS.PENDING,
    });
  }

  async findAll(memberId: string, type?: string, status?: string) {
    return this.referralRepository.findByFilters({
      memberId,
      type: type as "sent" | "received" | undefined,
      status,
    });
  }

  async findOne(id: string, memberId: string) {
    const referral = await this.referralRepository.findById(id);

    if (!referral) {
      throw new ReferralNotFoundException(id);
    }

    this.validateMemberAccess(
      referral.referrerId,
      referral.referredId,
      memberId
    );

    return referral;
  }

  async updateStatus(
    id: string,
    memberId: string,
    dto: UpdateReferralStatusDto
  ) {
    const referral = await this.findOne(id, memberId);

    if (referral.referredId !== memberId) {
      throw new UnauthorizedActionException(
        "atualizar o status desta indicação"
      );
    }

    const updateData: { status: string; updatedAt?: Date } = {
      status: dto.status,
    };

    if (dto.status === REFERRAL_STATUS.CLOSED) {
      updateData.updatedAt = new Date();
    }

    return this.referralRepository.updateStatus(
      id,
      updateData.status,
      updateData.updatedAt
    );
  }

  async createAcknowledgment(
    referralId: string,
    fromMemberId: string,
    dto: CreateAcknowledgmentDto
  ) {
    const referral = await this.referralRepository.findById(referralId);

    if (!referral) {
      throw new ReferralNotFoundException(referralId);
    }

    if (referral.referredId !== fromMemberId) {
      throw new UnauthorizedActionException(
        "criar um agradecimento para esta indicação"
      );
    }

    return this.acknowledgmentRepository.create({
      referral: { connect: { id: referralId } },
      fromMember: { connect: { id: fromMemberId } },
      toMember: { connect: { id: referral.referrerId } },
      message: dto.message,
      isPublic: dto.isPublic ?? true,
    });
  }

  async findAllMembers() {
    return this.memberRepository.findActiveMembers();
  }

  private async validateMemberExists(memberId: string): Promise<void> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundException(memberId);
    }
  }

  private validateNotSelfReferral(
    referrerId: string,
    referredId: string
  ): void {
    if (referrerId === referredId) {
      throw new SelfReferralException();
    }
  }

  private validateMemberAccess(
    referrerId: string,
    referredId: string,
    memberId: string
  ): void {
    if (referrerId !== memberId && referredId !== memberId) {
      throw new AccessDeniedException();
    }
  }
}
