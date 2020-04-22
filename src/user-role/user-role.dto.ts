import { IsArray, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToUserDto {
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '用户名数组',
    required: true
  })
  userNames: string[];

  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '角色名称数组',
    required: true
  })
  roleNames: string[];
}