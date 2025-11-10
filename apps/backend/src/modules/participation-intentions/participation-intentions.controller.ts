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
  UseGuards,
} from "@nestjs/common";
import { ParticipationIntentionsService } from "./participation-intentions.service";
import { CreateParticipationIntentionDto } from "./dto/create-participation-intention.dto";
import { ParticipationIntentionResponseDto } from "./dto/participation-intention-response.dto";
import { AdminGuard } from "../../common/guards/admin.guard";

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

  @UseGuards(AdminGuard)
  @Get("admin")
  async findAll(@Query("status") status?: string) {
    const intentions =
      await this.participationIntentionsService.findAll(status);
    return {
      data: intentions.map((i) => new ParticipationIntentionResponseDto(i)),
    };
  }

  @UseGuards(AdminGuard)
  @Patch("admin/:id/approve")
  async approve(@Param("id") id: string) {
    return await this.participationIntentionsService.approve(id);
  }

  @UseGuards(AdminGuard)
  @Patch("admin/:id/reject")
  async reject(@Param("id") id: string) {
    const intention = await this.participationIntentionsService.reject(id);
    return new ParticipationIntentionResponseDto(intention);
  }
}
