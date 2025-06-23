import { ApiResponseOk, ApiResponseThrow } from '@/common/dto/api-response.dto';
import { HttpException } from '@nestjs/common';

export class ApiResponse {
  public static instance: ApiResponse;

  public static getInstance(): ApiResponse {
    if (!this.instance) {
      this.instance = new ApiResponse();
    }
    return this.instance;
  }

  public ok(message: string, data: any): ApiResponseOk {
    return {
      success: true,
      message,
      data
    };
  }

  public throw(statusCode: number, message: string, error: any = null): ApiResponseThrow {
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
