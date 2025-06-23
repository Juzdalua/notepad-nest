import { CustomApiResponseOk, CustomApiResponseThrow } from '@/common/dto/api-response.dto';
import { HttpException } from '@nestjs/common';

export class CustomApiResponse {
  public static instance: CustomApiResponse;

  public static getInstance(): CustomApiResponse {
    if (!this.instance) {
      this.instance = new CustomApiResponse();
    }
    return this.instance;
  }

  public ok(message: string, data: any): CustomApiResponseOk {
    return {
      success: true,
      message,
      data
    };
  }

  public throw(statusCode: number, message: string, error: any = null): CustomApiResponseThrow {
    throw new HttpException(
      {
        success: false,
        message,
        error
      },
      statusCode
    );
  }
}
