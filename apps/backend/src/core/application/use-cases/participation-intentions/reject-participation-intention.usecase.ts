import { Injectable } from "@nestjs/common";
import { ParticipationIntentionRepository } from "../../../../infra/database/repositories/participation-intention.repository";
import {
  IntentionAlreadyReviewedException,
  IntentionNotFoundException,
} from "../../../../common/exceptions/domain-exceptions";
import { INTENTION_STATUS } from "../../../../common/constants/status.constants";

@Injectable()
export class RejectParticipationIntentionUseCase {
  constructor(
    private readonly intentionRepository: ParticipationIntentionRepository
  ) {}

  async execute(id: string) {
    const intention = await this.intentionRepository.findById(id);

    if (!intention) {
      throw new IntentionNotFoundException(id);
    }

    if (intention.status !== INTENTION_STATUS.PENDING) {
      throw new IntentionAlreadyReviewedException(intention.status);
    }

    return this.intentionRepository.updateStatus(
      id,
      INTENTION_STATUS.REJECTED,
      new Date()
    );
  }
}
