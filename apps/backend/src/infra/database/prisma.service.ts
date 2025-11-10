import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PRISMA_OPTIONS } from "../../config/prisma.config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Optional()
    @Inject(PRISMA_OPTIONS)
    options?: Prisma.PrismaClientOptions
  ) {
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
