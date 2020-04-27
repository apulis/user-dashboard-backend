import { IsString } from "class-validator";






export class RegisterDto {

  @IsString()
  userName: string;

  @IsString()
  password: string;
}


export class LoginDto extends RegisterDto {
  
}