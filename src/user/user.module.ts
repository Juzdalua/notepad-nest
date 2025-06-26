import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '@/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from '@/global/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CustomJwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
