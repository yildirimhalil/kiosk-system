import { IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  branchCode: string;

  @IsString()
  loginName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
