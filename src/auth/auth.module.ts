import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RedisModule } from '@/global/redis/redis.module';
import { CustomJwtModule } from '@/global/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CustomJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
