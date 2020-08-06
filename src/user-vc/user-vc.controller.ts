import { Controller, Get, Post, Patch, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserVcService } from './user-vc.service';
import { vcListDto } from './user-vc.dto';
import { ApiProperty, ApiDefaultResponse, ApiTags } from '@nestjs/swagger';


@Controller('user-vc')
@ApiTags('用户和 VC 相关')
export class UserVcController {
  constructor(
    private readonly userVcService: UserVcService
  ) {

  }

  @Get()
  @ApiProperty({
    description: '获取用户的 VC',
  })
  getUserVcList() {
    
  }

  @Patch()
  @ApiProperty({
    description: '修改用户可以使用的 VC'
  })
  modifyUserVc(@Body() vcList: vcListDto, @Req() req: Request) {
    console.log('vcList', vcList)
  }




}
