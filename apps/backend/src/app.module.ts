import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ParticipationIntentionsModule } from './participation-intentions/participation-intentions.module';
import { RegistrationModule } from './registration/registration.module';
import { ReferralsModule } from './referrals/referrals.module';

@Module({
  imports: [
    CommonModule,
    ParticipationIntentionsModule,
    RegistrationModule,
    ReferralsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

