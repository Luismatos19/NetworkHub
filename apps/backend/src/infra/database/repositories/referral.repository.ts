import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type BusinessReferral = NonNullable<
  Awaited<ReturnType<PrismaService["businessReferral"]["findUnique"]>>
>;
type BusinessReferralCreateInput = {
  title: string;
  description: string;
  value?: number | null;
  status?: string;
  referrer: { connect: { id: string } };
  referred: { connect: { id: string } };
};
type BusinessReferralWhereInput = {
  referrerId?: string;
  referredId?: string;
  status?: string;
  OR?: Array<{ referrerId: string } | { referredId: string }>;
};

export interface ReferralFilters {
  memberId: string;
  type?: "sent" | "received";
  status?: string;
}

@Injectable()
export class ReferralRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: BusinessReferralCreateInput): Promise<BusinessReferral> {
    return this.prisma.businessReferral.create({
      data,
      include: {
        referrer: { select: { id: true, name: true } },
        referred: { select: { id: true, name: true } },
      },
    });
  }

  async findById(id: string): Promise<BusinessReferral | null> {
    return this.prisma.businessReferral.findUnique({
      where: { id },
      include: {
        referrer: { select: { id: true, name: true } },
        referred: { select: { id: true, name: true } },
        acknowledgments: {
          include: {
            fromMember: { select: { id: true, name: true } },
            toMember: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findByFilters(filters: ReferralFilters): Promise<BusinessReferral[]> {
    const where: BusinessReferralWhereInput = {};

    if (filters.type === "sent") {
      where.referrerId = filters.memberId;
    } else if (filters.type === "received") {
      where.referredId = filters.memberId;
    } else {
      where.OR = [
        { referrerId: filters.memberId },
        { referredId: filters.memberId },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.businessReferral.findMany({
      where,
      include: {
        referrer: { select: { id: true, name: true } },
        referred: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    updatedAt?: Date
  ): Promise<BusinessReferral> {
    return this.prisma.businessReferral.update({
      where: { id },
      data: {
        status,
        ...(updatedAt && { updatedAt }),
      },
      include: {
        referrer: { select: { id: true, name: true } },
        referred: { select: { id: true, name: true } },
      },
    });
  }
}
