import { IsEnum, IsOptional } from 'class-validator';
import { ROOM_TYPE } from '@/room/entities/room.entity';
import { Transform } from 'class-transformer';

export class GetRoomListQueryDto {
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(ROOM_TYPE)
  type?: ROOM_TYPE;
}
