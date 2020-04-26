import { IsArray, ArrayNotEmpty, IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToUserDto {
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '用户id数组',
    required: true,
    example: [1, 2, 3]
  })
  userIds: number[];

  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '角色id数组',
    required: true,
    example: [1, 2, 3]
  })
  roleIds: number[];
}


export class EditUserRolesDto {
  
  @IsNumber()
  @ApiProperty({
    description: '用户id数组',
    example: [1, 2, 3]
  })
  userId: number;

  @IsArray()
  @ApiProperty({
    description: '角色id数组',
    example: [1, 2, 3]
  })
  roleIds: number[]

}


export class RemoveUserRoleDto {
  @IsString()
  roleId: number;
}