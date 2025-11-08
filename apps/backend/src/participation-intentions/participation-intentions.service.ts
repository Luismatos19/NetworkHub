import { Injectable } from '@nestjs/common';
import { ParticipationIntentionRepository } from '../common/repositories/participation-intention.repository';
import { RegistrationInviteRepository } from '../common/repositories/registration-invite.repository';
import { TokenService } from '../common/services/token.service';
import { EmailService } from '../common/services/email.service';
import { CreateParticipationIntentionDto } from './dto/create-participation-intention.dto';
import {
  IntentionNotFoundException,
  IntentionAlreadyReviewedException,
} from '../common/exceptions/domain-exceptions';
import { INTENTION_STATUS } from '../common/constants/status.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParticipationIntentionsService {
  constructor(
    private readonly intentionRepository: ParticipationIntentionRepository,
    private readonly inviteRepository: RegistrationInviteRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateParticipationIntentionDto) {
    return this.intentionRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      message: dto.message,
      status: INTENTION_STATUS.PENDING,
    });
  }

  async findAll(status?: string) {
    if (status) {
      return this.intentionRepository.findByStatus(status);
    }
    return this.intentionRepository.findAll();
  }

  async findOne(id: string) {
    const intention = await this.intentionRepository.findById(id);
    if (!intention) {
      throw new IntentionNotFoundException(id);
    }
    return intention;
  }

  async approve(id: string) {
    const intention = await this.intentionRepository.findById(id);
    
    if (!intention) {
      throw new IntentionNotFoundException(id);
    }

    if (intention.status !== INTENTION_STATUS.PENDING) {
      throw new IntentionAlreadyReviewedException(intention.status);
    }

    const token = this.tokenService.generateToken();
    const expiresAt = this.tokenService.calculateExpirationDate();

    const [updatedIntention, invite] = await this.prisma.$transaction([
      this.intentionRepository.updateStatus(
        id,
        INTENTION_STATUS.APPROVED,
        new Date(),
      ),
      this.inviteRepository.create({
        intention: { connect: { id } },
        token,
        email: intention.email,
        expiresAt,
      }),
    ]);

    await this.emailService.sendInviteEmail({
      to: intention.email,
      name: intention.name,
      token,
    });

    return {
      intention: updatedIntention,
      invite: {
        ...invite,
        registrationUrl: `http://localhost:3000/register/${token}`,
      },
    };
  }

  async reject(id: string) {
    const intention = await this.intentionRepository.findById(id);
    
    if (!intention) {
      throw new IntentionNotFoundException(id);
    }

    if (intention.status !== INTENTION_STATUS.PENDING) {
      throw new IntentionAlreadyReviewedException(intention.status);
    }

    return this.intentionRepository.updateStatus(
      id,
      INTENTION_STATUS.REJECTED,
      new Date(),
    );
  }
}
