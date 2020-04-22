import { IsArray, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToGroupDto {
  @ApiProperty({description: '角色id数组', example: [1, 2, 3]})
  @IsArray()
  @ArrayNotEmpty()
  roleIds: number[];

  @ApiProperty({description: '组id数组', example: [1, 2, 3]})
  @IsArray()
  @ArrayNotEmpty()
  groupIds: number[];
}