import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';
import { UserRole } from '@/auth/domain/user.domain';
import { CommonResponse } from '@/util/api.response';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.userId;

    if (!userId) throw new ForbiddenException('Require Login.');

    const user = await this.authService.findById(userId);
    if (!user || user.role != UserRole.ADMIN) {
      throw new ForbiddenException('Invalid Roles.');
    }

    return true;
  }
}
