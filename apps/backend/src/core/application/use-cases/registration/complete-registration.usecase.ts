import { Injectable } from "@nestjs/common";
import { RegistrationInviteRepository } from "../../../../infra/database/repositories/registration-invite.repository";
import { UserRepository } from "../../../../infra/database/repositories/user.repository";
import { MemberRepository } from "../../../../infra/database/repositories/member.repository";
import { PasswordService } from "../../../../infra/services/password.service";
import {
  EmailMismatchException,
  InvalidTokenException,
  UserAlreadyExistsException,
} from "../../../../common/exceptions/domain-exceptions";
import { PrismaService } from "../../../../infra/database/prisma.service";
import {
  MEMBER_STATUS,
  USER_ROLE,
} from "../../../../common/constants/status.constants";
import { ValidateRegistrationTokenUseCase } from "./validate-registration-token.usecase";

export interface CompleteRegistrationInput {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
  bio?: string;
}

@Injectable()
export class CompleteRegistrationUseCase {
  constructor(
    private readonly inviteRepository: RegistrationInviteRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
    private readonly validateTokenUseCase: ValidateRegistrationTokenUseCase
  ) {}

  async execute(token: string, dto: CompleteRegistrationInput) {
    const validation = await this.validateTokenUseCase.execute(token);

    if (!validation.valid) {
      throw new InvalidTokenException(validation.message);
    }

    if (dto.email !== validation.email) {
      throw new EmailMismatchException();
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          role: USER_ROLE.MEMBER,
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          name: dto.name,
          company: dto.company,
          phone: dto.phone,
          bio: dto.bio,
          status: MEMBER_STATUS.ACTIVE,
        },
      });

      await this.inviteRepository.markAsUsed(token, new Date());

      return { user, member };
    });

    return result.member;
  }
}

