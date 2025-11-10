import { Module } from "@nestjs/common";
import { ReferralsController } from "./referrals.controller";
import { ReferralsService } from "./referrals.service";
import { InfraModule } from "../../infra/infra.module";
import { CreateReferralUseCase } from "../../core/application/use-cases/referrals/create-referral.usecase";
import { ListReferralsUseCase } from "../../core/application/use-cases/referrals/list-referrals.usecase";
import { GetReferralUseCase } from "../../core/application/use-cases/referrals/get-referral.usecase";
import { UpdateReferralStatusUseCase } from "../../core/application/use-cases/referrals/update-referral-status.usecase";
import { CreateAcknowledgmentUseCase } from "../../core/application/use-cases/referrals/create-acknowledgment.usecase";
import { ListMembersUseCase } from "../../core/application/use-cases/referrals/list-members.usecase";
import { FindMemberByEmailUseCase } from "../../core/application/use-cases/referrals/find-member-by-email.usecase";

@Module({
  imports: [InfraModule],
  controllers: [ReferralsController],
  providers: [
    ReferralsService,
    CreateReferralUseCase,
    ListReferralsUseCase,
    GetReferralUseCase,
    UpdateReferralStatusUseCase,
    CreateAcknowledgmentUseCase,
    ListMembersUseCase,
    FindMemberByEmailUseCase,
  ],
})
export class ReferralsModule {}
