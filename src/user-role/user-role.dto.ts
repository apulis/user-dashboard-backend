import { MaxLength, IsArray, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToUserDto {
  @Min(1)
  @IsArray()
  @ApiProperty({
    description: '用户名数组',
    required: true
  })
  userNames: string[];
  
  @Min(1)
  @IsArray()
  @ApiProperty({
    description: '角色名称数组',
    required: true
  })
  roleNames: string[];
}