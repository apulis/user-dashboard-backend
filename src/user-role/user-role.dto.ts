import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToUserDto {
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '用户id数组',
    required: true
  })
  userIds: number[];

  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '角色id数组',
    required: true
  })
  roleIds: number[];
}


export class EditUserRolesDto {
  
  @IsNumber()
  userId: number;

  @IsArray()
  roleIds: number[]

}