import { Injectable } from "@nestjs/common";
import { ParticipationIntentionRepository } from "../../../../infra/database/repositories/participation-intention.repository";

@Injectable()
export class ListParticipationIntentionsUseCase {
  constructor(
    private readonly intentionRepository: ParticipationIntentionRepository
  ) {}

  async execute(status?: string) {
    if (status) {
      return this.intentionRepository.findByStatus(status);
    }

    return this.intentionRepository.findAll();
  }
}
