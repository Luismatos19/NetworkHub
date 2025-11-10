import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import {
  ValidateRegistrationTokenUseCase,
  TokenValidationResult,
} from "../../core/application/use-cases/registration/validate-registration-token.usecase";
import { CompleteRegistrationUseCase } from "../../core/application/use-cases/registration/complete-registration.usecase";

@Injectable()
export class RegistrationService {
  constructor(
    private readonly validateTokenUseCase: ValidateRegistrationTokenUseCase,
    private readonly completeRegistrationUseCase: CompleteRegistrationUseCase,
  ) {}

  async validateToken(token: string): Promise<TokenValidationResult> {
    return this.validateTokenUseCase.execute(token);
  }

  async register(token: string, dto: RegisterDto) {
    return this.completeRegistrationUseCase.execute(token, {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      company: dto.company,
      phone: dto.phone,
      bio: dto.bio,
    });
  }
}
