import { Controller, UseGuards, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { PermissionService } from './permission.service';

@UseGuards(AuthGuard('jwt'))
@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService
    
  ) {

  }

  @Get('/all')
  @ApiOperation({
    description: '获取所有权限'
  })
  async getAllPermissions(@Res() res: Response) {
    
    const permissions = await this.permissionService.getAppPermissions();
    res.send({
      success: true,
      permissions,
    })
  }
}
