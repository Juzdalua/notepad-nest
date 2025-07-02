import { ROOM_TYPE } from '@/room/entities/room.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsEnum(ROOM_TYPE)
  type: ROOM_TYPE;

  @IsString()
  title: string;
}
