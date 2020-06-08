import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param, Patch, UseGuards } from '@nestjs/common';

import { Response, } from 'express';
import { ApiTags, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { GroupService } from './group.service';
import { CreateGroupDto, EditGroupDto, RemoveGroupDto } from './group.dto';
import { GroupRoleService } from 'src/group-role/group-role.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzGuard } from 'src/guards/authz.guard';

export interface ICreateGroup {
  name: string;
  note: string;
  role: number[];
}



@Controller('group')
@UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
@ApiTags('用户组相关')
export class GroupController {

  constructor(
    private readonly groupService: GroupService,
    private readonly groupRoleService: GroupRoleService
    ) {}
  
  @Get('/list')
  @ApiOperation({
    description: '查询用户组列表'
  })
  async getGroups(
    @Res() res: Response,
    @Query('search') search?: string
  ): Promise<any> {
    const list = await this.groupService.getAllGroup(search);
    res.status(HttpStatus.OK).json({
      success: true,
      list,
    })
  }

  @Post('/')
  @ApiOperation({
    description: '新建用户组'
  })
  async createGroup(@Body() body: CreateGroupDto, @Res() res: Response) {
    const group = await this.groupService.checkDupGroup(body.name);
    if (group) {
      res.send({
        success: false,
      });
      return;
    }
    const result = await this.groupService.createGroup(body);
    if (result) {
      const { id } = result;
      await this.groupRoleService.addRoleToGroup(body.role, [id]);
    }
    res.send({
      success: true,
      messsage: 'ok',
    })
  }

  @Delete('/')
  @ApiOperation({
    description: '批量删除用户组'
  })
  async removeGroup(@Body() body: RemoveGroupDto, @Res() res: Response) {
    await this.groupService.removeGroup(body.groupIds);
    res.json({
      success: true,
      messsage: 'success delete ' + body.groupIds
    })
  }

  @Get('/detail/:id')
  @ApiOperation({
    description: '根据id获取用户组详情'
  })
  async getGroupDetail(@Param('id') id: number, @Res() res: Response) {
    id = Number(id);
    const result = await this.groupService.getGroupDetail(id);
    res.send({
      success: true,
      data: result,
    });
  }

  @Patch('/:id')
  @ApiOperation({
    description: '修改用户组信息'
  })
  async editGroupDetail(@Param('id') id: number, @Res() res: Response, @Body() body: EditGroupDto) {
    id = Number(id);
    const { name, note} = body;
    await this.groupService.editGroupDetail(id, note, name);
    res.send({
      success: true,
      messsage: 'ok'
    })
  }

  @Get('/count')
  @ApiOperation({
    description: '获取用户组总数'
  })
  async getGroupTotalCount(@Res() res: Response) {
    const count = await this.groupService.getAllGroupCount();
    res.send({
      success: true,
      count,
    })
  }
}
