import { Controller, Get, Post, Patch, Body, Req, Res, Param, Delete, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserVcService } from './user-vc.service';
import { ModifyVCDto } from './user-vc.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponseProperty, ApiMethodNotAllowedResponse, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthzGuard } from 'src/guards/authz.guard';


@Controller('vc')
@ApiTags('用户和 VC 相关')
export class UserVcController {
  constructor(
    private readonly userVcService: UserVcService
  ) {

  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    description: '根据 userId 获取用户的 VC',
  })
  async getUserVcList(@Param('userId') userId: number) {
    userId = Number(userId);
    const vcList = await this.userVcService.listVcForUser(userId);
    return {
      success: true,
      vcList,
    }
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    description: '修改用户 VC',
  })
  async modifyUserVc(@Body() body: ModifyVCDto) {
    const { vcList, userId } = body;
    await this.userVcService.modifyUserVc(userId + '', vcList);
    return {
      success: true,
      message: 'success',
    }
  }

  @Get('/:vcName/user/count')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    description: '获取 VC 下用户数量'
  })
  async getVCUserCount(@Param('vcName') vcName: string) {
    const count = await this.userVcService.getVCUserCount(vcName);
    return {
      success: true,
      count,
    }
  }

}
