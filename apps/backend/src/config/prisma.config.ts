import { Prisma } from "@prisma/client";

export const PRISMA_OPTIONS = Symbol("PRISMA_OPTIONS");

export const prismaConfig = (): Prisma.PrismaClientOptions => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return {
    log: isDevelopment ? ["query", "error", "warn"] : ["error"],
  };
};

