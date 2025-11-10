import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ReferralsService } from "./referrals.service";
import { CreateReferralDto } from "./dto/create-referral.dto";
import { UpdateReferralStatusDto } from "./dto/update-referral-status.dto";
import { CreateAcknowledgmentDto } from "./dto/create-acknowledgment.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Request } from "express";

@Controller("referrals")
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get("members/by-email/:email")
  async findMemberByEmail(@Param("email") email: string) {
    return this.referralsService.findMemberByEmail(email);
  }

  @Get("members")
  async findAllMembers() {
    return this.referralsService.findAllMembers();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateReferralDto) {
    const memberId = req.memberId as string;
    return this.referralsService.create(memberId, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Req() req: Request,
    @Query("type") type?: string,
    @Query("status") status?: string
  ) {
    const memberId = req.memberId as string;
    return this.referralsService.findAll(memberId, type, status);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const memberId = req.memberId as string;
    return this.referralsService.findOne(id, memberId);
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard)
  async updateStatus(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: UpdateReferralStatusDto
  ) {
    const memberId = req.memberId as string;
    return this.referralsService.updateStatus(id, memberId, dto);
  }

  @Post(":id/acknowledgments")
  @UseGuards(AuthGuard)
  async createAcknowledgment(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: CreateAcknowledgmentDto
  ) {
    const memberId = req.memberId as string;
    return this.referralsService.createAcknowledgment(id, memberId, dto);
  }
}
