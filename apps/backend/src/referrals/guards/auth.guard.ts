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
    const memberId = request.headers["x-member-id"];

    if (!memberId) {
      throw new BadRequestException("Member ID required");
    }

    return true;
  }
}
