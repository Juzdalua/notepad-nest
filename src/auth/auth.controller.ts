import { AdminGuard } from '@/global/guard/admin.guard';
import { AuthGuard } from '@/global/guard/auth.guard';
import { JWTRequest } from '@/global/jwt/jwt.interceptor';
import { CommonResponse } from '@/util/api.response';
import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ApiDefaultResponses } from '../common/dto/api-response.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { SignupDto } from './dto/request/signup.dto';
import { SignupResponse } from './dto/response/signup-response.dto';
import { UserResponse } from './dto/response/user-response.dto';
import { CustomJwtService } from '@/global/jwt/jwt.service';
import { UserRole } from './domain/user.domain';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customJwtService: CustomJwtService
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
      throw new BadRequestException('Email already exist.');
    } else {
      const signupId = await this.authService.signup(signupDto);
      if (signupId == -1) {
        throw new InternalServerErrorException('DB Error.');
      } else if (signupId == -2) {
        throw new InternalServerErrorException('Internal Server Error.');
      }

      const accessToken = this.customJwtService.sign(findUser.id, findUser.role == UserRole.ADMIN ? true : false);
      return CommonResponse.ok('Signup Success.', { accessToken });
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const findUser = await this.authService.findByEmail(loginDto.email);
    if (!findUser) {
      throw new BadRequestException('Email not exist.');
    }
    const pwdOk = await bcrypt.compare(loginDto.password, findUser.password);
    if (!pwdOk) {
      throw new BadRequestException('Password not correct.');
    }

    const accessToken = this.customJwtService.sign(findUser.id, findUser.role == UserRole.ADMIN ? true : false);
    return CommonResponse.ok('Login Success.', { accessToken });
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
      throw new BadRequestException('Invalid Access');
    }

    return CommonResponse.ok('My Info.', { id: userId, name: findUser.name, email: findUser.email, role: findUser.role, status: findUser.status, createdAt: findUser.created_at });
  }

  @Get('guard')
  @UseGuards(AuthGuard, AdminGuard)
  async testGuardAdmin(@Req() req: Request) {
    console.log(req.userId);
  }
}
