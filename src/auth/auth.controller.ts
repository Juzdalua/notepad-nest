import { JWTInterceptor, JWTRequest } from '@/global/jwt/jwt.interceptor';
import { CustomApiResponse as CustomApiResponse } from '@/util/api.response';
import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { MakeJwtToken } from './auth.util';
import { LoginDto } from './dto/request/login.dto';
import { SignupDto } from './dto/request/signup.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupResponse } from './dto/response/signup-response.dto';
import { UserResponse } from './dto/response/user-response.dto';
import { ApiDefaultResponses } from '../common/dto/api-response.dto';
import { AuthGuard } from '@/global/guard/auth.guard';
import { Request } from 'express';
import { AdminGuard } from '@/global/guard/admin.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    // private readonly redisService: RedisService
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Signup' })
  @ApiBody({ type: SignupDto })
  @ApiOkResponse({ type: SignupResponse })
  @ApiDefaultResponses()
  async signup(@Body() signupDto: SignupDto) {
    const findUser = await this.authService.findByEmail(signupDto.email);
    if (findUser) {
      return CustomApiResponse.getInstance().throw(400, 'Email already exist.');
    } else {
      const signupId = await this.authService.signup(signupDto);
      if (signupId == -1) {
        return CustomApiResponse.getInstance().throw(500, 'DB Error.');
      } else if (signupId == -2) {
        return CustomApiResponse.getInstance().throw(500, 'Internal Server Error.');
      }
      return CustomApiResponse.getInstance().ok('Signup Success.', { accessToken: MakeJwtToken(signupId, signupDto.name, signupDto.email) });
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const findUser = await this.authService.findByEmail(loginDto.email);
    if (!findUser) {
      return CustomApiResponse.getInstance().throw(400, 'Email not exist.');
    }
    const pwdOk = await bcrypt.compare(loginDto.password, findUser.password);
    if (!pwdOk) {
      return CustomApiResponse.getInstance().throw(400, 'Password not correct.');
    }

    return CustomApiResponse.getInstance().ok('Login Success.', { accessToken: MakeJwtToken(findUser.id, findUser.name, findUser.email) });
  }

  @Post('/me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: UserResponse })
  @ApiDefaultResponses()
  async getMe(@Req() req: JWTRequest) {
    const { userId } = req;
    const findUser = await this.authService.findById(userId);
    if (!findUser) {
      return CustomApiResponse.getInstance().throw(400, 'Invalid Access');
    }

    return CustomApiResponse.getInstance().ok('My Info.', { id: userId, name: findUser.name, email: findUser.email, role: findUser.role, status: findUser.status, createdAt: findUser.created_at });
  }

  @Get('guard')
  @UseGuards(AuthGuard, AdminGuard)
  async testGuardAdmin(@Req() req: Request) {
    console.log(req.userId);
  }
}
