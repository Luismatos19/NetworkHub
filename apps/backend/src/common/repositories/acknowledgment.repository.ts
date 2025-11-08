import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Acknowledgment, Prisma } from '@prisma/client';

@Injectable()
export class AcknowledgmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AcknowledgmentCreateInput): Promise<Acknowledgment> {
    return this.prisma.acknowledgment.create({
      data,
      include: {
        fromMember: { select: { id: true, name: true } },
        toMember: { select: { id: true, name: true } },
      },
    });
  }
}

