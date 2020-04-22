import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

import { AddRoleToUserDto } from './user-role.dto'
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('user-role')
@ApiTags('关联角色和用户')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) { }

  @Post()
  @ApiOperation({
    description: '给用户添加角色'
  })
  async addRoleToUsers(@Body() body: AddRoleToUserDto, @Res() res: Response) {
    const { userNames, roleNames } = body;
    const duplicate = await this.userRoleService.checkDuplicateItems(userNames, roleNames);
    if (duplicate.length === 0) {
      await this.userRoleService.addRoleToUser(userNames, roleNames)
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
