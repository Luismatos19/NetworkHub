import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { RegisterDto } from "./dto/register.dto";
import { MemberResponseDto } from "./dto/registration-response.dto";

@Controller("register")
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Get("validate/:token")
  async validateToken(@Param("token") token: string) {
    return this.registrationService.validateToken(token);
  }

  @Post(":token")
  async register(@Param("token") token: string, @Body() dto: RegisterDto) {
    const member = await this.registrationService.register(token, dto);
    return new MemberResponseDto(member);
  }
}
