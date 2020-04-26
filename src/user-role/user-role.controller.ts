import { Controller, Post, Body, Res, HttpStatus, Get, Query, Param, Patch } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

import { AddRoleToUserDto, EditUserRolesDto } from './user-role.dto'
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';

@Controller('user-role')
@ApiTags('关联角色和用户')
export class UserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService
  ) { }

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

  @Patch()
  @ApiOperation({
    description: '修改用户的角色',
  })
  async editUserRoles(@Body() body: EditUserRolesDto, @Res() res: Response) {
    const { userId, roleIds } = body;
    await this.userRoleService.eidtUserRoles(userId, roleIds);
    res.send({
      success: true,
      message: 'ok',
    })
  }

  @Get('/userId/:userId')
  @ApiOperation({
    description: '查询某个用户已有的roleId'
  })
  async getRoleByUserId(@Param('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    const result = await this.userRoleService.findUserRoleIdsById(userId);
    res.send({
      success: true,
      list: result
    })
  }

  @Get('/:userId/info')
  async getRoleInfo(@Param('userId') userId: number, @Res() res: Response) {
    userId = Number(userId);
    const roleIds = await this.userRoleService.findUserRoleIdsById(userId);
    if (roleIds.length === 0) {
      res.send({
        success: true,
        list: []
      })
      return;
    }
    const roleInfo = await this.roleService.getRolesByRoleIds(roleIds.map(val => val.roleId));
    res.send({
      success: true,
      list: roleInfo
    })
  }
}
