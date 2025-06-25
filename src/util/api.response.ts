import { CommonResponseOk, CommonResponseThrow } from '@/common/dto/api-response.dto';
import { HttpException } from '@nestjs/common';

export class CommonResponse {
  public static ok(message: string, data: any): CommonResponseOk {
    return {
      success: true,
      message,
      data
    };
  }
}
