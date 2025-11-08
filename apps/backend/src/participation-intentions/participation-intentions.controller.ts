import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
} from "@nestjs/common";
import { ParticipationIntentionsService } from "./participation-intentions.service";
import { CreateParticipationIntentionDto } from "./dto/create-participation-intention.dto";
import { ParticipationIntentionResponseDto } from "./dto/participation-intention-response.dto";

@Controller("participation-intentions")
export class ParticipationIntentionsController {
  constructor(
    private readonly participationIntentionsService: ParticipationIntentionsService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateParticipationIntentionDto) {
    const intention = await this.participationIntentionsService.create(dto);
    return new ParticipationIntentionResponseDto(intention);
  }

  @Get("admin")
  async findAll(
    @Headers("x-admin-secret") adminSecret: string,
    @Query("status") status?: string
  ) {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new BadRequestException("Unauthorized");
    }
    const intentions =
      await this.participationIntentionsService.findAll(status);
    return {
      data: intentions.map((i) => new ParticipationIntentionResponseDto(i)),
    };
  }

  @Patch("admin/:id/approve")
  async approve(
    @Headers("x-admin-secret") adminSecret: string,
    @Param("id") id: string
  ) {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new BadRequestException("Unauthorized");
    }
    return await this.participationIntentionsService.approve(id);
  }

  @Patch("admin/:id/reject")
  async reject(
    @Headers("x-admin-secret") adminSecret: string,
    @Param("id") id: string
  ) {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new BadRequestException("Unauthorized");
    }
    const intention = await this.participationIntentionsService.reject(id);
    return new ParticipationIntentionResponseDto(intention);
  }
}
