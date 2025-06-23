import { JWTInterceptor, JWTRequest } from '@/global/jwt/jwt.interceptor';
import { ApiResponse } from '@/util/api.response';
import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { MakeJwtToken } from './auth.util';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly redisService: RedisService
  ) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const findUser = await this.authService.findByEmail(signupDto.email);
    if (findUser) {
      return ApiResponse.getInstance().throw(400, 'Email already exist.');
    } else {
      const signupId = await this.authService.signup(signupDto);
      if (signupId == -1) {
        return ApiResponse.getInstance().throw(500, 'DB Error.');
      } else if (signupId == -2) {
        return ApiResponse.getInstance().throw(500, 'Internal Server Error.');
      }
      return ApiResponse.getInstance().ok('Signup Success.', { accessToken: MakeJwtToken(signupId, signupDto.name, signupDto.email) });
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const findUser = await this.authService.findByEmail(loginDto.email);
    if (!findUser) {
      return ApiResponse.getInstance().throw(400, 'Email not exist.');
    }
    const pwdOk = await bcrypt.compare(loginDto.password, findUser.password);
    if (!pwdOk) {
      return ApiResponse.getInstance().throw(400, 'Password not correct.');
    }

    return ApiResponse.getInstance().ok('Login Success.', { accessToken: MakeJwtToken(findUser.id, findUser.name, findUser.email) });
  }

  @UseInterceptors(JWTInterceptor)
  @Post('/me')
  async getMe(@Req() req: JWTRequest) {
    const { userId } = req;
    const findUser = await this.authService.findById(userId);
    if (!findUser) {
      return ApiResponse.getInstance().throw(400, 'Invalid Access');
    }

    return ApiResponse.getInstance().ok('My Info.', { id: userId, name: findUser.name, email: findUser.email, role: findUser.role, status: findUser.status, createdAt: findUser.created_at });
  }
}
