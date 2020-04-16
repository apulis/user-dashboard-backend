import { Controller, Get, Post, Body, Res, Query, HttpStatus, Delete, Param } from '@nestjs/common';

import { Response, } from 'express';

import { GroupService } from './group.service';

export interface ICreateGroup {
  name: string;
  desc: string;
  note: string;
  roles: string[];
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
}
