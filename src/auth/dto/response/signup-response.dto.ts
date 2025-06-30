import { CommonResponseBase } from '@/common/dto/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseData {
  @ApiProperty({ example: 'eyJhd...' })
  accessToken!: string;
}

export class SignupResponse extends CommonResponseBase {
  @ApiProperty({ type: SignupResponseData })
  data!: SignupResponseData;
}
