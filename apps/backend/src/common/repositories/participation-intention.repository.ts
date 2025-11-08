import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ParticipationIntention, Prisma } from '@prisma/client';

@Injectable()
export class ParticipationIntentionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ParticipationIntentionCreateInput): Promise<ParticipationIntention> {
    return this.prisma.participationIntention.create({ data });
  }

  async findById(id: string): Promise<ParticipationIntention | null> {
    return this.prisma.participationIntention.findUnique({
      where: { id },
      include: { registrationInvite: true },
    });
  }

  async findByStatus(status: string): Promise<ParticipationIntention[]> {
    return this.prisma.participationIntention.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<ParticipationIntention[]> {
    return this.prisma.participationIntention.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    reviewedAt: Date,
  ): Promise<ParticipationIntention> {
    return this.prisma.participationIntention.update({
      where: { id },
      data: { status, reviewedAt },
    });
  }
}

