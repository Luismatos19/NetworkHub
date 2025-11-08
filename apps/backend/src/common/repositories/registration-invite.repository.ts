import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationInvite, Prisma } from '@prisma/client';

@Injectable()
export class RegistrationInviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<RegistrationInvite | null> {
    return this.prisma.registrationInvite.findUnique({
      where: { token },
      include: { intention: true },
    });
  }

  async create(data: Prisma.RegistrationInviteCreateInput): Promise<RegistrationInvite> {
    return this.prisma.registrationInvite.create({ data });
  }

  async markAsUsed(token: string, usedAt: Date): Promise<RegistrationInvite> {
    return this.prisma.registrationInvite.update({
      where: { token },
      data: { usedAt },
    });
  }
}

