import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import { InfraModule } from "../../infra/infra.module";
import { ValidateRegistrationTokenUseCase } from "../../core/application/use-cases/registration/validate-registration-token.usecase";
import { CompleteRegistrationUseCase } from "../../core/application/use-cases/registration/complete-registration.usecase";

@Module({
  imports: [InfraModule],
  controllers: [RegistrationController],
  providers: [
    RegistrationService,
    ValidateRegistrationTokenUseCase,
    CompleteRegistrationUseCase,
  ],
})
export class RegistrationModule {}

