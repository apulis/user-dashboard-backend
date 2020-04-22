import { Controller, Post, Res, Body, HttpService, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';


import { GroupRoleService } from './group-role.service';
import { AddRoleToGroupDto } from './group-role.dto';

@Controller('group-role')
export class GroupRoleController {
  constructor(private readonly groupRoleService: GroupRoleService) { }

  @Post()
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
}
