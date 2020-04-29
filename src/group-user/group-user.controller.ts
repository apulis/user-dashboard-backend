import { Controller, Post, Res, Body, Get, HttpStatus, Query, Delete, Param, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { GroupUserService } from './group-user.service';
import { AddUsersToGroupDto } from './group-user.dto'
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupService } from 'src/group/group.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('group-user')
@UseGuards(AuthGuard('jwt'))
@ApiTags('用户组和用户关联')
export class GroupUserController {
  constructor(
    private readonly groupUserService: GroupUserService,
    private readonly userService: UserService,
    private readonly groupService: GroupService
  ) { }

  @Post()
  @ApiOperation({
    description: '添加用户到用户组'
  })
  async addUsersToGroups(@Body() body: AddUsersToGroupDto, @Res() res: Response) {
    const { userIds, groupIds } = body;
    const duplicate = await this.groupUserService.checkDuplicateItems(userIds, groupIds);
    if (duplicate.length === 0) {
      await this.groupUserService.addUsersToGroups(userIds, groupIds);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'ok'
      })
    } else {
      res.status(HttpStatus.OK).json({
        success: false,
        duplicate
      })
    }
  }

  @Get('/users')
  @ApiOperation({
    description: '获取某个用户组的所有用户'
  })
  async getUsersForGroup(@Query('groupId') groupId: number, @Res() res: Response) {
    groupId = Number(groupId);
    if (!isNaN(groupId)) {
      const users = await this.groupUserService.getUsersByGroupId(groupId);
      if (users.length === 0) {
        res.send({
          success: true,
          list: []
        })
        return;
      }
      const userIds = users.map(val => val.userId);
      const userInfos = await this.userService.findUsersByUserIds(userIds);
      res.send({
        success: true,
        list: userInfos,
      })
    }
  }

  @Get('/group-info')
  @ApiOperation({
    description: '根据userId获取用户组信息',
  })
  async getGroupInfoByUserId(@Query('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    console.log(211234, userId)
    if (!isNaN(userId)) {
      const groups = await this.groupUserService.getGroupsByUserId(userId);
      if (groups.length === 0) {
        res.send({
          success: true,
          list: []
        });
        return;
      }
      const groupIds = groups.map(val => val.groupId);
      const groupInfos = await this.groupService.getGroupInfos(groupIds);
      res.send({
        success: true,
        list: groupInfos,
      })
    }
  }

  @Delete('/:groupId')
  async removeGroupForUser(@Param('groupId') groupId: number, @Query('userId') userId: number, @Res() res: Response) {
    groupId = Number(groupId);
    userId = Number(userId);
    console.log(groupId, userId)
    if (!isNaN(groupId) && !isNaN(userId)) {
      await this.groupUserService.removeGroupForUser(groupId, userId);
      res.send({
        success: true
      })
    }
  }
}
  