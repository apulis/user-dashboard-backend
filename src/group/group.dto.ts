import { IsString, ArrayNotEmpty, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateGroupDto {
  @IsString()
  @ApiProperty({
    description: '新建用户组名称',
    example: 'group_1'
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '用户组描述',
    example: '研发小组A'
  })
  note: string;

  @IsArray()
  @ApiProperty({
    description: '用户组的角色ID数组',
    example: [1, 2, 3]
  })
  role: number[];
}

export class EditGroupDto {
  @IsString()
  @ApiProperty({
    description: '编辑用户组名称',
    example: 'group_1'
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '用户组描述',
    example: '研发小组A'
  })
  note: string;
}

export class RemoveGroupDto {
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    description: '需要删除的组的id数组',
    example: [1, 2, 3]
  })
  groupIds: number[];

}