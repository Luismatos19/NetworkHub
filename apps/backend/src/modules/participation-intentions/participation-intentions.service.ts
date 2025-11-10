import { Injectable } from "@nestjs/common";
import { CreateParticipationIntentionDto } from "./dto/create-participation-intention.dto";
import { CreateParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/create-participation-intention.usecase";
import { ListParticipationIntentionsUseCase } from "../../core/application/use-cases/participation-intentions/list-participation-intentions.usecase";
import { ApproveParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/approve-participation-intention.usecase";
import { RejectParticipationIntentionUseCase } from "../../core/application/use-cases/participation-intentions/reject-participation-intention.usecase";

@Injectable()
export class ParticipationIntentionsService {
  constructor(
    private readonly createUseCase: CreateParticipationIntentionUseCase,
    private readonly listUseCase: ListParticipationIntentionsUseCase,
    private readonly approveUseCase: ApproveParticipationIntentionUseCase,
    private readonly rejectUseCase: RejectParticipationIntentionUseCase
  ) {}

  async create(dto: CreateParticipationIntentionDto) {
    return this.createUseCase.execute({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      message: dto.message,
    });
  }

  async findAll(status?: string) {
    return this.listUseCase.execute(status);
  }

  async approve(id: string) {
    return this.approveUseCase.execute(id);
  }

  async reject(id: string) {
    return this.rejectUseCase.execute(id);
  }
}
