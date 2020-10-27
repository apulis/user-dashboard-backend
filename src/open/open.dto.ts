import { IsString } from "class-validator";

export class OpenCreateUserDto {
  @IsString()
  openId: string;

  @IsString()
  userName: string
}