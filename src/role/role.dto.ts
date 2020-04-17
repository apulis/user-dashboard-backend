import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty , Length} from 'class-validator';

export class CreateRoleDto {
  
  @ApiProperty({ description: '角色名称，不能与其他角色冲突' })
  @IsNotEmpty()
  @Length(1, 10)
  name: string;
  
  @ApiProperty({ description: '角色功能描述' })
  @IsNotEmpty()
  @Length(1, 50)
  note: string
  
}
