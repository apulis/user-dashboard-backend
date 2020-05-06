import { IsString, IsArray, IsOptional } from "class-validator";






export class RegisterDto {

  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  nickName: string;

  @IsString()
  @IsOptional()
  microsoftId?: string;

  @IsString()
  @IsOptional()
  wechatId?: string;
}


export class LoginDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}