import { UserRole } from '@/user/entities/user.entity';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class UserResponse {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  description: string;

  @IsString()
  imgUrl: string;

  @IsString()
  location: string;

  @IsString()
  status: boolean;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
