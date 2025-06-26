import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SignupDto } from './dto/request/signup.dto';
import { CustomJwtService } from '../global/jwt/jwt.service';
import * as fs from 'fs';
import { extname } from 'path';
import { UserEntity, USER_ROLE } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly customJwtService: CustomJwtService,

    private readonly dataSource: DataSource,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async isAdmin(userId: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Invalid access.');
      }

      if (user.role != USER_ROLE.ADMIN) {
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async signup(dto: SignupDto, image: Express.Multer.File): Promise<string> {
    const qr = this.dataSource.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      const findUser = await qr.manager.findOne(UserEntity, {
        where: {
          name: dto.name,
          nickname: dto.nickname
        },
        select: ['id']
      });
      if (findUser) {
        throw new BadRequestException('Email already exist.');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const createUserQuery = qr.manager.create(UserEntity, {
        email: dto.email ?? undefined,
        password: dto.password ? hashedPassword : undefined,
        name: dto.name,
        nickname: dto.nickname,
        description: dto.description ?? undefined,
        location: dto.location
      });
      const createdUser = await qr.manager.save(createUserQuery);
      const createdUserId = createdUser.id;

      const endpoint = `/uploads/${createdUserId}`;
      if (!fs.existsSync(`./public${endpoint}`)) {
        fs.mkdirSync(endpoint, { recursive: true });
      }
      const ext = extname(image.originalname);
      const filename = `image-${Date.now()}${ext}`;
      const imgUrl = `${endpoint}/${filename}`;
      fs.writeFileSync(imgUrl, image.buffer);

      qr.manager.update(UserEntity, { id: createdUserId }, { img_url: imgUrl });

      const accessToken = this.customJwtService.sign(createdUserId, false);

      await qr.commitTransaction();
      return accessToken;
    } catch (error) {
      await qr.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException((error as Error).message);
    } finally {
      await qr.release();
    }
  }

  async login(email: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return this.customJwtService.sign(user.id, user.role == USER_ROLE.ADMIN ? true : false);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException((error as Error).message);
    }
  }
}
