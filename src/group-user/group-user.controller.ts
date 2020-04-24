import { Controller, Post, Res, Body, Get, HttpStatus, Query } from '@nestjs/common';

import { Response } from 'express';
import { GroupUserService } from './group-user.service';
import { AddUsersToGroupDto } from './group-user.dto'
import { UserService } from 'src/user/user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('group-user')
export class GroupUserController {
  constructor(
    private readonly groupUserService: GroupUserService,
    private readonly userService: UserService
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
    console.log(groupId)
    if (!isNaN(groupId)) {
      const users = await this.groupUserService.getUsersByGroupId(groupId);
      const userIds = users.map(val => val.id);
      const userInfos = await this.userService.findUsersByUserIds(userIds);
      res.send({
        success: true,
        list: userInfos,
      })
    }
  }
    
}
  