import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty , Length, ArrayNotEmpty, IsArray} from 'class-validator';

export class CreateRoleDto {
  
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty()
  @Length(1, 20)
  name: string;
  
  @ApiProperty({ description: '角色功能描述' })
  @IsNotEmpty()
  @Length(1, 50)
  note: string

  @ApiProperty({ description: '权限列表' })
  @IsArray()
  permissions: string[]
  
}


export class RemoveRoleDto {
  @ApiProperty({ description: '删除角色的id', example: [1, 2, 3] })
  @ArrayNotEmpty()
  @IsArray()
  roleIds: number[]
}

export class EditPermissionDto {
  @ApiProperty({ description: '编辑新权限的 KEY', example: ['PERMISSION_1', 'PERMISSION_2'] })
  @IsArray()
  permissionKeys: string[]
}