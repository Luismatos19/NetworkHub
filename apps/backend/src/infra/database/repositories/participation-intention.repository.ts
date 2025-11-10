import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type ParticipationIntention = NonNullable<
  Awaited<ReturnType<PrismaService["participationIntention"]["findUnique"]>>
>;
type ParticipationIntentionArray = Awaited<
  ReturnType<PrismaService["participationIntention"]["findMany"]>
>;
type ParticipationIntentionCreateInput = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  status?: string;
};

@Injectable()
export class ParticipationIntentionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: ParticipationIntentionCreateInput
  ): Promise<ParticipationIntention> {
    return this.prisma.participationIntention.create({ data });
  }

  async findById(id: string): Promise<ParticipationIntention | null> {
    return this.prisma.participationIntention.findUnique({
      where: { id },
      include: { registrationInvite: true },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.participationIntention.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll() {
    return this.prisma.participationIntention.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    reviewedAt: Date
  ): Promise<ParticipationIntention> {
    return this.prisma.participationIntention.update({
      where: { id },
      data: { status, reviewedAt },
    });
  }
}
