import { Injectable } from "@nestjs/common";
import { ParticipationIntentionRepository } from "../../../../infra/database/repositories/participation-intention.repository";
import { INTENTION_STATUS } from "../../../../common/constants/status.constants";

export interface CreateParticipationIntentionInput {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
}

@Injectable()
export class CreateParticipationIntentionUseCase {
  constructor(
    private readonly intentionRepository: ParticipationIntentionRepository
  ) {}

  async execute(input: CreateParticipationIntentionInput) {
    return this.intentionRepository.create({
      ...input,
      status: INTENTION_STATUS.PENDING,
    });
  }
}
