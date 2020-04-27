import { IsString, IsArray } from "class-validator";






export class RegisterDto {

  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  nickName: string;
}


export class LoginDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}