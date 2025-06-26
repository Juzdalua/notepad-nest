import { IsDate, IsNumber, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  roomId: string;

  @IsNumber()
  userId: number;

  @IsString()
  message: string;

  @IsDate()
  createdAt: Date;
}
