import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type User = NonNullable<Awaited<ReturnType<PrismaService['user']['findUnique']>>>;
type UserCreateInput = {
  email: string;
  passwordHash: string;
  role?: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }
}

