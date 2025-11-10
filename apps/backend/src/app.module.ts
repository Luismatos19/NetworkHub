import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { InfraModule } from "./infra/infra.module";
import { ParticipationIntentionsModule } from "./modules/participation-intentions/participation-intentions.module";
import { RegistrationModule } from "./modules/registration/registration.module";
import { ReferralsModule } from "./modules/referrals/referrals.module";
import { envConfig } from "./config/env.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    InfraModule,
    ParticipationIntentionsModule,
    RegistrationModule,
    ReferralsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

