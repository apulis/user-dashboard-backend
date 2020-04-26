import { IsArray, ArrayNotEmpty, IsNumber, IsString } from 'class-validator'
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


export class RemoveUserRoleDto {
  @IsString()
  roleId: number;
}