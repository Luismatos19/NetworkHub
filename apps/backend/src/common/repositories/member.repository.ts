import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Member, Prisma } from '@prisma/client';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { id } });
  }

  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return this.prisma.member.create({ data });
  }

  async findActiveMembers(): Promise<Member[]> {
    return this.prisma.member.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        company: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}

