import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param } from '@nestjs/common';

import { Response, } from 'express';

import { GroupService } from './group.service';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiTags, ApiProperty } from '@nestjs/swagger';

export interface ICreateGroup {
  name: string;
  desc: string;
  note: string;
  roles: string[];
}

class removeGroupDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: '需要删除的组的名称数组',
    example: [1, 2, 3]
  })
  groupIds: number[];

}

@Controller('group')
export class GroupController {

  constructor(private readonly groupService: GroupService) {}
  
  @Get('/list')
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
  async createGroup(@Body() body: ICreateGroup) {
    await this.groupService.createGroup(body);
  }

  @Delete('/')
  async removeGroup(@Body() body: removeGroupDto, @Res() res: Response) {
    await this.groupService.removeGroup(body.groupIds);
    res.status(HttpStatus.OK).json({
      success: true,
      messsage: 'success delete ' + body.groupIds
    })
  }
}
