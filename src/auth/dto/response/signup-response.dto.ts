import { CommonResponseBase } from '@/common/dto/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignupData {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}

export class SignupResponse extends CommonResponseBase {
  @ApiProperty({ type: SignupData })
  data: SignupData;
}
