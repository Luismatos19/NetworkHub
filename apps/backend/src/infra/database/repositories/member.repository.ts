import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type Member = NonNullable<
  Awaited<ReturnType<PrismaService["member"]["findUnique"]>>
>;
type MemberCreateInput = {
  name: string;
  company?: string | null;
  phone?: string | null;
  bio?: string | null;
  status?: string;
  user: { connect: { id: string } };
};

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { id } });
  }

  async create(data: MemberCreateInput): Promise<NonNullable<Member>> {
    return this.prisma.member.create({ data });
  }

  async findActiveMembers() {
    return this.prisma.member.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        company: true,
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async findByUserEmail(email: string) {
    return this.prisma.member.findFirst({
      where: {
        user: {
          email,
        },
        status: "active",
      },
      select: {
        id: true,
        name: true,
        company: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
