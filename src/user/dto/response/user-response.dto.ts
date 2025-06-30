import { CommonResponseBase } from '@/common/dto/api-response.dto';
import { USER_ROLE } from '@/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class UserResponseData {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ example: 'jun' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'jj' })
  nickname: string;

  @IsEnum(USER_ROLE)
  @ApiProperty({ example: USER_ROLE })
  role: USER_ROLE;

  @IsString()
  @ApiProperty({ example: 'hi' })
  description: string;

  @IsString()
  @ApiProperty({ example: 'https://naver.com' })
  imgUrl: string;

  @IsString()
  @ApiProperty({ example: 'KR' })
  location: string;

  @IsString()
  @ApiProperty({ example: true })
  status: boolean;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2011-10-05T14:48:00.000Z' })
  createdAt: Date;
}

export class UserResponse extends CommonResponseBase {
  @ApiProperty({ type: UserResponseData })
  data: UserResponseData;
}
