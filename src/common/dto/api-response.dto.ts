import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiProperty } from '@nestjs/swagger';

export class CommonResponseBase {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Success messages...' })
  message: string;
}

export class CommonResponseOk extends CommonResponseBase {
  data: any;
}

export class CommonResponseThrow extends CommonResponseBase {
  error: any;
}

export function ApiDefaultResponses() {
  return applyDecorators(
    // 400
    ApiBadRequestResponse({
      description: 'Invalid Access',
      schema: {
        example: {
          success: false,
          message: 'Invalid request.',
          error: null
        }
      }
    }),

    // 500
    ApiInternalServerErrorResponse({
      description: 'Internal Server error',
      schema: {
        example: {
          success: false,
          message: 'Internal Server Error.',
          error: null
        }
      }
    })
  );
}
