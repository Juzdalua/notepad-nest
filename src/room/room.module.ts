import { AuthModule } from '@/auth/auth.module';
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RedisModule } from '@/global/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity]), RedisModule, AuthModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
