import { registerAs } from "@nestjs/config";

export const envConfig = registerAs("env", () => ({
  port: parseInt(process.env.PORT ?? "3001", 10),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  adminSecret: process.env.ADMIN_SECRET ?? "",
}));

