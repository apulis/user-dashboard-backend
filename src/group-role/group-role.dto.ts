import { IsArray, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToGroupDto {
  @ApiProperty({description: '角色名称数组', example: ['role_1']})
  @IsArray()
  @ArrayNotEmpty()
  roleNames: string[];

  @ApiProperty({description: '组名称数组', example: ['group_1']})
  @IsArray()
  @ArrayNotEmpty()
  groupNames: string[];
}