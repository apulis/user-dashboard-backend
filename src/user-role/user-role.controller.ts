import { Controller, Post, Body, Res, HttpStatus, Get, Query, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

import { AddRoleToUserDto, EditUserRolesDto, RemoveUserRoleDto } from './user-role.dto'
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzGuard } from 'src/guards/authz.guard';

@Controller('user-role')
@UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
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
    await this.userRoleService.addRoleToUser(userIds, roleIds)
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'ok'
    })
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
    description: '查询某个用户已有的roleId',
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

  @Delete('/:userId')
  async removeUserROle(@Param('userId') userId: number, @Res() res: Response, @Query() query: RemoveUserRoleDto) {
    const { roleId } = query;
    userId = Number(userId);
    await this.userRoleService.removeRoleForUser(userId, roleId);
    res.send({
      success: true,
    })
  }
}
