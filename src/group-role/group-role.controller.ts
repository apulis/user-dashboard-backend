import { Controller, Post, Res, Body, HttpService, HttpStatus, HttpCode, Get, Query, Delete, Param, UseGuards } from '@nestjs/common';
import { Response } from 'express';


import { GroupRoleService } from './group-role.service';
import { AddRoleToGroupDto } from './group-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('group-role')
@UseGuards(AuthGuard('jwt'))
@ApiTags('用户组和角色关联')
export class GroupRoleController {
  constructor(
    private readonly groupRoleService: GroupRoleService,
    private readonly roleService: RoleService
  ) { }

  @Post()
  @ApiOperation({
    description: '给用户组添加角色'
  })
  async addRoleToGroup(@Body() body: AddRoleToGroupDto, @Res() res: Response ) {
    const { roleIds, groupIds } = body;
    const duplicate = await this.groupRoleService.checkDuplicateItems(roleIds, groupIds);
    if (duplicate.length === 0) {
      await this.groupRoleService.addRoleToGroup(roleIds, groupIds);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'ok'
      })
    } else {
      res.status(HttpStatus.OK).json({
        success: false,
        duplicate,
      })
    }
  }

  @Get('/roles')
  @ApiOperation({
    description: '根据用户组id查询角色'
  })
  async getRolesForGroup(@Query('groupId') groupId: number, @Res() res: Response) {
    groupId = Number(groupId);
    if (!isNaN(groupId)) {
      const roles = await this.groupRoleService.getRolesById(groupId);
      if (roles.length === 0) {
        res.send({
          success: true,
          list: []
        });
        return;
      }
      const roleIds = roles.map(val => val.roleId);
      const roleInfos = await this.roleService.getRolesByRoleIds(roleIds);
      res.send({
        success: true,
        list: roleInfos,
      });
    }
  }

  @Delete('/:groupId')
  @ApiOperation({
    description: '删除某个用户组的某个角色'
  })
  async removeRoleForGroup(@Param('groupId') groupId: number, @Query('roleId') roleId: number, @Res() res: Response ) {
    groupId = Number(groupId);
    roleId = Number(roleId);
    if (!isNaN(groupId) && !isNaN(roleId)) {
      await this.groupRoleService.removeRoleForGroup(groupId, roleId);
    }
    res.send({
      success: true,
      message: 'ok'
    })
  }
}
