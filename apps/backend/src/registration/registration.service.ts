import { Injectable } from '@nestjs/common';
import { RegistrationInviteRepository } from '../common/repositories/registration-invite.repository';
import { UserRepository } from '../common/repositories/user.repository';
import { MemberRepository } from '../common/repositories/member.repository';
import { PasswordService } from '../common/services/password.service';
import { TokenService } from '../common/services/token.service';
import { RegisterDto } from './dto/register.dto';
import {
  InvalidTokenException,
  TokenExpiredException,
  TokenAlreadyUsedException,
  EmailMismatchException,
  UserAlreadyExistsException,
} from '../common/exceptions/domain-exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { MEMBER_STATUS, USER_ROLE } from '../common/constants/status.constants';

export interface TokenValidationResult {
  valid: boolean;
  email?: string;
  expiresAt?: Date;
  message?: string;
}

@Injectable()
export class RegistrationService {
  constructor(
    private readonly inviteRepository: RegistrationInviteRepository,
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async validateToken(token: string): Promise<TokenValidationResult> {
    const invite = await this.inviteRepository.findByToken(token);

    if (!invite) {
      return { valid: false, message: 'Token inválido' };
    }

    if (invite.usedAt) {
      return { valid: false, message: 'Token já foi utilizado' };
    }

    if (this.tokenService.isTokenExpired(invite.expiresAt)) {
      return { valid: false, message: 'Token expirado' };
    }

    return {
      valid: true,
      email: invite.email,
      expiresAt: invite.expiresAt,
    };
  }

  async register(token: string, dto: RegisterDto) {
    const validation = await this.validateToken(token);
    
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
