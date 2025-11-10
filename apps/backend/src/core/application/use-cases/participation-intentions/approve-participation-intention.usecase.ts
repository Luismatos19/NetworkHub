import { Injectable } from "@nestjs/common";
import { ParticipationIntentionRepository } from "../../../../infra/database/repositories/participation-intention.repository";
import { TokenService } from "../../../../infra/services/token.service";
import { EmailService } from "../../../../infra/services/email.service";
import {
  IntentionAlreadyReviewedException,
  IntentionNotFoundException,
} from "../../../../common/exceptions/domain-exceptions";
import { INTENTION_STATUS } from "../../../../common/constants/status.constants";
import { PrismaService } from "../../../../infra/database/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApproveParticipationIntentionUseCase {
  constructor(
    private readonly intentionRepository: ParticipationIntentionRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async execute(id: string) {
    const intention = await this.intentionRepository.findById(id);

    if (!intention) {
      throw new IntentionNotFoundException(id);
    }

    if (intention.status !== INTENTION_STATUS.PENDING) {
      throw new IntentionAlreadyReviewedException(intention.status);
    }

    const token = this.tokenService.generateToken();
    const expiresAt = this.tokenService.calculateExpirationDate();

    const [updatedIntention, invite] = await this.prisma.$transaction(
      async (tx) => {
        const updated = await tx.participationIntention.update({
          where: { id },
          data: { status: INTENTION_STATUS.APPROVED, reviewedAt: new Date() },
        });
        const created = await tx.registrationInvite.create({
          data: {
            intention: { connect: { id } },
            token,
            email: intention.email,
            expiresAt,
          },
        });

        return [updated, created] as const;
      }
    );

    await this.emailService.sendInviteEmail({
      to: intention.email,
      name: intention.name,
      token,
    });

    const frontendUrl =
      this.configService.get<string>("env.frontendUrl") ??
      "http://localhost:3000";

    return {
      intention: updatedIntention,
      invite: {
        ...invite,
        registrationUrl: `${frontendUrl}/register/${token}`,
      },
    };
  }
}
