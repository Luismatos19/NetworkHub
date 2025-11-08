import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminSecret = request.headers['x-admin-secret'];

    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new BadRequestException('Unauthorized');
    }

    return true;
  }
}

