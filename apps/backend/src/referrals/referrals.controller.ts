import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralStatusDto } from './dto/update-referral-status.dto';
import { CreateAcknowledgmentDto } from './dto/create-acknowledgment.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('referrals')
@UseGuards(AuthGuard)
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('members')
  async findAllMembers() {
    return this.referralsService.findAllMembers();
  }

  @Post()
  async create(
    @Headers('x-member-id') memberId: string,
    @Body() dto: CreateReferralDto,
  ) {
    if (!memberId) {
      throw new BadRequestException('Member ID required');
    }
    return this.referralsService.create(memberId, dto);
  }

  @Get()
  async findAll(
    @Headers('x-member-id') memberId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    if (!memberId) {
      throw new BadRequestException('Member ID required');
    }
    return this.referralsService.findAll(memberId, type, status);
  }

  @Get(':id')
  async findOne(
    @Headers('x-member-id') memberId: string,
    @Param('id') id: string,
  ) {
    if (!memberId) {
      throw new BadRequestException('Member ID required');
    }
    return this.referralsService.findOne(id, memberId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Headers('x-member-id') memberId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReferralStatusDto,
  ) {
    if (!memberId) {
      throw new BadRequestException('Member ID required');
    }
    return this.referralsService.updateStatus(id, memberId, dto);
  }

  @Post(':id/acknowledgments')
  async createAcknowledgment(
    @Headers('x-member-id') memberId: string,
    @Param('id') id: string,
    @Body() dto: CreateAcknowledgmentDto,
  ) {
    if (!memberId) {
      throw new BadRequestException('Member ID required');
    }
    return this.referralsService.createAcknowledgment(id, memberId, dto);
  }
}

