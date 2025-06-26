import { AuthGuard } from '@/auth/auth.guard';
import { JWTRequest } from '@/global/jwt/jwt.interceptor';
import { CommonResponse } from '@/util/api.response';
import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as multer from 'multer';
import { extname } from 'path';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@Req() req: JWTRequest) {
    const { userId } = req;
    const findUser = await this.userService.findById(userId);
    return CommonResponse.ok('My Info.', findUser);
  }

  @Post('/me')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req: JWTRequest, file, cb) => {
          if (!req.userId) {
            return cb(new Error('User ID is undefined'), null);
          }
          const endpoint = `./public/uploads/${req.userId}`;
          if (!fs.existsSync(endpoint)) {
            fs.mkdirSync(endpoint, { recursive: true });
          }

          cb(null, endpoint);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
      }
    })
  )
  async updateMe(@Req() req: JWTRequest, @Body() updateUserDto: UpdateUserDto, @UploadedFile() image?: Express.Multer.File) {
    const { userId } = req;
    const parsedBody = plainToInstance(UpdateUserDto, updateUserDto ?? {}, {
      enableImplicitConversion: true
    });
    const validError = await validate(parsedBody);
    if (validError.length > 0) throw new BadRequestException(validError);

    if (!updateUserDto.name && !updateUserDto.description && !image) {
      throw new BadRequestException('Require info');
    }

    let imagePath = '';
    if (image) {
      imagePath = `/uploads/${userId}/${image.filename}`;
    }

    await this.userService.updateUser(userId, updateUserDto, imagePath);

    return CommonResponse.ok('My Info.', {});
  }
}
