import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParticipationIntentionRepository } from './repositories/participation-intention.repository';
import { RegistrationInviteRepository } from './repositories/registration-invite.repository';
import { UserRepository } from './repositories/user.repository';
import { MemberRepository } from './repositories/member.repository';
import { ReferralRepository } from './repositories/referral.repository';
import { AcknowledgmentRepository } from './repositories/acknowledgment.repository';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { EmailService } from './services/email.service';

@Global()
@Module({
  providers: [
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
export class CommonModule {}

