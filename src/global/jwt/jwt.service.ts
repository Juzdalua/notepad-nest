import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}

  sign(userId: number, isAdmin: boolean, expiresIn: string = '1h'): string {
    return this.jwtService.sign({ userId, isAdmin }, { expiresIn });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
