import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({example: 'test@test.com'})
  email: string;

  @IsString()
  @ApiProperty({example: 'pwd123'})
  password: string;
}
