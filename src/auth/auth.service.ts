import { Injectable, Logger } from '@nestjs/common';
import { SignupDto } from './dto/request/signup.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './domain/user.domain';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(userId: number): Promise<UserEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      });

      return user ?? undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email
        }
      });

      return user ?? undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async isAdmin(userId: number): Promise<number> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return -1;
      }

      if (user.role != UserRole.ADMIN) {
        return -2;
      }
      return 1;
    } catch (error) {
      this.logger.error(error);
      return 0;
    }
  }

  async signup(signupDto: SignupDto): Promise<number> {
    try {
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const newUser = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({
          email: signupDto.email,
          name: signupDto.name,
          password: hashedPassword
        })
        .execute();

      return newUser.raw.insertId;
    } catch (error) {
      this.logger.error(error);
      return -2;
    }
  }

  // async verifyUser(userId: number, coupon: CouponEntity) {
  //   const qr = this.dataSource.createQueryRunner();
  //   await qr.connect();
  //   await qr.startTransaction();

  //   try {
  //     await qr.manager.update(
  //       CouponEntity,
  //       { code: coupon.code, source: coupon.source },
  //       {
  //         status: true
  //       }
  //     );

  //     await qr.manager.update(
  //       UserEntity,
  //       { id: userId },
  //       {
  //         status: true
  //       }
  //     );

  //     await qr.commitTransaction();
  //     return true;
  //   } catch (error) {
  //     this.logger.error(error);
  //     await qr.rollbackTransaction();
  //     return false;
  //   } finally {
  //     await qr.release();
  //   }
  // }
}
