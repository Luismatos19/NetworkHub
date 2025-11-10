import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type Acknowledgment = NonNullable<
  Awaited<ReturnType<PrismaService["acknowledgment"]["create"]>>
>;
type AcknowledgmentCreateInput = {
  message: string;
  isPublic?: boolean;
  referral: { connect: { id: string } };
  fromMember: { connect: { id: string } };
  toMember: { connect: { id: string } };
};

@Injectable()
export class AcknowledgmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AcknowledgmentCreateInput): Promise<Acknowledgment> {
    return this.prisma.acknowledgment.create({
      data,
      include: {
        fromMember: { select: { id: true, name: true } },
        toMember: { select: { id: true, name: true } },
      },
    });
  }
}
