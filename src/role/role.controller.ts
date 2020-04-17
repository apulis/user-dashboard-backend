import { Controller, Get, Query, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiOperation } from '@nestjs/swagger';
import { Response }  from 'express'


import { CreateRoleDto } from './role.dto'
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('角色')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ description: '分页查询角色列表'})
  async index(
    @Query('pageNo') pageNo: string | number, 
    @Query('pageSize') pageSize: string | number,
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
}
