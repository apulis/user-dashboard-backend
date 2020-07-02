import { Controller, UseGuards, Get, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PermissionService } from './permission.service';
import { AuthzGuard } from 'src/guards/authz.guard';
import { Permission } from './permission.entity';

export enum EnumLanguageTypes {
  'zh-CN' = 'zh-CN',
  'en-US' = 'en-US',
}

@UseGuards(AuthGuard('jwt'), new AuthzGuard('MANAGE_USER'))
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
  async getAllPermissions(@Res() res: Response, @Req() req: Request) {
    const lang = req.cookies.language;
    let permissions: Permission[] = [];
    if (EnumLanguageTypes["zh-CN"] === lang) {
      permissions = await this.permissionService.getAppCNPermissions();
    } else if (EnumLanguageTypes["en-US"] === lang) {
      permissions = await this.permissionService.getAppPermissions();
    } else {
      permissions = await this.permissionService.getAppPermissions();
    }
    res.send({
      success: true,
      permissions,
    })
  }
}
