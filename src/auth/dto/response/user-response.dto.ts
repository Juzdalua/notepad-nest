import { CommonResponseBase } from '@/common/dto/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/user.domain';

export class UserResponseData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'user', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: '2024-06-23T00:00:00.000Z' })
  createdAt: Date;
}

export class UserResponse extends CommonResponseBase {
  @ApiProperty({ type: UserResponseData })
  data: UserResponseData;
}
