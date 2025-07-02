import { IsNumber } from 'class-validator';

export class DeleteRoomDto {
  @IsNumber()
  roomId: number;
}
