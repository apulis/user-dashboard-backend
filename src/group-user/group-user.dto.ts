import { IsArray, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersToGroupDto {
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '用户id列表',
    example: [1, 2, 3]
  })
  userIds: number[];
  
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '用户组id列表',
    example: [1, 2, 3]
  })
  groupIds: number[];
}