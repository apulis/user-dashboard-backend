import { IsArray, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ModifyVCDto {
  @IsArray()
  @ApiProperty({
    description: 'VC 名称数组',
    required: true,
    example: ['vc1', 'vc2']
  })
  vcList: string[];

  @IsNumber()
  @ApiProperty({
    description: '用户 ID',
    required: true,
    example: 30001
  })
  userId: number;

}

export class GetVCResponse {

  success: boolean;

  vcList: string[]

}

export class AddUserForVCDTO {
  @IsArray()
  @ApiProperty({
    description: '用户ID数组',
    required: true,
    example: [30001, 30002]
  })
  userIds: number[];

  @IsString()
  @ApiProperty({
    description: 'vc name'
  })
  vcName: string;

}