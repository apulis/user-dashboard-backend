import { Controller, Post, Body, Res, HttpStatus, Get, Query, Param } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

import { AddRoleToUserDto } from './user-role.dto'
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiMovedPermanentlyResponse } from '@nestjs/swagger';

@Controller('user-role')
@ApiTags('关联角色和用户')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) { }

  @Post()
  @ApiOperation({
    description: '给用户添加角色'
  })
  async addRoleToUsers(@Body() body: AddRoleToUserDto, @Res() res: Response) {
    const { userIds, roleIds } = body;
    const duplicate = await this.userRoleService.checkDuplicateItems(userIds, roleIds);
    if (duplicate.length === 0) {
      await this.userRoleService.addRoleToUser(userIds, roleIds)
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

  @Get('/userId/:userId')
  @ApiOperation({
    description: '查询某个用户已有的roleId'
  })
  async getRoleByUserId(@Param('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    const result = await this.userRoleService.findUserRolesById(userId);
    res.send({
      success: true,
      list: result
    })
  }
}
