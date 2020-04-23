import { ArrayNotEmpty } from "class-validator";
import { ApiProperty, ApiTags, ApiMovedPermanentlyResponse } from "@nestjs/swagger";


export class CreateUserDto {
  @ArrayNotEmpty()
  @ApiProperty({
    description: '用户信息数组',
    example: [{
      userName: 'string',
      nickName: 'string',
      password: 'string',
      phone: 'string',
      email: 'string',
      note: 'string',
    }]
  })
  userMessage: {
    userName: string;
    nickName: string;
    password: string;
    phone?: string;
    email?: string;
    note?: string;
  }[];

  @ArrayNotEmpty()
  @ApiProperty({
    description: '用户角色id数组',
    example: [
      1, 2, 3
    ]
  })
  userRole: number[]
} 