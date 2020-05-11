import { Controller, Get, Query, Res, HttpStatus, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Response }  from 'express'


import { CreateRoleDto, RemoveRoleDto } from './role.dto'
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { CasbinService } from 'src/common/authz';

@Controller('role')
@UseGuards(AuthGuard('jwt'))
@ApiTags('角色')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Get()
  @ApiOperation({ description: '分页查询角色列表'})
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
  @ApiOperation({ description: '新建角色' })
  async create(
    @Body() body: CreateRoleDto,
    @Res() res: Response
  ) {
    await this.roleService.createRole(body)
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'suucess',
    })
  }

  @Delete()
  @ApiOperation({ description: '删除角色' })
  async remove(@Body() body: RemoveRoleDto, @Res() res: Response) {
    await this.roleService.removeRoles(body.roleIds);
    res.status(HttpStatus.OK).json({
      success: true,
      message: `success delete role ${body.roleIds.join(', ')}`
    })
  }

  @Get('/count')
  @ApiOperation({ description: '获取角色总数' })
  async getRolesTotal(@Res() res: Response) {
    const count = await this.roleService.getRoleCount()
    res.send({
      success: true,
      count,
    })
  }
}
