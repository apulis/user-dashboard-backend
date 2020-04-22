import { Controller, Post, Res, Body, Get, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { GroupUserService } from './group-user.service';
import { AddUsersToGroupDto } from './group-user.dto'

@Controller('/group-user')
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) { }

  @Post()
  async addUsersToGroups(@Body() body: AddUsersToGroupDto, @Res() res: Response) {
    const { userIds, groupIds } = body;
    const duplicate = await this.groupUserService.checkDuplicateItems(userIds, groupIds);
    if (duplicate.length === 0) {
      await this.groupUserService.addUsersToGroups(userIds, groupIds);
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
    
}
  