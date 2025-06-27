import { JWTRequest } from '@/global/jwt/jwt.interceptor';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomJwtService } from '@/global/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: CustomJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<JWTRequest>();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    try {
      const decoded = this.jwtService.verifyToken(token);
      request.userId = decoded.userId;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
