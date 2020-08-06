import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class vcListDto {
  @IsArray()
  @ApiProperty({
    description: 'VC 名称数组',
    required: true,
    example: ['vc1', 'vc2']
  })
  vcList: string[];

}