import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'securepassword123' })
  password: string;

  @IsString()
  @ApiProperty({ example: '홍길동' })
  name: string;
}
