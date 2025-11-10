import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerValue = request.headers["x-member-id"];
    const memberId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (!memberId) {
      throw new BadRequestException("Member ID required");
    }

    request.memberId = memberId;

    return true;
  }
}
