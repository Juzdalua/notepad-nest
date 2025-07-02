import { ROOM_TYPE } from '@/room/entities/room.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomResponse {
  @IsNumber()
  id: number;

  @IsEnum(ROOM_TYPE)
  type: ROOM_TYPE;

  @IsString()
  title: string;

  @IsNumber()
  createdUserId: number;

  @IsNumber()
  @IsOptional()
  joinedUserId?: number;

  @IsString()
  @IsOptional()
  joinedAt?: string;

  @IsNumber()
  status: number;

  @IsString()
  createdAt: string;

  @IsNumber()
  @IsOptional()
  userCount?: number;
}
