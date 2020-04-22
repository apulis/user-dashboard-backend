import { Controller, Post, Res, Body, HttpService, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';


import { GroupRoleService } from './group-role.service';
import { AddRoleToGroupDto } from './group-role.dto';

@Controller('group-role')
export class GroupRoleController {
  constructor(private readonly groupRoleService: GroupRoleService) { }

  @Post()
  async addRoleToGroup(@Body() body: AddRoleToGroupDto, @Res() res: Response ) {
    const { roleNames, groupNames } = body;
    const duplicate = await this.groupRoleService.checkDuplicateItems(roleNames, groupNames);
    if (duplicate.length === 0) {
      await this.groupRoleService.addRoleToGroup(roleNames, groupNames);
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
}
