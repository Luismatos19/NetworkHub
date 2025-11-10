import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type RegistrationInvite = NonNullable<
  Awaited<ReturnType<PrismaService["registrationInvite"]["findUnique"]>>
>;
type RegistrationInviteCreateInput = {
  token: string;
  email: string;
  expiresAt: Date;
  intention: { connect: { id: string } };
};

@Injectable()
export class RegistrationInviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<RegistrationInvite | null> {
    return this.prisma.registrationInvite.findUnique({
      where: { token },
      include: { intention: true },
    });
  }

  async create(
    data: RegistrationInviteCreateInput
  ): Promise<RegistrationInvite> {
    return this.prisma.registrationInvite.create({ data });
  }

  async markAsUsed(token: string, usedAt: Date): Promise<RegistrationInvite> {
    return this.prisma.registrationInvite.update({
      where: { token },
      data: { usedAt },
    });
  }
}
