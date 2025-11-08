import { Module } from '@nestjs/common';
import { ParticipationIntentionsController } from './participation-intentions.controller';
import { ParticipationIntentionsService } from './participation-intentions.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ParticipationIntentionsController],
  providers: [ParticipationIntentionsService],
  exports: [ParticipationIntentionsService],
})
export class ParticipationIntentionsModule {}

