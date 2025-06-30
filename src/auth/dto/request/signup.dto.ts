import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'user@example.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'password123' })
  password?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'hasedCode' })
  qrcodeKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'jun' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'jj' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'KR' })
  location: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'hi' })
  description?: string;
}
