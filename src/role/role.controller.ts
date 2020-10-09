import { Controller, Get, Query, Res, HttpStatus, Post, Body, Delete, UseGuards, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Response }  from 'express'


import { CreateRoleDto, RemoveRoleDto, EditPermissionDto } from './role.dto'
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { CasbinService } from 'src/common/authz';
import { AuthzGuard } from 'src/guards/authz.guard';
import { initialPermissions } from 'db-init/init-permission';
import { PermissionService } from 'src/permission/permission.service';

@Controller('role')
@UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
@ApiTags('角色')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly casbinService: CasbinService,
    private readonly permissionService: PermissionService
  ) {}

  @Get()
  @ApiOperation({ summary: '分页查询角色列表'})
  async index(
    @Query('pageNo') pageNo: number, 
    @Query('pageSize') pageSize: number,
    @Res() res: Response,
    @Query('search') search?: string
  ) {
    pageSize = Number(pageSize);
    pageNo = (Number(pageNo) - 1) * pageSize;
    const result = await this.roleService.getRoleList(pageNo, pageSize, search);
    res.status(HttpStatus.OK).json({
      success: true,
      ...result
    })
  }

  @Post()
  @ApiOperation({ summary: '新建角色' })
  async create(
    @Body() body: CreateRoleDto,
    @Res() res: Response
  ) {
    const role = await this.roleService.checkDupItem(body.name);
    if (role) {
      res.status(200).send({
        success: false,
      });
      return;
    }
    await this.roleService.createRole(body)
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'success',
    })
  }

  @Delete()
  @ApiOperation({ summary: '删除角色' })
  async remove(@Body() body: RemoveRoleDto, @Res() res: Response) {
    await this.roleService.removeRoles(body.roleIds);
    res.status(HttpStatus.OK).json({
      success: true,
      message: `success delete role ${body.roleIds.join(', ')}`
    })
  }

  @Get('/count')
  @ApiOperation({ summary: '获取角色总数' })
  async getRolesTotal(@Res() res: Response) {
    const count = await this.roleService.getRoleCount()
    res.send({
      success: true,
      count,
    })
  }

  @Get('/:roleId/permission')
  @ApiOperation({ summary: '获取一个角色已有的权限' })
  async getRolePermission(@Param('roleId') roleId: number) {
    roleId = Number(roleId);
    const [permissionKeys, permissions] = await Promise.all([
      this.casbinService.getPermissionForRole(roleId),
      this.permissionService.getAppPermissions()
    ])
    return {
      success: true,
      permissions: permissions.filter(p => {
        return permissionKeys.includes(p.key)
      })
    }
  }

  @Get('/:roleId/detail')
  @ApiOperation({ summary: '获取一个角色详情' })
  async getRoleDetail(@Param('roleId') roleId: number) {
    roleId = Number(roleId);
    return {
      success: true,
      detail: await this.roleService.getRoleDetail(roleId) || {}
    }
  }

  @Patch('/:roleId/permission')
  @ApiOperation({ summary: '修改角色的权限' })
  async modifyRolePermission(@Param('roleId') roleId: number, @Body() body: EditPermissionDto) {
    roleId = Number(roleId);
    await this.casbinService.removeRolePermissions(roleId);
    await this.casbinService.addPermissionForRole(roleId, body.permissionKeys)
    return {
      success: true,
      message: 'success',
    }
  }

}
