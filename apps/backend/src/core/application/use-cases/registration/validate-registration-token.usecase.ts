import { Injectable } from "@nestjs/common";
import { RegistrationInviteRepository } from "../../../../infra/database/repositories/registration-invite.repository";
import { TokenService } from "../../../../infra/services/token.service";

export interface TokenValidationResult {
  valid: boolean;
  email?: string;
  expiresAt?: Date;
  message?: string;
}

@Injectable()
export class ValidateRegistrationTokenUseCase {
  constructor(
    private readonly inviteRepository: RegistrationInviteRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(token: string): Promise<TokenValidationResult> {
    const invite = await this.inviteRepository.findByToken(token);

    if (!invite) {
      return { valid: false, message: "Token inválido" };
    }

    if (invite.usedAt) {
      return { valid: false, message: "Token já foi utilizado" };
    }

    if (this.tokenService.isTokenExpired(invite.expiresAt)) {
      return { valid: false, message: "Token expirado" };
    }

    return {
      valid: true,
      email: invite.email,
      expiresAt: invite.expiresAt,
    };
  }
}

