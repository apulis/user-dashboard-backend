import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param, Patch } from '@nestjs/common';

import { Response, } from 'express';
import { ApiTags, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { GroupService } from './group.service';
import { CreateGroupDto, EditGroupDto } from './group.dto';
import { GroupRoleService } from 'src/group-role/group-role.service';

export interface ICreateGroup {
  name: string;
  note: string;
  role: number[];
}

class removeGroupDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: '需要删除的组的id数组',
    example: [1, 2, 3]
  })
  groupIds: number[];

}

@Controller('group')
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
  async createGroup(@Body() body: CreateGroupDto, @Res() res: Response) {
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
  async removeGroup(@Body() body: removeGroupDto, @Res() res: Response) {
    await this.groupService.removeGroup(body.groupIds);
    res.json({
      success: true,
      messsage: 'success delete ' + body.groupIds
    })
  }

  @Get('/detail/:id')
  async getGroupDetail(@Param('id') id: number, @Res() res: Response) {
    id = Number(id);
    const result = await this.groupService.getGroupDetail(id);
    res.send({
      success: true,
      data: result,
    });
  }

  @Patch('/:id')
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
  async getGroupTotalCount(@Res() res: Response) {
    const count = await this.groupService.getAllGroupCount();
    res.send({
      success: true,
      count,
    })
  }
}
