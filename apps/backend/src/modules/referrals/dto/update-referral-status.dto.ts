import { IsNotEmpty, IsString, IsIn } from "class-validator";

export class UpdateReferralStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(["pending", "in_progress", "closed", "lost"])
  status: string;
}
