import { Controller, Get, Post, Patch, Body, Req, Res, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserVcService } from './user-vc.service';
import { ModifyVCDto, GetVCResponse, AddUserForVCDTO } from './user-vc.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponseProperty, ApiMethodNotAllowedResponse, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthzGuard } from 'src/guards/authz.guard';
import { IRequestUser } from 'src/auth/auth.controller';
import { CasbinService } from 'src/common/authz';
import { ConfigService } from 'config/config.service';
import { boolean } from '@hapi/joi';
import { userInfo } from 'os';

@Controller('vc')
@ApiTags('用户和 VC 相关')
export class UserVcController {
  constructor(
    private readonly userVcService: UserVcService,
    private readonly casbinService: CasbinService,
    private readonly config: ConfigService,
  ) {

  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    summary: '用户管理员根据 userId 分页获取 VC 详情',
  })
  async getUserVcList(@Param('userId') userId: number, @Query('pageNo') pageNo: number, @Query('pageSize') pageSize: number) {
    userId = Number(userId);
    if (typeof pageNo !== 'undefined') {
      pageNo = Number(pageNo);
    }
    if (typeof pageSize !== 'undefined') {
      pageSize = Number(pageSize);
    }
    const { list, total} = await this.userVcService.getUserVcDetail(userId, pageNo - 1, pageSize);
    return {
      success: true,
      list,
      total,
    }
  }

  @Get('/bytoken')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '获取用户自己的 VC'
  })
  async getUserByToken(@Req() req: Request) {
    const {id: userId, userName: userName} = (req.user as IRequestUser);
    const vcList = await this.userVcService.getUserVcNames(userId, userName);
    return {
      success: true,
      vcList,
    }
  }

  @Patch('')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    summary: '修改用户 VC',
  })
  async modifyUserVc(@Body() body: ModifyVCDto, @Query('confirmed') confirm: string) {
    const { vcList, userId } = body;
    const { deleted, activeJobs } = await this.userVcService.modifyUserVc(userId + '', vcList, Boolean(confirm));
    if (deleted) {
      return {
        success: true,
        message: 'success',
      }
    } else {
      return {
        success: false,
        message: 'Has active job',
        activeJobs: activeJobs,
      }
    }

  }

  @Get('/:vcName/user/count')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    summary: '获取 VC 下用户数量'
  })
  async getVCUserCount(@Param('vcName') vcName: string) {
    const count = await this.userVcService.getVCUserCount(vcName);
    return {
      success: true,
      count,
    }
  }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
  @ApiOperation({
    summary: '获取所有 vc 名称列表'
  })
  async getALLVC(@Query('pageNo') pageNo?: number, @Query('pageSize') pageSize?: number, @Query('search') search?: string) {
    const vcList = await this.userVcService.searchVC(Number(pageNo), Number(pageSize), search);
    return {
      success: true,
      vcList,
    }
  }

  @Post('userforvc')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard(['MANAGE_USER', 'MANAGE_VC']))
  async addUserForVC(@Body() body: AddUserForVCDTO) {
    await this.userVcService.addUsersForVC(body.userIds, body.vcName);
    return {
      success: true,
      msg: 'success',
    }
  }

  @Get('/:vcName/users')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard(['MANAGE_USER', 'MANAGE_VC']))
  async getVCUsers(@Param('vcName') vcName: string) {
    const users = await this.userVcService.getVCUsersByVCName(vcName);
    return {
      success: true,
      users,
    }
  }

  @Delete('/:vcName/users/:userId')
  @UseGuards(AuthGuard('jwt'), new AuthzGuard(['MANAGE_USER', 'MANAGE_VC']))
  async deleteVCUsers(@Param('vcName') vcName: string, @Param('userId') userId: string, @Query('confirmed') confirmed: string) {
    console.log('userId', userId)
    const userIds = userId.split(',').map(val => Number(val));
    const res = await this.userVcService.removeVCUsers(vcName, userIds, !!confirmed);
    if (res.deleted) {
      return {
        success: true
      }
    } else {
      return {
        success: false,
        activeJobs: res.activeJobs,
      }
    }
    
  }

}
