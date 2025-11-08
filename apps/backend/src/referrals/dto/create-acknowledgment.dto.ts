import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateAcknowledgmentDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
