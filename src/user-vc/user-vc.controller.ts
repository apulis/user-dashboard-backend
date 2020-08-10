import { Controller, Get, Post, Patch, Body, Req, Res, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserVcService } from './user-vc.service';
import { ModifyVCDto } from './user-vc.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponseProperty, ApiMethodNotAllowedResponse } from '@nestjs/swagger';
import { IRequestUser } from 'src/auth/auth.controller';


@Controller('vc')
@ApiTags('用户和 VC 相关')
export class UserVcController {
  constructor(
    private readonly userVcService: UserVcService
  ) {

  }

  @Get('/user/:userId')
  @ApiOperation({
    description: '获取用户的 VC',
  })
  async getUserVcList(@Param('userId') userId: number) {
    userId = Number(userId);
    const vcNames = await this.userVcService.listVcForUser(userId);
    
  }

  @Patch()
  @ApiOperation({
    description: '修改用户 VC',
  })
  async modifyUserVc(@Body() body: ModifyVCDto, @Req() req: Request, @Res() res: Response) {
    const { vcList, userId } = body;
    await this.userVcService.modifyUserVc(userId + '', vcList);
    res.send({
      success: true,
      message: 'success',
    })
  }

  @Get('/:vcName/user/count')
  @ApiOperation({
    description: '获取 VC 下用户数量'
  })
  async getVCUserCount(@Param('vcName') vcName: string, @Res() res: Response) {
    const count = await this.userVcService.getVCUserCount(vcName);
    res.json({
      success: true,
      count,
    })
  }

 
}
