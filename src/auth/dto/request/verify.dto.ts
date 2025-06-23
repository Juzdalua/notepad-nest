import { IsString } from "class-validator";

export class VerifyDto{
  @IsString()
  code: string;

  @IsString()
  source: string;
}