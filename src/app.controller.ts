import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionService } from './permission/permission.service';
import { RoleService } from './role/role.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService
    ) {
    Promise.all([
      permissionService.initPermissions(),
      roleService.initDbRoles(),
    ])
  }

  @Get('/')
  getHello(): object {
    return this.appService.getHello();
  }

}
