import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface JWTRequest extends Request {
  userId: number;
  name: string;
  email: string;
}

@Injectable()
export class JWTInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JWTRequest;
      request.userId = decoded.userId;
      request.name = decoded.name;
      request.email = decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return next.handle();
  }
}
