import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../global/redis/redis.service';
import { RoomResponseDto } from './dto/request/room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ROOM_TYPE, RoomEntity } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/request/create-room.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RoomResponse } from './dto/response/room-response.dto';
import { RoomMapper } from './room.mapper';

@Injectable()
export class RoomService {
  private logger = new Logger(RoomService.name);
  constructor(
    private readonly redisService: RedisService,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(userId: number, dto: CreateRoomDto): Promise<RoomResponse> {
    try {
      const newRoom = this.roomRepository.create({
        type: dto.type,
        title: dto.title,
        created_user_id: userId,
      });
      await this.roomRepository.save(newRoom);
      await this.redisService.createRoom(newRoom);

      const room = await RoomMapper.mapToResponse(newRoom);
      return { ...room, userCount: 1 };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException((error as Error).message);
    }
  }

  async joinRoom(userId: number, roomId: number) {
    try {
      const room = await this.redisService.getRoomById(roomId);
      if (!room || Object.keys(room).length == 0) {
        throw new BadRequestException('Invalid Room');
      }

      if (room.joinedUserId) {
        throw new BadRequestException('Full Room');
      }

      const result = await this.roomRepository.update(
        {
          id: roomId,
        },
        {
          joined_user_id: userId,
          joined_at: new Date().toISOString(),
        },
      );

      if (result.affected == 0) {
        throw new BadRequestException('Internal Server Error');
      }

      this.redisService.joinRoom(room, userId);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException((error as Error).message);
    }
  }

  async deleteRoom(roomId: number) {
    try {
      const result = await this.roomRepository.update(
        { id: roomId },
        { status: 0 },
      );
      if (result.affected == 0) {
        throw new BadRequestException('Internal Server Error');
      }

      await this.redisService.deleteRoom(roomId);
    } catch (error) {}
  }
}
