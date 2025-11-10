import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./database/prisma.service";
import { ParticipationIntentionRepository } from "./database/repositories/participation-intention.repository";
import { RegistrationInviteRepository } from "./database/repositories/registration-invite.repository";
import { UserRepository } from "./database/repositories/user.repository";
import { MemberRepository } from "./database/repositories/member.repository";
import { ReferralRepository } from "./database/repositories/referral.repository";
import { AcknowledgmentRepository } from "./database/repositories/acknowledgment.repository";
import { TokenService } from "./services/token.service";
import { PasswordService } from "./services/password.service";
import { EmailService } from "./services/email.service";
import { PRISMA_OPTIONS, prismaConfig } from "../config/prisma.config";

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_OPTIONS,
      useFactory: prismaConfig,
    },
    PrismaService,
    ParticipationIntentionRepository,
    RegistrationInviteRepository,
    UserRepository,
    MemberRepository,
    ReferralRepository,
    AcknowledgmentRepository,
    TokenService,
    PasswordService,
    EmailService,
  ],
  exports: [
    PrismaService,
    ParticipationIntentionRepository,
    RegistrationInviteRepository,
    UserRepository,
    MemberRepository,
    ReferralRepository,
    AcknowledgmentRepository,
    TokenService,
    PasswordService,
    EmailService,
  ],
})
export class InfraModule {}

