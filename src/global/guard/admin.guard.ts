import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.userId;

    if (!userId) throw new ForbiddenException('Require Login.');

    const user = await this.authService.isAdmin(userId);
    if (user != 1) {
      throw new ForbiddenException('Invalid Roles.');
    }

    return true;
  }
}
