import { Module } from "@nestjs/common";
import { ParticipationIntentionsController } from "./participation-intentions.controller";
import { ParticipationIntentionsService } from "./participation-intentions.service";
import { InfraModule } from "../../infra/infra.module";
import { CreateParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/create-participation-intention.usecase";
import { ListParticipationIntentionsUseCase } from "../../core/application/use-cases/participation-intentions/list-participation-intentions.usecase";
import { ApproveParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/approve-participation-intention.usecase";
import { RejectParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/reject-participation-intention.usecase";

@Module({
  imports: [InfraModule],
  controllers: [ParticipationIntentionsController],
  providers: [
    ParticipationIntentionsService,
    CreateParticipationIntentionUseCase,
    ListParticipationIntentionsUseCase,
    ApproveParticipationIntentionUseCase,
    RejectParticipationIntentionUseCase,
  ],
  exports: [ParticipationIntentionsService],
})
export class ParticipationIntentionsModule {}
