interface ApiResponseBase{
  success: boolean;
  message: string;
}

export interface ApiResponseOk extends ApiResponseBase{
  data: any;
}

export interface ApiResponseThrow extends ApiResponseBase{
  error: any;
}
