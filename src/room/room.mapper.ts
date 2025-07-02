import { plainToInstance } from 'class-transformer';
import { RoomResponse } from './dto/response/room-response.dto';
import { ROOM_TYPE, RoomEntity } from './entities/room.entity';
import { validate } from 'class-validator';
import { BadRequestException, Logger } from '@nestjs/common';

export interface RoomEntityByRedis {
  id: number;
  type: ROOM_TYPE;
  title: string;
  created_user_id: number;
  joined_user_id?: number | null;
  joined_at?: Date | null;
  status: number;
  created_at: Date;
}

export class RoomMapper {
  private static logger = new Logger(RoomMapper.name);

  // Entity -> Dto
  public static async mapToResponse(
    room: RoomEntity,
    userCount: number = 1,
  ): Promise<RoomResponse> {
    try {
      const result = plainToInstance(RoomResponse, {
        type: room.type as ROOM_TYPE,
        id: Number(room.id),
        title: room.title,
        createdUserId: Number(room.created_user_id),
        joinedUserId: room.joined_user_id ? Number(room.joined_user_id) : null,
        joinedAt: room.joined_at ? room.joined_at.toISOString() : null,
        status: Number(room.status),
        createdAt: room.created_at.toISOString(),
      });

      const validError = await validate(result);
      if (validError.length > 0) {
        this.logger.error(validError);
        throw new BadRequestException(validError);
      }

      return { ...result, userCount };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  public static mapToEntityByRedis(room: any): RoomEntityByRedis {
    return {
      id: Number(room.id),
      type: room.type as ROOM_TYPE,
      title: room.title,
      created_user_id: Number(room.created_user_id),
      joined_user_id:
        room.joined_user_id && room.joined_user_id.trim() != ''
          ? Number(room.joined_user_id)
          : null,
      joined_at:
        room.joined_at && room.joined_user_id.trim() != ''
          ? new Date(room.joined_at)
          : null,
      status: Number(room.status),
      created_at: new Date(room.created_at),
    };
  }
}
